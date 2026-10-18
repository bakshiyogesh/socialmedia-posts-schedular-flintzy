'use client';

import React, { useState } from 'react';
import { Clock, X, Check, CalendarClock } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/postsApi';
import { POSTS_QUERY_KEY, useBulkRescheduleMutation } from '../hooks/usePosts';
import { DateTimePicker } from '@/features/composer/components/DateTimePicker';
import type { Post } from '@/types';
import { toast } from 'sonner';

interface RescheduleModalProps {
  post: Post | null;
  postIds?: string[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function RescheduleModal({ post, postIds = [], onClose, onSuccess }: RescheduleModalProps) {
  const queryClient = useQueryClient();
  const bulkRescheduleMutation = useBulkRescheduleMutation();
  const isBulk = postIds.length > 0;
  const isMultiplePosts = postIds.length > 1;
  const postPronoun = isMultiplePosts ? 'Posts' : 'Post';

  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    return post ? post.scheduledAt : new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString();
  });

  const singleRescheduleMutation = useMutation({
    mutationFn: ({ id, newTime }: { id: string; newTime: string }) =>
      postsApi.updatePost(id, { scheduledAt: newTime, status: 'scheduled', errorMessage: undefined }),
    onMutate: async ({ id, newTime }) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previous = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY);
      if (previous) {
        queryClient.setQueryData<Post[]>(
          POSTS_QUERY_KEY,
          previous.map((p) =>
            p.id === id ? { ...p, scheduledAt: newTime, status: 'scheduled', errorMessage: undefined } : p
          )
        );
      }
      return { previous };
    },
    onSuccess: (updated) => {
      toast.success('Post rescheduled successfully!', {
        description: `New slot: ${new Date(updated.scheduledAt).toLocaleString()}`,
      });
      onSuccess?.();
      onClose();
    },
    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previous);
      }
      toast.error('Failed to reschedule post.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });

  const isPending = singleRescheduleMutation.isPending || bulkRescheduleMutation.isPending;

  // Lock background scroll while the modal is open.
  React.useEffect(() => {
    if (!post && !isBulk) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [post, isBulk]);

  if (!post && !isBulk) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBulk) {
      bulkRescheduleMutation.mutate(
        { ids: postIds, newTime: scheduledAt },
        {
          onSuccess: () => {
            onSuccess?.();
            onClose();
          },
        }
      );
    } else if (post) {
      singleRescheduleMutation.mutate({ id: post.id, newTime: scheduledAt });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
    >
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {isBulk && postIds.length > 1 ? <CalendarClock className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                {isBulk && postIds.length > 1 ? `Reschedule ${postIds.length} Posts` : 'Reschedule Post'}
              </h3>
              <p className="text-xs text-zinc-400">
                {isBulk && postIds.length > 1 ? 'Set a new future publishing timeslot for all selected items' : 'Select a new future timeslot'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <DateTimePicker
            scheduledAtUtc={scheduledAt}
            onChange={(utc) => setScheduledAt(utc)}
          />

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <Check className="w-4 h-4" />
              <span>
                {isPending
                  ? 'Updating...'
                  : isBulk
                    ? `Reschedule ${isMultiplePosts ? `${postIds.length} ` : ''} ${postPronoun}`
                    : 'Confirm Reschedule'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
