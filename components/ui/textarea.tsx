'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  showCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, containerClassName, showCount, maxLength, id, value, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor={textareaId} className="form-label mb-0">
              {label}
              {props.required && <span className="text-danger ml-1" aria-hidden="true">*</span>}
            </label>
            {showCount && maxLength && (
              <span className={cn('text-xs', charCount > maxLength * 0.9 ? 'text-warning' : 'text-[#64748B]')}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          value={value}
          maxLength={maxLength}
          className={cn(
            'form-textarea',
            error && 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="form-error" role="alert">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#64748B] mt-1.5">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
