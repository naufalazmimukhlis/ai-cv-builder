// ============================================================
// ATS CV Builder Pro — Core TypeScript Types
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
  text: string;
  aiOptimized?: boolean;
}

export interface Experience {
  id: string;
  jobTitle: string;
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
  degree: string;
  major: string;
  institution: string;
  graduationYear: string;
  gpa: string;
}

export interface Certification {
  id: string;
  name: string;
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
  professionalSummary: string;
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
  optimized: string;
  explanation: string;
}

export interface AISummaryResult {
  summary: string;
}

export interface AIEnhancedExperience {
  id: string;
  bullets: string[];
}

export interface AIEnhancementResult {
  professionalSummary: string;
  enhancedExperiences: AIEnhancedExperience[];
  prioritizedSkills: {
    technical: string[];
    soft: string[];
    tools: string[];
    languages: string[];
  };
  atsScore: number;
  improvements: string[];
  tips: string[];
}

export interface AIEnhancementState {
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  currentStep: string;
  result: AIEnhancementResult | null;
  error: string | null;
}

// Diff types for before/after comparison
export interface SectionDiff {
  section: string;
  label: string;
  before: string;
  after: string;
  accepted: boolean;
}

// Form Step
export type BuilderStep = 1 | 2 | 3 | 4 | 5;

export type FormStatus = 'idle' | 'dirty' | 'valid' | 'submitting';
