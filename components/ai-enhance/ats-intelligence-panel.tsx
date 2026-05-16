'use client';

import * as React from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { useCVStore } from '@/store/cv-store';
import { cn } from '@/lib/utils';

export function ATSIntelligencePanel() {
  const { target, experiences, skills } = useCVStore();
  const analysis = target.aiAnalysis;

  if (!analysis || (analysis.required.length === 0 && analysis.preferred.length === 0)) {
    return null;
  }

  // Basic calculation of missing keywords (case-insensitive check)
  const allCurrentText = [
    target.jobTitle,
    ...experiences.flatMap(e => [e.jobTitle, ...e.bullets.map(b => b.text)]),
    ...skills.technical,
    ...skills.tools
  ].join(' ').toLowerCase();

  const missingRequired = analysis.required.filter(
    k => !allCurrentText.includes(k.toLowerCase())
  );

  const matchedCount = analysis.required.length - missingRequired.length;
  const matchPercentage = analysis.required.length > 0 
    ? Math.round((matchedCount / analysis.required.length) * 100) 
    : 0;

  return (
    <div className="mt-8 space-y-5 animate-slide-up ai-glow">
      <div className="flex items-center gap-2.5 mb-2 px-1">
        <div className="w-8 h-8 rounded-lg bg-ai/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-ai" />
        </div>
        <h3 className="text-lg font-display font-bold text-primary">ATS Intelligence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Match Score Card */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-card flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.02] duration-300">
          <div className="relative w-24 h-24 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                className="text-surface-3 stroke-current"
                strokeWidth="2.5"
                fill="none"
                cx="18" cy="18" r="16"
              />
              <circle
                className={cn(
                  "stroke-current transition-all duration-1000 ease-out",
                  matchPercentage > 75 ? "text-success" : matchPercentage > 45 ? "text-warning" : "text-danger"
                )}
                strokeWidth="2.5"
                strokeDasharray={`${matchPercentage}, 100`}
                strokeLinecap="round"
                fill="none"
                cx="18" cy="18" r="16"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-bold text-primary">{matchPercentage}</span>
              <span className="text-[10px] font-bold text-[#64748B] -mt-1">MATCH</span>
            </div>
          </div>
          <div className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest bg-surface-2 px-3 py-1 rounded-full border border-border">
            ATS Score
          </div>
        </div>

        {/* Missing Keywords Card */}
        <div className="md:col-span-2 bg-white border border-border rounded-2xl p-6 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-warning" />
              </div>
              Keywords Penting yang Belum Ada
            </h4>
            <span className="text-[11px] bg-warning/5 text-warning-700 border border-warning/10 px-3 py-1 rounded-full font-bold">
              {missingRequired.length} Missing
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-40 pr-2 custom-scrollbar">
            {missingRequired.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {missingRequired.map((k, i) => (
                  <span key={i} className="text-xs bg-surface-2 text-primary border border-border px-3 py-1.5 rounded-xl font-medium transition-all hover:border-warning/30 hover:bg-warning/5 hover:text-warning-800 cursor-default">
                    {k}
                  </span>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <p className="text-sm font-bold text-success">Luar Biasa!</p>
                <p className="text-xs text-[#64748B]">Semua keyword utama sudah ada di CV Anda.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recruiter Suggestions */}
      <div className="bg-ai-50/50 border border-ai-100 rounded-2xl p-6 shadow-ai-sm">
        <h4 className="text-sm font-bold text-ai-900 mb-4 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ai/10 flex items-center justify-center">
            <Info className="w-4 h-4 text-ai" />
          </div>
          Saran Strategis AI
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/60 rounded-xl border border-ai-100/50">
              <div className="w-5 h-5 rounded-full bg-ai/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-3 h-3 text-ai" />
              </div>
              <p className="text-[11px] leading-relaxed text-ai-800 font-medium">{s}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
