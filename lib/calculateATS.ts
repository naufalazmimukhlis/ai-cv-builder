import { CVData } from '@/types/cv';
import actionVerbs from '../data/action-verbs.json';
import skillsDb from '../data/skills.json';

export interface ATSResult {
  score: number;
  feedback: {
    id: string;
    en: string;
  }[];
}

export function calculateATSScore(cvData: Partial<CVData>): ATSResult {
  let score = 0;
  const feedback: { id: string, en: string }[] = [];

  const { personal, target, experiences, skills, education, professionalSummaryId, professionalSummaryEn } = cvData;

  // 1. Basic Info (15 pts)
  if (personal?.fullName) score += 5;
  if (personal?.email && personal?.phone) score += 5;
  if (personal?.location) score += 5;
  else feedback.push({ id: "Tambahkan lokasi untuk pencarian kerja lokal.", en: "Add location for local job searches." });

  // 2. Professional Summary (15 pts)
  const summary = professionalSummaryId || professionalSummaryEn;
  if (summary) {
    if (summary.length > 100) score += 15;
    else {
      score += 8;
      feedback.push({ id: "Ringkasan terlalu pendek. Berikan deskripsi yang lebih kuat.", en: "Summary is too short. Provide a stronger description." });
    }
  } else {
    feedback.push({ id: "Tambahkan ringkasan profesional untuk menarik perhatian HR.", en: "Add a professional summary to catch HR attention." });
  }

  // 3. Experience (35 pts)
  if (experiences && experiences.length > 0) {
    score += 15;
    
    let totalBullets = 0;
    let hasMetrics = false;
    let hasActionVerbs = false;

    experiences.forEach(exp => {
      totalBullets += exp.bullets.length;
      exp.bullets.forEach(b => {
        const text = (b.textId + b.textEn).toLowerCase();
        if (/\d+%|\d+ |berhasil|meningkatkan|increase|improve|saved/.test(text)) hasMetrics = true;
        
        // Detect action verbs
        const allVerbs = [...actionVerbs.id, ...actionVerbs.en].map(v => v.toLowerCase());
        if (allVerbs.some(v => text.includes(v))) hasActionVerbs = true;
      });
    });

    if (totalBullets >= 5) score += 10;
    if (hasMetrics) score += 5;
    else feedback.push({ id: "Gunakan angka (%) untuk menunjukkan pencapaian nyata.", en: "Use numbers (%) to show real achievements." });
    
    if (hasActionVerbs) score += 5;
    else feedback.push({ id: "Gunakan kata kerja aksi seperti 'Memimpin' atau 'Mengelola'.", en: "Use action verbs like 'Lead' or 'Manage'." });

  } else {
    feedback.push({ id: "Pengalaman kerja adalah bagian paling penting di CV.", en: "Work experience is the most important part of a CV." });
  }

  // 4. Skills (20 pts)
  const totalSkills = (skills?.technical.length || 0) + (skills?.soft.length || 0);
  if (totalSkills >= 8) score += 20;
  else if (totalSkills >= 4) score += 10;
  else feedback.push({ id: "Tambahkan lebih banyak keahlian yang relevan.", en: "Add more relevant skills." });

  // 5. Education (15 pts)
  if (education && education.length > 0) score += 15;
  else feedback.push({ id: "Informasi pendidikan belum diisi.", en: "Education information is missing." });

  return {
    score: Math.min(100, score),
    feedback
  };
}
