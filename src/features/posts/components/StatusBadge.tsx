import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { PostStatus } from '@/types';

interface StatusBadgeProps {
  status: PostStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  switch (status) {
    case 'scheduled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 ${className}`}
          role="status"
          aria-label="Status: Scheduled"
        >
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Scheduled</span>
        </span>
      );
    case 'published':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}
          role="status"
          aria-label="Status: Published"
        >
          <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Published</span>
        </span>
      );
    case 'failed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 ${className}`}
          role="status"
          aria-label="Status: Failed"
        >
          <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Failed</span>
        </span>
      );
  }
}
