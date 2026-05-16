'use client';

import * as React from 'react';
import { useCVStore } from '@/store/cv-store';
import { CheckCircle2, Loader2 } from 'lucide-react';

export function SaveIndicator() {
  const [status, setStatus] = React.useState<'saved' | 'saving'>('saved');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
    let timeout: NodeJS.Timeout;
    
    // Subscribe to any state change in the CV Store
    const unsubscribe = useCVStore.subscribe(() => {
      setStatus('saving');
      
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setStatus('saved');
      }, 1000); // Artificial delay to show saving status smoothly
    });
    
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${
      status === 'saving' 
        ? 'bg-ai/5 border-ai/20 text-ai-700 shadow-ai-sm' 
        : 'bg-success/5 border-success/20 text-success-700'
    }`}>
      <div className="relative w-3.5 h-3.5">
        {status === 'saving' ? (
          <Loader2 className="absolute inset-0 w-3.5 h-3.5 animate-spin text-ai" />
        ) : (
          <CheckCircle2 className="absolute inset-0 w-3.5 h-3.5 text-success animate-bounceSoft" />
        )}
      </div>
      <span className="text-[11px] font-bold tracking-tight">
        {status === 'saving' ? 'Menyimpan draft...' : 'Draft tersimpan otomatis'}
      </span>
    </div>
  );
}
