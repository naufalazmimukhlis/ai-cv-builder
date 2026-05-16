import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, getClientIP } from '@/lib/rate-limiter';
import { buildBulletOptimizerPrompt } from '@/lib/ai-prompts';
import { parseAIJSON, sanitizeForAI } from '@/lib/utils';
import type { AIBulletResult } from '@/types/cv';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const { success } = await rateLimit(`bullet:${ip}`);
  if (!success) {
    return NextResponse.json({ error: 'Terlalu banyak permintaan.' }, { status: 429 });
  }

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  let bullet: string;
  let jobTitle: string;
  let keywords: string[];
  let lang: 'id' | 'en' = 'en';

  try {
    const body = await request.json() as {
      bullet: string;
      jobTitle: string;
      keywords: string[];
      lang?: 'id' | 'en';
    };
    bullet = sanitizeForAI(body.bullet || '');
    jobTitle = sanitizeForAI(body.jobTitle || 'Profesional');
    keywords = Array.isArray(body.keywords) ? body.keywords.slice(0, 15) : [];
    lang = body.lang || 'en';

    if (!bullet || bullet.length < 5) {
      return NextResponse.json({ error: 'Bullet point terlalu singkat.' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
  }

  // Local optimization fallback
  const { en: enVerbs, id: idVerbs } = await import('@/data/action-verbs.json');
  const actionVerbs = lang === 'id' ? idVerbs : enVerbs;
  const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
  
  const localOptimized = bullet.toLowerCase().startsWith(verb.toLowerCase().substring(0, 5))
    ? bullet
    : `${verb} ${bullet.toLowerCase().replace(/^(saya|kami|tim|i|we)\s/i, '')}`;

  if (!apiKey) {
    return NextResponse.json({
      optimized: localOptimized,
      explanation: lang === 'id' ? 'Optimasi lokal: Menggunakan kata kerja aktif.' : 'Local optimization: Using action verbs for impact.',
      isLocal: true
    });
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

    const prompt = buildBulletOptimizerPrompt(bullet, jobTitle, keywords);
    const promptWithLang = `${prompt}\n\nIMPORTANT: The output MUST be in ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}.`;
    
    const result = await model.generateContent(promptWithLang);
    const text = result.response.text();
    const parsed = parseAIJSON<AIBulletResult>(text);

    if (!parsed?.optimized) {
      return NextResponse.json({
        optimized: localOptimized,
        explanation: 'AI fallback: Optimasi lokal digunakan.',
        isLocal: true
      });
    }

    return NextResponse.json({
      optimized: String(parsed.optimized).substring(0, 500),
      explanation: String(parsed.explanation || '').substring(0, 300),
      isLocal: false
    });
  } catch (err) {
    console.error('AI ERROR [Bullet Optimization]:', err);
    return NextResponse.json({ 
      optimized: localOptimized,
      explanation: 'AI Error, menggunakan optimasi lokal.',
      isLocal: true
    });
  }
}
