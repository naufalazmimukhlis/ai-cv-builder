import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AIBadge({ children, className, ...props }: AIBadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-ai/5 border border-ai/20 text-ai-600 text-[10px] font-bold uppercase tracking-wider relative overflow-hidden group ai-glow",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      <Sparkles className="w-3 h-3 text-ai" />
      <span className="z-10">{children}</span>
    </div>
  );
}
