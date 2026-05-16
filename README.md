# ATS CV Builder Pro 🚀

![ATS CV Builder Pro Banner](https://via.placeholder.com/1200x600/0F2040/FFFFFF?text=ATS+CV+Builder+Pro)

Aplikasi pembuat CV berbasis AI kelas enterprise yang dirancang khusus untuk job seeker Indonesia. Dioptimasi untuk menembus filter ATS (Applicant Tracking System), menarik perhatian HRD, dan menghasilkan PDF *pixel-perfect* dalam waktu kurang dari 5 menit.

## ✨ Fitur Unggulan

- **🤖 AI-Powered by Google Gemini Flash 2.5:** Analisis job description, ekstrak keyword ATS, dan sempurnakan seluruh isi CV dengan satu klik.
- **📈 ATS Match Score (0-100):** Ketahui tingkat kompatibilitas CV Anda dengan posisi yang dilamar sebelum mengirimkannya.
- **🎯 STAR Method Bullet Optimizer:** AI secara otomatis mengubah deskripsi pekerjaan biasa menjadi pencapaian berorientasi hasil.
- **👁️ Live Preview Split-Screen:** Lihat perubahan CV secara real-time saat Anda mengetik di editor.
- **💾 Auto-Save:** Data tersimpan dengan aman di browser lokal Anda (Local Storage) melalui sistem persistence Zustand.
- **📄 Pixel-Perfect PDF Export:** Template *single-column* strict yang dipastikan lolos parsing ATS berkat integrasi `@react-pdf/renderer`.
- **🛡️ Rate Limiting:** Keamanan API menggunakan hybrid Upstash Redis & in-memory cache untuk melindungi dari *abuse*.

---

## 🛠️ Tech Stack & Arsitektur

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS (Premium UI/UX System)
- **State Management:** Zustand + Immer (Immutable updates)
- **Forms & Validation:** React Hook Form + Zod
- **AI Engine:** Google Generative AI SDK (`@google/generative-ai`)
- **PDF Generation:** `@react-pdf/renderer`
- **Rate Limiter:** Upstash Redis (Serverless-ready)

---

## 📂 Struktur Proyek Final

```text
ai-cv-builder/
├── app/
│   ├── (landing)/          # Landing page pemasaran (Hero, Fitur, Cara Kerja, Testimoni)
│   ├── (builder)/          # Layout builder utama dengan split-screen form & live preview
│   │   └── builder/        # Form Wizard 5 Langkah
│   │       ├── page.tsx          # Step 1: Info Pribadi
│   │       ├── target/           # Step 2: Target Posisi & Keyword AI
│   │       ├── experience/       # Step 3: Pengalaman & Bullet AI
│   │       ├── skills/           # Step 4: Keahlian (Tag Input)
│   │       └── education/        # Step 5: Pendidikan & Sertifikasi
│   ├── preview/            # Fullscreen preview & PDF Export
│   ├── api/
│   │   ├── ai/             # API routes Gemini AI (enhance, keywords, bullet, summary)
│   │   └── pdf/            # API rute utilitas PDF
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Tailwind & Design System Variables
├── components/
│   ├── ui/                 # Reusable UI components (Button, Input, Modal, Toaster, dll)
│   ├── landing/            # Komponen penyusun landing page
│   ├── cv-template/        # Template ATS browser (DOM) & PDF (React-PDF)
│   └── ai-enhance/         # AI Modal, Diff Viewer, & Score Badge
├── lib/
│   ├── ai-prompts.ts       # Library system prompts untuk Gemini
│   ├── rate-limiter.ts     # Hybrid Upstash/Memory rate limiter
│   ├── utils.ts            # Utility functions (cn, parseAIJSON, etc)
│   └── validators.ts       # Skema Zod
├── store/
│   └── cv-store.ts         # Zustand store dengan LocalStorage persistence
├── types/
│   └── cv.ts               # Tipe data utama
└── tailwind.config.ts      # Konfigurasi token desain
```

---

## 🚀 Panduan Instalasi Lokal

1. **Clone repositori** (atau pastikan Anda berada di root folder `ai-cv-builder`).
2. **Install dependensi:**
   ```bash
   npm install
   ```
3. **Konfigurasi Environment:**
   Buat file `.env.local` di root proyek dan tambahkan variabel berikut:
   ```env
   # Wajib: Google Gemini API Key (Dapatkan dari Google AI Studio)
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here

   # Opsional (Direkomendasikan untuk Production): Upstash Redis
   UPSTASH_REDIS_REST_URL=your_upstash_url
   UPSTASH_REDIS_REST_TOKEN=your_upstash_token

   # Opsional: Base URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```
4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:3000` di browser Anda.

---

## 🌐 Panduan Deploy Vercel (Production-Ready)

Proyek ini telah dikonfigurasi secara khusus agar bebas dari masalah saat di-*deploy* ke Vercel (khususnya untuk *free-tier*).

1. Push kode ke GitHub repository Anda.
2. Buat proyek baru di Vercel dan hubungkan ke repository tersebut.
3. Di tab **Environment Variables** pada dashboard Vercel, masukkan:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `UPSTASH_REDIS_REST_URL` *(Jika ada)*
   - `UPSTASH_REDIS_REST_TOKEN` *(Jika ada)*
   - `NEXT_PUBLIC_APP_URL` (URL Vercel Anda, misal `https://my-cv-builder.vercel.app`)
4. Klik **Deploy**.
5. *Note: API Routes AI telah diatur dengan konfigurasi `maxDuration = 30` untuk mencegah timeout.*

---

## 💡 Arsitektur Keputusan & Solusi Masalah

1. **Gemini 2.5 Flash:** Kami menggunakan model Flash karena waktu responnya yang sangat cepat (penting untuk API di Vercel free-tier) dan parsing instruksi terstrukturnya (JSON) yang konsisten.
2. **Hybrid Rate Limiter:** Karena ini adalah proyek terbuka, Endpoint AI sangat rawan disalahgunakan. Kami menerapkan sistem rate limiter ganda. Jika instance Upstash Redis tersedia, ia akan digunakan sebagai *primary block*. Jika tidak ada (misal di local dev), ia akan otomatis *fallback* ke *in-memory Map()*.
3. **DOM vs PDF Split Template:** Merender DOM (untuk live preview) dan PDF (untuk download) memerlukan *renderer* yang berbeda agar performanya maksimal. Kami memisahkannya menjadi `ats-template.tsx` (menggunakan tag HTML biasa) dan `ats-template-pdf.tsx` (menggunakan tag `<View>`, `<Text>` dari `@react-pdf/renderer`).
4. **Zustand Persistence:** Form CV terdiri dari 5 langkah. Menggunakan `localStorage` persistence dari Zustand memastikan bahwa meskipun user tidak sengaja me-refresh halaman, data yang sudah diisi (seperti riwayat pekerjaan) tidak hilang.

---

**ATS CV Builder Pro**
*Membantu talenta terbaik Indonesia meraih karir impian.*
