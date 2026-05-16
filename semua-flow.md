# 🔄 SEMUA FLOW.md — ATS CV Builder Pro

## Overview Flow Map

```
┌──────────────────────────────────────────────────────────────────┐
│                     MASTER FLOW                                  │
│                                                                  │
│  Landing → Form Wizard → AI Enhancement → Preview → Download     │
│                                                                  │
│  [1]        [2-6]         [7]              [8]        [9]        │
└──────────────────────────────────────────────────────────────────┘
```

---

## FLOW 1: Landing Page Flow

```
User buka URL
    │
    ▼
┌─────────────────────────────────────┐
│           LANDING PAGE              │
│                                     │
│  • Hero: "CV ATS dalam 5 Menit"    │
│  • Feature highlights               │
│  • Sample CV preview (static)       │
│  • Testimonial / social proof       │
│  • CTA: [Buat CV Gratis Sekarang]   │
└─────────────────────────────────────┘
    │
    ▼
User klik CTA
    │
    ▼
Redirect ke /builder (Step 1)
```

---

## FLOW 2: Form Wizard — Step 1 (Informasi Pribadi)

```
/builder
    │
    ▼
┌─────────────────────────────────────────┐
│  STEP 1: INFORMASI PRIBADI              │
│                                         │
│  Fields:                                │
│  ├── Nama Lengkap *                     │
│  ├── Email Profesional *                │
│  ├── Nomor Telepon *                    │
│  ├── Kota Domisili *                    │
│  ├── URL LinkedIn                       │
│  └── URL Portfolio/GitHub (opsional)    │
│                                         │
│  Validasi: real-time (Zod schema)       │
│  Preview: Update langsung di panel kanan│
│                                         │
│  [Lanjut →]                             │
└─────────────────────────────────────────┘
    │
    ▼ (semua field required terisi)
Step 2
```

---

## FLOW 3: Form Wizard — Step 2 (Target Posisi)

```
/builder/target
    │
    ▼
┌─────────────────────────────────────────┐
│  STEP 2: TARGET POSISI & LOWONGAN       │
│                                         │
│  Fields:                                │
│  ├── Posisi yang Dilamar *              │
│  │   (contoh: "Software Engineer")      │
│  ├── Nama Perusahaan Target             │
│  ├── Paste Job Description *            │
│  │   (textarea besar)                   │
│  │   [✨ Ekstrak Keywords Otomatis]     │
│  └── Keywords ATS (auto-filled atau    │
│      manual tambah)                     │
│                                         │
│  [← Kembali] [Lanjut →]                │
└─────────────────────────────────────────┘
    │
    ├──► User paste JD → [Ekstrak Keywords]
    │         │
    │         ▼
    │    POST /api/ai/keywords
    │         │
    │         ▼
    │    Keywords tampil sebagai chips/tags
    │    User bisa tambah/hapus manual
    │
    ▼
Step 3
```

---

## FLOW 4: Form Wizard — Step 3 (Pengalaman Kerja)

```
/builder/experience
    │
    ▼
┌─────────────────────────────────────────┐
│  STEP 3: PENGALAMAN KERJA               │
│                                         │
│  [+ Tambah Pengalaman]                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Pengalaman 1                    │   │
│  │ ├── Jabatan *                   │   │
│  │ ├── Nama Perusahaan *           │   │
│  │ ├── Periode * (bulan/tahun)     │   │
│  │ ├── Masih Bekerja? [checkbox]   │   │
│  │ ├── Lokasi                      │   │
│  │ └── Deskripsi Pekerjaan         │   │
│  │     (bullet points, min 2)      │   │
│  │     [+ Tambah Bullet]           │   │
│  │     [✨ Poles Bullet ini]       │   │
│  │     [🗑 Hapus]                  │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Bisa tambah multiple experiences       │
│  Drag-and-drop untuk reorder           │
│                                         │
│  [← Kembali] [Lanjut →]                │
└─────────────────────────────────────────┘
    │
    ├──► User klik [✨ Poles Bullet ini]
    │         │
    │         ▼
    │    POST /api/ai/bullet { bullet, jobContext }
    │         │
    │         ▼
    │    Tampil: "Sebelum" vs "Sesudah"
    │    [Gunakan Versi AI] [Pertahankan Original]
    │
    ▼
Step 4
```

---

## FLOW 5: Form Wizard — Step 4 (Keahlian)

