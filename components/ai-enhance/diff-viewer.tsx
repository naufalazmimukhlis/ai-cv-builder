'use client';

import * as React from 'react';
import { CheckCircle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCVStore } from '@/store/cv-store';
import type { AIEnhancementResult, CVData } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { Typewriter } from '@/components/ui/typewriter';

interface DiffViewerProps {
  result: AIEnhancementResult;
  cvData: CVData;
}

export function DiffViewer({ result, cvData }: DiffViewerProps) {
  const store = useCVStore();
  const [summaryAccepted, setSummaryAccepted] = React.useState<boolean | null>(null);
  const [expandedExp, setExpandedExp] = React.useState<string | null>(null);

  const handleAcceptSummary = () => {
    store.setSummary(result.professionalSummary);
    setSummaryAccepted(true);
  };

  const handleRejectSummary = () => {
    setSummaryAccepted(false);
  };

  const handleAcceptExperience = (expId: string, bullets: string[]) => {
    const optimizedBullets = bullets.map((text) => ({
      id: generateId(),
      text,
      aiOptimized: true,
    }));
    store.updateExperience(expId, { bullets: optimizedBullets });
  };

  return (
    <div className="space-y-4">
      {/* Professional Summary Diff */}
      {result.professionalSummary && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-surface-2 border-b border-border">
            <span className="text-sm font-semibold text-primary">Ringkasan Profesional</span>
            {summaryAccepted === null && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRejectSummary}
                  leftIcon={<X className="w-3 h-3 text-danger" />}
                  className="text-xs border-danger/30 text-danger hover:bg-danger/5"
                  id="reject-summary-btn"
                >
                  Pertahankan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAcceptSummary}
                  leftIcon={<CheckCircle className="w-3 h-3 text-success" />}
                  className="text-xs border-success/30 text-success hover:bg-success/5"
                  id="accept-summary-btn"
                >
                  Gunakan
                </Button>
              </div>
            )}
            {summaryAccepted !== null && (
              <span className={`text-xs font-medium ${summaryAccepted ? 'text-success' : 'text-[#64748B]'}`}>
                {summaryAccepted ? '✓ Diterapkan' : '○ Dipertahankan asli'}
              </span>
            )}
          </div>
          <div className="p-4 space-y-3">
            {/* Before */}
            {cvData.professionalSummary && (
              <div>
                <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Sebelum</p>
                <div className="diff-before">
                  {cvData.professionalSummary}
                </div>
              </div>
            )}
            {/* After */}
            <div>
              <p className="text-[10px] font-semibold text-success uppercase tracking-wider mb-1.5">Sesudah (AI)</p>
              <div className="diff-after">
                <Typewriter text={result.professionalSummary} speed={5} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Experiences */}
      {result.enhancedExperiences.map((enhanced) => {
        const originalExp = cvData.experiences.find((e) => e.id === enhanced.id);
        if (!originalExp) return null;

        const isExpanded = expandedExp === enhanced.id;
        const originalBullets = originalExp.bullets.map((b) => b.text).filter(Boolean);
        const hasChanges = JSON.stringify(originalBullets) !== JSON.stringify(enhanced.bullets);

        if (!hasChanges) return null;

        return (
          <div key={enhanced.id} className="border border-border rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 bg-surface-2 border-b border-border text-left hover:bg-surface-3 transition-colors"
              onClick={() => setExpandedExp(isExpanded ? null : enhanced.id)}
              aria-expanded={isExpanded}
              id={`exp-diff-${enhanced.id}`}
            >
              <span className="text-sm font-semibold text-primary">
                {originalExp.jobTitle} — {originalExp.company}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ai bg-ai/10 px-2 py-0.5 rounded-full">AI Optimized</span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#64748B]" aria-hidden="true" />
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="p-4 space-y-3">
                {/* Before */}
                <div>
                  <p className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider mb-1.5">Sebelum</p>
                  <div className="diff-before space-y-1">
                    {originalBullets.map((b, i) => (
                      <p key={i}>• {b}</p>
                    ))}
                  </div>
                </div>
                {/* After */}
                <div>
                  <p className="text-[10px] font-semibold text-success uppercase tracking-wider mb-1.5">Sesudah (AI)</p>
                  <div className="diff-after space-y-1">
                    {enhanced.bullets.map((b, i) => (
                      <p key={i}>• <Typewriter text={b} speed={5} /></p>
                    ))}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs border-danger/30 text-danger hover:bg-danger/5 flex-1"
                    id={`reject-exp-${enhanced.id}`}
                  >
                    Pertahankan Asli
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs border-success/30 text-success hover:bg-success/5 flex-1"
                    onClick={() => handleAcceptExperience(enhanced.id, enhanced.bullets)}
                    id={`accept-exp-${enhanced.id}`}
                  >
                    Gunakan Versi AI
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
