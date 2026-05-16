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

Ubah deskripsi tugas/pengalaman harian ini menjadi pencapaian berkaliber tinggi untuk posisi ${sanitizedTitle}.

BULLET ASLI DARI KANDIDAT:
"${sanitizedBullet}"

KEYWORDS ATS TARGET YANG PERLU DIMASUKKAN (Jika relevan):
${keywords.slice(0, 8).join(', ')}

ATURAN KHUSUS UNTUK BULLET INI:
1. Translasi task biasa menjadi kalimat bertenaga. (Contoh buruk: "membuat website toko online" -> Contoh baik: "Developed and maintained responsive e-commerce websites with optimized user experience, contributing to improved customer engagement and smoother online transactions.")
2. Buat terdengar sangat natural, meyakinkan (believable), dan elegan.
3. Maksimal 2 baris (sekitar 150-200 karakter). Jangan terlalu panjang.
4. Gunakan bahasa yang sama dengan bullet asli kandidat.

Response HANYA dalam JSON valid:
{
  "optimized": "hasil kalimat yang sempurna",
  "explanation": "Alasan singkat 1 kalimat mengapa ini lebih baik di mata HRD"
}`;
}

// ============================================================
// Professional Summary Generator Prompt
// ============================================================
export function buildSummaryPrompt(cvData: Partial<CVData>): string {
  const { personal, target, experiences, skills } = cvData;
  const yearsExp = experiences?.length || 0;
  const topSkills = skills?.technical?.slice(0, 5).join(', ') || '';

  return `${CV_SYSTEM_PROMPT}

Buat Professional Summary (Profil Singkat) yang sangat tajam, *recruiter-oriented*, dan *impactful* berdasarkan profil kandidat berikut.
Summary ini akan diletakkan di paling atas CV dan harus membuat HRD ingin membaca lebih lanjut dalam 6 detik pertama.

POSISI TARGET: ${sanitizeForAI(target?.jobTitle || '')}
NAMA KANDIDAT: ${sanitizeForAI(personal?.fullName || '')}
JUMLAH PENGALAMAN KERJA: ${yearsExp}
TOP SKILLS: ${sanitizeForAI(topSkills)}
JOB DESCRIPTION EXCERPT: ${sanitizeForAI((target?.jobDescription || '').substring(0, 500))}
KEYWORDS ATS DARI JD: ${(target?.keywords || []).slice(0, 8).join(', ')}

ATURAN SUMMARY:
1. Hindari kalimat usang seperti "Saya adalah individu yang pekerja keras dan mencari tantangan baru".
2. Buka dengan identitas profesional yang kuat (contoh: "Results-driven Frontend Developer with X years of experience...").
3. Sebutkan kompetensi inti yang paling relevan dengan Job Description.
4. Akhiri dengan nilai/dampak konkret yang bisa diberikan kepada perusahaan.
5. Terdiri dari 3-4 kalimat padat. Tidak bertele-tele.

Response HANYA dalam JSON valid:
{
  "summary": "Teks professional summary"
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
