'use client';

import React from 'react';
import { Layers, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { PostStatus, StatusCounts } from '@/types';

interface StatusSummaryStripProps {
  counts: StatusCounts;
  activeStatus: PostStatus | 'all';
  onSelectStatus: (status: PostStatus | 'all') => void;
}

export function StatusSummaryStrip({
  counts,
  activeStatus,
  onSelectStatus,
}: StatusSummaryStripProps) {
  const tabs = [
    {
      id: 'all' as const,
      label: 'All Posts',
      count: counts.all,
      icon: Layers,
      color: 'text-zinc-300',
      activeBg: 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-sm',
    },
    {
      id: 'scheduled' as const,
      label: 'Scheduled',
      count: counts.scheduled,
      icon: Clock,
      color: 'text-indigo-400',
      activeBg: 'bg-indigo-950/60 text-indigo-200 border-indigo-700/80 shadow-sm shadow-indigo-950',
    },
    {
      id: 'published' as const,
      label: 'Published',
      count: counts.published,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      activeBg: 'bg-emerald-950/60 text-emerald-200 border-emerald-700/80 shadow-sm shadow-emerald-950',
    },
    {
      id: 'failed' as const,
      label: 'Failed',
      count: counts.failed,
      icon: AlertTriangle,
      color: 'text-rose-400',
      activeBg: 'bg-rose-950/60 text-rose-200 border-rose-700/80 shadow-sm shadow-rose-950',
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filter posts by publishing status"
      className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeStatus === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelectStatus(tab.id)}
            className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
              isActive
                ? `${tab.activeBg} ring-1 ring-zinc-700`
                : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:bg-zinc-900/80 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${tab.color}`} aria-hidden="true" />
              <span className="text-xs font-medium">{tab.label}</span>
            </div>
            <span
              className={`text-sm font-semibold font-mono ${
                isActive ? 'text-zinc-100' : 'text-zinc-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
