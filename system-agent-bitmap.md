# 🧠 SYSTEM AGENT BITMAP PRO — ATS CV Builder

## Arsitektur Sistem Lengkap

```
┌─────────────────────────────────────────────────────────────────────┐
│                        VERCEL EDGE NETWORK                          │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    NEXT.JS 14 APP                             │  │
│  │                                                               │  │
│  │  ┌──────────────┐    ┌──────────────┐    ┌────────────────┐  │  │
│  │  │   FRONTEND   │    │  API ROUTES  │    │   AI AGENT     │  │  │
│  │  │  (React)     │◄──►│  /api/*      │◄──►│   LAYER        │  │  │
│  │  └──────────────┘    └──────────────┘    └────────────────┘  │  │
│  │         │                    │                    │           │  │
│  │         ▼                    ▼                    ▼           │  │
│  │  ┌──────────────┐    ┌──────────────┐    ┌────────────────┐  │  │
│  │  │  FORM STATE  │    │  RATE LIMIT  │    │  ANTHROPIC API │  │  │
│  │  │  (Zustand)   │    │  (Upstash)   │    │  claude-sonnet │  │  │
│  │  └──────────────┘    └──────────────┘    └────────────────┘  │  │
│  │                                                               │  │
│  │  ┌──────────────┐    ┌──────────────┐    ┌────────────────┐  │  │
│  │  │  PDF ENGINE  │    │  PREVIEW     │    │  TEMPLATE      │  │  │
│  │  │  (Puppeteer/ │    │  RENDERER    │    │  ENGINE        │  │  │
│  │  │   @react-pdf)│    │  (React)     │    │  (Handlebars)  │  │  │
│  │  └──────────────┘    └──────────────┘    └────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Breakdown

### 1. FRONTEND LAYER

```
/app
├── (landing)/
│   └── page.tsx              → Landing page + hero
│
├── (builder)/
│   ├── layout.tsx            → Builder layout (form + preview split)
│   ├── page.tsx              → Step 1: Info Pribadi
│   ├── target/page.tsx       → Step 2: Target Posisi
│   ├── experience/page.tsx   → Step 3: Pengalaman
│   ├── skills/page.tsx       → Step 4: Keahlian
│   └── education/page.tsx    → Step 5: Pendidikan
│
├── preview/
│   └── page.tsx              → Full preview + download
│
└── components/
    ├── form/                 → Semua form components
    ├── cv-template/          → CV ATS template renderer
    ├── ai-enhance/           → AI enhancement UI
    └── ui/                   → Shared UI components
```

### 2. STATE MANAGEMENT (Zustand)

```typescript
interface CVStore {
  // Personal Info
  personal: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio?: string;
  };

  // Target Job
  target: {
    jobTitle: string;
    company: string;
    jobDescription: string;      // Paste JD untuk ATS keyword matching
    keywords: string[];          // Auto-extracted dari JD
  };

  // Experience (array)
  experiences: Experience[];

  // Skills
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    tools: string[];
  };

  // Education
  education: Education[];

  // Summary (AI-generated atau manual)
  professionalSummary: string;

  // AI State
  aiStatus: 'idle' | 'processing' | 'done' | 'error';
  aiSuggestions: AISuggestions | null;

  // Actions
  updatePersonal: (data: Partial<Personal>) => void;
  updateTarget: (data: Partial<Target>) => void;
  addExperience: (exp: Experience) => void;
  removeExperience: (id: string) => void;
  enhanceWithAI: () => Promise<void>;
  generatePDF: () => Promise<void>;
}
```

### 3. API ROUTES

```
/api
├── ai/
│   ├── enhance/route.ts      → POST: Sempurnakan seluruh CV dengan AI
│   ├── summary/route.ts      → POST: Generate professional summary
│   ├── bullet/route.ts       → POST: Improve satu bullet point
│   └── keywords/route.ts     → POST: Extract keywords dari job description
│
└── pdf/
    └── generate/route.ts     → POST: Generate PDF dari CV data
```

### 4. AI AGENT LAYER

#### Agent: CV Enhancer
```
INPUT:
  - Semua data form (personal, experience, skills, education)
  - Job description target
  - Keywords ATS yang relevan

PROCESS (Multi-step reasoning):
  1. Analisis gap antara CV dan JD
  2. Extract ATS keywords dari JD
  3. Per-section enhancement:
     a. Professional Summary → 3-4 kalimat powerful
     b. Experience bullets → STAR format (Situation-Task-Action-Result)
     c. Skills → Prioritas sesuai JD keywords
     d. Education → Highlight relevansi
  4. Consistency check (tone, tense, format)
  5. ATS score estimation

