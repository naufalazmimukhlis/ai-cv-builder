'use client';

import { useState, useCallback } from 'react';
import { useCVStore } from '@/store/cv-store';
import { useToast } from '@/components/ui/toast';
import type { AIEnhancementResult } from '@/types/cv';
import { generateSummary as generateSummaryLocal } from '@/lib/generateSummary';
import { optimizeBulletLocal, enhanceCVLocal, extractKeywordsLocal } from '@/lib/localAI';

interface UseAIEnhanceReturn {
  isLoading: boolean;
  loadingLabel: string | null;
  enhance: () => Promise<void>;
  optimizeBullet: (
    experienceId: string,
    bulletId: string,
    bulletText: string
  ) => Promise<void>;
  generateSummary: () => Promise<void>;
  extractKeywords: (jobDescription: string) => Promise<string[]>;
  result: AIEnhancementResult | null;
  error: string | null;
  reset: () => void;
}

/**
 * Hook for Local-First AI Enhancement.
 * All intelligence logic runs locally in the browser.
 */
export function useAIEnhance(): UseAIEnhanceReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const store = useCVStore();
  const toast = useToast();
  const language = useCVStore((s) => s.language);

  // Artificial delay to make it feel "AI-powered" and premium
  const simulateWork = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

  const enhance = useCallback(async () => {
    const cvData = store.getCVData();

    if (!cvData.personal.fullName) {
      toast.error(
        language === 'id' ? 'Data tidak lengkap' : 'Incomplete data', 
        language === 'id' 
          ? 'Isi informasi pribadi terlebih dahulu agar engine dapat menganalisa profil Anda.'
          : 'Fill in your personal information first so the engine can analyze your profile.'
      );
      return;
    }

    setIsLoading(true);
    setLoadingLabel(language === 'id' ? 'Menganalisis kompatibilitas ATS...' : 'Analyzing ATS compatibility...');
    setError(null);
    store.setAIStatus('processing');
    store.setAIProgress(20, language === 'id' ? 'Menjalankan Local Intelligence Engine...' : 'Running Local Intelligence Engine...');

    try {
      await simulateWork(1200); // Feel premium
      
      const result = await enhanceCVLocal(cvData, language);
      
      store.setAIProgress(100, language === 'id' ? 'Selesai!' : 'Done!');
      store.applyAIEnhancement(result);

      toast.ai(
        language === 'id' ? '✨ CV berhasil disempurnakan!' : '✨ CV successfully enhanced!',
        `ATS Score: ${result.atsScore}/100 — ${language === 'id' ? 'Tersedia dalam ID & EN' : 'Available in ID & EN'}`
      );
    } catch (err) {
      const message = language === 'id' ? 'Terjadi kesalahan pada engine lokal' : 'Error in local intelligence engine';
      setError(message);
      store.setAIError(message);
      toast.error(language === 'id' ? 'Gagal menyempurnakan CV' : 'Failed to enhance CV', message);
    } finally {
      setIsLoading(false);
      setLoadingLabel(null);
    }
  }, [store, toast, language]);

  const optimizeBullet = useCallback(
    async (
      experienceId: string,
      bulletId: string,
      bulletText: string
    ): Promise<void> => {
      setIsLoading(true);
      setLoadingLabel(language === 'id' ? 'Meningkatkan keterbacaan...' : 'Improving readability...');

      try {
        await simulateWork(600);
        const { optimized, explanation } = optimizeBulletLocal(bulletText, language);
        
        // We need to handle bilingual optimization if possible, but for now we optimize the active one
        // and keep the other as is or use a basic translation if available.
        // For simplicity in Local-First, we optimize both with the same logic but different languages.
        const { optimized: optId } = optimizeBulletLocal(bulletText, 'id');
        const { optimized: optEn } = optimizeBulletLocal(bulletText, 'en');

        store.optimizeBullet(experienceId, bulletId, optId, optEn);
        toast.ai(language === 'id' ? 'Dioptimalkan!' : 'Optimized!', explanation);
      } catch (err) {
        toast.error('Error', 'Failed to optimize bullet.');
      } finally {
        setIsLoading(false);
        setLoadingLabel(null);
      }
    },
    [store, toast, language]
  );

  const generateSummary = useCallback(async (): Promise<void> => {
    const cvData = store.getCVData();

    setIsLoading(true);
    setLoadingLabel(language === 'id' ? 'Mengoptimalkan ringkasan...' : 'Optimizing summary...');

    try {
      await simulateWork(1000);
      const { id, en } = generateSummaryLocal(cvData);
      
      store.setSummaryBilingual(id, en);
      toast.ai(
        language === 'id' ? 'Ringkasan dibuat!' : 'Summary generated!', 
        language === 'id' ? 'Tersedia dalam Bahasa Indonesia & Inggris.' : 'Available in both Indonesian & English.'
      );
    } catch (err) {
      toast.error('Error', 'Failed to generate summary.');
    } finally {
      setIsLoading(false);
      setLoadingLabel(null);
    }
  }, [store, toast, language]);

  const extractKeywords = useCallback(async (jobDescription: string): Promise<string[]> => {
    setIsLoading(true);
    setLoadingLabel(language === 'id' ? 'Ekstrak keyword...' : 'Extracting keywords...');
    
    await simulateWork(500);
    const keywords = extractKeywordsLocal(jobDescription);
    
    setIsLoading(false);
    setLoadingLabel(null);
    return keywords;
  }, [language]);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    store.resetAI();
  }, [store]);

  return {
    isLoading,
    loadingLabel,
    enhance,
    optimizeBullet,
    generateSummary,
    extractKeywords,
    result: store.aiResult,
    error,
    reset,
  };
}
