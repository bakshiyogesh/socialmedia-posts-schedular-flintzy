'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { postsApi } from '../api/postsApi';
import type { Post } from '@/types';
import type { PostFormInput } from '@/features/composer/utils/validation';

export const POSTS_QUERY_KEY = ['posts'] as const;

export function usePostsQuery() {
  return useQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: () => postsApi.getPosts(),
  });
}

export function useCreatePostMutation(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PostFormInput) => postsApi.createPost(input),
    onSuccess: (newPost) => {
      queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, (old = []) => [newPost, ...old]);
      toast.success('Post scheduled successfully!', {
        description: `Scheduled for ${new Date(newPost.scheduledAt).toLocaleString()}`,
      });
      onSuccessCallback?.();
    },
    onError: (error: Error) => {
      toast.error('Failed to schedule post', {
        description: error.message || 'Please check your input and try again.',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useRetryPostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.retryPost(id),

    // 1. Optimistic Update: Immediately flip UI to 'scheduled'
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY);

      if (previousPosts) {
        queryClient.setQueryData<Post[]>(
          POSTS_QUERY_KEY,
          previousPosts.map((p) =>
            p.id === id
              ? {
                ...p,
                status: 'scheduled',
                errorMessage: undefined,
                errorType: undefined,
              }
              : p
          )
        );
      }

      toast.info('Retrying post publishing...', {
        id: `retry-${id}`,
        duration: 1500,
      });

      return { previousPosts };
    },

    // 2. Rollback on 20% simulated failure
    onError: (error: Error, id: string, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
      toast.error('Retry failed (simulated 20% error)', {
        id: `retry-${id}`,
        description: error.message || 'Gateway timeout. Reverted back to failed status.',
        duration: 4000,
      });
    },

    // 3. Success
    onSuccess: (updatedPost, id) => {
      queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, (old = []) =>
        old.map((p) => (p.id === id ? updatedPost : p))
      );
      toast.success('Post recovered and scheduled!', {
        id: `retry-${id}`,
        description: 'Publishing pipeline re-armed successfully.',
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useBulkRetryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postsApi.bulkRetry(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY);

      // Optimistically flip all failed to scheduled
      if (previousPosts) {
        queryClient.setQueryData<Post[]>(
          POSTS_QUERY_KEY,
          previousPosts.map((p) =>
            p.status === 'failed'
              ? { ...p, status: 'scheduled', errorMessage: undefined }
              : p
          )
        );
      }
      toast.loading('Retrying all failed posts in batch...', { id: 'bulk-retry' });
      return { previousPosts };
    },
    onSuccess: (data) => {
      toast.success(
        `Batch recovery complete: ${data.successful.length} recovered, ${data.failed.length} failed.`,
        { id: 'bulk-retry' }
      );
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
      toast.error('Bulk retry encountered an issue. Reverted failed states.', {
        id: 'bulk-retry',
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postsApi.deletePost(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY);
      const deletedPost = previousPosts?.find((p) => p.id === id);

      if (previousPosts) {
        queryClient.setQueryData<Post[]>(
          POSTS_QUERY_KEY,
          previousPosts.filter((p) => p.id !== id)
        );
      }

      // 5-second Undo window
      if (deletedPost) {
        toast('Post deleted', {
          description: 'Post removed from schedule.',
          action: {
            label: 'Undo',
            onClick: () => {
              queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, (old = []) => [
                deletedPost,
                ...old,
              ]);
              // Restore in store
              postsApi.createPost({
                content: deletedPost.content,
                platforms: deletedPost.platforms,
                mediaUrl: deletedPost.mediaUrl,
                scheduledAt: deletedPost.scheduledAt,
              });
              toast.success('Post restored');
            },
          },
          duration: 5000,
        });
      }

      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
      toast.error('Failed to delete post.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Post> }) =>
      postsApi.updatePost(id, updates),
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY);

      if (previousPosts) {
        queryClient.setQueryData<Post[]>(
          POSTS_QUERY_KEY,
          previousPosts.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          )
        );
      }
      return { previousPosts };
    },
    onSuccess: (updatedPost) => {
      toast.success('Post updated successfully!');
      queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, (old = []) =>
        old.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
      toast.error('Failed to save post changes.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useBulkDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      await Promise.all(ids.map((id) => postsApi.deletePost(id)));
      return ids;
    },
    onMutate: async (ids: string[]) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY);
      const deletedPosts = previousPosts?.filter((p) => ids.includes(p.id)) || [];

      if (previousPosts) {
        queryClient.setQueryData<Post[]>(
          POSTS_QUERY_KEY,
          previousPosts.filter((p) => !ids.includes(p.id))
        );
      }

      // Undo toast window for batch deletion
      if (deletedPosts.length > 0) {
        toast(`Deleted ${deletedPosts.length} posts`, {
          description: 'Posts removed from timeline.',
          action: {
            label: 'Undo',
            onClick: () => {
              queryClient.setQueryData<Post[]>(POSTS_QUERY_KEY, (old = []) => [
                ...deletedPosts,
                ...old,
              ]);
              deletedPosts.forEach((p) => {
                postsApi.createPost({
                  content: p.content,
                  platforms: p.platforms,
                  mediaUrl: p.mediaUrl,
                  scheduledAt: p.scheduledAt,
                });
              });
              toast.success(`Restored ${deletedPosts.length} posts`);
            },
          },
          duration: 6000,
        });
      }

      return { previousPosts };
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
      toast.error('Failed to delete selected posts.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}

export function useBulkRescheduleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ids, newTime }: { ids: string[]; newTime: string }) => {
      const results = await Promise.all(
        ids.map((id) =>
          postsApi.updatePost(id, {
            scheduledAt: newTime,
            status: 'scheduled',
            errorMessage: undefined,
          })
        )
      );
      return results;
    },
    onMutate: async ({ ids, newTime }) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      const previousPosts = queryClient.getQueryData<Post[]>(POSTS_QUERY_KEY);

      if (previousPosts) {
        queryClient.setQueryData<Post[]>(
          POSTS_QUERY_KEY,
          previousPosts.map((p) =>
            ids.includes(p.id)
              ? { ...p, scheduledAt: newTime, status: 'scheduled', errorMessage: undefined }
              : p
          )
        );
      }
      return { previousPosts };
    },
    onSuccess: (updatedPosts) => {
      toast.success(`Rescheduled ${updatedPosts.length} posts successfully!`, {
        description: `New slot: ${new Date(updatedPosts[0]?.scheduledAt || '').toLocaleString()}`,
      });
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.previousPosts);
      }
      toast.error('Failed to reschedule selected posts.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
    },
  });
}
