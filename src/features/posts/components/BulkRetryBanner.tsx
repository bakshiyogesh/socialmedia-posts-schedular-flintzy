'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useBulkRetryMutation } from '../hooks/usePosts';

interface BulkRetryBannerProps {
  failedCount: number;
}

export function BulkRetryBanner({ failedCount }: BulkRetryBannerProps) {
  const bulkRetryMutation = useBulkRetryMutation();

  if (failedCount === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-rose-900/50 bg-gradient-to-r from-rose-950/40 via-zinc-900 to-rose-950/20 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-rose-950/20"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-rose-200">
            {failedCount} {failedCount === 1 ? 'post failed' : 'posts failed'} to publish
          </h3>
          <p className="text-xs text-rose-300/80">
            Errors caused by OAuth expiration, aspect-ratio mismatch, or API throttles.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => bulkRetryMutation.mutate()}
        disabled={bulkRetryMutation.isPending}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white rounded-lg text-xs font-semibold transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 shrink-0"
      >
        <RefreshCw
          className={`w-3.5 h-3.5 ${bulkRetryMutation.isPending ? 'animate-spin' : ''}`}
          aria-hidden="true"
        />
        <span>
          {bulkRetryMutation.isPending ? 'Retrying in Batch...' : `Retry All (${failedCount})`}
        </span>
      </button>
    </div>
  );
}
