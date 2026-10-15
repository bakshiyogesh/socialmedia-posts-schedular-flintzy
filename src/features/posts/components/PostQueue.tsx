'use client';

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { GroupedDateSection } from './GroupedDateSection';
import { EmptyState } from './EmptyState';
import { PostQueueSkeleton } from './PostQueueSkeleton';
import { groupPostsByDay } from '@/lib/time';
import type { Post } from '@/types';

interface PostQueueProps {
  posts: Post[];
  isLoading: boolean;
  isError: boolean;
  onRetryQuery?: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  onOpenComposer: () => void;
  selectedPostIds?: string[];
  onToggleSelectPost?: (id: string) => void;
  onEditPost?: (post: Post) => void;
  onDuplicatePost: (post: Post) => void;
  onReschedulePost?: (post: Post) => void;
  onReconnectAccount?: (post: Post) => void;
  onFixDimensions?: (post: Post) => void;
}

export function PostQueue({
  posts,
  isLoading,
  isError,
  onRetryQuery,
  hasFilters,
  onClearFilters,
  onOpenComposer,
  selectedPostIds = [],
  onToggleSelectPost,
  onEditPost,
  onDuplicatePost,
  onReschedulePost,
  onReconnectAccount,
  onFixDimensions,
}: PostQueueProps) {
  if (isLoading) {
    return <PostQueueSkeleton />;
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="p-8 text-center rounded-2xl border border-rose-900/50 bg-rose-950/20"
      >
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-rose-200">
          Failed to load posts queue
        </h3>
        <p className="text-xs text-rose-300/80 mt-1 mb-4">
          Could not communicate with the scheduling API service.
        </p>
        {onRetryQuery && (
          <button
            type="button"
            onClick={onRetryQuery}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    );
  }

  if (posts.length === 0) {
    if (hasFilters) {
      return <EmptyState type="no-results" onAction={onClearFilters} />;
    }
    return <EmptyState type="no-posts" onAction={onOpenComposer} />;
  }

  const groups = groupPostsByDay(posts);

  return (
    <div className="space-y-8" aria-label="Grouped posts list">
      {groups.map((group) => (
        <GroupedDateSection
          key={group.label}
          group={group}
          selectedPostIds={selectedPostIds}
          onToggleSelect={onToggleSelectPost}
          onEdit={onEditPost}
          onDuplicate={onDuplicatePost}
          onReschedule={onReschedulePost}
          onReconnect={onReconnectAccount}
          onFixDimensions={onFixDimensions}
        />
      ))}
    </div>
  );
}
