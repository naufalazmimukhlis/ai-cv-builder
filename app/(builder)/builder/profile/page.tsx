'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Info, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import { useAIEnhance } from '@/hooks/use-ai-enhance';
import { useState } from 'react';
import translations from '@/data/translations.json';

export default function ProfessionalProfileStep() {
  const router = useRouter();
  const { language, setSummary } = useCVStore();
  const { generateSummary, isLoading } = useAIEnhance();
  const [isGenerating, setIsGenerating] = useState(false);
  const t = (translations as any)[language];

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      await generateSummary();
    } catch (error) {
      console.error("Generate summary failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const summaryValue = useCVStore((state) => 
    state.language === 'id' ? state.professionalSummaryId : state.professionalSummaryEn
  );

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto animate-fade-in pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary mb-2">
          {language === 'id' ? 'Profil Profesional' : 'Professional Profile'}
        </h1>
        <p className="text-sm text-[#64748B]">
          {language === 'id' 
            ? 'Langkah terakhir! Buat ringkasan yang kuat untuk menarik perhatian HRD.'
            : 'Last step! Create a strong summary to catch the recruiter\'s attention.'}
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-border shadow-card p-6 md:p-8 animate-slide-up">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-ai-50 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-ai" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">
                  {language === 'id' ? 'Profil' : 'Professional Profile'}
                </h2>
                <p className="text-xs text-[#64748B]">
                  {language === 'id' 
                    ? 'Jelaskan siapa Anda dan apa nilai tambah Anda.'
                    : 'Explain who you are and what your value proposition is.'}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGenerating || isLoading}
              className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ai-50 border border-ai-200 text-ai-700 text-xs font-bold hover:bg-ai-100 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-ai border-t-transparent rounded-full animate-spin" />
                  {language === 'id' ? 'AI Menulis...' : 'AI Writing...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-ai" />
                  <span className="z-10">✨ {t.generate_summary} AI</span>
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            <textarea
              className="form-textarea min-h-[200px] text-sm leading-relaxed focus:ring-ai/20 focus:border-ai transition-all scrollbar-hide"
              placeholder={language === 'id' 
                ? "Tuliskan profil singkat Anda atau gunakan AI untuk membuat profil profesional berdasarkan pengalaman dan skill Anda." 
                : "Write your professional profile or let AI generate it based on your experience and skills."}
              value={summaryValue}
              onChange={(e) => setSummary(e.target.value)}
            />
            
            <div className="flex items-start gap-3 text-xs text-[#64748B] bg-surface-2 p-4 rounded-xl border border-border">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-primary">
                  {language === 'id' ? 'Tips Profil Profesional:' : 'Professional Profile Tips:'}
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>{language === 'id' ? 'Gunakan kalimat yang padat dan berorientasi hasil.' : 'Use concise and result-oriented sentences.'}</li>
                  <li>{language === 'id' ? 'Sebutkan total pengalaman dan spesialisasi utama.' : 'Mention total experience and main specialization.'}</li>
                  <li>{language === 'id' ? 'AI akan menggunakan data Target Posisi & Pengalaman Anda.' : 'AI will use your Target Position & Experience data.'}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 pb-12">
          <Button
            variant="ghost"
            size="lg"
            className="flex-1 h-12 md:h-14 font-bold rounded-xl"
            onClick={() => router.push('/builder/education')}
            leftIcon={<ArrowLeft className="w-5 h-5" />}
          >
            {language === 'id' ? 'Kembali' : 'Back'}
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-[2] h-12 md:h-14 font-bold rounded-xl shadow-ai"
            onClick={() => router.push('/preview')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            {language === 'id' ? 'Lihat Pratinjau CV' : 'View CV Preview'}
          </Button>
        </div>
      </div>
    </div>
  );
}
