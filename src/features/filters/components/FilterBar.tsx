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
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl">
      {/* Search Input */}
      <SearchInput
        initialValue={filters.q}
        onSearchChange={(q) => onUpdateFilters({ q })}
      />

      {/* Date & Platform Filters + Reset */}
      <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
        <DateFilter
          selectedDate={filters.date}
          onSelectDate={(date) => onUpdateFilters({ date })}
          onClear={() => onUpdateFilters({ date: 'all' })}
        />

        <PlatformFilter
          selectedPlatforms={filters.platforms}
          onTogglePlatform={handleTogglePlatform}
          onClear={() => onUpdateFilters({ platforms: [] })}
        />

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent hover:border-zinc-700 transition-colors"
            title="Reset all active filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
