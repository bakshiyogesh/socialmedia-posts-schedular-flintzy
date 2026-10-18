import type { FilterState, Post, StatusCounts } from '@/types';

export function matchesDateFilter(scheduledAtIso: string, dateFilter?: string): boolean {
  if (!dateFilter || dateFilter === 'all') return true;
  const d = new Date(scheduledAtIso);
  if (isNaN(d.getTime())) return false;

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const postDateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  if (dateFilter === 'today') {
    return postDateKey === todayKey;
  }

  if (dateFilter === 'tomorrow') {
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowKey = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
    return postDateKey === tomorrowKey;
  }

  if (dateFilter === 'this_week') {
    // Current local week Sunday 00:00:00 through Saturday 23:59:59
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay(), 0, 0, 0, 0);
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()), 23, 59, 59, 999);
    return d >= startOfWeek && d <= endOfWeek;
  }

  if (dateFilter === 'this_month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }

  if (dateFilter === 'earlier' || dateFilter === 'past') {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    return d < startOfToday;
  }

  // Exact date YYYY-MM-DD match
  return postDateKey === dateFilter;
}

/**
 * Pure function that filters a list of posts according to platform, status, search query, and date.
 */
export function filterPosts(posts: Post[], filters: FilterState): Post[] {
  const query = filters.q.trim().toLowerCase();
  const hasPlatformFilter = filters.platforms.length > 0;
  const hasStatusFilter = filters.status !== 'all';
  const hasDateFilter = Boolean(filters.date && filters.date !== 'all');

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

    // 4. Date Filter
    if (hasDateFilter) {
      if (!matchesDateFilter(post.scheduledAt, filters.date)) {
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
