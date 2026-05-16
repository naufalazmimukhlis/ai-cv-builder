// ============================================================
// AI CV Builder — Core TypeScript Types (Bilingual Support)
// ============================================================

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface TargetJob {
  jobTitle: string;
  company: string;
  jobDescription: string;
  keywords: string[];
  aiAnalysis?: {
    required: string[];
    preferred: string[];
    missing: string[];
    suggestions: string[];
  };
}

export interface BulletPoint {
  id: string;
  textId: string;    // Indonesian version
  textEn: string;    // English version
  aiOptimized?: boolean;
}

export interface Experience {
  id: string;
  jobTitleId: string; // Bilingual job title
  jobTitleEn: string;
  company: string;
  location: string;
  startMonth: string;
  startYear: string;
  endMonth: string;
  endYear: string;
  isCurrent: boolean;
  bullets: BulletPoint[];
}

export interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export interface Education {
  id: string;
  degreeId: string;
  degreeEn: string;
  majorId: string;
  majorEn: string;
  institution: string;
  graduationYear: string;
  gpa: string;
}

export interface Certification {
  id: string;
  nameId: string;
  nameEn: string;
  issuer: string;
  year: string;
}

export interface CVData {
  personal: PersonalInfo;
  target: TargetJob;
  experiences: Experience[];
  skills: Skills;
  education: Education[];
  certifications: Certification[];
  professionalSummaryId: string;
  professionalSummaryEn: string;
}

// AI Related Types
export interface AIKeywordResult {
  required_skills: string[];
  preferred_skills: string[];
  tools: string[];
  soft_skills: string[];
  keywords: string[];
}

export interface AIBulletResult {
  optimizedId: string;
  optimizedEn: string;
  explanation: string;
}

export interface AISummaryResult {
  summaryId: string;
  summaryEn: string;
}

export interface AIEnhancedExperience {
  id: string;
  bulletsId: string[];
  bulletsEn: string[];
}

export interface AIEnhancementResult {
  professionalSummaryId: string;
  professionalSummaryEn: string;
  enhancedExperiences: AIEnhancedExperience[];
  prioritizedSkills: {
    technical: string[];
    soft: string[];
    tools: string[];
    languages: string[];
  };
  atsScore: number;
  improvements: string[]; // These will be selected based on language by UI
  tips: string[];
}

export interface AIEnhancementState {
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  currentStep: string;
  result: AIEnhancementResult | null;
  error: string | null;
}

export type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6;
export type FormStatus = 'idle' | 'dirty' | 'valid' | 'submitting';

export interface Translation {
  summary: string;
  experience: string;
  education: string;
  skills: string;
  certifications: string;
  contact: string;
  present: string;
  loading: string;
  generate_summary: string;
  ats_score: string;
  back_to_edit: string;
  preview_title: string;
  tips_title: string;
  adjust_keywords: string;
  empty_preview: string;
  empty_preview_desc: string;
  technical_skills: string;
  soft_skills: string;
  languages: string;
  gpa: string;
}

export interface LandingTranslation {
  hero_title: string;
  hero_subtitle: string;
  hero_desc: string;
  benefits: string[];
  cta_start: string;
  cta_how: string;
  stats: Record<string, string>;
  features_badge: string;
  features_title: string;
  features_desc: string;
  feature_list: Array<{ title: string; desc: string }>;
  how_title: string;
  how_desc: string;
  how_steps: Array<{ title: string; desc: string; detail: string }>;
  cta_footer: string;
  no_registration: string;
  footer_tagline: string;
  [key: string]: any;
}

export interface TranslationsSchema {
  id: Translation;
  en: Translation;
  landing: {
    id: LandingTranslation;
    en: LandingTranslation;
  };
}
