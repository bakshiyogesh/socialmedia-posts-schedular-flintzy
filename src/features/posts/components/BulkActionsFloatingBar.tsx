'use client';

import React from 'react';
import { CalendarClock, Trash2, X, CheckSquare } from 'lucide-react';

interface BulkActionsFloatingBarProps {
  selectedCount: number;
  onReschedule: () => void;
  onDelete: () => void;
  onClear: () => void;
  isDeleting?: boolean;
}

export function BulkActionsFloatingBar({
  selectedCount,
  onReschedule,
  onDelete,
  onClear,
  isDeleting,
}: BulkActionsFloatingBarProps) {
  if (selectedCount === 0) return null;

  return (
    <aside
      aria-label="Bulk actions toolbar"
      className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="pointer-events-auto bg-zinc-950/95 border border-indigo-500/40 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 rounded-2xl p-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3 sm:gap-6 max-w-lg w-full">
        {/* Count & Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white tracking-tight">
              {selectedCount} {selectedCount === 1 ? 'post' : 'posts'} selected
            </p>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Apply actions across all selected items
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onReschedule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
          >
            <CalendarClock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reschedule</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>

          <button
            type="button"
            onClick={onClear}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors ml-0.5"
            title="Deselect all"
            aria-label="Deselect all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
