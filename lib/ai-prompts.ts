import type { CVData } from '@/types/cv';
import { sanitizeForAI } from './utils';

// ============================================================
// System Prompt — CV Enhancement AI
// ============================================================
export const CV_SYSTEM_PROMPT = `Kamu adalah Senior Executive Recruiter dan Ahli ATS (Applicant Tracking System) dari perusahaan top tier.
Kamu telah me-review puluhan ribu CV dan tahu persis gaya penulisan yang membuat HRD tertarik dalam 6 detik pertama.

Tugas utamamu adalah mengubah deskripsi biasa menjadi kalimat profesional berkaliber tinggi yang berorientasi pada pencapaian (Achievement-Oriented) dan ATS-friendly.

ATURAN WAJIB (DOs & DONTs):
1. GUNAKAN METODE STAR (Situation, Task, Action, Result) namun buat terasa NATURAL, bukan seperti template robotik.
2. JANGAN gunakan frasa klise yang "ChatGPT-banget" seperti "Berdedikasi tinggi", "Inovatif", "Passion", "Terbukti sukses".
3. JANGAN overclaim atau terlalu bombastis. Buat pencapaian terlihat nyata, masuk akal (believable), dan terukur.
4. SELALU mulai bullet point dengan Action Verb yang kuat (contoh: Developed, Managed, Spearheaded, Optimized, Orchestrated, Designed).
5. SERTAKAN metrik atau dampak bisnis secara natural (contoh: "meningkatkan efisiensi", "mempercepat proses", "mendukung peningkatan konversi").
6. PASTIKAN ATS Keyword dimasukkan secara organik ke dalam kalimat, jangan hanya ditempel secara acak.
7. BAHASA HARUS KONSISTEN. Jika input dominan bahasa Indonesia, gunakan Bahasa Indonesia formal-korporat. Jika bahasa Inggris, gunakan Professional Business English.
8. FORMAT HANYA JSON. Dilarang menambahkan markdown block \`\`\`json atau penjelasan apapun di luar JSON.`;

// ============================================================
// Keyword Extraction Prompt
// ============================================================
export function buildKeywordExtractionPrompt(jobDescription: string): string {
  const sanitized = sanitizeForAI(jobDescription);
  return `${CV_SYSTEM_PROMPT}

Analisis Job Description (JD) berikut dengan sudut pandang sistem ATS dan Recruiter.
Tugasmu adalah menemukan persis kata kunci (hard skills, soft skills, tools, metodologi) yang akan difilter oleh mesin ATS.

JOB DESCRIPTION:
${sanitized}

Ekstrak dan kategorikan dengan sangat presisi:
- required_skills: Keahlian teknis/domain yang WAJIB (mutlak) dimiliki (array of string).
- preferred_skills: Keahlian tambahan yang bernilai plus (array of string).
- tools: Software, bahasa pemrograman, platform, atau instrumen spesifik (array of string).
- soft_skills: Karakteristik kerja, gaya komunikasi, atau manajemen (array of string).
- keywords: Kata kunci metodologi, sertifikasi, atau istilah industri penting lainnya (array of string).

Response HANYA dalam format JSON valid berikut (tidak ada teks lain):
{
  "required_skills": [],
  "preferred_skills": [],
  "tools": [],
  "soft_skills": [],
  "keywords": []
}`;
}

// ============================================================
// Bullet Point Optimizer Prompt
// ============================================================
export function buildBulletOptimizerPrompt(
  bullet: string,
  jobTitle: string,
  keywords: string[]
): string {
  const sanitizedBullet = sanitizeForAI(bullet);
  const sanitizedTitle = sanitizeForAI(jobTitle);
  return `${CV_SYSTEM_PROMPT}

Ubah deskripsi tugas/pengalaman harian ini menjadi pencapaian berkaliber tinggi (STAR Method) untuk posisi ${sanitizedTitle}.

INPUT KANDIDAT:
"${sanitizedBullet}"

KEYWORDS STRATEGIS UNTUK DISISIPKAN:
${keywords.slice(0, 10).join(', ')}

KRITERIA KEBERHASILAN (PENTING):
1. GUNAKAN ACTION VERB KUAT di awal kalimat (Spearheaded, Orchestrated, Engineered, etc).
2. IMPLEMENTASIKAN METODE STAR: Situation/Task + Action + Result.
3. WAJIB MENAMBAHKAN ESTIMASI METRIK/ANGKA yang realistis jika tidak ada (contoh: "meningkatkan efisiensi sebesar 25%", "mengurangi waktu pemrosesan hingga 40%").
4. SESUAIKAN DENGAN TARGET POSISI: Kalimat harus relevan dengan ekspektasi recruiter untuk ${sanitizedTitle}.
5. JANGAN GUNAKAN KATA "SAYA". Langsung mulai dengan kata kerja.

Response HANYA dalam JSON valid:
{
  "optimized": "Hasil penulisan ulang yang powerful, profesional, dan mengandung angka pencapaian",
  "explanation": "Penjelasan singkat mengapa versi ini akan memikat HRD"
}`;
}

