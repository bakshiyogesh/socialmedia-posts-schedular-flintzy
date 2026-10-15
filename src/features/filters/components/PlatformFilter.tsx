'use client';

import React from 'react';
import { PlatformIcon } from '@/components/shared/PlatformIcons';
import { ALL_PLATFORMS, PLATFORMS } from '@/config/platforms';
import type { PlatformId } from '@/types';

interface PlatformFilterProps {
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (platform: PlatformId) => void;
  onClear: () => void;
}

export function PlatformFilter({
  selectedPlatforms,
  onTogglePlatform,
}: PlatformFilterProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by social platform">
      {ALL_PLATFORMS.map((pid) => {
        const isSelected = selectedPlatforms.includes(pid);
        const config = PLATFORMS[pid];

        return (
          <button
            key={pid}
            type="button"
            role="checkbox"
            aria-checked={isSelected}
            onClick={() => onTogglePlatform(pid)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              isSelected
                ? 'bg-zinc-800 text-zinc-100 border-indigo-500/80 shadow-sm shadow-indigo-950 ring-1 ring-indigo-500/50'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <PlatformIcon platform={pid} size={14} />
            <span>{config.shortName}</span>
          </button>
        );
      })}
    </div>
  );
}
