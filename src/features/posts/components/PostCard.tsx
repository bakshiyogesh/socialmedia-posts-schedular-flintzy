'use client';

import React, { useState } from 'react';
import { RefreshCw, Trash2, Copy, AlertCircle, Key, ImageOff, Zap, CalendarClock, Clock, Edit3 } from 'lucide-react';
import { PlatformIcon } from '@/components/shared/PlatformIcons';
import { StatusBadge } from './StatusBadge';
import { formatLocalDateTimeWithTz } from '@/lib/time';
import { useRetryPostMutation, useDeletePostMutation } from '../hooks/usePosts';
import { PLATFORMS } from '@/config/platforms';
import type { Post, ErrorCategory } from '@/types';

interface PostCardProps {
  post: Post;
  onDuplicate?: (post: Post) => void;
  onReschedule?: (post: Post) => void;
  onReconnect?: (post: Post) => void;
  onFixDimensions?: (post: Post) => void;
}

export function PostCard({
  post,
  onDuplicate,
  onReschedule,
  onReconnect,
  onFixDimensions,
}: PostCardProps) {
  const retryMutation = useRetryPostMutation();
  const deleteMutation = useDeletePostMutation();
  const [imgError, setImgError] = useState(false);

  const isRetrying = retryMutation.isPending && retryMutation.variables === post.id;
  const isFailed = post.status === 'failed';

  const handleRetry = () => {
    retryMutation.mutate(post.id);
  };

  const handleDelete = () => {
    deleteMutation.mutate(post.id);
  };

  const getErrorTypeConfig = (type?: ErrorCategory) => {
    switch (type) {
      case 'token_expired':
        return {
          label: 'OAuth Expired',
          icon: Key,
          ctaText: 'Reconnect Token',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          onAction: () => onReconnect?.(post),
        };
      case 'media_rejected':
        return {
          label: 'Media Rejected',
          icon: ImageOff,
          ctaText: 'Fix Dimensions',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          onAction: () => onFixDimensions?.(post),
        };
      case 'rate_limited':
        return {
          label: 'API Rate Limited',
          icon: Zap,
          ctaText: 'Reschedule Slot',
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          onAction: () => onReschedule?.(post),
        };
      default:
        return {
          label: 'Publishing Error',
          icon: AlertCircle,
          ctaText: 'Troubleshoot',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          onAction: handleRetry,
        };
    }
  };

  const errorConfig = getErrorTypeConfig(post.errorType);
  const ErrorIcon = errorConfig.icon;

  return (
    <div
      className={`group relative rounded-xl border p-4 sm:p-5 transition-all duration-200 overflow-hidden w-full ${
        isFailed
          ? 'bg-rose-950/15 border-rose-900/40 hover:border-rose-700/60'
          : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-900/90'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        {/* Platforms & Scheduled Time */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 bg-zinc-950/80 px-2.5 py-1 rounded-lg border border-zinc-800">
            {post.platforms.map((pid) => (
              <span
                key={pid}
                title={PLATFORMS[pid]?.name}
                className="hover:scale-110 transition-transform"
              >
                <PlatformIcon platform={pid} size={15} />
              </span>
            ))}
          </div>

          <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
            <CalendarClock className="w-3.5 h-3.5 text-zinc-500" />
            {formatLocalDateTimeWithTz(post.scheduledAt)}
          </span>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-2">
          <StatusBadge status={post.status} />

          {/* Quick Actions Menu */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {onReschedule && (
              <button
                type="button"
                onClick={() => onReschedule(post)}
                className="p-1.5 text-zinc-400 hover:text-indigo-300 hover:bg-zinc-800 rounded-md transition-colors"
                title="Reschedule post"
                aria-label="Reschedule post"
              >
                <Clock className="w-3.5 h-3.5" />
              </button>
            )}

            {onDuplicate && (
              <button
                type="button"
                onClick={() => onDuplicate(post)}
                className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
                title="Duplicate post to composer"
                aria-label="Duplicate post"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-md transition-colors"
              title="Delete post"
              aria-label="Delete post"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content & Thumbnail */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between w-full">
        <div className="flex-1 min-w-0 space-y-2 w-full">
          <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
            {post.content}
          </p>

          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>{post.content.length} characters</span>
            {post.mediaUrl && <span>• 1 attachment</span>}
          </div>
        </div>

        {/* Optional Media Thumbnail */}
        {post.mediaUrl && (
          <div className="relative w-full sm:w-32 h-44 sm:h-28 rounded-xl overflow-hidden border border-zinc-800 shrink-0 bg-zinc-950 flex items-center justify-center self-start shadow-md">
            {!imgError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.mediaUrl}
                alt="Post attachment preview"
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2 text-center text-zinc-500 text-[10px] w-full h-full">
                <ImageOff className="w-4 h-4 mb-1 text-zinc-600" />
                <span>Preview unavailable</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Failure Recovery Strip */}
      {isFailed && (
        <div className="mt-4 pt-3 border-t border-rose-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${errorConfig.bg}`}
            >
              <ErrorIcon className="w-3 h-3" />
              {errorConfig.label}
            </span>
            <p className="text-xs text-rose-300/90 line-clamp-1" title={post.errorMessage}>
              {post.errorMessage}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Contextual CTA (e.g. Reconnect Token, Fix Dimensions, Reschedule Slot) */}
            <button
              type="button"
              onClick={errorConfig.onAction}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium border border-zinc-700 transition-colors"
            >
              {errorConfig.ctaText}
            </button>

            {/* Direct Optimistic Retry Button */}
            <button
              type="button"
              onClick={handleRetry}
              disabled={isRetrying}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white rounded-lg text-xs font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-label={`Retry failed post ${post.id}`}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`}
                aria-hidden="true"
              />
              <span>{isRetrying ? 'Retrying (1s)...' : 'Retry Now'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
