'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type {
  CVData,
  PersonalInfo,
  TargetJob,
  Experience,
  Skills,
  Education,
  Certification,
  BulletPoint,
  AIEnhancementResult,
  BuilderStep,
} from '@/types/cv';
import { generateId } from '@/lib/utils';

// ============================================================
// Default State
// ============================================================
const defaultPersonal: PersonalInfo = {
  fullName: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  portfolio: '',
};

const defaultTarget: TargetJob = {
  jobTitle: '',
  company: '',
  jobDescription: '',
  keywords: [],
};

const defaultSkills: Skills = {
  technical: [],
  soft: [],
  tools: [],
  languages: [],
};

// ============================================================
// Store Interface
// ============================================================
interface CVStoreState {
  // CV Data
  personal: PersonalInfo;
  target: TargetJob;
  experiences: Experience[];
  skills: Skills;
  education: Education[];
  certifications: Certification[];
  professionalSummary: string;

  // UI State
  currentStep: BuilderStep;
  isInitialized: boolean;

  // AI State
  aiStatus: 'idle' | 'processing' | 'done' | 'error';
  aiProgress: number;
  aiCurrentStep: string;
  aiResult: AIEnhancementResult | null;
  aiError: string | null;

  // ATS Score (from last AI run)
  atsScore: number | null;

  // Actions — Personal
  updatePersonal: (data: Partial<PersonalInfo>) => void;

  // Actions — Target
  updateTarget: (data: Partial<TargetJob>) => void;
  setKeywords: (keywords: string[]) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;

  // Actions — Experience
  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;
  addBullet: (experienceId: string) => void;
  updateBullet: (experienceId: string, bulletId: string, text: string) => void;
  removeBullet: (experienceId: string, bulletId: string) => void;
  optimizeBullet: (experienceId: string, bulletId: string, optimizedText: string) => void;

  // Actions — Skills
  updateSkills: (data: Partial<Skills>) => void;
  addSkill: (category: keyof Skills, skill: string) => void;
  removeSkill: (category: keyof Skills, skill: string) => void;

  // Actions — Education
  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  // Actions — Certifications
  addCertification: () => void;
  updateCertification: (id: string, data: Partial<Certification>) => void;
  removeCertification: (id: string) => void;

  // Actions — Summary
  setSummary: (summary: string) => void;

  // Actions — Navigation
  setCurrentStep: (step: BuilderStep) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;

  // Actions — AI
  setAIStatus: (status: CVStoreState['aiStatus']) => void;
  setAIProgress: (progress: number, step: string) => void;
  setAIResult: (result: AIEnhancementResult) => void;
  setAIError: (error: string) => void;
  applyAIEnhancement: (result: AIEnhancementResult) => void;
  applySectionDiff: (section: string, value: string) => void;
  resetAI: () => void;

  // Actions — Reset
  resetCV: () => void;

  // Selectors
  getCVData: () => CVData;
  hasMinimumData: () => boolean;
}

