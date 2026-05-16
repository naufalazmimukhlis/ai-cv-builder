'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  maxTags?: number;
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  id?: string;
}

export function TagInput({
  value = [],
  onChange,
  placeholder = 'Ketik dan tekan Enter...',
  suggestions = [],
  maxTags = 30,
  label,
  error,
  hint,
  className,
  id,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputId = id || `tag-input-${Math.random().toString(36).substr(2, 9)}`;

  const filteredSuggestions = React.useMemo(() => {
    if (!inputValue.trim()) return [];
    return suggestions
      .filter(
        (s) =>
          s.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(s)
      )
      .slice(0, 8);
  }, [inputValue, suggestions, value]);

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed) || value.length >= maxTags) return;
    onChange([...value, trimmed]);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div
        className={cn(
          'min-h-[48px] w-full px-3 py-2 bg-white border rounded-xl',
          'flex flex-wrap gap-1.5 items-center cursor-text',
          'transition-all duration-200',
          error
            ? 'border-danger focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
            : 'border-border focus-within:border-accent focus-within:shadow-input-focus'
        )}
        onClick={() => inputRef.current?.focus()}
        role="group"
        aria-label={label}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20 group"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="ml-0.5 text-accent/60 hover:text-accent hover:bg-accent/20 rounded-full p-0.5 transition-colors"
              aria-label={`Hapus ${tag}`}
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm text-[#1A2332] placeholder-[#64748B] py-0.5"
          aria-label={placeholder}
          disabled={value.length >= maxTags}
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="relative z-20">
          <div className="absolute top-1 left-0 right-0 bg-white rounded-xl border border-border shadow-card-hover overflow-hidden">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                className="w-full text-left px-3 py-2 text-sm text-[#1A2332] hover:bg-accent/5 hover:text-accent transition-colors"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(suggestion);
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mt-1.5">
        {error && (
          <p className="form-error">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[#64748B]">{hint}</p>
        )}
        <span className="text-xs text-[#64748B] ml-auto">
          {value.length}/{maxTags}
        </span>
      </div>
    </div>
  );
}
