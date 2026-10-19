'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  initialValue?: string;
  onSearchChange?: (value: string) => void;
}

export function SearchInput({ initialValue = "", onSearchChange = () => { } }: SearchInputProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external initialValue if URL changes externally (e.g. back button)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Debounce by 300ms as requested in FILTERING spec
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== initialValue) {
        onSearchChange(value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, initialValue, onSearchChange]);

  // Global '/' keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setValue('');
    onSearchChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search copy, errors, platforms... (Press /)"
        aria-label="Search posts by content, error message or platform"
        className="w-full pl-9 pr-9 py-2 bg-zinc-900/80 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300"
          aria-label="Clear search query"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
