'use client';

import React from 'react';
import { PlatformIcon } from '@/components/shared/PlatformIcons';
import { ALL_PLATFORMS, PLATFORMS } from '@/config/platforms';
import type { PlatformId } from '@/types';

interface PlatformSelectorProps {
  selectedPlatforms: PlatformId[];
  onTogglePlatform: (platform: PlatformId) => void;
}

export function PlatformSelector({
  selectedPlatforms,
  onTogglePlatform,
}: PlatformSelectorProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300">
          Target Channels <span className="text-rose-400">*</span>
        </label>
        <span className="text-[11px] text-zinc-500">
          {selectedPlatforms.length} selected
        </span>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        role="group"
        aria-label="Select target social channels"
      >
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
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-zinc-800 text-zinc-100 border-indigo-500 ring-1 ring-indigo-500/50 shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:bg-zinc-800/60 hover:border-zinc-700'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isSelected ? 'bg-zinc-950 text-indigo-400' : 'bg-zinc-950 text-zinc-500'
                }`}
              >
                <PlatformIcon platform={pid} size={16} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate leading-tight">
                  {config.shortName}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {config.charLimit.toLocaleString()} max
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
