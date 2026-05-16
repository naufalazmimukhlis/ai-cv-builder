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
  if (!apiKey) {
    return NextResponse.json({ error: 'Konfigurasi AI tidak tersedia.' }, { status: 503 });
  }

  let bullet: string;
  let jobTitle: string;
  let keywords: string[];

  try {
    const body = await request.json() as {
      bullet: string;
      jobTitle: string;
      keywords: string[];
    };
    bullet = sanitizeForAI(body.bullet || '');
    jobTitle = sanitizeForAI(body.jobTitle || 'Profesional');
    keywords = Array.isArray(body.keywords) ? body.keywords.slice(0, 15) : [];

    if (!bullet || bullet.length < 5) {
      return NextResponse.json({ error: 'Bullet point terlalu singkat.' }, { status: 400 });
    }
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

    const prompt = buildBulletOptimizerPrompt(bullet, jobTitle, keywords);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJSON<AIBulletResult>(text);

    if (!parsed?.optimized) {
      console.warn('[AI WARNING]: Bullet point optimization returned malformed JSON or empty result.');
      // Fallback: prefix with an action verb if missing
      const actionVerbs = ['Developed', 'Implemented', 'Spearheaded', 'Optimized', 'Orchestrated'];
      const verb = actionVerbs[Math.floor(Math.random() * actionVerbs.length)];
      const improved = bullet.startsWith(verb.slice(0, 5))
        ? bullet
        : `${verb} ${bullet.toLowerCase().replace(/^(saya|kami|tim)\s/i, '')}`;
      return NextResponse.json({
        optimized: improved,
        explanation: 'AI fallback: Action verb added for better impact.',
      });
    }

    return NextResponse.json({
      optimized: String(parsed.optimized).substring(0, 500),
      explanation: String(parsed.explanation || '').substring(0, 300),
    });
  } catch (err) {
    console.error('AI ERROR [Bullet Optimization]:', err);
    return NextResponse.json({ 
      error: 'Gagal mengoptimalkan bullet point. Pastikan API Key valid dan coba lagi.',
      details: err instanceof Error ? err.message : 'Unknown AI error'
    }, { status: 500 });
  }
}
