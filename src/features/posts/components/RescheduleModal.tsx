'use client';

import React, { useState } from 'react';
import { Clock, X, Check } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/postsApi';
import { POSTS_QUERY_KEY } from '../hooks/usePosts';
import { DateTimePicker } from '@/features/composer/components/DateTimePicker';
import type { Post } from '@/types';
import { toast } from 'sonner';

interface RescheduleModalProps {
  post: Post | null;
  onClose: () => void;
}

export function RescheduleModal({ post, onClose }: RescheduleModalProps) {
  const queryClient = useQueryClient();
  const [scheduledAt, setScheduledAt] = useState<string>(() => {
    return post ? post.scheduledAt : new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString();
  });

  const rescheduleMutation = useMutation({
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

  // Lock background scroll while the modal is open.
  // Must run before the early return so hook order is stable across renders.
  React.useEffect(() => {
    if (!post) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [post]);

  if (!post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rescheduleMutation.mutate({ id: post.id, newTime: scheduledAt });
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
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">Reschedule Post</h3>
              <p className="text-xs text-zinc-400">Select a new future timeslot</p>
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
              disabled={rescheduleMutation.isPending}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <Check className="w-4 h-4" />
              <span>{rescheduleMutation.isPending ? 'Updating...' : 'Confirm Reschedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
