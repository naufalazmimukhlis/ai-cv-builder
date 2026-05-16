import actionVerbs from '../data/action-verbs.json';
import { CVData, AIEnhancementResult } from '@/types/cv';
import { calculateATSScore } from './calculateATS';

const WEAK_VERBS: Record<string, string[]> = {
  id: ['membuat', 'membantu', 'bertugas', 'mengerjakan', 'ikut', 'pakai', 'tahu'],
  en: ['made', 'helped', 'worked', 'did', 'part of', 'use', 'know']
};

const STRONG_VERBS: Record<string, string[]> = {
  id: ['Mengembangkan', 'Berkontribusi', 'Bertanggung jawab', 'Berhasil mengelola', 'Berperan aktif', 'Mengimplementasikan', 'Menguasai'],
  en: ['Developed', 'Contributed', 'Managed', 'Executed', 'Spearheaded', 'Implemented', 'Expert in']
};

/**
 * Extracts potential keywords from text locally
 */
export const extractKeywordsLocal = (text: string): string[] => {
  if (!text) return [];
  
  // Standardize text
  const cleaned = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  const words = cleaned.split(/\s+/);
  
  // Filtering common words (Stop words)
  const stopWords = new Set([
    'and', 'the', 'with', 'for', 'from', 'that', 'this', 'have', 'been', 'will', 'your',
    'dan', 'yang', 'dengan', 'untuk', 'dari', 'bahwa', 'ini', 'memiliki', 'telah', 'akan', 'anda'
  ]);
  
  // Predefined high-value keywords to look for
  const techKeywords = [
    'react', 'next.js', 'typescript', 'javascript', 'node.js', 'python', 'java', 'aws', 'docker', 'kubernetes',
    'sql', 'nosql', 'mongodb', 'postgresql', 'figma', 'ui/ux', 'agile', 'scrum', 'project management',
    'sales', 'marketing', 'seo', 'finance', 'accounting', 'analytics', 'data science'
  ];

  const detected = techKeywords.filter(k => cleaned.includes(k));
  
  // Also add long words that aren't stop words
  const longWords = words.filter(w => w.length > 5 && !stopWords.has(w));
  
  return Array.from(new Set([...detected, ...longWords])).slice(0, 20);
};

/**
 * Optimizes a single bullet point locally
 */
export const optimizeBulletLocal = (text: string, language: 'id' | 'en'): { optimized: string; explanation: string } => {
  let optimized = text.trim();
  if (!optimized) return { optimized: '', explanation: '' };

  const weak = WEAK_VERBS[language];
  const strong = STRONG_VERBS[language];
  
  // Replace weak verbs with strong ones
  weak.forEach((w, i) => {
    const regex = new RegExp(`^${w}\\b`, 'i'); // Only if it starts with the weak verb
    if (regex.test(optimized)) {
      optimized = optimized.replace(regex, strong[i]);
    }
  });

  // Check if it starts with an action verb
  const allVerbs = actionVerbs[language];
  const startsWithVerb = allVerbs.some(v => optimized.toLowerCase().startsWith(v.toLowerCase()));
  
  if (!startsWithVerb && !STRONG_VERBS[language].some(v => optimized.startsWith(v))) {
    // Add a relevant action verb if missing
    const randomVerb = allVerbs[Math.floor(Math.random() * allVerbs.length)];
    optimized = `${randomVerb} ${optimized.charAt(0).toLowerCase() + optimized.slice(1)}`;
  }

  // Add punctuation if missing
  if (!optimized.endsWith('.') && !optimized.endsWith('!') && !optimized.endsWith('?')) {
    optimized += '.';
  }

  return {
    optimized,
    explanation: language === 'id' 
      ? 'Menggunakan kata kerja aksi (Action Verbs) dan struktur STAR untuk dampak maksimal.' 
      : 'Utilized Action Verbs and STAR method structure for maximum impact.'
  };
};

/**
 * Performs full CV enhancement locally
 */
export const enhanceCVLocal = async (cvData: Partial<CVData>, language: 'id' | 'en' = 'id'): Promise<AIEnhancementResult> => {
  const atsResult = calculateATSScore(cvData);
  
  // Extract keywords from job description if exists
  const jdKeywords = extractKeywordsLocal(cvData.target?.jobDescription || '');
  
  // Prepare enhanced experiences (we'll optimize existing bullets)
  const enhancedExperiences = (cvData.experiences || []).map(exp => ({
    id: exp.id,
    bulletsId: exp.bullets.map(b => optimizeBulletLocal(b.textId, 'id').optimized),
    bulletsEn: exp.bullets.map(b => optimizeBulletLocal(b.textEn, 'en').optimized),
  }));

  // Identify improvements
  const improvements = atsResult.feedback.map(f => language === 'id' ? f.id : f.en);

  return {
    professionalSummaryId: cvData.professionalSummaryId || '',
    professionalSummaryEn: cvData.professionalSummaryEn || '',
    enhancedExperiences,
    prioritizedSkills: {
      technical: [...(cvData.skills?.technical || []), ...jdKeywords.slice(0, 3)],
      soft: cvData.skills?.soft || [],
      tools: cvData.skills?.tools || [],
      languages: cvData.skills?.languages || [],
    },
    atsScore: atsResult.score,
    improvements: improvements,
    tips: [
      language === 'id' 
        ? 'Gunakan font standar seperti Arial atau Calibri untuk keterbacaan ATS maksimal.' 
        : 'Use standard fonts like Arial or Calibri for maximum ATS readability.',
      language === 'id'
        ? 'Pastikan setiap pengalaman memiliki setidaknya 3 poin pencapaian.'
        : 'Ensure each experience has at least 3 achievement points.'
    ]
  };
};