// ============================================================
// Zustand Store with Immer + Persist
// ============================================================
export const useCVStore = create<CVStoreState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      personal: defaultPersonal,
      target: defaultTarget,
      experiences: [],
      skills: defaultSkills,
      education: [],
      certifications: [],
      professionalSummary: '',
      currentStep: 1,
      isInitialized: true,
      aiStatus: 'idle',
      aiProgress: 0,
      aiCurrentStep: '',
      aiResult: null,
      aiError: null,
      atsScore: null,

      // Personal
      updatePersonal: (data) =>
        set((state) => {
          Object.assign(state.personal, data);
        }),

      // Target
      updateTarget: (data) =>
        set((state) => {
          Object.assign(state.target, data);
        }),
      setKeywords: (keywords) =>
        set((state) => {
          state.target.keywords = keywords;
        }),
      addKeyword: (keyword) =>
        set((state) => {
          if (!state.target.keywords.includes(keyword)) {
            state.target.keywords.push(keyword);
          }
        }),
      removeKeyword: (keyword) =>
        set((state) => {
          state.target.keywords = state.target.keywords.filter((k) => k !== keyword);
        }),

      // Experience
      addExperience: () =>
        set((state) => {
          const newExp: Experience = {
            id: generateId(),
            jobTitle: '',
            company: '',
            location: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            isCurrent: false,
            bullets: [{ id: generateId(), text: '', aiOptimized: false }],
          };
          state.experiences.push(newExp);
        }),
      updateExperience: (id, data) =>
        set((state) => {
          const idx = state.experiences.findIndex((e) => e.id === id);
          if (idx !== -1) Object.assign(state.experiences[idx], data);
        }),
      removeExperience: (id) =>
        set((state) => {
          state.experiences = state.experiences.filter((e) => e.id !== id);
        }),
      reorderExperiences: (experiences) =>
        set((state) => {
          state.experiences = experiences;
        }),
      addBullet: (experienceId) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            exp.bullets.push({ id: generateId(), text: '', aiOptimized: false });
          }
        }),
      updateBullet: (experienceId, bulletId, text) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            const bullet = exp.bullets.find((b) => b.id === bulletId);
            if (bullet) bullet.text = text;
          }
        }),
      removeBullet: (experienceId, bulletId) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            exp.bullets = exp.bullets.filter((b) => b.id !== bulletId);
          }
        }),
      optimizeBullet: (experienceId, bulletId, optimizedText) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            const bullet = exp.bullets.find((b) => b.id === bulletId);
            if (bullet) {
              bullet.text = optimizedText;
              bullet.aiOptimized = true;
            }
          }
        }),

      // Skills
      updateSkills: (data) =>
        set((state) => {
          Object.assign(state.skills, data);
        }),
      addSkill: (category, skill) =>
        set((state) => {
          if (!state.skills[category].includes(skill)) {
            state.skills[category].push(skill);
          }
        }),
      removeSkill: (category, skill) =>
        set((state) => {
          state.skills[category] = state.skills[category].filter((s) => s !== skill);
        }),

      // Education
      addEducation: () =>
        set((state) => {
          state.education.push({
            id: generateId(),
            degree: '',
            major: '',
            institution: '',
            graduationYear: '',
            gpa: '',
          });
        }),
      updateEducation: (id, data) =>
        set((state) => {
          const idx = state.education.findIndex((e) => e.id === id);
          if (idx !== -1) Object.assign(state.education[idx], data);
        }),
      removeEducation: (id) =>
        set((state) => {
          state.education = state.education.filter((e) => e.id !== id);
        }),

      // Certifications
      addCertification: () =>
        set((state) => {
          state.certifications.push({
            id: generateId(),
            name: '',
            issuer: '',
            year: '',
          });
        }),
      updateCertification: (id, data) =>
        set((state) => {
          const idx = state.certifications.findIndex((c) => c.id === id);
          if (idx !== -1) Object.assign(state.certifications[idx], data);
        }),
      removeCertification: (id) =>
        set((state) => {
          state.certifications = state.certifications.filter((c) => c.id !== id);
        }),

      // Summary
      setSummary: (summary) =>
        set((state) => {
          state.professionalSummary = summary;
        }),

      // Navigation
      setCurrentStep: (step) =>
        set((state) => {
          state.currentStep = step;
        }),
      goToNextStep: () =>
        set((state) => {
          if (state.currentStep < 5) {
            state.currentStep = (state.currentStep + 1) as BuilderStep;
          }
        }),
      goToPrevStep: () =>
        set((state) => {
          if (state.currentStep > 1) {
            state.currentStep = (state.currentStep - 1) as BuilderStep;
          }
        }),

      // AI
      setAIStatus: (status) =>
        set((state) => {
          state.aiStatus = status;
        }),
      setAIProgress: (progress, step) =>
        set((state) => {
          state.aiProgress = progress;
          state.aiCurrentStep = step;
        }),
      setAIResult: (result) =>
        set((state) => {
          state.aiResult = result;
          state.aiStatus = 'done';
          state.atsScore = result.atsScore;
        }),
      setAIError: (error) =>
        set((state) => {
          state.aiError = error;
          state.aiStatus = 'error';
        }),
      applyAIEnhancement: (result) =>
        set((state) => {
          // Apply summary
          if (result.professionalSummary) {
            state.professionalSummary = result.professionalSummary;
          }
          // Apply enhanced experiences
          result.enhancedExperiences.forEach((enhanced) => {
            const exp = state.experiences.find((e) => e.id === enhanced.id);
            if (exp) {
              exp.bullets = enhanced.bullets.map((text) => ({
                id: generateId(),
                text,
                aiOptimized: true,
              }));
            }
          });
          // Apply prioritized skills
          if (result.prioritizedSkills) {
            Object.assign(state.skills, result.prioritizedSkills);
          }
          state.atsScore = result.atsScore;
          state.aiStatus = 'done';
        }),
      applySectionDiff: (section, value) =>
        set((state) => {
          if (section === 'summary') {
            state.professionalSummary = value;
          }
        }),
      resetAI: () =>
        set((state) => {
          state.aiStatus = 'idle';
          state.aiProgress = 0;
          state.aiCurrentStep = '';
          state.aiResult = null;
          state.aiError = null;
        }),

      // Reset
      resetCV: () =>
        set((state) => {
          state.personal = defaultPersonal;
          state.target = defaultTarget;
          state.experiences = [];
          state.skills = defaultSkills;
          state.education = [];
          state.certifications = [];
          state.professionalSummary = '';
          state.currentStep = 1;
          state.aiStatus = 'idle';
          state.aiProgress = 0;
          state.aiCurrentStep = '';
          state.aiResult = null;
          state.aiError = null;
          state.atsScore = null;
        }),

      // Selectors
      getCVData: (): CVData => {
        const state = get();
        return {
          personal: state.personal,
          target: state.target,
          experiences: state.experiences,
          skills: state.skills,
          education: state.education,
          certifications: state.certifications,
          professionalSummary: state.professionalSummary,
        };
      },
      hasMinimumData: (): boolean => {
        const state = get();
        return !!(
          state.personal.fullName &&
          state.personal.email &&
          state.target.jobTitle &&
          state.experiences.length > 0
        );
      },
    })),
    {
      name: 'ats-cv-builder-store',
      storage: createJSONStorage(() => {
        // SSR-safe localStorage
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: (state) => ({
        personal: state.personal,
        target: state.target,
        experiences: state.experiences,
        skills: state.skills,
        education: state.education,
        certifications: state.certifications,
        professionalSummary: state.professionalSummary,
        currentStep: state.currentStep,
        atsScore: state.atsScore,
      }),
    }
  )
);
