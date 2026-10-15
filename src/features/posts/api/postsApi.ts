import type { Post } from '@/types';
import type { PostFormInput } from '@/features/composer/utils/validation';

export const postsApi = {
  async getPosts(): Promise<Post[]> {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch posts: ${res.statusText}`);
    }
    return res.json();
  },

  async createPost(input: PostFormInput): Promise<Post> {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to create post' }));
      throw new Error(err.error || 'Failed to create post');
    }
    return res.json();
  },

  async updatePost(id: string, updates: Partial<Post>): Promise<Post> {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      throw new Error('Failed to update post');
    }
    return res.json();
  },

  async deletePost(id: string): Promise<{ success: boolean; id: string }> {
    const res = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('Failed to delete post');
    }
    return res.json();
  },

  async retryPost(id: string): Promise<Post> {
    const res = await fetch(`/api/posts/${id}/retry`, {
      method: 'POST',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Retry failed' }));
      throw new Error(err.error || 'Retry attempt failed');
    }
    return res.json();
  },

  async bulkRetry(): Promise<{ successful: string[]; failed: string[] }> {
    const res = await fetch('/api/posts/bulk-retry', {
      method: 'POST',
    });
    if (!res.ok) {
      throw new Error('Bulk retry failed');
    }
    return res.json();
  },
};
