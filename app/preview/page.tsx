'use client';

import Link from 'next/link';
import { ArrowLeft, Sparkles, Edit2 } from 'lucide-react';
import { ATSTemplate } from '@/components/cv-template/ats-template';
import { PDFExportButton } from '@/components/pdf-export-button';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import { ATSScoreBadge } from '@/components/ai-enhance/ats-score-badge';
import { cn } from '@/lib/utils';

import translations from '@/data/translations.json';
import { Languages } from 'lucide-react';

export default function PreviewPage() {
  const atsScore = useCVStore((s) => s.atsScore);
  const language = useCVStore((s) => s.language);
  const t = (translations as any)[language];
  const resumeRef = React.useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/builder/experience">
              <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                {t.back_to_edit}
              </Button>
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <h1 className="text-lg font-display font-semibold text-primary hidden sm:block">
              {t.preview_title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-2 rounded-xl p-1 border border-border mr-2 shadow-inner">
              <Languages className="w-3.5 h-3.5 text-[#64748B] ml-2 mr-1" />
              <button
                onClick={() => useCVStore.getState().setLanguage('id')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  language === 'id' ? "bg-white text-primary shadow-sm" : "text-[#64748B] hover:text-primary hover:bg-white/50"
                )}
              >
                ID
              </button>
              <button
                onClick={() => useCVStore.getState().setLanguage('en')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                  language === 'en' ? "bg-white text-primary shadow-sm" : "text-[#64748B] hover:text-primary hover:bg-white/50"
                )}
              >
                EN
              </button>
            </div>
            {atsScore !== null && (
              <div className="hidden sm:block">
                <ATSScoreBadge score={atsScore} compact />
              </div>
            )}
            <PDFExportButton resumeRef={resumeRef} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Tips & Stats */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* ATS Score Detail */}
            {atsScore !== null && (
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm animate-fade-in">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-ai" />
                  {t.ats_score} Analysis
                </h3>
                <ATSScoreBadge score={atsScore} large className="w-full" />
                
                <div className="mt-6 pt-4 border-t border-border">
                  <Link href="/builder/target" className="block w-full">
                    <Button variant="outline" size="sm" className="w-full" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                      {t.adjust_keywords}
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Print Tips */}
            <div className="bg-surface-2 rounded-2xl p-5 border border-border animate-fade-in [animation-delay:200ms]">
              <h3 className="font-semibold text-[#1A2332] mb-3 text-sm">{t.tips_title}</h3>
              <ul className="space-y-3 text-xs text-[#64748B]">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {language === 'id' 
                    ? 'CV ini menggunakan format A4 standar industri (210 x 297 mm).'
                    : 'This CV uses industry-standard A4 format (210 x 297 mm).'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {language === 'id'
                    ? 'Desain dibuat khusus untuk sistem ATS: tanpa kolom ganda, teks murni.'
                    : 'Design optimized specifically for ATS: single column, pure text.'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {language === 'id'
                    ? 'PDF mendukung seleksi teks penuh yang wajib untuk sistem ATS.'
                    : 'PDF supports full text selection, which is mandatory for ATS systems.'}
                </li>
              </ul>
            </div>
          </div>

          {/* Right: CV Preview */}
          <div className="flex-1 flex justify-center animate-slide-up">
            <div className="bg-white rounded-xl shadow-modal border border-border overflow-hidden w-full max-w-[21cm]">
              <ATSTemplate ref={resumeRef} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
