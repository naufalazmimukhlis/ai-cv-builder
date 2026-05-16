'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Eye, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepProgress } from '@/components/ui/progress';
import { useCVStore } from '@/store/cv-store';
import { ATSTemplate } from '@/components/cv-template/ats-template';
import { AIEnhancementModal } from '@/components/ai-enhance/ai-enhancement-modal';
import { ATSScoreBadge } from '@/components/ai-enhance/ats-score-badge';
import { SaveIndicator } from '@/components/ui/save-indicator';
import { AIBadge } from '@/components/ui/ai-badge';
import { useState } from 'react';
import { ToastProvider } from '@/components/ui/toast';

const STEPS = ['Info Pribadi', 'Posisi', 'Pengalaman', 'Keahlian', 'Pendidikan'];

const PATH_TO_STEP: Record<string, number> = {
  '/builder': 1,
  '/builder/target': 2,
  '/builder/experience': 3,
  '/builder/skills': 4,
  '/builder/education': 5,
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const currentStep = PATH_TO_STEP[pathname] || 1;
  const atsScore = useCVStore((s) => s.atsScore);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-surface flex flex-col font-sans">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border shadow-sm" role="banner">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            {/* Logo & Autosave */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 group" aria-label="Kembali ke beranda">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                  <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="font-display font-bold text-primary leading-none">ATS CV Builder</span>
                  <span className="text-[10px] text-[#64748B] font-medium tracking-wide">PRO EDITION</span>
                </div>
              </Link>
              <div className="hidden md:block h-6 w-px bg-border mx-2" />
              <div className="hidden sm:block">
                <SaveIndicator />
              </div>
            </div>

            {/* Step indicator — center */}
            <div className="flex-1 max-w-sm mx-4 hidden lg:block">
              <StepProgress steps={STEPS} current={currentStep} />
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              <div className="hidden md:block">
                <AIBadge>Powered by Gemini 1.5</AIBadge>
              </div>
              {atsScore !== null && (
                <ATSScoreBadge score={atsScore} compact />
              )}
              <button
                onClick={() => setShowPreviewMobile(true)}
                className="md:hidden btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
                aria-label="Lihat pratinjau CV"
                id="mobile-preview-btn"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <Button
                variant="ai"
                size="sm"
                onClick={() => setShowAIModal(true)}
                id="ai-enhance-btn"
                leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                aria-label="Sempurnakan CV dengan AI"
              >
                <span className="hidden sm:inline">Sempurnakan AI</span>
                <span className="sm:hidden">AI</span>
              </Button>
              <Link href="/preview" id="preview-btn">
                <Button variant="accent" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                  <span className="hidden sm:inline">Preview</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile step indicator */}
          <div className="md:hidden px-4 pb-3">
            <StepProgress steps={STEPS} current={currentStep} />
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Form Panel — Left (45%) */}
          <main
            className="w-full md:w-[45%] lg:w-[42%] flex-shrink-0 overflow-y-auto"
            id="form-panel"
            role="main"
          >
            <div className="min-h-full">
              {children}
            </div>
          </main>

          {/* Preview Panel — Right (55%) */}
          <aside
            className="hidden md:flex flex-1 bg-surface-2 border-l border-border overflow-hidden flex-col"
            id="preview-panel"
            aria-label="Pratinjau CV"
          >
            {/* Preview header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" aria-hidden="true" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" aria-hidden="true" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" aria-hidden="true" />
                </div>
                <span className="text-xs text-[#64748B] font-medium ml-2">Pratinjau CV — ATS Mode</span>
              </div>
              <Link href="/preview" id="full-preview-link">
                <Button variant="ghost" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                  Fullscreen
                </Button>
              </Link>
            </div>

            {/* Scrollable CV preview */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-white rounded-xl shadow-card border border-border overflow-hidden">
                <ATSTemplate />
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Preview Sheet */}
        {showPreviewMobile && (
          <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-label="Pratinjau CV">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowPreviewMobile(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-modal max-h-[85vh] flex flex-col animate-slide-up">
              <div className="flex items-center justify-between p-4 border-b border-border flex-shrink-0">
                <span className="font-semibold text-primary text-sm">Pratinjau CV</span>
                <button
                  onClick={() => setShowPreviewMobile(false)}
                  className="text-[#64748B] hover:text-primary transition-colors p-1"
                  aria-label="Tutup pratinjau"
                >
                  <ChevronLeft className="w-5 h-5 rotate-90" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white border border-border rounded-xl overflow-hidden">
                  <div className="scale-[0.75] origin-top-left w-[133%]">
                    <ATSTemplate />
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <Link href="/preview" className="block" onClick={() => setShowPreviewMobile(false)}>
                  <Button variant="primary" size="md" className="w-full" leftIcon={<Eye className="w-4 h-4" />}>
                    Lihat Fullscreen
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* AI Enhancement Modal */}
        <AIEnhancementModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
        />
      </div>
    </ToastProvider>
  );
}
