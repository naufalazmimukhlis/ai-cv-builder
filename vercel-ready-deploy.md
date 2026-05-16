# 🚀 VERCEL READY DEPLOY — ATS CV Builder Pro

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git repository (GitHub / GitLab / Bitbucket)
- [ ] Akun Vercel (free tier cukup)
- [ ] Anthropic API Key dari console.anthropic.com

---

## Struktur Folder Project

```
ats-cv-builder/
├── app/                          ← Next.js App Router
│   ├── (landing)/
│   │   └── page.tsx
│   ├── (builder)/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── target/page.tsx
│   │   ├── experience/page.tsx
│   │   ├── skills/page.tsx
│   │   └── education/page.tsx
│   ├── preview/
│   │   └── page.tsx
│   └── api/
│       ├── ai/
│       │   ├── enhance/route.ts
│       │   ├── summary/route.ts
│       │   └── keywords/route.ts
│       └── pdf/
│           └── generate/route.ts
│
├── components/
│   ├── form/
│   ├── cv-template/
│   ├── ai-enhance/
│   └── ui/
│
├── lib/
│   ├── ai-prompts.ts
│   ├── cv-store.ts
│   ├── pdf-generator.tsx
│   └── validators.ts
│
├── public/
│   └── og-image.png
│
├── .env.local                    ← JANGAN di-commit!
├── .env.example                  ← Template env (commit ini)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── vercel.json                   ← Vercel config
```

---

## Setup Awal (Step-by-Step)

### Step 1: Init Project

```bash
npx create-next-app@latest ats-cv-builder \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd ats-cv-builder
```

### Step 2: Install Dependencies

```bash
# Core dependencies
npm install zustand immer

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# AI
npm install @anthropic-ai/sdk ai

# PDF Generation
npm install @react-pdf/renderer

# UI
npm install framer-motion lucide-react clsx tailwind-merge

# Rate Limiting (opsional tapi recommended)
npm install @upstash/ratelimit @upstash/redis

# Dev
npm install -D @types/node
```

### Step 3: next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@anthropic-ai/sdk'],
  },
  // Untuk @react-pdf/renderer
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
}

module.exports = nextConfig
```

### Step 4: vercel.json

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/ai/enhance/route.ts": {
      "maxDuration": 30
    },
    "app/api/ai/summary/route.ts": {
      "maxDuration": 30
    },
    "app/api/pdf/generate/route.ts": {
      "maxDuration": 30
    }
  }
}
```

> ⚠️ `maxDuration: 30` diperlukan karena AI response bisa lambat. Free tier Vercel support 10 detik, **upgrade ke Hobby ($0/bulan dengan limits)** untuk 30 detik.

### Step 5: .env.example (commit file ini)

```bash
# Copy ke .env.local dan isi nilainya
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Upstash untuk rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Step 6: .gitignore (pastikan ada)

```
.env.local
.env*.local
node_modules/
.next/
out/
build/
```

---

## Deploy ke Vercel

### Cara A: Via Vercel CLI (Recommended untuk Developer)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (pertama kali)
vercel

# Deploy production
vercel --prod
```

### Cara B: Via GitHub (Recommended untuk CI/CD)

1. Push ke GitHub:
```bash
git init
git add .
git commit -m "feat: initial ATS CV Builder"
git remote add origin https://github.com/username/ats-cv-builder.git
git push -u origin main
```

2. Buka [vercel.com](https://vercel.com)
3. Klik **"Add New Project"**
4. Import repository GitHub
5. Vercel auto-detect Next.js ✅
6. **PENTING**: Tambah Environment Variables:
   - `ANTHROPIC_API_KEY` = `sk-ant-xxxxx`
   - (tambah yang lain jika perlu)
7. Klik **Deploy** 🚀

### Cara C: One-Click Deploy Button (untuk sharing)

Tambahkan di README.md project:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/username/ats-cv-builder&env=ANTHROPIC_API_KEY&envDescription=Anthropic%20API%20Key%20dari%20console.anthropic.com)
```

---

## Environment Variables di Vercel Dashboard

```
Project Settings → Environment Variables

Name                        Value                   Environments
─────────────────────────── ─────────────────────── ─────────────────────
ANTHROPIC_API_KEY           sk-ant-xxxxxxxx         Production, Preview
UPSTASH_REDIS_REST_URL      https://xxx.upstash.io  Production, Preview
UPSTASH_REDIS_REST_TOKEN    xxxxxxxx                Production, Preview
NEXT_PUBLIC_APP_URL         https://xxx.vercel.app  Production
```

---

## Vercel Plan Recommendation

| Fitur | Hobby (Free) | Pro ($20/mo) |
|-------|-------------|--------------|
| Serverless timeout | 10 detik | 60 detik |
| Bandwidth | 100 GB/bln | 1 TB/bln |
| Custom domain | ✅ | ✅ |
| Environment vars | ✅ | ✅ |
| **Cukup untuk project ini?** | ⚠️ (AI timeout) | ✅ |

> 💡 **Solusi untuk Free tier**: Gunakan **Streaming AI response** agar tidak timeout. Vercel Free support streaming hingga 25 detik.

---

## Optimasi untuk Vercel

### 1. Streaming AI Response (menghindari timeout)

```typescript
// app/api/ai/enhance/route.ts
import { StreamingTextResponse, streamText } from 'ai';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge'; // Gunakan Edge Runtime (lebih cepat cold start)
export const maxDuration = 25;

export async function POST(req: Request) {
  const { cvData } = await req.json();
  
  const anthropic = new Anthropic();
  
  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: buildPrompt(cvData) }]
  });

  return new StreamingTextResponse(stream.toReadableStream());
}
```

### 2. Edge Runtime untuk API Routes

```typescript
export const runtime = 'edge';
// Lebih cepat cold start, support streaming native
```

### 3. Image Optimization

```typescript
// next.config.js
images: {
  formats: ['image/avif', 'image/webp'],
}
```

---

## Post-Deploy Checklist

- [ ] Test form multi-step berfungsi
- [ ] Test AI enhance (cek API key terhubung)
- [ ] Test generate preview CV
- [ ] Test download PDF
- [ ] Test nama file PDF: `NamaPengguna_cv-ats.pdf`
- [ ] Cek mobile responsiveness
- [ ] Test di berbagai browser (Chrome, Firefox, Safari)
- [ ] Set up custom domain (opsional)

---

## Monitoring & Analytics (Gratis)

```bash
# Vercel Analytics (built-in)
npm install @vercel/analytics @vercel/speed-insights

# app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```