```
/builder/skills
    │
    ▼
┌─────────────────────────────────────────┐
│  STEP 4: KEAHLIAN & KOMPETENSI          │
│                                         │
│  Technical Skills *                     │
│  [Tag input: Python, React, SQL...]     │
│  💡 Saran dari JD: [React] [Node.js]   │
│                                         │
│  Tools & Software                       │
│  [Tag input: Figma, Jira, Git...]       │
│                                         │
│  Soft Skills                            │
│  [Tag input: Leadership, Komunikasi...] │
│                                         │
│  Bahasa                                 │
│  [Tag input + level: Indonesia (Native)]│
│                                         │
│  [← Kembali] [Lanjut →]                │
└─────────────────────────────────────────┘
    │
    ▼
Step 5
```

---

## FLOW 6: Form Wizard — Step 5 (Pendidikan)

```
/builder/education
    │
    ▼
┌─────────────────────────────────────────┐
│  STEP 5: PENDIDIKAN & SERTIFIKASI       │
│                                         │
│  Pendidikan:                            │
│  ┌─────────────────────────────────┐   │
│  │ ├── Gelar * (S1, S2, D3, dll)   │   │
│  │ ├── Jurusan *                   │   │
│  │ ├── Nama Institusi *            │   │
│  │ ├── Tahun Lulus *               │   │
│  │ └── IPK (opsional)              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Sertifikasi (opsional):                │
│  ┌─────────────────────────────────┐   │
│  │ ├── Nama Sertifikasi            │   │
│  │ ├── Penerbit                    │   │
│  │ └── Tahun                       │   │
│  └─────────────────────────────────┘   │
│  [+ Tambah Sertifikasi]                 │
│                                         │
│  [← Kembali] [✨ Sempurnakan dengan AI] │
└─────────────────────────────────────────┘
    │
    ▼
Flow 7: AI Enhancement
```

---

## FLOW 7: AI Enhancement Flow (Core Feature)

```
User klik [✨ Sempurnakan dengan AI]
    │
    ▼
┌─────────────────────────────────────────────────────┐
│              AI ENHANCEMENT MODAL                    │
│                                                     │
│  🤖 "Sedang menganalisis CV Anda..."               │
│  ████████████░░░░ 65%                              │
│                                                     │
│  ✅ Menganalisis job description                    │
│  ✅ Mengekstrak ATS keywords                        │
│  ⏳ Mengoptimalkan professional summary...          │
│  ○  Menyempurnakan bullet points                   │
│  ○  Menyesuaikan skill priorities                  │
└─────────────────────────────────────────────────────┘
    │
    ▼ (proses ~10-20 detik via streaming)
    │
    POST /api/ai/enhance
    {
      cvData: { personal, target, experiences, skills, education },
      jobDescription: "...",
      atsKeywords: [...]
    }
    │
    ▼
    AI System Prompt:
    "Kamu adalah expert HR konsultan Indonesia dengan 15 tahun pengalaman.
     Sempurnakan CV ini agar:
     1. Lolos ATS filter dengan keyword yang relevan
     2. Menarik perhatian HRD dalam 6 detik pertama
     3. Gunakan STAR method untuk experience bullets
     4. Bahasa Indonesia yang formal namun engaging
     5. Format: konsisten, profesional, bebas typo"
    │
    ▼
    AI Returns JSON:
    {
      professionalSummary: "...",
      enhancedExperiences: [...],
      prioritizedSkills: [...],
      atsScore: 87,
      improvements: [...],
      tips: [...]
    }
    │
    ▼
┌─────────────────────────────────────────────────────┐
│              HASIL AI ENHANCEMENT                    │
│                                                     │
│  ATS Match Score: 87/100 🎯                        │
│                                                     │
│  Professional Summary:                              │
│  SEBELUM: [teks lama user]                         │
│  SESUDAH:  [teks AI yang lebih profesional]        │
│  [Gunakan ✓] [Edit] [Pertahankan Asli]             │
│                                                     │
│  Experience Bullets:                                │
│  SEBELUM: "Membuat fitur login"                    │
│  SESUDAH:  "Mengembangkan sistem autentikasi..."   │
│  [Gunakan ✓] [Edit] [Pertahankan Asli]             │
│                                                     │
│  💡 Tips: Tambahkan sertifikasi AWS untuk          │
│     meningkatkan skor ATS ke 95+                   │
│                                                     │
│  [Terima Semua] [Review Satu per Satu]             │
│  [Lanjut ke Preview →]                             │
└─────────────────────────────────────────────────────┘
```

