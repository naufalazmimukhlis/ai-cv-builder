'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant: 'default' | 'success' | 'error' | 'warning' | 'ai';
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastData, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  ai: (title: string, description?: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((options: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const toast: ToastData = { id, duration: 4000, ...options };
    setToasts((prev) => [...prev.slice(-4), toast]); // max 5 toasts

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration);
  }, []);

  const contextValue: ToastContextType = React.useMemo(
    () => ({
      toast: addToast,
      success: (title, description) => addToast({ variant: 'success', title, description }),
      error: (title, description) => addToast({ variant: 'error', title, description }),
      warning: (title, description) => addToast({ variant: 'warning', title, description }),
      ai: (title, description) => addToast({ variant: 'ai', title, description }),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            {...toast}
            onDismiss={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  title,
  description,
  variant,
  onDismiss,
}: ToastData & { onDismiss: () => void }) {
  const variantStyles = {
    default: 'bg-white border-border',
    success: 'bg-white border-l-4 border-l-success border-border',
    error: 'bg-white border-l-4 border-l-danger border-border',
    warning: 'bg-white border-l-4 border-l-warning border-border',
    ai: 'bg-white border-l-4 border-l-ai border-border',
  };

  const iconVariant = {
    default: null,
    success: (
      <div className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-success" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    error: (
      <div className="w-5 h-5 rounded-full bg-danger/15 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-danger" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    warning: (
      <div className="w-5 h-5 rounded-full bg-warning/15 flex items-center justify-center flex-shrink-0">
        <svg className="w-3 h-3 text-warning" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </div>
    ),
    ai: (
      <div className="w-5 h-5 rounded-full bg-ai/15 flex items-center justify-center flex-shrink-0">
        <span className="text-ai text-xs">✨</span>
      </div>
    ),
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-modal',
        'animate-slide-left min-w-[280px] max-w-[380px]',
        variantStyles[variant]
      )}
      role="alert"
    >
      {iconVariant[variant]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#1A2332]">{title}</p>
        {description && (
          <p className="text-xs text-[#64748B] mt-0.5">{description}</p>
        )}
      </div>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-[#64748B] hover:text-[#1A2332] transition-colors p-0.5 rounded"
        aria-label="Tutup notifikasi"
      >
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

export function useToast(): ToastContextType {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function Toaster() {
  return <ToastProvider>{null}</ToastProvider>;
}
