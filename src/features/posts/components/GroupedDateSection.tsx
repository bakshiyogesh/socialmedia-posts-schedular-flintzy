'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { PostCard } from './PostCard';
import type { DayGroup } from '@/lib/time';
import type { Post } from '@/types';

interface GroupedDateSectionProps {
  group: DayGroup;
  onDuplicate?: (post: Post) => void;
  onReschedule?: (post: Post) => void;
  onReconnect?: (post: Post) => void;
  onFixDimensions?: (post: Post) => void;
}

export function GroupedDateSection({
  group,
  onDuplicate,
  onReschedule,
  onReconnect,
  onFixDimensions,
}: GroupedDateSectionProps) {
  const isToday = group.label === 'Today';
  const isTomorrow = group.label === 'Tomorrow';
  const isEarlier = group.label === 'Earlier';

  return (
    <section className="space-y-3" aria-labelledby={`heading-${group.label}`}>
      {/* Date Header Pill */}
      <div className="sticky top-16 z-10 py-2 bg-zinc-950/90 backdrop-blur-md flex items-center justify-between border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          <h2
            id={`heading-${group.label}`}
            className="text-sm font-semibold tracking-wide flex items-center gap-2"
          >
            <span
              className={
                isToday
                  ? 'text-indigo-400 font-bold'
                  : isTomorrow
                  ? 'text-cyan-400 font-bold'
                  : isEarlier
                  ? 'text-zinc-400'
                  : 'text-zinc-200'
              }
            >
              {group.label}
            </span>
          </h2>
        </div>

        <span className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full font-mono">
          {group.posts.length} {group.posts.length === 1 ? 'post' : 'posts'}
        </span>
      </div>

      {/* Posts in Group */}
      <div className="grid grid-cols-1 gap-3 w-full min-w-0">
        {group.posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onDuplicate={onDuplicate}
            onReschedule={onReschedule}
            onReconnect={onReconnect}
            onFixDimensions={onFixDimensions}
          />
        ))}
      </div>
    </section>
  );
}
