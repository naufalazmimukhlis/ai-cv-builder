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
  professionalSummaryId: string;
  professionalSummaryEn: string;

  // UI State
  currentStep: BuilderStep;
  language: 'id' | 'en';
  isInitialized: boolean;

  // AI State
  aiStatus: 'idle' | 'processing' | 'done' | 'error';
  aiProgress: number;
  aiCurrentStep: string;
  aiResult: AIEnhancementResult | null;
  aiError: string | null;

  // ATS Score
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
  updateBullet: (experienceId: string, bulletId: string, text: string, lang?: 'id' | 'en') => void;
  updateBulletBilingual: (experienceId: string, bulletId: string, textId: string, textEn: string) => void;
  removeBullet: (experienceId: string, bulletId: string) => void;
  optimizeBullet: (experienceId: string, bulletId: string, optimizedId: string, optimizedEn: string) => void;

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
  setSummary: (summary: string, lang?: 'id' | 'en') => void;
  setSummaryBilingual: (summaryId: string, summaryEn: string) => void;

  // Actions — Navigation
  setCurrentStep: (step: BuilderStep) => void;
  setLanguage: (lang: 'id' | 'en') => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;

  // Actions — AI
  setAIStatus: (status: CVStoreState['aiStatus']) => void;
  setAIProgress: (progress: number, step: string) => void;
  setAIResult: (result: AIEnhancementResult) => void;
  setAIError: (error: string) => void;
  applyAIEnhancement: (result: AIEnhancementResult) => void;
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
      professionalSummaryId: '',
      professionalSummaryEn: '',
      currentStep: 1,
      language: 'id',
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
            jobTitleId: '',
            jobTitleEn: '',
            company: '',
            location: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            isCurrent: false,
            bullets: [{ id: generateId(), textId: '', textEn: '', aiOptimized: false }],
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
            exp.bullets.push({ id: generateId(), textId: '', textEn: '', aiOptimized: false });
          }
        }),
      updateBullet: (experienceId, bulletId, text, lang) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            const bullet = exp.bullets.find((b) => b.id === bulletId);
            if (bullet) {
              const currentLang = lang || state.language;
              if (currentLang === 'id') bullet.textId = text;
              else bullet.textEn = text;
            }
          }
        }),
      updateBulletBilingual: (experienceId, bulletId, textId, textEn) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            const bullet = exp.bullets.find((b) => b.id === bulletId);
            if (bullet) {
              bullet.textId = textId;
              bullet.textEn = textEn;
            }
          }
        }),
      removeBullet: (experienceId, bulletId) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            exp.bullets = exp.bullets.filter((b) => b.id !== bulletId);
          }
        }),
      optimizeBullet: (experienceId, bulletId, optimizedId, optimizedEn) =>
        set((state) => {
          const exp = state.experiences.find((e) => e.id === experienceId);
          if (exp) {
            const bullet = exp.bullets.find((b) => b.id === bulletId);
            if (bullet) {
              bullet.textId = optimizedId;
              bullet.textEn = optimizedEn;
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
            degreeId: '',
            degreeEn: '',
            majorId: '',
            majorEn: '',
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
            nameId: '',
            nameEn: '',
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
      setSummary: (summary, lang) =>
        set((state) => {
          const currentLang = lang || state.language;
          if (currentLang === 'id') state.professionalSummaryId = summary;
          else state.professionalSummaryEn = summary;
        }),
      setSummaryBilingual: (summaryId, summaryEn) =>
        set((state) => {
          state.professionalSummaryId = summaryId;
          state.professionalSummaryEn = summaryEn;
        }),

      // Navigation
      setCurrentStep: (step) =>
        set((state) => {
          state.currentStep = step;
        }),
      setLanguage: (lang) =>
        set((state) => {
          state.language = lang;
        }),
      goToNextStep: () =>
        set((state) => {
          if (state.currentStep < 6) {
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
          if (result.professionalSummaryId) {
            state.professionalSummaryId = result.professionalSummaryId;
          }
          if (result.professionalSummaryEn) {
            state.professionalSummaryEn = result.professionalSummaryEn;
          }
          // Apply enhanced experiences
          result.enhancedExperiences.forEach((enhanced) => {
            const exp = state.experiences.find((e) => e.id === enhanced.id);
            if (exp) {
              exp.bullets = enhanced.bulletsId.map((textId, i) => ({
                id: generateId(),
                textId,
                textEn: enhanced.bulletsEn[i] || '',
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
          state.professionalSummaryId = '';
          state.professionalSummaryEn = '';
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
          professionalSummaryId: state.professionalSummaryId,
          professionalSummaryEn: state.professionalSummaryEn,
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
      name: 'ats-cv-builder-store-v2', // Change name to avoid conflicts with old schema
      storage: createJSONStorage(() => {
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
        professionalSummaryId: state.professionalSummaryId,
        professionalSummaryEn: state.professionalSummaryEn,
        currentStep: state.currentStep,
        language: state.language,
        atsScore: state.atsScore,
      }),
    }
  )
);
