# 🎨 DESAIN.md — ATS CV Builder Pro

## Visi Produk

**ATS CV Builder Pro** adalah aplikasi web yang membantu job seeker Indonesia membuat CV ATS-friendly yang profesional, dengan bantuan AI untuk menyempurnakan konten agar lebih menarik di mata HRD dan lolos filter ATS (Applicant Tracking System).

---

## Stack Teknologi (Rekomendasi)

### ✅ Pilihan Utama: **Next.js 14 App Router**

| Aspek | Alasan |
|-------|--------|
| SSR/SSG | CV preview bisa di-render server-side untuk performa optimal |
| API Routes | Backend AI terintegrasi tanpa server terpisah |
| Vercel Native | Deploy 1-klik, zero config, auto HTTPS |
| TypeScript | Type safety untuk form data yang kompleks |
| App Router | Layout sistem lebih clean dan modern |

### Alternatif yang Bisa Dipertimbangkan

| Framework | Pro | Kontra |
|-----------|-----|--------|
| **SvelteKit** | Lebih ringan, DX luar biasa | Ekosistem lebih kecil |
| **Remix** | Data loading sangat baik | Vercel perlu sedikit config |
| **Nuxt 3 (Vue)** | Familiar jika background Vue | JS bundle lebih besar |

> **Rekomendasi Final: Next.js 14** — paling matang untuk Vercel deploy, komunitas terbesar, dan AI SDK paling banyak tersedia.

---

## Design System

### Palet Warna

```css
:root {
  /* Primary - Deep Navy Professional */
  --color-primary: #0F2040;
  --color-primary-light: #1A3A6B;
  --color-accent: #2D7DD2;       /* Trust blue */
  --color-accent-warm: #F4A261;  /* CTA orange */

  /* Neutral */
  --color-surface: #FAFBFC;
  --color-surface-2: #F0F4F8;
  --color-border: #D1DCE8;
  --color-text: #1A2332;
  --color-text-muted: #64748B;

  /* Semantic */
  --color-success: #10B981;
  --color-ai-purple: #7C3AED;    /* AI feature highlight */
  --color-warning: #F59E0B;
}
```

### Tipografi

```css
/* Heading: Playfair Display (editorial, profesional) */
/* Body: IBM Plex Sans (technical, readable, ATS-friendly look) */
/* Mono: JetBrains Mono (untuk kode/data preview) */

font-family: 'IBM Plex Sans', system-ui, sans-serif;
```

### Komponen UI Utama

```
┌─────────────────────────────────────────────────┐
│  NAVBAR                                         │
│  Logo | Step Indicator | [Pratinjau] [Unduh]    │
└─────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────────────┐
│                  │  │                          │
│   FORM PANEL     │  │   LIVE PREVIEW PANEL     │
│   (Left 45%)     │  │   (Right 55%)            │
│                  │  │                          │
│  Step 1: Info    │  │  ┌────────────────────┐  │
│  Step 2: Target  │  │  │  CV PREVIEW ATS    │  │
│  Step 3: Exp     │  │  │  (Real-time)       │  │
│  Step 4: Skills  │  │  │                    │  │
│  Step 5: Edu     │  │  │                    │  │
│                  │  │  └────────────────────┘  │
│  [✨ AI Polish]  │  │                          │
└──────────────────┘  └──────────────────────────┘
```

### Tema CV ATS (Template)

**ATS-Strict Template** — Clean, single column, serif headings:
- Font: Georgia / Times-like untuk CV body
- No tables, no images, no columns
- Section headers dengan garis horizontal
- Bullet points dengan karakter standar (•)
- Margin: 0.75 inch semua sisi

---

## UX Flow Utama

### Onboarding (Landing Page)
```
Hero Section
├── Headline: "CV ATS Profesional dalam 5 Menit"
├── Sub: "Dioptimasi AI • Lolos ATS • Diminati HRD"
├── [Buat CV Sekarang] CTA
└── Social proof: "1.000+ CV dibuat minggu ini"
```

### Form Wizard (Multi-Step)

```
Progress Bar: ●●●○○ Step 3 dari 5

Step 1 → Informasi Pribadi
Step 2 → Target Posisi & Perusahaan
Step 3 → Pengalaman Kerja
Step 4 → Keahlian & Kompetensi
Step 5 → Pendidikan & Sertifikasi
```

### AI Enhancement Flow

```
User klik [✨ Sempurnakan dengan AI]
    ↓
Loading animation (typewriter effect)
    ↓
AI menganalisis semua input
    ↓
Menampilkan diff: "Sebelum vs Sesudah"
    ↓
User bisa Accept All / Review per-section
    ↓
[Generate CV] → PDF Download
```

---

## Responsif & Aksesibilitas

- Mobile: Form fullscreen, preview slide-up sheet
- Tablet: Split view 50/50
- Desktop: Split view 45/55
- Dark mode: Support via CSS variables
- A11y: ARIA labels, keyboard navigation, focus management

---

## Animasi & Micro-interactions

| Elemen | Animasi |
|--------|---------|
| Step transition | Slide + fade (300ms) |
| AI processing | Typing cursor + gradient pulse |
| Form field focus | Border glow (accent color) |
| CV preview update | Subtle flash highlight pada bagian yang berubah |
| Download button | Bounce + confetti mini |
| Error state | Shake animation |
