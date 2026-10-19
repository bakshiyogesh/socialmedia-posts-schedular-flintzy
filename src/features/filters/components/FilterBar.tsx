'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { PlatformFilter } from './PlatformFilter';
import { DateFilter } from './DateFilter';
import type { FilterState, PlatformId } from '@/types';

interface FilterBarProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({
  filters,
  onUpdateFilters,
  onResetFilters,
  hasActiveFilters,
}: FilterBarProps) {
  const handleTogglePlatform = (platform: PlatformId) => {
    const isSelected = filters.platforms.includes(platform);
    const updated = isSelected
      ? filters.platforms.filter((p) => p !== platform)
      : [...filters.platforms, platform];
    onUpdateFilters({ platforms: updated });
  };

  return (
    <div className="p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl space-y-2.5">
      {/* Primary Row: Search Input + Date Filter + Reset Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="flex-1 min-w-0">
          <SearchInput
            initialValue={filters.q}
            onSearchChange={(q) => onUpdateFilters({ q })}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 sm:flex-initial min-w-0">
            <DateFilter
              selectedDate={filters.date}
              onSelectDate={(date) => onUpdateFilters({ date })}
              onClear={() => onUpdateFilters({ date: 'all' })}
            />
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center justify-center gap-1.5 px-3 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 transition-colors shrink-0 h-10"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Secondary Row: Platform Filter channel strip */}
      <div className="pt-2 border-t border-zinc-800/50 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <PlatformFilter
          selectedPlatforms={filters.platforms}
          onTogglePlatform={handleTogglePlatform}
          onClear={() => onUpdateFilters({ platforms: [] })}
        />
      </div>
    </div>
  );
}
