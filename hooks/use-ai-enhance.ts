'use client';

import { useState, useCallback } from 'react';
import { useCVStore } from '@/store/cv-store';
import { useToast } from '@/components/ui/toast';
import type { AIEnhancementResult } from '@/types/cv';

interface UseAIEnhanceReturn {
  isLoading: boolean;
  enhance: () => Promise<void>;
  extractKeywords: (jobDescription: string) => Promise<string[]>;
  optimizeBullet: (
    experienceId: string,
    bulletId: string,
    bulletText: string
  ) => Promise<string | null>;
  generateSummary: () => Promise<string | null>;
  result: AIEnhancementResult | null;
  error: string | null;
  reset: () => void;
}

export function useAIEnhance(): UseAIEnhanceReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const store = useCVStore();
  const toast = useToast();

  const enhance = useCallback(async () => {
    const cvData = store.getCVData();

    if (!cvData.personal.fullName) {
      toast.error('Data tidak lengkap', 'Isi informasi pribadi terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setError(null);
    store.setAIStatus('processing');
    store.setAIProgress(0, 'Memulai analisis CV...');

    try {
      store.setAIProgress(15, 'Menganalisis job description...');

      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData }),
      });

      store.setAIProgress(50, 'AI sedang menyempurnakan konten...');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      store.setAIProgress(85, 'Memproses hasil optimasi...');

      const data = await response.json() as { result: AIEnhancementResult };
      store.setAIProgress(100, 'Selesai!');
      store.setAIResult(data.result);

      toast.ai(
        '✨ CV berhasil disempurnakan!',
        `ATS Score: ${data.result.atsScore}/100`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan';
      setError(message);
      store.setAIError(message);
      toast.error('Gagal menyempurnakan CV', message);
    } finally {
      setIsLoading(false);
    }
  }, [store, toast]);

  const extractKeywords = useCallback(
    async (jobDescription: string): Promise<string[]> => {
      if (!jobDescription.trim()) return [];

      try {
        const response = await fetch('/api/ai/keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription }),
        });

        if (!response.ok) throw new Error('Gagal mengekstrak keywords');

        const data = await response.json() as {
          keywords: string[];
          required_skills: string[];
          preferred_skills: string[];
          tools: string[];
          soft_skills: string[];
        };

        const allKeywords = [
          ...(data.required_skills || []),
          ...(data.preferred_skills || []),
          ...(data.tools || []),
          ...(data.keywords || []),
        ].filter(Boolean);

        const uniqueKeywords = Array.from(new Set(allKeywords));
        
        // Update store with specialized analysis
        store.updateTarget({
          keywords: uniqueKeywords,
          aiAnalysis: {
            required: data.required_skills || [],
            preferred: data.preferred_skills || [],
            missing: [], // Will be calculated by UI based on current CV content
            suggestions: [
              "Gunakan kata kunci teknis di bagian Pengalaman Kerja untuk skor maksimal.",
              "Pastikan setidaknya 80% keyword utama muncul di CV Anda.",
            ]
          }
        });

        toast.ai('Keywords ATS diekstrak!', `${uniqueKeywords.length} keywords penting ditemukan`);
        return uniqueKeywords;
      } catch (err) {
        toast.error('Gagal mengekstrak keywords', 'Coba lagi atau tambah manual');
        return [];
      }
    },
    [store, toast]
  );

  const optimizeBullet = useCallback(
    async (
      experienceId: string,
      bulletId: string,
      bulletText: string
    ): Promise<string | null> => {
      const { target } = store.getCVData();

      try {
        const response = await fetch('/api/ai/bullet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bullet: bulletText,
            jobTitle: target.jobTitle,
            keywords: target.keywords,
          }),
        });

        if (!response.ok) throw new Error('Gagal mengoptimalkan bullet point');

        const data = await response.json() as { optimized: string; explanation: string };
        store.optimizeBullet(experienceId, bulletId, data.optimized);
        toast.ai('Bullet point dioptimalkan!', data.explanation);
        return data.optimized;
      } catch (err) {
        toast.error('Gagal mengoptimalkan bullet point', 'Coba lagi');
        return null;
      }
    },
    [store, toast]
  );

  const generateSummary = useCallback(async (): Promise<string | null> => {
    const cvData = store.getCVData();

    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData }),
      });

      if (!response.ok) throw new Error('Gagal generate summary');

      const data = await response.json() as { summary: string };
      store.setSummary(data.summary);
      toast.ai('Professional summary dibuat!');
      return data.summary;
    } catch (err) {
      toast.error('Gagal membuat summary', 'Coba lagi');
      return null;
    }
  }, [store, toast]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    store.resetAI();
  }, [store]);

  return {
    isLoading,
    enhance,
    extractKeywords,
    optimizeBullet,
    generateSummary,
    result: store.aiResult,
    error,
    reset,
  };
}
