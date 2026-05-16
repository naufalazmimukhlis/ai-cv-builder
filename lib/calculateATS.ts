import { CVData } from '@/types/cv';

const ACTION_VERBS = [
  'developed', 'implemented', 'managed', 'led', 'created', 'designed', 'optimized',
  'built', 'spearheaded', 'orchestrated', 'delivered', 'collaborated', 'increased',
  'reduced', 'improved', 'scaled', 'architected', 'coordinated', 'mentored',
  'mengembangkan', 'mengimplementasikan', 'mengelola', 'memimpin', 'merancang', 'membangun',
  'mempelopori', 'mengoordinasikan', 'menyampaikan', 'berkolaborasi', 'meningkatkan',
  'mengurangi', 'menskalakan', 'membimbing'
];

export function calculateATSScore(cvData: CVData): number {
  let score = 0;
  const maxScore = 100;

  // 1. Keyword Match (25 points)
  const skills = [...(cvData.skills?.technical || []), ...(cvData.skills?.soft || [])];
  const targetKeywords = cvData.target?.keywords || [];
  
  let keywordMatches = 0;
  targetKeywords.forEach(kw => {
    if (skills.some(s => s.toLowerCase().includes(kw.toLowerCase()))) {
      keywordMatches++;
    }
  });

  const keywordRatio = targetKeywords.length > 0 ? keywordMatches / targetKeywords.length : 0.5;
  score += Math.round(keywordRatio * 25);

  // 2. CV Completeness (25 points)
  if (cvData.personal?.fullName && cvData.personal?.email) score += 5;
  if (cvData.professionalSummary) score += 5;
  if (cvData.experiences && cvData.experiences.length > 0) score += 5;
  if (cvData.education && cvData.education.length > 0) score += 5;
  if (cvData.skills?.technical.length > 0) score += 5;

  // 3. Experience Quality & Action Verbs (25 points)
  if (cvData.experiences && cvData.experiences.length > 0) {
    let bulletCount = 0;
    let verbCount = 0;
    
    cvData.experiences.forEach(exp => {
      exp.bullets.forEach(b => {
        if (b.text.trim()) {
          bulletCount++;
          const words = b.text.trim().split(/\s+/);
          const firstWord = words[0].toLowerCase().replace(/[^a-z]/g, '');
          if (ACTION_VERBS.includes(firstWord)) {
            verbCount++;
          }
        }
      });
    });

    if (bulletCount >= 5) score += 15;
    else if (bulletCount >= 3) score += 10;
    
    if (verbCount >= 3) score += 10;
    else if (verbCount >= 1) score += 5;
  }

  // 4. Skills Variety (15 points)
  if (cvData.skills?.technical.length >= 5) score += 10;
  if (cvData.skills?.soft.length >= 3) score += 5;

  // 5. Professional Summary Quality (10 points)
  if (cvData.professionalSummary && cvData.professionalSummary.length > 100 && cvData.professionalSummary.length < 1000) {
    score += 10;
  }

  return Math.min(score, maxScore);
}

export function getATSFeedback(score: number, lang: 'id' | 'en' = 'en'): string[] {
  const feedback: string[] = [];
  
  if (lang === 'id') {
    if (score < 50) {
      feedback.push('Lengkapi informasi pengalaman dan keahlian Anda.');
      feedback.push('Tambahkan ringkasan profesional yang kuat.');
    } else if (score < 80) {
      feedback.push('Tingkatkan jumlah skill teknis yang relevan.');
      feedback.push('Gunakan bullet points yang lebih mendetail di bagian pengalaman.');
    } else {
      feedback.push('CV Anda memiliki skor ATS yang sangat baik.');
      feedback.push('Pastikan format tetap bersih saat diekspor ke PDF.');
    }
  } else {
    if (score < 50) {
      feedback.push('Complete your experience and skills information.');
      feedback.push('Add a strong professional summary.');
    } else if (score < 80) {
      feedback.push('Increase the number of relevant technical skills.');
      feedback.push('Use more detailed bullet points in the experience section.');
    } else {
      feedback.push('Your CV has an excellent ATS score.');
      feedback.push('Ensure the formatting remains clean when exporting to PDF.');
    }
  }
  
  return feedback;
}
