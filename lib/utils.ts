import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate ATS-safe PDF filename from full name
 * "Budi Santoso" → "Budi-Santoso_cv-ats.pdf"
 */
export function generatePDFFilename(fullName: string): string {
  const safeName = fullName
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-');
  return `${safeName}_cv-ats.pdf`;
}

/**
 * Sanitize user input to prevent prompt injection and XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Sanitize for AI prompts (strip injection attempts)
 */
export function sanitizeForAI(input: string): string {
  return input
    .replace(/ignore previous instructions/gi, '')
    .replace(/you are now/gi, '')
    .replace(/system:/gi, '')
    .replace(/\[INST\]/gi, '')
    .replace(/\[\/INST\]/gi, '')
    .trim()
    .substring(0, 5000); // hard cap
}

/**
 * Format date range for experience
 */
export function formatDateRange(
  startMonth: string,
  startYear: string,
  endMonth: string,
  endYear: string,
  isCurrent: boolean
): string {
  const start = startMonth && startYear ? `${startMonth} ${startYear}` : startYear || '';
  const end = isCurrent ? 'Sekarang' : endMonth && endYear ? `${endMonth} ${endYear}` : endYear || '';
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
}

/**
 * Parse JSON from AI response robustly
 */
export function parseAIJSON<T>(text: string): T | null {
  try {
    // Try direct parse
    return JSON.parse(text) as T;
  } catch {
    // Try to extract JSON from markdown code blocks
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1]) as T;
      } catch {
        // ignore
      }
    }
    // Try to find JSON object in text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]) as T;
      } catch {
        // ignore
      }
    }
    return null;
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get initials from full name
 */
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

/**
 * Format ATS score to color class
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-500';
  return 'text-red-500';
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}
