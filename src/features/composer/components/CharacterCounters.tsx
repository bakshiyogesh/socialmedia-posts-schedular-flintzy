'use client';

import React from 'react';
import { PlatformIcon } from '@/components/shared/PlatformIcons';
import { PLATFORMS } from '@/config/platforms';
import type { PlatformId } from '@/types';

interface CharacterCountersProps {
  selectedPlatforms: PlatformId[];
  charCounts: Record<
    PlatformId,
    { count: number; limit: number; remaining: number; isOver: boolean }
  >;
}

export function CharacterCounters({
  selectedPlatforms,
  charCounts,
}: CharacterCountersProps) {
  if (selectedPlatforms.length === 0) return null;

  return (
    <div
      className="flex items-center gap-2 flex-wrap pt-1"
      aria-live="polite"
      aria-atomic="true"
    >
      {selectedPlatforms.map((pid) => {
        const stats = charCounts[pid];
        const config = PLATFORMS[pid];
        const isNearLimit = stats.remaining <= 30 && !stats.isOver;

        return (
          <div
            key={pid}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono border transition-all ${
              stats.isOver
                ? 'bg-rose-950/60 text-rose-300 border-rose-600/80 ring-1 ring-rose-500 font-bold animate-pulse'
                : isNearLimit
                ? 'bg-amber-950/40 text-amber-300 border-amber-600/60'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800'
            }`}
          >
            <PlatformIcon platform={pid} size={13} />
            <span>
              {stats.isOver ? (
                <span>
                  {stats.count}/{stats.limit} (+{Math.abs(stats.remaining)})
                </span>
              ) : (
                <span>
                  {stats.count}/{stats.limit}
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