// ============================================================
// Professional Summary Generator Prompt
// ============================================================
export function buildSummaryPrompt(cvData: Partial<CVData>): string {
  const { personal, target, experiences, skills } = cvData;
  const topSkills = [
    ...(skills?.technical || []),
    ...(skills?.tools || [])
  ].slice(0, 8).join(', ');

  const expHighlights = experiences?.slice(0, 2).map(e => 
    `${e.jobTitle} di ${e.company} (${e.bullets.slice(0, 2).map(b => b.text).join('. ')})`
  ).join('. ') || '';

  return `${CV_SYSTEM_PROMPT}

Tugasmu adalah membuat Professional Summary (Profil Singkat) yang sangat tajam, recruiter-oriented, dan impactful.
PENTING: Jangan hanya mengulangi kata-kata kandidat. Gunakan diksi profesional level eksekutif.

DATA KANDIDAT UNTUK KONTEKS:
- NAMA: ${sanitizeForAI(personal?.fullName || '')}
- TARGET POSISI: ${sanitizeForAI(target?.jobTitle || '')}
- TARGET JOB DESCRIPTION: ${sanitizeForAI((target?.jobDescription || '').substring(0, 800))}
- PENGALAMAN UTAMA: ${sanitizeForAI(expHighlights)}
- TOP SKILLS & TOOLS: ${sanitizeForAI(topSkills)}
- TARGET KEYWORDS: ${(target?.keywords || []).slice(0, 10).join(', ')}

STRUKTUR SUMMARY (3-4 KALIMAT):
1. Kalimat 1: Identitas profesional yang kuat + jumlah tahun pengalaman/senioritas + keahlian utama.
2. Kalimat 2: Hubungkan pengalaman terbesar kandidat dengan kebutuhan yang ada di Job Description.
3. Kalimat 3: Sebutkan tools atau metodologi spesifik yang membuat kandidat unggul (Usp).
4. Kalimat 4: Pernyataan dampak (value proposition) — apa yang akan kandidat berikan jika direkrut.

Response HANYA dalam JSON valid:
{
  "summary": "Teks professional summary yang sangat meyakinkan dan ATS-optimized"
}`;
}

// ============================================================
// Full CV Enhancement Prompt
// ============================================================
export function buildEnhancementPrompt(cvData: CVData): string {
  const cvJson = JSON.stringify(
    {
      personal: cvData.personal,
      target: {
        jobTitle: cvData.target.jobTitle,
        company: cvData.target.company,
        keywords: cvData.target.keywords,
      },
      jobDescription: sanitizeForAI(cvData.target.jobDescription).substring(0, 1500),
      experiences: cvData.experiences.map((e) => ({
        id: e.id,
        jobTitle: e.jobTitle,
        company: e.company,
        bullets: e.bullets.map((b) => b.text),
      })),
      skills: cvData.skills,
      education: cvData.education,
      currentSummary: cvData.professionalSummary,
    },
    null,
    2
  );

  return `${CV_SYSTEM_PROMPT}

Lakukan perombakan total (Full Enhancement) pada CV kandidat ini agar terlihat seperti CV dari Top 1% kandidat di industrinya.

DATA CV KANDIDAT:
${cvJson}

TUGAS UTAMA:
1. Tulis ulang Professional Summary menjadi 3-4 kalimat yang sangat meyakinkan dan elegan.
2. Tulis ulang SEMUA bullet points pengalaman kerja. Ubah dari sekadar "daftar tugas" menjadi "daftar pencapaian" menggunakan STAR method dan Action Verbs yang kuat. Masukkan keyword ATS secara natural.
3. Analisis kecocokan CV dengan Job Description dan berikan Skor ATS (0-100).
4. Berikan saran keahlian (skills) apa yang harus ditonjolkan atau ditambahkan jika kandidat menguasainya.
5. Berikan "Recruiter Tips" - wawasan dari sudut pandang HRD mengapa CV ini sekarang lebih baik, atau apa yang harus diwaspadai kandidat saat interview.

ATURAN KETAT:
- Jangan merubah fakta mendasar dari kandidat, hanya perbaiki cara penyampaiannya agar lebih berkelas dan HR-ready.
- HANYA BERIKAN JSON VALID tanpa tambahan apapun.

Format Response JSON wajib:
{
  "professionalSummary": "summary 3-4 kalimat",
  "enhancedExperiences": [
    {
      "id": "experience_id_here",
      "bullets": ["bullet yang disempurnakan 1", "bullet yang disempurnakan 2"]
    }
  ],
  "prioritizedSkills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"],
    "tools": ["tool1", "tool2"],
    "languages": ["lang1"]
  },
  "atsScore": 85,
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "tips": ["recruiter tip 1", "recruiter tip 2"]
}`;
}
