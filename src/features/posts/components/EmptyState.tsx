'use client';

import React from 'react';
import { CalendarX2, SearchX, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-posts' | 'no-results';
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 text-zinc-400 mb-3 shadow-inner">
          <SearchX className="w-8 h-8" aria-hidden="true" />
        </div>
        <h3 className="text-base font-semibold text-zinc-200 mb-1">
          No matching posts found
        </h3>
        <p className="text-xs text-zinc-400 max-w-sm mb-4">
          No scheduled, published, or failed posts matched your current search and platform filters.
        </p>
        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors border border-zinc-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear all filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
      <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-3 shadow-inner">
        <CalendarX2 className="w-8 h-8" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-zinc-200 mb-1">
        Your publishing queue is empty
      </h3>
      <p className="text-xs text-zinc-400 max-w-sm mb-4">
        Ready to build your social engine? Compose a post, run pre-flight checks, and schedule it across your channels.
      </p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create your first post</span>
        </button>
      )}
    </div>
  );
}
