import { z } from 'zod';

// ============================================================
// Step 1 — Personal Info
// ============================================================
export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Nama lengkap minimal 2 karakter')
    .max(100, 'Nama terlalu panjang')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Nama hanya boleh mengandung huruf'),
  email: z
    .string()
    .email('Format email tidak valid')
    .max(200, 'Email terlalu panjang'),
  phone: z
    .string()
    .min(8, 'Nomor telepon minimal 8 digit')
    .max(20, 'Nomor telepon terlalu panjang')
    .regex(/^[+\d\s()-]+$/, 'Format nomor telepon tidak valid'),
  location: z
    .string()
    .min(2, 'Lokasi wajib diisi')
    .max(100, 'Lokasi terlalu panjang'),
  linkedin: z
    .string()
    .url('URL LinkedIn tidak valid')
    .or(z.literal('')),
  portfolio: z
    .string()
    .url('URL Portfolio tidak valid')
    .or(z.literal('')),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// ============================================================
// Step 2 — Target Job
// ============================================================
export const targetJobSchema = z.object({
  jobTitle: z
    .string()
    .min(2, 'Posisi wajib diisi')
    .max(100, 'Posisi terlalu panjang'),
  company: z
    .string()
    .max(100, 'Nama perusahaan terlalu panjang')
    .or(z.literal('')),
  jobDescription: z
    .string()
    .min(50, 'Job description minimal 50 karakter untuk analisis ATS yang optimal')
    .max(10000, 'Job description terlalu panjang'),
  keywords: z.array(z.string()),
});

export type TargetJobFormData = z.infer<typeof targetJobSchema>;

// ============================================================
// Step 3 — Experience
// ============================================================
export const bulletPointSchema = z.object({
  id: z.string(),
  text: z
    .string()
    .min(10, 'Deskripsi terlalu singkat')
    .max(500, 'Deskripsi terlalu panjang'),
  aiOptimized: z.boolean().optional().default(false),
});

export const experienceSchema = z.object({
  id: z.string(),
  jobTitle: z
    .string()
    .min(2, 'Jabatan wajib diisi')
    .max(100, 'Jabatan terlalu panjang'),
  company: z
    .string()
    .min(2, 'Nama perusahaan wajib diisi')
    .max(100, 'Nama terlalu panjang'),
  location: z
    .string()
    .max(100, 'Lokasi terlalu panjang')
    .optional()
    .default(''),
  startMonth: z.string().optional().default(''),
  startYear: z
    .string()
    .min(4, 'Tahun mulai wajib diisi')
    .regex(/^\d{4}$/, 'Format tahun tidak valid'),
  endMonth: z.string().optional().default(''),
  endYear: z.string().optional().default(''),
  isCurrent: z.boolean().default(false),
  bullets: z
    .array(bulletPointSchema)
    .min(1, 'Minimal 1 deskripsi pekerjaan')
    .max(10, 'Maksimal 10 deskripsi'),
});

export const experienceStepSchema = z.object({
  experiences: z
    .array(experienceSchema)
    .min(1, 'Minimal 1 pengalaman kerja')
    .max(10, 'Maksimal 10 pengalaman'),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type ExperienceStepFormData = z.infer<typeof experienceStepSchema>;

// ============================================================
// Step 4 — Skills
// ============================================================
export const skillsSchema = z.object({
  technical: z
    .array(z.string().min(1).max(50))
    .min(1, 'Minimal 1 technical skill')
    .max(30, 'Maksimal 30 skill'),
  soft: z
    .array(z.string().min(1).max(50))
    .max(20, 'Maksimal 20 soft skill')
    .default([]),
  tools: z
    .array(z.string().min(1).max(50))
    .max(20, 'Maksimal 20 tools')
    .default([]),
  languages: z
    .array(z.string().min(1).max(50))
    .max(10, 'Maksimal 10 bahasa')
    .default([]),
});

export type SkillsFormData = z.infer<typeof skillsSchema>;

// ============================================================
// Step 5 — Education & Certifications
// ============================================================
export const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(2, 'Gelar wajib diisi').max(50),
  major: z.string().min(2, 'Jurusan wajib diisi').max(100),
  institution: z
    .string()
    .min(2, 'Nama institusi wajib diisi')
    .max(150),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, 'Format tahun tidak valid')
    .min(4, 'Tahun lulus wajib diisi'),
  gpa: z
    .string()
    .max(10)
    .optional()
    .default(''),
});

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'Nama sertifikasi wajib diisi').max(150),
  issuer: z.string().min(2, 'Penerbit wajib diisi').max(150),
  year: z
    .string()
    .regex(/^\d{4}$/, 'Format tahun tidak valid')
    .or(z.string().length(0))
    .optional()
    .default(''),
});

export const educationStepSchema = z.object({
  education: z
    .array(educationSchema)
    .min(1, 'Minimal 1 data pendidikan')
    .max(5, 'Maksimal 5 data pendidikan'),
  certifications: z
    .array(certificationSchema)
    .max(10, 'Maksimal 10 sertifikasi')
    .default([]),
});

export type EducationFormData = z.infer<typeof educationSchema>;
export type CertificationFormData = z.infer<typeof certificationSchema>;
export type EducationStepFormData = z.infer<typeof educationStepSchema>;
