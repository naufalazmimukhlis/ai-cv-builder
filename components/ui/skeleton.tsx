'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

export function Skeleton({ className, width, height, rounded = 'rounded-lg' }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', rounded, className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function CVPreviewSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse" aria-label="Memuat pratinjau CV...">
      {/* Name */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      {/* Contact */}
      <Skeleton className="h-8 w-full rounded-none" />
      {/* Summary section */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="h-px bg-surface-3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
      </div>
      {/* Experience */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <div className="h-px bg-surface-3" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-5/6" />
        <Skeleton className="h-3.5 w-full" />
      </div>
      {/* Skills */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <div className="h-px bg-surface-3" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
      {/* Education */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <div className="h-px bg-surface-3" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/5" />
        </div>
        <Skeleton className="h-3.5 w-1/2" />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4 p-6 animate-pulse">
      <Skeleton className="h-6 w-1/3" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
