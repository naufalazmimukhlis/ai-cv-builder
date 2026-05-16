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
  const language = useCVStore((s) => s.language);

  const enhance = useCallback(async () => {
    const cvData = store.getCVData();

    if (!cvData.personal.fullName) {
      toast.error(
        language === 'id' ? 'Data tidak lengkap' : 'Incomplete data', 
        language === 'id' 
          ? 'Isi informasi pribadi terlebih dahulu agar AI dapat menganalisa profil Anda.'
          : 'Fill in your personal information first so AI can analyze your profile.'
      );
      return;
    }

    setIsLoading(true);
    setLoadingLabel(language === 'id' ? 'Menganalisis kompatibilitas ATS...' : 'Analyzing ATS compatibility...');
    setError(null);
    store.setAIStatus('processing');
    store.setAIProgress(5, language === 'id' ? 'Inisialisasi engine AI lokal...' : 'Initializing local AI engine...');

    try {
      await new Promise(r => setTimeout(r, 800));
      store.setAIProgress(20, language === 'id' ? 'Menganalisis kompatibilitas ATS...' : 'Analyzing ATS compatibility...');
      setLoadingLabel(language === 'id' ? 'Menganalisis kompatibilitas ATS...' : 'Analyzing ATS compatibility...');

      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, lang: language }),
      });

      await new Promise(r => setTimeout(r, 600));
      store.setAIProgress(45, language === 'id' ? 'Mengoptimalkan ringkasan profesional...' : 'Optimizing professional summary...');
      setLoadingLabel(language === 'id' ? 'Mengoptimalkan ringkasan profesional...' : 'Optimizing professional summary...');

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Koneksi AI terputus' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      await new Promise(r => setTimeout(r, 600));
      store.setAIProgress(70, language === 'id' ? 'Meningkatkan keterbacaan untuk rekruter...' : 'Improving recruiter readability...');
      setLoadingLabel(language === 'id' ? 'Meningkatkan keterbacaan untuk rekruter...' : 'Improving recruiter readability...');

      const data = await response.json() as { result: AIEnhancementResult };
      
      await new Promise(r => setTimeout(r, 500));
      store.setAIProgress(90, language === 'id' ? 'Finalisasi resume...' : 'Finalizing resume...');
      setLoadingLabel(language === 'id' ? 'Finalisasi resume...' : 'Finalizing resume...');
      
      await new Promise(r => setTimeout(r, 400));
      store.setAIProgress(100, language === 'id' ? 'Selesai!' : 'Done!');
      store.setAIResult(data.result);

      toast.ai(
        language === 'id' ? '✨ CV berhasil disempurnakan!' : '✨ CV successfully enhanced!',
        `ATS Score: ${data.result.atsScore}/100 - ${language === 'id' ? 'Cek rekomendasi perbaikan di dashboard AI.' : 'Check improvement recommendations in AI dashboard.'}`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Terjadi kesalahan pada server AI';
      setError(message);
      store.setAIError(message);
      toast.error(
        language === 'id' ? 'Gagal menyempurnakan CV' : 'Failed to enhance CV', 
        `Error: ${message}.`
      );
    } finally {
      setIsLoading(false);
      setLoadingLabel(null);
    }
  }, [store, toast, language]);

  const extractKeywords = useCallback(
    async (jobDescription: string): Promise<string[]> => {
      if (!jobDescription.trim()) return [];

      setIsLoading(true);
      setLoadingLabel(language === 'id' ? 'Mengekstrak kata kunci...' : 'Extracting keywords...');
      
      try {
        const response = await fetch('/api/ai/keywords', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobDescription, lang: language }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Gagal mengekstrak keywords');
        }

        const data = await response.json() as {
          keywords: string[];
          required_skills: string[];
        };

        const allKeywords = [
          ...(data.required_skills || []),
          ...(data.keywords || []),
        ].filter(Boolean);

        const uniqueKeywords = Array.from(new Set(allKeywords));
        
        store.updateTarget({
          keywords: uniqueKeywords,
          aiAnalysis: {
            required: data.required_skills || [],
            preferred: [],
            missing: [],
            suggestions: language === 'id' ? [
              "Gunakan kata kunci teknis ini di bagian Pengalaman Kerja untuk skor ATS maksimal.",
              "Pastikan setidaknya 80% keyword utama muncul di CV Anda."
            ] : [
              "Use these technical keywords in Work Experience for maximum ATS score.",
              "Ensure at least 80% of primary keywords appear in your CV."
            ]
          }
        });

        toast.ai(
          language === 'id' ? 'Keywords ATS diekstrak!' : 'ATS Keywords extracted!', 
          `${uniqueKeywords.length} keywords ${language === 'id' ? 'penting ditemukan.' : 'important keywords found.'}`
        );
        return uniqueKeywords;
      } catch (err) {
        toast.error('Error', `Failed to extract keywords.`);
        return [];
      } finally {
        setIsLoading(false);
        setLoadingLabel(null);
      }
    },
    [store, toast, language]
  );

  const optimizeBullet = useCallback(
    async (
      experienceId: string,
      bulletId: string,
      bulletText: string
    ): Promise<string | null> => {
      const { target } = store.getCVData();

      setIsLoading(true);
      setLoadingLabel(language === 'id' ? 'Meningkatkan keterbacaan...' : 'Improving readability...');

      try {
        const response = await fetch('/api/ai/bullet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bullet: bulletText,
            jobTitle: target.jobTitle,
            keywords: target.keywords,
            lang: language
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Error');
        }

        const data = await response.json() as { optimized: string; explanation: string };
        store.optimizeBullet(experienceId, bulletId, data.optimized);
        toast.ai(language === 'id' ? 'Dioptimalkan!' : 'Optimized!', data.explanation);
        return data.optimized;
      } catch (err) {
        toast.error('Error', 'Failed to optimize bullet.');
        return null;
      } finally {
        setIsLoading(false);
        setLoadingLabel(null);
      }
    },
    [store, toast, language]
  );

  const generateSummary = useCallback(async (): Promise<string | null> => {
    const cvData = store.getCVData();

    setIsLoading(true);
    setLoadingLabel(language === 'id' ? 'Mengoptimalkan ringkasan...' : 'Optimizing summary...');

    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvData, lang: language }),
      });

      if (!response.ok) {
        throw new Error('Error');
      }

      const data = await response.json() as { summary: string };
      store.setSummary(data.summary);
      toast.ai(
        language === 'id' ? 'Ringkasan dibuat!' : 'Summary generated!', 
        language === 'id' ? 'Ringkasan telah dioptimasi.' : 'Summary has been optimized.'
      );
      return data.summary;
    } catch (err) {
      toast.error('Error', 'Failed to generate summary.');
      return null;
    } finally {
      setIsLoading(false);
      setLoadingLabel(null);
    }
  }, [store, toast, language]);

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
