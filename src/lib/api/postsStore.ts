import { SEED_POSTS } from '@/mocks/seed-data';
import type { Post } from '@/types';

// In-memory persistent store across hot reloads in dev
declare global {
  var __FLINTZY_POSTS_STORE__: Post[] | undefined;
}

function getStore(): Post[] {
  if (!global.__FLINTZY_POSTS_STORE__) {
    // Clone seed posts to allow mutations
    global.__FLINTZY_POSTS_STORE__ = JSON.parse(JSON.stringify(SEED_POSTS));
  }
  return global.__FLINTZY_POSTS_STORE__!;
}

export const postsStore = {
  getAll(): Post[] {
    return getStore();
  },

  getById(id: string): Post | undefined {
    return getStore().find((p) => p.id === id);
  },

  create(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post {
    const store = getStore();
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.unshift(newPost);
    return newPost;
  },

  update(id: string, updates: Partial<Post>): Post | null {
    const store = getStore();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) return null;

    store[index] = {
      ...store[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return store[index];
  },

  delete(id: string): boolean {
    const store = getStore();
    const index = store.findIndex((p) => p.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  },

  retry(id: string): { post: Post | null; success: boolean; error?: string } {
    const post = this.getById(id);
    if (!post) {
      return { post: null, success: false, error: 'Post not found' };
    }

    // 20% chance of failure as required by assignment specification
    const isFailure = Math.random() < 0.2;
    if (isFailure) {
      return {
        post,
        success: false,
        error: 'Platform Gateway 500: Temporary upstream timeout. The social provider rejected the request. Please retry.',
      };
    }

    // Success: flip status to scheduled and clear errors
    const updated = this.update(id, {
      status: 'scheduled',
      errorMessage: undefined,
      errorType: undefined,
    });

    return { post: updated, success: true };
  },

  bulkRetry(): { successful: string[]; failed: string[] } {
    const store = getStore();
    const failedPosts = store.filter((p) => p.status === 'failed');
    const successful: string[] = [];
    const failed: string[] = [];

    for (const p of failedPosts) {
      const result = this.retry(p.id);
      if (result.success) {
        successful.push(p.id);
      } else {
        failed.push(p.id);
      }
    }

    return { successful, failed };
  },

  reset(): void {
    global.__FLINTZY_POSTS_STORE__ = JSON.parse(JSON.stringify(SEED_POSTS));
  },
};
