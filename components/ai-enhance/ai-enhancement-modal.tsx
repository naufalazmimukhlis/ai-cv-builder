'use client';

import * as React from 'react';
import { Sparkles, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ATSScoreBadge } from './ats-score-badge';
import { DiffViewer } from './diff-viewer';
import { useAIEnhance } from '@/hooks/use-ai-enhance';
import { useCVStore } from '@/store/cv-store';

interface AIEnhancementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROCESSING_STEPS = [
  'Menganalisis job description...',
  'Mengekstrak ATS keywords...',
  'Mengoptimalkan professional summary...',
  'Menyempurnakan bullet points pengalaman...',
  'Menyesuaikan prioritas skills...',
  'Menghitung ATS match score...',
  'Menyelesaikan...',
];

export function AIEnhancementModal({ isOpen, onClose }: AIEnhancementModalProps) {
  const { enhance, result, error, reset } = useAIEnhance();
  const aiStatus = useCVStore((s) => s.aiStatus);
  const aiProgress = useCVStore((s) => s.aiProgress);
  const applyAIEnhancement = useCVStore((s) => s.applyAIEnhancement);
  const store = useCVStore();

  const [stepIndex, setStepIndex] = React.useState(0);
  const [hasApplied, setHasApplied] = React.useState(false);

  // Animate through processing steps
  React.useEffect(() => {
    if (aiStatus === 'processing') {
      const interval = setInterval(() => {
        setStepIndex((prev) => Math.min(prev + 1, PROCESSING_STEPS.length - 1));
      }, 1500);
      return () => clearInterval(interval);
    } else {
      setStepIndex(0);
    }
  }, [aiStatus]);

  const handleEnhance = async () => {
    setHasApplied(false);
    await enhance();
  };

  const handleAcceptAll = () => {
    if (result) {
      applyAIEnhancement(result);
      setHasApplied(true);
      setTimeout(() => {
        onClose();
        reset();
      }, 1200);
    }
  };

  const handleClose = () => {
    onClose();
    if (aiStatus === 'done' || aiStatus === 'error') {
      reset();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="✨ Sempurnakan CV dengan AI"
      description="Google Gemini AI akan mengoptimalkan seluruh CV Anda"
      size="lg"
    >
      <div className="space-y-6">
        {/* Idle state */}
        {aiStatus === 'idle' && (
          <div className="text-center py-4">
            <div className="w-16 h-16 ai-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-display font-semibold text-primary mb-2">
              AI Siap Menyempurnakan CV Anda
            </h3>
            <p className="text-sm text-[#64748B] mb-6 max-w-sm mx-auto">
              AI akan menganalisis seluruh data CV dan job description untuk mengoptimalkan konten, keyword, dan ATS score Anda.
            </p>

            <div className="bg-surface-2 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs font-semibold text-primary mb-3">AI akan melakukan:</p>
              <ul className="space-y-2">
                {[
                  'Analisis gap antara CV dan job description',
                  'Optimasi professional summary (3-4 kalimat powerful)',
                  'Perbaikan bullet points dengan STAR method + metrics',
                  'Prioritisasi skills sesuai keywords JD',
                  'Kalkulasi ATS match score (0-100)',
                  'Rekomendasi improvement spesifik',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-[#64748B]">
                    <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="ai"
              size="lg"
              onClick={handleEnhance}
              className="w-full"
              id="start-ai-enhance-btn"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Mulai Sempurnakan CV
            </Button>
          </div>
        )}

        {/* Processing state */}
        {aiStatus === 'processing' && (
          <div className="py-4">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 ai-gradient rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" aria-hidden="true" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-ping" aria-hidden="true" />
                </div>
              </div>
            </div>

            <h3 className="text-center text-base font-semibold text-primary mb-1">
              AI sedang bekerja...
            </h3>
            <p className="text-center text-xs text-[#64748B] mb-5">Proses ini memakan waktu 10-20 detik</p>

            <Progress value={aiProgress} variant="ai" showLabel className="mb-4" />

            {/* Animated step list */}
            <div className="space-y-2">
              {PROCESSING_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg transition-all duration-300 ${
                    index < stepIndex
                      ? 'opacity-50'
                      : index === stepIndex
                      ? 'bg-ai/5 border border-ai/10'
                      : 'opacity-30'
                  }`}
                >
                  {index < stepIndex ? (
                    <CheckCircle className="w-3.5 h-3.5 text-success flex-shrink-0" aria-hidden="true" />
                  ) : index === stepIndex ? (
                    <div className="w-3.5 h-3.5 border-2 border-ai border-t-transparent rounded-full animate-spin flex-shrink-0" aria-hidden="true" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-border flex-shrink-0" aria-hidden="true" />
                  )}
                  <span className={`text-xs ${index === stepIndex ? 'text-ai font-medium' : 'text-[#64748B]'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {aiStatus === 'error' && (
          <div className="text-center py-4">
            <div className="w-14 h-14 bg-danger/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-danger" aria-hidden="true" />
            </div>
            <h3 className="font-display font-semibold text-primary mb-2">AI Gagal Merespons</h3>
            <p className="text-sm text-[#64748B] mb-6 max-w-sm mx-auto">
              {error || 'Terjadi kesalahan. Periksa koneksi internet dan API key Anda.'}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" onClick={handleClose} size="md">
                Tutup
              </Button>
              <Button variant="primary" onClick={handleEnhance} size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        {/* Done state — show results */}
        {aiStatus === 'done' && result && (
          <div>
            {/* ATS Score */}
            <div className="flex justify-center mb-6">
              <ATSScoreBadge score={result.atsScore} large />
            </div>

            {/* Diff viewer */}
            <DiffViewer result={result} cvData={store.getCVData()} />

            {/* Improvements */}
            {result.improvements.length > 0 && (
              <div className="mt-4 p-4 bg-surface-2 rounded-xl">
                <p className="text-xs font-semibold text-primary mb-2.5">💡 Rekomendasi AI:</p>
                <ul className="space-y-1.5">
                  {result.improvements.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#64748B]">
                      <ChevronRight className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={handleClose} className="flex-1" id="skip-ai-btn">
                Tinjau Manual
              </Button>
              <Button
                variant="ai"
                onClick={handleAcceptAll}
                className="flex-1"
                id="accept-all-btn"
                leftIcon={hasApplied ? <CheckCircle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              >
                {hasApplied ? 'Diterapkan!' : 'Terapkan Semua'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
