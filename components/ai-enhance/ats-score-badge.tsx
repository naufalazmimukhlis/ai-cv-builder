'use client';

import * as React from 'react';
import { cn, getScoreColor, getScoreBgColor, getScoreLabel } from '@/lib/utils';
import { Target } from 'lucide-react';

interface ATSScoreBadgeProps {
  score: number;
  compact?: boolean;
  large?: boolean;
  className?: string;
}

export function ATSScoreBadge({ score, compact = false, large = false, className }: ATSScoreBadgeProps) {
  const color = getScoreColor(score);
  const bg = getScoreBgColor(score);
  const label = getScoreLabel(score);

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border',
          bg,
          className
        )}
        title={`ATS Score: ${score}/100 — ${label}`}
        aria-label={`ATS Score ${score} dari 100`}
      >
        <Target className={cn('w-3 h-3', color)} aria-hidden="true" />
        <span className={color}>{score}</span>
      </div>
    );
  }

  if (large) {
    return (
      <div className={cn('flex flex-col items-center p-6 rounded-2xl border-2', bg, className)}>
        {/* Circular score */}
        <div className="relative mb-3">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-border/30"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              strokeDasharray={`${(score / 100) * 251.2} 251.2`}
              strokeLinecap="round"
              className={cn(
                score >= 80 ? 'stroke-emerald-500' : score >= 60 ? 'stroke-amber-500' : 'stroke-red-500'
              )}
              style={{ transition: 'stroke-dasharray 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn('text-2xl font-display font-bold', color)}>{score}</span>
            <span className="text-xs text-[#64748B]">/100</span>
          </div>
        </div>
        <span className={cn('text-base font-display font-semibold', color)}>{label}</span>
        <span className="text-xs text-[#64748B] mt-0.5">ATS Match Score</span>
        <p className="text-center text-xs text-[#64748B] mt-2 max-w-[200px]">
          {score >= 80
            ? 'CV Anda sangat kompatibel dengan ATS. Excellent!'
            : score >= 60
            ? 'CV cukup baik. Ada beberapa area yang bisa ditingkatkan.'
            : 'CV perlu peningkatan signifikan untuk lolos ATS.'}
        </p>
      </div>
    );
  }

  // Default size
  return (
    <div
      className={cn('flex items-center gap-2 px-3 py-2 rounded-xl border', bg, className)}
      aria-label={`ATS Score ${score} dari 100`}
    >
      <Target className={cn('w-4 h-4', color)} aria-hidden="true" />
      <div>
        <div className={cn('text-sm font-bold leading-none', color)}>{score}/100</div>
        <div className="text-xs text-[#64748B] mt-0.5">ATS Score — {label}</div>
      </div>
    </div>
  );
}