---

## FLOW 8: Preview CV Flow

```
User klik [Lanjut ke Preview →]
    │
    ▼
/preview
    │
    ▼
┌───────────────────────────────────────────────────────┐
│                    PREVIEW PAGE                        │
│                                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │              CV ATS PREVIEW                     │ │
│  │                                                 │ │
│  │  BUDI SANTOSO                                   │ │
│  │  Software Engineer                              │ │
│  │  ─────────────────────────────────────────────  │ │
│  │  📧 budi@email.com | 📱 +62 812-xxxx-xxxx      │ │
│  │  📍 Jakarta | 🔗 linkedin.com/in/budi          │ │
│  │  ─────────────────────────────────────────────  │ │
│  │  PROFESSIONAL SUMMARY                           │ │
│  │  Software Engineer dengan 5 tahun pengalaman... │ │
│  │                                                 │ │
│  │  WORK EXPERIENCE                                │ │
│  │  ─────────────────────────────────────────────  │ │
│  │  Senior Developer | PT Teknologi Maju    2021- │ │
│  │  • Mengembangkan sistem yang meningkatkan...   │ │
│  │  • Memimpin tim 5 developer dalam...           │ │
│  │                                                 │ │
│  └─────────────────────────────────────────────────┘ │
│                                                       │
│  Toolbar:                                             │
│  [← Edit] [🔄 Refresh] [📥 Unduh PDF]               │
│                                                       │
│  Zoom: [75%] [100%] [125%]                           │
└───────────────────────────────────────────────────────┘
```

---

## FLOW 9: PDF Generation & Download Flow

```
User klik [📥 Unduh PDF]
    │
    ▼
Client-side PDF generation (@react-pdf/renderer)
    │
    ├── Kumpulkan semua data dari Zustand store
    ├── Inject ke CV React PDF template
    ├── Render ke PDF blob
    │
    ▼
Generate filename:
    namaDepan_namaBelakanng → format_safe
    "Budi Santoso" → "Budi-Santoso_cv-ats.pdf"
    │
    ▼
Trigger browser download
    │
    ▼
┌─────────────────────────────────────┐
│  ✅ SUCCESS STATE                   │
│                                     │
│  🎉 CV berhasil diunduh!            │
│  File: Budi-Santoso_cv-ats.pdf      │
│                                     │
│  [Buat CV Baru] [Edit CV Ini]       │
│  [Share ke LinkedIn] (coming soon)  │
└─────────────────────────────────────┘
```

---

## FLOW 10: Error Handling Flows

### AI API Error

```
POST /api/ai/enhance
    │
    ├── Network error / timeout
    │       ↓
    │   Toast: "Koneksi bermasalah. Coba lagi?"
    │   [Coba Lagi] [Skip AI, Lanjut Manual]
    │
    ├── Rate limit exceeded
    │       ↓
    │   Toast: "Terlalu banyak permintaan. Tunggu 1 menit."
    │   Countdown timer tampil
    │
    └── Invalid API key (dev mode)
            ↓
        Console error (tidak tampil ke user)
        Fallback: "AI sedang tidak tersedia"
```

### Form Validation Error

```
User klik [Lanjut] dengan field kosong
    │
    ▼
Zod validation → error per field
    │
    ▼
Field highlight merah + error message
Scroll ke field pertama yang error
Focus pada field tersebut
```

### PDF Generation Error

```
@react-pdf render gagal
    │
    ▼
Fallback: Generate via /api/pdf/generate (server-side)
    │
    ├── Success → Download
    └── Fail → "Gagal generate PDF. Coba refresh halaman."
```

---

## FLOW 11: State Persistence Flow

```
User mengisi form di Step 1
    │
    ▼
Data tersimpan di Zustand store (memory)
    │
    ▼
Zustand persist middleware → localStorage
    │
    ├── User refresh halaman → data masih ada ✅
    ├── User tutup tab → data hilang setelah session ❌
    │
    ▼
Banner: "CV Anda tersimpan sementara di browser ini"
[Lanjutkan dari terakhir] muncul jika ada data sebelumnya
```

---

## Component Interaction Map

