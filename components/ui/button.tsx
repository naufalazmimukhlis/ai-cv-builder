'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white rounded-xl shadow-button hover:bg-primary-light hover:shadow-button-hover',
        accent: 'bg-accent text-white rounded-xl shadow-button hover:bg-accent-600 hover:shadow-button-hover',
        warm: 'bg-warm text-white rounded-xl shadow-button hover:bg-warm-600 hover:shadow-button-hover font-semibold',
        ai: 'bg-ai text-white rounded-xl shadow-ai hover:bg-ai-600',
        ghost: 'bg-transparent border border-border text-[#1A2332] rounded-xl hover:bg-surface-2 hover:border-accent/30',
        outline: 'border border-primary text-primary rounded-xl hover:bg-primary hover:text-white',
        destructive: 'bg-danger text-white rounded-xl hover:bg-red-600',
        link: 'text-accent underline-offset-4 hover:underline p-0 h-auto',
        secondary: 'bg-surface-2 text-[#1A2332] rounded-xl border border-border hover:bg-surface-3',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0',
        'icon-lg': 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : leftIcon ? (
          <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
        ) : null}
        {children}
        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
