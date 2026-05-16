import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, getClientIP } from '@/lib/rate-limiter';
import { buildKeywordExtractionPrompt } from '@/lib/ai-prompts';
import { parseAIJSON, sanitizeForAI } from '@/lib/utils';
import type { AIKeywordResult } from '@/types/cv';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await rateLimit(`keywords:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  let jobDescription: string;
  try {
    const body = await request.json() as { jobDescription: string };
    jobDescription = sanitizeForAI(body.jobDescription || '');
    if (jobDescription.length < 20) {
      return NextResponse.json({ error: 'Job description terlalu singkat.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
  }

  // Local fallback: simple keyword extraction
  const words = jobDescription
    .split(/\s+/)
    .filter((w) => w.length > 3 && !['dan', 'dengan', 'yang', 'untuk', 'dari', 'atau'].includes(w.toLowerCase()))
    .map(w => w.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,""))
    .slice(0, 30);
  
  const localKeywords = {
    required_skills: words.slice(0, 8),
    preferred_skills: words.slice(8, 12),
    tools: words.slice(12, 16),
    soft_skills: ['Communication', 'Teamwork', 'Problem Solving'].slice(0, 3),
    keywords: words.slice(16, 25),
    isLocal: true
  };

  if (!apiKey) {
    return NextResponse.json(localKeywords);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    });

    const prompt = buildKeywordExtractionPrompt(jobDescription);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJSON<AIKeywordResult>(text);

    if (!parsed) {
      return NextResponse.json(localKeywords);
    }

    return NextResponse.json({
      required_skills: (parsed.required_skills || []).slice(0, 15),
      preferred_skills: (parsed.preferred_skills || []).slice(0, 10),
      tools: (parsed.tools || []).slice(0, 10),
      soft_skills: (parsed.soft_skills || []).slice(0, 8),
      keywords: (parsed.keywords || []).slice(0, 15),
      isLocal: false
    });
  } catch (err) {
    console.error('AI ERROR [Keyword Extraction]:', err);
    return NextResponse.json({ 
      ...localKeywords,
      error: 'AI Error, menggunakan ekstraksi lokal.'
    });
  }
}