OUTPUT:
  - Enhanced version per section
  - Diff highlight (sebelum vs sesudah)
  - ATS match score (0-100%)
  - Improvement tips
```

#### Agent: Keyword Extractor
```
INPUT: Raw job description text

PROCESS:
  1. Identify required skills
  2. Identify preferred qualifications
  3. Extract role-specific terminology
  4. Identify soft skills mentioned
  5. Extract tools/technologies

OUTPUT:
  - keywords: string[] (hard skills)
  - softSkills: string[]
  - tools: string[]
  - mustHave: string[]
  - niceToHave: string[]
```

#### Agent: Bullet Point Optimizer
```
INPUT: Raw bullet point + job context

PROCESS:
  1. Identify action verb (if missing, add strong one)
  2. Add quantification if possible
  3. Add impact/result statement
  4. Ensure ATS keyword inclusion
  5. Keep under 2 lines

OUTPUT: Optimized bullet point dengan explanation
```

### 5. PDF GENERATION ENGINE

```
Pilihan Engine:

Option A: @react-pdf/renderer (Recommended untuk Vercel)
  ✅ Runs client-side atau server-side
  ✅ No Puppeteer dependency (lighter on Vercel)
  ✅ Pixel-perfect control
  ✅ Streaming support

Option B: Puppeteer + HTML template
  ✅ Lebih fleksibel visual
  ❌ Berat untuk Vercel serverless (perlu Playwright/Puppeteer layer)
  ❌ Cold start lambat

→ GUNAKAN: @react-pdf/renderer
```

#### PDF Template Structure
```
┌────────────────────────────────┐
│  NAMA LENGKAP                  │  ← Font: Georgia Bold 24pt
│  Target Job Title              │  ← Font: 14pt, color: #2D7DD2
├────────────────────────────────┤
│  📧 email | 📱 phone | 📍 kota │
│  🔗 linkedin | 🌐 portfolio    │
├────────────────────────────────┤
│  PROFESSIONAL SUMMARY          │  ← Section header 11pt ALL CAPS
│  ─────────────────────────────  │  ← Horizontal rule
│  Paragraf summary 3-4 kalimat  │
├────────────────────────────────┤
│  WORK EXPERIENCE               │
│  ─────────────────────────────  │
│  Job Title | Company     Tahun │
│  • Bullet point STAR format    │
│  • Dengan angka dan impact     │
├────────────────────────────────┤
│  SKILLS                        │
│  ─────────────────────────────  │
│  Technical: skill1, skill2...  │
│  Tools: tool1, tool2...        │
├────────────────────────────────┤
│  EDUCATION                     │
│  ─────────────────────────────  │
│  Gelar | Universitas    Tahun  │
└────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER INPUT                 PROCESSING                  OUTPUT
─────────                  ──────────                  ──────
Form Fields
    │
    ▼
[Zustand Store] ──────► [AI Enhance API] ──────► [Enhanced Data]
    │                         │                        │
    │                    [Anthropic API]                │
    │                    claude-sonnet                  │
    │                         │                        ▼
    │                    [Suggestions]         [Updated Store]
    │                                                   │
    └───────────────────────────────────────────────────┤
                                                        │
                                                        ▼
                                              [Preview Renderer]
                                                        │
                                              [CV Template React]
                                                        │
                                                        ▼
                                              [@react-pdf Engine]
                                                        │
                                                        ▼
                                         [Download: NamaUser_cv-ats.pdf]
```

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Optional: Rate limiting
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxx
```

---

## Dependencies Map

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "typescript": "^5.0.0",

    "// State": "---",
    "zustand": "^4.5.0",
    "immer": "^10.0.0",

    "// Forms": "---",
    "react-hook-form": "^7.51.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.3.4",

    "// AI": "---",
    "@anthropic-ai/sdk": "^0.24.0",
    "ai": "^3.1.0",

    "// PDF": "---",
    "@react-pdf/renderer": "^3.4.0",

    "// UI": "---",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.383.0",
    "clsx": "^2.1.0",

    "// Rate Limit (optional)": "---",
    "@upstash/ratelimit": "^1.1.0",
    "@upstash/redis": "^1.31.0"
  }
}
```

---

## Security Considerations

| Risiko | Mitigasi |
|--------|----------|
| API Key exposed | Server-side only via API routes |
| AI abuse/spam | Rate limiting per IP (Upstash) |
| XSS di PDF | Sanitize semua input sebelum render |
| Data privacy | Zero persistence — tidak ada DB, data hanya di client |
| Prompt injection | System prompt hardened, input validation |
