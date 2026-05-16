'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0-100
  label?: string;
  className?: string;
  variant?: 'default' | 'success' | 'ai' | 'warning';
  showLabel?: boolean;
  animated?: boolean;
}

export function Progress({
  value,
  label,
  className,
  variant = 'default',
  showLabel = false,
  animated = true,
}: ProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const trackColors = {
    default: 'bg-surface-2',
    success: 'bg-success/10',
    ai: 'bg-ai/10',
    warning: 'bg-warning/10',
  };

  const fillColors = {
    default: 'bg-accent',
    success: 'bg-success',
    ai: 'bg-gradient-to-r from-ai to-accent',
    warning: 'bg-warning',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs font-medium text-[#64748B]">{label}</span>}
          {showLabel && (
            <span className="text-xs font-semibold text-[#1A2332]">{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        className={cn('h-2 rounded-full overflow-hidden', trackColors[variant])}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all',
            animated && 'duration-500 ease-out',
            fillColors[variant]
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

interface StepProgressProps {
  steps: string[];
  current: number; // 1-based
  className?: string;
}

export function StepProgress({ steps, current, className }: StepProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border z-0">
          <div
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${((current - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < current;
          const isActive = stepNum === current;

          return (
            <div key={step} className="flex flex-col items-center gap-2 z-10">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all duration-300',
                  isCompleted && 'bg-success border-success text-white',
                  isActive && 'bg-primary border-primary text-white shadow-button scale-110',
                  !isCompleted && !isActive && 'bg-white border-border text-[#64748B]'
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium text-center leading-tight max-w-[60px]',
                  isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-[#64748B]'
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
