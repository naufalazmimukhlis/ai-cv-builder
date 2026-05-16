'use client';

import { useState, useCallback } from 'react';
import { useCVStore } from '@/store/cv-store';
import { useToast } from '@/components/ui/toast';
import type { AIEnhancementResult } from '@/types/cv';

interface UseAIEnhanceReturn {
  isLoading: boolean;
  loadingLabel: string | null;
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
  const [loadingLabel, setLoadingLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const store = useCVStore();
  const toast = useToast();

  const enhance = useCallback(async () => {
    const cvData = store.getCVData();

    if (!cvData.personal.fullName) {
      toast.error('Data tidak lengkap', 'Isi informasi pribadi terlebih dahulu agar AI dapat menganalisa profil Anda.');
      return;
    }

    setIsLoading(true);
    setLoadingLabel('AI sedang menganalisis seluruh CV Anda...');
    setError(null);
    store.setAIStatus('processing');
    store.setAIProgress(0, 'Memulai analisis CV...');

    try {
      store.setAIProgress(15, 'Mengevaluasi kesesuaian dengan Job Description...');

      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData }),
      });

      store.setAIProgress(50, 'AI sedang menyempurnakan setiap bagian CV...');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Koneksi AI terputus' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      store.setAIProgress(85, 'Menghitung skor ATS dan memproses tips...');

      const data = await response.json() as { result: AIEnhancementResult };
      store.setAIProgress(100, 'Selesai!');
      store.setAIResult(data.result);

      toast.ai(
        '✨ CV berhasil disempurnakan!',
        `ATS Score: ${data.result.atsScore}/100 - Cek rekomendasi perbaikan di dashboard AI.`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server AI';
      setError(message);
      store.setAIError(message);
      toast.error('Gagal menyempurnakan CV', `Error: ${message}. Pastikan koneksi internet stabil dan API Key valid.`);
    } finally {
      setIsLoading(false);
      setLoadingLabel(null);
    }
  }, [store, toast]);

  const extractKeywords = useCallback(
    async (jobDescription: string): Promise<string[]> => {
      if (!jobDescription.trim()) return [];

      setIsLoading(true);
      setLoadingLabel('AI sedang menganalisis Job Description & mengekstrak kata kunci...');
      
      try {
        const response = await fetch('/api/ai/keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Gagal mengekstrak keywords');
        }

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
            missing: [], // Will be calculated by UI
            suggestions: [
              "Gunakan kata kunci teknis ini di bagian Pengalaman Kerja untuk skor ATS maksimal.",
              "Pastikan setidaknya 80% keyword utama muncul di CV Anda.",
              "Fokus pada hard skills yang ditandai sebagai 'Required'."
            ]
          }
        });

        toast.ai('Keywords ATS diekstrak!', `${uniqueKeywords.length} keywords penting ditemukan dari JD.`);
        return uniqueKeywords;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown AI error';
        toast.error('Gagal mengekstrak keywords', `Gagal menganalisis Job Description. ${message}`);
        return [];
      } finally {
        setIsLoading(false);
        setLoadingLabel(null);
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

      setIsLoading(true);
      setLoadingLabel('Mengoptimalkan bullet point dengan metode STAR...');

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

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Gagal mengoptimalkan bullet point');
        }

        const data = await response.json() as { optimized: string; explanation: string };
        store.optimizeBullet(experienceId, bulletId, data.optimized);
        toast.ai('Bullet point dioptimalkan!', data.explanation);
        return data.optimized;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown AI error';
        toast.error('Gagal mengoptimalkan bullet point', `Gagal memproses AI Rewrite. ${message}`);
        return null;
      } finally {
        setIsLoading(false);
        setLoadingLabel(null);
      }
    },
    [store, toast]
  );

  const generateSummary = useCallback(async (): Promise<string | null> => {
    const cvData = store.getCVData();

    setIsLoading(true);
    setLoadingLabel('Membuat professional summary berdasarkan profil Anda...');

    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Gagal generate summary');
      }

      const data = await response.json() as { summary: string };
      store.setSummary(data.summary);
      toast.ai('Professional summary dibuat!', 'Ringkasan telah dioptimasi agar sesuai dengan target posisi Anda.');
      return data.summary;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown AI error';
      toast.error('Gagal membuat summary', `Gagal menghubungi server AI. ${message}`);
      return null;
    } finally {
      setIsLoading(false);
      setLoadingLabel(null);
    }
  }, [store, toast]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    store.resetAI();
  }, [store]);

  return {
    isLoading,
    loadingLabel,
    enhance,
    extractKeywords,
    optimizeBullet,
    generateSummary,
    result: store.aiResult,
    error,
    reset,
  };
}
