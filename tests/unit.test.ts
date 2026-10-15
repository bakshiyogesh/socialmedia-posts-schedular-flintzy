import { describe, it, expect } from 'vitest';

import {
  getCalendarDayDifference,
  getDayGroupLabel,
  groupPostsByDay,
  isFutureDate,
  combineLocalDateTimeToUtc,
} from '@/lib/time';

import {
  filterPosts,
  computeStatusCounts,
} from '@/features/filters/utils/filterPosts';

import { validatePost } from '@/features/composer/utils/validation';
import type { Post } from '@/types';

describe('Timezone & Calendar Grouping', () => {
  it('groups a 23:30 local post landing on next UTC day into "Today" for local user', () => {
    const referenceDate = new Date(2026, 9, 15, 12, 0, 0); // Oct 15, 2026 at noon local
    const latePostDate = new Date(2026, 9, 15, 23, 30, 0); // Oct 15, 2026 at 23:30 local
    const isoUtc = latePostDate.toISOString();

    const diff = getCalendarDayDifference(latePostDate, referenceDate);
    expect(diff).toBe(0);

    const label = getDayGroupLabel(isoUtc, referenceDate);
    expect(label).toBe('Today');
  });

  it('groups next-day early post (00:15 local) under "Tomorrow"', () => {
    const referenceDate = new Date(2026, 9, 15, 12, 0, 0);
    const tomorrowEarly = new Date(2026, 9, 16, 0, 15, 0);
    const isoUtc = tomorrowEarly.toISOString();

    const diff = getCalendarDayDifference(tomorrowEarly, referenceDate);
    expect(diff).toBe(1);

    const label = getDayGroupLabel(isoUtc, referenceDate);
    expect(label).toBe('Tomorrow');
  });

  it('formats upcoming dates (+3 days) with weekday name and date', () => {
    const referenceDate = new Date(2026, 9, 15, 12, 0, 0);
    const futureDate = new Date(2026, 9, 18, 14, 0, 0);
    const isoUtc = futureDate.toISOString();

    const label = getDayGroupLabel(isoUtc, referenceDate);
    expect(label).toContain('Oct 18');
  });

  it('classifies past historical posts under "Earlier"', () => {
    const referenceDate = new Date(2026, 9, 15, 12, 0, 0);
    const pastDate = new Date(2026, 9, 13, 10, 0, 0);
    const isoUtc = pastDate.toISOString();

    const label = getDayGroupLabel(isoUtc, referenceDate);
    expect(label).toBe('Earlier');
  });

  it('validates future vs past timestamps correctly', () => {
    const futureIso = new Date(Date.now() + 600000).toISOString();
    const pastIso = new Date(Date.now() - 600000).toISOString();

    expect(isFutureDate(futureIso)).toBe(true);
    expect(isFutureDate(pastIso)).toBe(false);
  });
});

describe('Filtering & Search Engine', () => {
  const mockPosts: Post[] = [
    {
      id: '1',
      content: 'X product announcement with key features',
      platforms: ['x'],
      scheduledAt: new Date(Date.now() + 10000).toISOString(),
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      content: 'Instagram video reel',
      platforms: ['instagram'],
      mediaUrl: 'https://example.com/reel.mp4',
      scheduledAt: new Date(Date.now() + 20000).toISOString(),
      status: 'failed',
      errorType: 'media_rejected',
      errorMessage: 'Dimensions violate 4:5 aspect ratio',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      content: 'Multi-channel blast across channels',
      platforms: ['x', 'facebook', 'tiktok'],
      scheduledAt: new Date(Date.now() - 50000).toISOString(),
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  it('filters strictly by status "failed"', () => {
    const result = filterPosts(mockPosts, { platforms: [], status: 'failed', q: '' });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('2');
  });

  it('filters by platform: matches if post targets ANY selected platform', () => {
    const result = filterPosts(mockPosts, {
      platforms: ['facebook'],
      status: 'all',
      q: '',
    });
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('3');
  });

  it('searches across both copy content and error message case-insensitively', () => {
    const contentMatch = filterPosts(mockPosts, {
      platforms: [],
      status: 'all',
      q: 'ANNOUNCEMENT',
    });
    expect(contentMatch).toHaveLength(1);
    expect(contentMatch[0]?.id).toBe('1');

    const errorMatch = filterPosts(mockPosts, {
      platforms: [],
      status: 'all',
      q: 'aspect ratio',
    });
    expect(errorMatch).toHaveLength(1);
    expect(errorMatch[0]?.id).toBe('2');
  });

  it('computes status counts derived from full unfiltered collection', () => {
    const counts = computeStatusCounts(mockPosts);
    expect(counts).toEqual({
      all: 3,
      scheduled: 1,
      published: 1,
      failed: 1,
    });
  });
});

describe('Pre-Flight Validation & Platform Limits', () => {
  it('blocks scheduling when content exceeds X character limit (280 chars)', () => {
    const longTweet = 'A'.repeat(281);
    const result = validatePost({
      content: longTweet,
      platforms: ['x'],
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });

    expect(result.isValid).toBe(false);
    expect(
      result.blockers.some((b) => b.message.includes('exceeds character limit by 1 chars'))
    ).toBe(true);
  });

  it('blocks scheduling when Instagram or TikTok is missing required media', () => {
    const resultInstagram = validatePost({
      content: 'Caption without image',
      platforms: ['instagram'],
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(resultInstagram.isValid).toBe(false);
    expect(
      resultInstagram.blockers.some((b) => b.message.includes('requires media'))
    ).toBe(true);

    const resultTikTok = validatePost({
      content: 'Caption without video',
      platforms: ['tiktok'],
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(resultTikTok.isValid).toBe(false);
    expect(
      resultTikTok.blockers.some((b) => b.message.includes('requires media'))
    ).toBe(true);
  });

  it('permits X and Facebook without media if within character limits', () => {
    const result = validatePost({
      content: 'Text-only update for X and Facebook',
      platforms: ['x', 'facebook'],
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(result.isValid).toBe(true);
    expect(result.blockers).toHaveLength(0);
  });

  it('blocks scheduling if scheduled time is in the past', () => {
    const pastUtc = new Date(Date.now() - 3600000).toISOString();
    const result = validatePost({
      content: 'Valid content',
      platforms: ['x'],
      scheduledAt: pastUtc,
    });
    expect(result.isValid).toBe(false);
    expect(
      result.blockers.some((b) => b.message.includes('must be in the future'))
    ).toBe(true);
  });
});
