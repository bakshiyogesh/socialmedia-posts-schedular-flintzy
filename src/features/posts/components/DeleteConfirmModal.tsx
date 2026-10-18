'use client';

import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
  title?: string;
  description?: string;
  postExcerpt?: string;
  count?: number;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  title,
  description,
  postExcerpt,
  count = 1,
}: DeleteConfirmModalProps) {
  // Lock background scrolling while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  const isBulk = count > 1;
  const modalTitle = title || (isBulk ? `Delete ${count} Posts?` : 'Delete Post?');
  const modalDescription =
    description ||
    (isBulk
      ? `Are you sure you want to delete these ${count} posts? They will be permanently removed from your publishing schedule.`
      : 'Are you sure you want to delete this post? It will be removed from your publishing schedule.');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header with Danger Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 id="delete-confirm-title" className="text-sm font-bold text-zinc-100">
                {modalTitle}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {modalDescription}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Post Preview Excerpt if available */}
        {postExcerpt && (
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 italic line-clamp-2">
            &ldquo;{postExcerpt}&rdquo;
          </div>
        )}

        {/* Warning Badge */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/40 text-[11px] text-rose-300">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
          <span>This action cannot be undone once confirmed.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900/50 transition-colors shadow-lg shadow-rose-600/25"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>
              {isDeleting
                ? 'Deleting...'
                : isBulk
                ? `Delete ${count} Posts`
                : 'Delete Post'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
