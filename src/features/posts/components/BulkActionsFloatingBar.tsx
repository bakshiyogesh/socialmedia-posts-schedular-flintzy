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
      className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="pointer-events-auto bg-zinc-950/95 border border-indigo-500/40 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-6 max-w-lg w-full">
        {/* Top Row on Mobile: Count + Close Button */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
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

          {/* Close button for mobile: pinned safely inside top-right */}
          <button
            type="button"
            onClick={onClear}
            className="sm:hidden p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
            title="Deselect all"
            aria-label="Deselect all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons: Half-and-Half width on mobile, inline on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onReschedule}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors w-full sm:w-auto"
          >
            <CalendarClock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Reschedule</span>
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50 w-full sm:w-auto"
          >
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>

          {/* Close button for desktop */}
          <button
            type="button"
            onClick={onClear}
            className="hidden sm:flex p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors ml-0.5 shrink-0"
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
