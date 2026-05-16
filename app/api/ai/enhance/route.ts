import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit, getClientIP } from '@/lib/rate-limiter';
import { buildEnhancementPrompt } from '@/lib/ai-prompts';
import { parseAIJSON } from '@/lib/utils';
import type { CVData, AIEnhancementResult } from '@/types/cv';

export const maxDuration = 30;

// Fallback result when AI fails
function buildFallbackResult(cvData: CVData): AIEnhancementResult {
  return {
    professionalSummary: cvData.professionalSummary || 
      `Profesional berpengalaman dengan background di ${cvData.target.jobTitle}. Memiliki keahlian di ${cvData.skills.technical.slice(0, 3).join(', ')} dan berkomitmen untuk memberikan kontribusi terbaik.`,
    enhancedExperiences: cvData.experiences.map((exp) => ({
      id: exp.id,
      bullets: exp.bullets.map((b) => b.text).filter(Boolean),
    })),
    prioritizedSkills: cvData.skills,
    atsScore: 60,
    improvements: [
      'Tambahkan lebih banyak keywords dari job description',
      'Kuantifikasi pencapaian dengan angka dan metrik',
      'Gunakan action verbs yang kuat di setiap bullet point',
    ],
    tips: [
      'Pastikan semua keywords dari JD muncul di CV Anda',
      'Tambahkan ringkasan profesional yang relevan dengan posisi target',
    ],
  };
}

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
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Konfigurasi AI tidak tersedia.' },
      { status: 503 }
    );
  }

  let cvData: CVData;
  try {
    const body = await request.json() as { cvData: CVData };
    cvData = body.cvData;

    if (!cvData?.personal?.fullName) {
      return NextResponse.json(
        { error: 'Data CV tidak lengkap.' },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json({ error: 'Request tidak valid.' }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    const prompt = buildEnhancementPrompt(cvData);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const parsed = parseAIJSON<AIEnhancementResult>(text);

    if (!parsed || typeof parsed.atsScore !== 'number') {
      // Return fallback if parsing fails
      return NextResponse.json({ result: buildFallbackResult(cvData) });
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

    return NextResponse.json({ result: safeResult });
  } catch (err) {
    console.error('[AI Enhance Error]:', err);
    // Graceful fallback
    return NextResponse.json({ result: buildFallbackResult(cvData) });
  }
}