```
<CVBuilderLayout>
├── <StepIndicator steps={5} current={3} />
├── <FormPanel>
│   ├── <Step1PersonalInfo />
│   ├── <Step2TargetJob />
│   │   └── <KeywordExtractor />
│   ├── <Step3Experience />
│   │   ├── <ExperienceCard />
│   │   └── <BulletPointEditor />
│   │       └── <AIBulletPolisher />
│   ├── <Step4Skills />
│   │   └── <TagInput />
│   └── <Step5Education />
│       └── <CertificationCard />
└── <PreviewPanel>
    └── <CVATSTemplate data={cvStore} />
```

```
<AIEnhancementModal>
├── <ProcessingAnimation />
├── <ScoreDisplay atsScore={87} />
├── <DiffViewer>
│   ├── <SectionDiff section="summary" />
│   ├── <SectionDiff section="experience" />
│   └── <SectionDiff section="skills" />
└── <ActionButtons />
```

```
<PreviewPage>
├── <CVATSTemplate data={cvStore} />
├── <PreviewToolbar>
│   ├── <ZoomControl />
│   ├── <EditButton />
│   └── <DownloadButton onDownload={generatePDF} />
└── <ATSScoreBadge score={87} />
```

---

## AI Prompt Architecture

### Master System Prompt

```
Kamu adalah konsultan karir profesional Indonesia dengan spesialisasi 
pembuatan CV ATS (Applicant Tracking System) yang telah membantu 
lebih dari 10.000 kandidat mendapatkan pekerjaan impian mereka.

Tugas kamu adalah mengoptimalkan CV kandidat dengan memastikan:

1. ATS COMPATIBILITY:
   - Gunakan exact keywords dari job description
   - Hindari tabel, kolom, grafik, atau format kompleks
   - Gunakan bullet points standar (•)
   - Pastikan section headers standar dan mudah dibaca parser

2. HUMAN APPEAL (HRD akan membaca dalam 6 detik):
   - Buka dengan professional summary yang kuat dan spesifik
   - Kuantifikasi pencapaian (angka, persentase, skala)
   - Gunakan action verbs yang powerful di awal setiap bullet
   - Relevansi posisi harus jelas di setiap section

3. BAHASA:
   - Formal namun tidak kaku
   - Konsisten (semua Indonesia atau semua Inggris, tidak campur)
   - Present tense untuk pekerjaan saat ini
   - Past tense untuk pekerjaan sebelumnya

4. FORMAT OUTPUT:
   Selalu response dalam JSON yang valid sesuai schema yang diberikan.
   Jangan tambahkan teks di luar JSON.
```

### Per-Feature Prompts

```typescript
// Keyword extraction
const keywordPrompt = (jd: string) => `
Analisis job description berikut dan ekstrak:
- required_skills: keahlian teknis wajib
- preferred_skills: keahlian tambahan yang diinginkan  
- tools: software dan tools yang disebutkan
- soft_skills: kemampuan non-teknis
- keywords: kata kunci ATS penting lainnya

JD: ${jd}

Response dalam JSON: { required_skills, preferred_skills, tools, soft_skills, keywords }
`;

// Bullet point optimizer
const bulletPrompt = (bullet: string, jobTitle: string, keywords: string[]) => `
Optimalkan bullet point CV ini untuk posisi ${jobTitle}.

Bullet asli: "${bullet}"
Keywords ATS target: ${keywords.join(', ')}

Aturan:
- Mulai dengan action verb yang kuat (Mengembangkan, Memimpin, Mengoptimalkan, dst)
- Tambahkan angka/metrik jika memungkinkan (estimasi wajar jika tidak ada)
- Sertakan dampak/hasil dari aksi tersebut
- Maksimal 2 baris
- Sertakan minimal 1 keyword dari list target

Response: { optimized: string, explanation: string }
`;
```

---

## Deployment & Release Flow

```
Development
    │  git push origin feature/xxx
    ▼
GitHub PR
    │  Review + merge to main
    ▼
Vercel Preview Deploy (otomatis)
    │  URL: ats-cv-builder-git-main-xxx.vercel.app
    ▼
QA Testing di preview URL
    │  Semua flow tested
    ▼
Promote to Production
    │  vercel --prod atau merge to main
    ▼
Production: ats-cv-builder.vercel.app
    │
    ▼
Monitoring via Vercel Analytics + Speed Insights
```
