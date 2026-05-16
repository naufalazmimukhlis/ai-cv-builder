import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, getClientIP } from '@/lib/rate-limiter';
import { buildEnhancementPrompt } from '@/lib/ai-prompts';
import { parseAIJSON } from '@/lib/utils';
import type { CVData, AIEnhancementResult } from '@/types/cv';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = getClientIP(request);
  const { success } = await rateLimit(`enhance:${ip}`);
  if (!success) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Tunggu 1 menit sebelum mencoba lagi.' },
      { status: 429 }
    );
  }

  // Validate API key
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  let cvData: CVData;
  let lang: 'id' | 'en' = 'en';
  try {
    const body = await request.json() as { cvData: CVData, lang?: 'id' | 'en' };
    cvData = body.cvData;
    lang = body.lang || 'en';

    if (!cvData?.personal?.fullName) {
      return NextResponse.json(
        { error: 'Data CV tidak lengkap.' },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
  }

  // Prepare Local Results
  const { calculateATSScore, getATSFeedback } = await import('@/lib/calculateATS');
  const { generateSummary } = await import('@/lib/generateSummary');
  
  const localAtsScore = calculateATSScore(cvData);
  const localFeedback = getATSFeedback(localAtsScore, lang);
  const localSummary = generateSummary(cvData, lang);

  const localResult: AIEnhancementResult = {
    professionalSummary: localSummary,
    enhancedExperiences: cvData.experiences.map((exp) => ({
      id: exp.id,
      bullets: exp.bullets.map((b) => b.text).filter(Boolean),
    })),
    prioritizedSkills: cvData.skills,
    atsScore: localAtsScore,
    improvements: localFeedback,
    tips: lang === 'id' ? [
      'Gunakan generator lokal untuk hasil cepat dan stabil.',
      'Tambahkan lebih banyak angka pencapaian di pengalaman kerja.',
    ] : [
      'Use local generator for fast and stable results.',
      'Add more metrics and numbers in your work experience.',
    ],
  };

  if (!apiKey) {
    return NextResponse.json({ result: localResult, isLocal: true });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.65,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    const prompt = buildEnhancementPrompt(cvData);
    const promptWithLang = `${prompt}\n\nIMPORTANT: ALL text fields in the JSON response (summary, bullets, improvements, tips) MUST be in ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}.`;
    
    const result = await model.generateContent(promptWithLang);
    const text = result.response.text();

    const parsed = parseAIJSON<AIEnhancementResult>(text);

    if (!parsed || typeof parsed.atsScore !== 'number') {
      return NextResponse.json({ result: localResult, isLocal: true });
    }

    // Validate and sanitize the result
    const safeResult: AIEnhancementResult = {
      professionalSummary: String(parsed.professionalSummary || '').substring(0, 1000),
      enhancedExperiences: Array.isArray(parsed.enhancedExperiences)
        ? parsed.enhancedExperiences.map((e) => ({
            id: String(e.id || ''),
            bullets: Array.isArray(e.bullets)
              ? e.bullets.map((b) => String(b).substring(0, 400)).filter(Boolean)
              : [],
          }))
        : [],
      prioritizedSkills: {
        technical: Array.isArray(parsed.prioritizedSkills?.technical)
          ? parsed.prioritizedSkills.technical.map(String).slice(0, 20)
          : cvData.skills.technical,
        soft: Array.isArray(parsed.prioritizedSkills?.soft)
          ? parsed.prioritizedSkills.soft.map(String).slice(0, 15)
          : cvData.skills.soft,
        tools: Array.isArray(parsed.prioritizedSkills?.tools)
          ? parsed.prioritizedSkills.tools.map(String).slice(0, 15)
          : cvData.skills.tools,
        languages: Array.isArray(parsed.prioritizedSkills?.languages)
          ? parsed.prioritizedSkills.languages.map(String).slice(0, 10)
          : cvData.skills.languages,
      },
      atsScore: Math.min(100, Math.max(0, Number(parsed.atsScore) || 60)),
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements.map(String).slice(0, 5)
        : [],
      tips: Array.isArray(parsed.tips) ? parsed.tips.map(String).slice(0, 3) : [],
    };

    return NextResponse.json({ result: safeResult, isLocal: false });
  } catch (err) {
    console.error('AI ERROR [Full CV Enhancement]:', err);
    return NextResponse.json({ 
      result: localResult,
      isLocal: true,
      warning: 'AI Optimization failed. Using local generator.'
    });
  }
}
