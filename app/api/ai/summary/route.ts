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
  if (!apiKey) {
    return NextResponse.json({ error: 'Konfigurasi AI tidak tersedia.' }, { status: 503 });
  }

  let cvData: Partial<CVData>;
  try {
    const body = await request.json() as { cvData: Partial<CVData> };
    cvData = body.cvData || {};
  } catch {
    return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
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
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJSON<AISummaryResult>(text);

    if (!parsed?.summary) {
      const fallback = `Profesional berpengalaman dengan keahlian di ${cvData.target?.jobTitle || 'bidang ini'}. Memiliki kemampuan yang kuat dalam ${(cvData.skills?.technical || []).slice(0, 3).join(', ')} dan berkomitmen untuk memberikan hasil terbaik bagi organisasi.`;
      return NextResponse.json({ summary: fallback });
    }

    return NextResponse.json({
      summary: String(parsed.summary).substring(0, 800),
    });
  } catch (err) {
    console.error('AI ERROR [Summary Generation]:', err);
    return NextResponse.json({ 
      error: 'Gagal membuat professional summary.',
      details: err instanceof Error ? err.message : 'Unknown AI error'
    }, { status: 500 });
  }
}
