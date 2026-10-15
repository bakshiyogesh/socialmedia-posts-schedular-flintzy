import type { FilterState, Post, StatusCounts } from '@/types';

/**
 * Pure function that filters a list of posts according to platform, status, and search query.
 */
export function filterPosts(posts: Post[], filters: FilterState): Post[] {
  const query = filters.q.trim().toLowerCase();
  const hasPlatformFilter = filters.platforms.length > 0;
  const hasStatusFilter = filters.status !== 'all';

  return posts.filter((post) => {
    // 1. Status Filter
    if (hasStatusFilter && post.status !== filters.status) {
      return false;
    }

    // 2. Platform Filter (match if post targets ANY of the selected platforms)
    if (hasPlatformFilter) {
      const matchesPlatform = post.platforms.some((platform) => filters.platforms.includes(platform));
      if (!matchesPlatform) return false;
    }

    // 3. Search Query Filter (searches post content and error message)
    if (query) {
      const contentMatch = post.content.toLowerCase().includes(query);
      const errorMatch = post.errorMessage ? post.errorMessage.toLowerCase().includes(query) : false;
      const platformMatch = post.platforms.some((p) => p.toLowerCase().includes(query));
      if (!contentMatch && !errorMatch && !platformMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Computes status counts derived from the full, unfiltered post collection
 * for the top status summary strip.
 */
export function computeStatusCounts(posts: Post[]): StatusCounts {
  const counts: StatusCounts = {
    all: posts.length,
    scheduled: 0,
    published: 0,
    failed: 0,
  };

  for (const post of posts) {
    if (post.status === 'scheduled') counts.scheduled++;
    else if (post.status === 'published') counts.published++;
    else if (post.status === 'failed') counts.failed++;
  }

  return counts;
}
