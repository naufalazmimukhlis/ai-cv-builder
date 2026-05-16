import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, getClientIP } from '@/lib/rate-limiter';
import { buildSummaryPrompt } from '@/lib/ai-prompts';
import { parseAIJSON } from '@/lib/utils';
import type { CVData, AISummaryResult } from '@/types/cv';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await rateLimit(`summary:${ip}`);
  if (!success) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan.' }, { status: 429 });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  let cvData: Partial<CVData>;
  let lang: 'id' | 'en' = 'en';
  try {
    const body = await request.json() as { cvData: Partial<CVData>, lang?: 'id' | 'en' };
    cvData = body.cvData || {};
    lang = body.lang || 'en';
  } catch {
    return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
  }

  // Use local generator
  const { generateSummary } = await import('@/lib/generateSummary');
  const localSummary = generateSummary(cvData, lang);

  if (!apiKey) {
    return NextResponse.json({ summary: localSummary, isLocal: true });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
      },
    });

    const prompt = buildSummaryPrompt(cvData);
    // Add language instruction to prompt if needed, 
    // but the buildSummaryPrompt should ideally handle it or we append it here.
    const promptWithLang = `${prompt}\n\nIMPORTANT: The output MUST be in ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}.`;
    
    const result = await model.generateContent(promptWithLang);
    const text = result.response.text();
    const parsed = parseAIJSON<AISummaryResult>(text);

    if (!parsed?.summary) {
      return NextResponse.json({ summary: localSummary, isLocal: true });
    }

    return NextResponse.json({
      summary: String(parsed.summary).substring(0, 800),
      isLocal: false
    });
  } catch (err) {
    console.error('AI ERROR [Summary Generation]:', err);
    return NextResponse.json({ 
      summary: localSummary, 
      isLocal: true,
      error: 'Gagal menggunakan AI, beralih ke generator lokal.'
    });
  }
}
