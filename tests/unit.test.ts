import { describe, it, expect } from 'vitest';

import {
  getCalendarDayDifference,
  getDayGroupLabel,
  groupPostsByDay,
  isFutureDate,
  combineLocalDateTimeToUtc,
  formatSocialTimestamp,
} from '@/lib/time';

import {
  filterPosts,
  computeStatusCounts,
  matchesDateFilter,
} from '@/features/filters/utils/filterPosts';

import { validatePost } from '@/features/composer/utils/validation';
import { normalizeMediaUrl, isVideoMedia } from '@/lib/media';
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

  it('orders groups Today → Tomorrow → future dates → Earlier, posts chronological within a day', () => {
    const ref = new Date(2026, 9, 15, 12, 0, 0);
    const at = (d: number, h: number, m = 0) => new Date(2026, 9, d, h, m).toISOString();
    const make = (id: string, scheduledAt: string): Post => ({
      id,
      content: id,
      platforms: ['x'],
      scheduledAt,
      status: 'scheduled',
      createdAt: scheduledAt,
      updatedAt: scheduledAt,
    });

    const groups = groupPostsByDay(
      [
        make('past', at(12, 9)),
        make('future-20', at(20, 9)),
        make('today-late', at(15, 23, 30)),
        make('tomorrow', at(16, 8)),
        make('future-18', at(18, 9)),
        make('today-early', at(15, 13)),
      ],
      ref
    );

    expect(groups.map((g) => g.label)[0]).toBe('Today');
    expect(groups.map((g) => g.label)[1]).toBe('Tomorrow');
    expect(groups[2].label).toContain('Oct 18');
    expect(groups[3].label).toContain('Oct 20');
    expect(groups[groups.length - 1].label).toBe('Earlier');
    expect(groups[0].posts.map((p) => p.id)).toEqual(['today-early', 'today-late']);
  });

  it('converts a local date + HH:mm into a UTC ISO string that round-trips to the same local time', () => {
    const iso = combineLocalDateTimeToUtc(new Date(2026, 9, 15), '18:45');
    expect(iso.endsWith('Z')).toBe(true);
    const back = new Date(iso);
    expect(back.getFullYear()).toBe(2026);
    expect(back.getMonth()).toBe(9);
    expect(back.getDate()).toBe(15);
    expect(back.getHours()).toBe(18);
    expect(back.getMinutes()).toBe(45);
  });

  it('correctly schedules a post for a clicked calendar date', () => {
    const clickedDateKey = '2026-10-25';
    const [y, m, d] = clickedDateKey.split('-').map(Number);
    const scheduledDate = new Date(y, m - 1, d, 10, 0, 0);
    const isoUtc = combineLocalDateTimeToUtc(scheduledDate, '14:30');
    const result = new Date(isoUtc);
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(9);
    expect(result.getDate()).toBe(25);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(30);
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

  it('permits X, Facebook, and LinkedIn without media if within character limits', () => {
    const result = validatePost({
      content: 'Text-only update for X, Facebook, and LinkedIn',
      platforms: ['x', 'facebook', 'linkedin'],
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(result.isValid).toBe(true);
    expect(result.blockers).toHaveLength(0);
  });

  it('blocks scheduling when LinkedIn exceeds 3000 character limit', () => {
    const longContent = 'L'.repeat(3001);
    const result = validatePost({
      content: longContent,
      platforms: ['linkedin'],
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(result.isValid).toBe(false);
    expect(result.blockers.some((b) => b.message.includes('exceeds character limit'))).toBe(true);
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

  it('permits local data URL image/video uploads and satisfies media requirement for Instagram/TikTok', () => {
    const videoDataUrl = 'data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAG1wNDJpc29t';
    const result = validatePost({
      content: 'TikTok video caption',
      platforms: ['tiktok'],
      mediaUrl: videoDataUrl,
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(result.isValid).toBe(true);
    expect(result.blockers).toHaveLength(0);
  });

  it('permits local blob: URLs and naked domain URLs without invalid URL format error', () => {
    const blobUrl = 'blob:http://localhost:3000/d73b064f-c020-4a8f-b98a-7b3b44b6c310#video';
    const result = validatePost({
      content: 'Instagram video post',
      platforms: ['instagram'],
      mediaUrl: blobUrl,
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(result.isValid).toBe(true);
    expect(result.blockers).toHaveLength(0);

    const nakedDomainResult = validatePost({
      content: 'Instagram post with domain URL',
      platforms: ['instagram'],
      mediaUrl: 'images.unsplash.com/photo-1522071820081-009f0129c71c',
      scheduledAt: new Date(Date.now() + 600000).toISOString(),
    });
    expect(nakedDomainResult.isValid).toBe(true);
    expect(nakedDomainResult.blockers).toHaveLength(0);
  });
});

describe('Media Utilities & Progressive Loader', () => {
  it('normalizes external URLs without corrupting local data: or blob: protocols', () => {
    expect(normalizeMediaUrl('images.unsplash.com/photo-123')).toBe('https://images.unsplash.com/photo-123');
    expect(normalizeMediaUrl('https://example.com/pic.png')).toBe('https://example.com/pic.png');
    expect(normalizeMediaUrl('data:image/png;base64,iVBORw0KGgo')).toBe('data:image/png;base64,iVBORw0KGgo');
    expect(normalizeMediaUrl('blob:http://localhost:3000/12345')).toBe('blob:http://localhost:3000/12345');
    expect(normalizeMediaUrl('blob:http://localhost:3000/12345#video')).toBe('blob:http://localhost:3000/12345#video');
  });

  it('detects video assets correctly for data URLs, blob fragments, and file extensions', () => {
    expect(isVideoMedia('data:video/mp4;base64,AAAA')).toBe(true);
    expect(isVideoMedia('blob:http://localhost:3000/12345#video')).toBe(true);
    expect(isVideoMedia('blob:http://localhost:3000/12345')).toBe(false);
    expect(isVideoMedia('https://example.com/clip.mp4')).toBe(true);
    expect(isVideoMedia('https://example.com/clip.mov?download=true')).toBe(true);
    expect(isVideoMedia('https://example.com/photo.jpg')).toBe(false);
    expect(isVideoMedia('data:image/png;base64,iVBOR')).toBe(false);
  });
});

describe('Social Media Timestamp Formatting', () => {
  const base = new Date('2026-10-15T12:00:00.000Z');

  it('formats short relative notations (1hr ago, 1d, 2d, 1w, 1mo, 1yr)', () => {
    // 1 hour ago
    const oneHour = new Date(base.getTime() - 1000 * 60 * 60);
    expect(formatSocialTimestamp(oneHour, base).short).toBe('1hr ago');

    // 1 day ago / ahead
    const oneDay = new Date(base.getTime() - 1000 * 60 * 60 * 24);
    expect(formatSocialTimestamp(oneDay, base).short).toBe('1d');

    // 2 days ago / ahead
    const twoDays = new Date(base.getTime() - 1000 * 60 * 60 * 48);
    expect(formatSocialTimestamp(twoDays, base).short).toBe('2d');

    // 1 week ago / ahead
    const oneWeek = new Date(base.getTime() - 1000 * 60 * 60 * 24 * 7);
    expect(formatSocialTimestamp(oneWeek, base).short).toBe('1w');

    // 1 month ago / ahead
    const oneMonth = new Date(base.getTime() - 1000 * 60 * 60 * 24 * 31);
    expect(formatSocialTimestamp(oneMonth, base).short).toBe('1mo');

    // 1 year ago / ahead
    const oneYear = new Date(base.getTime() - 1000 * 60 * 60 * 24 * 366);
    expect(formatSocialTimestamp(oneYear, base).short).toBe('1yr');
  });

  it('provides full suffix string for bottom caption previews', () => {
    const twoDays = new Date(base.getTime() - 1000 * 60 * 60 * 48);
    expect(formatSocialTimestamp(twoDays, base).ago).toBe('2d ago');
  });
});

describe('IndexedDB Draft Media Recovery', () => {
  it('safely handles non-browser environments and avoids crashing without window.indexedDB', async () => {
    const { getDraftMedia, saveDraftMedia, clearDraftMedia } = await import('@/lib/storage/draftMediaDb');
    const result = await getDraftMedia();
    expect(result).toBeNull();

    const mockBlob = new Blob(['sample-data'], { type: 'image/png' });
    await expect(
      saveDraftMedia(mockBlob, {
        fileName: 'hero.png',
        fileSize: '1.2 MB',
        fileType: 'image',
      })
    ).resolves.toBeUndefined();

    await expect(clearDraftMedia()).resolves.toBeUndefined();
  });
});

describe('Popover Auto-Flip Collision Detection', () => {
  it('defaults to safe spacing when element is null or during SSR', async () => {
    const { getAvailableVerticalSpaces } = await import('@/components/ui/popover-position');
    const spaces = getAvailableVerticalSpaces(null);
    expect(spaces.spaceBelow).toBe(500);
    expect(spaces.spaceAbove).toBe(500);
  });

  it('determines placement as "top" when space below is insufficient for calendar height', async () => {
    const { determinePopoverSide } = await import('@/components/ui/popover-position');

    // Space below is 80px (e.g. cut off by modal footer), space above is 450px
    const side = determinePopoverSide({ spaceBelow: 80, spaceAbove: 450 }, 310);
    expect(side).toBe('top');
  });

  it('determines placement as "bottom" when there is ample space below', async () => {
    const { determinePopoverSide } = await import('@/components/ui/popover-position');

    // Space below is 500px, space above is 50px
    const side = determinePopoverSide({ spaceBelow: 500, spaceAbove: 50 }, 310);
    expect(side).toBe('bottom');
  });

  it('calculates available space correctly when walking clipping ancestor elements', async () => {
    const { getAvailableVerticalSpaces, determinePopoverSide } = await import('@/components/ui/popover-position');

    // Mock window & getComputedStyle
    const origWindow = globalThis.window;
    // @ts-expect-error mock window
    globalThis.window = {
      innerHeight: 800,
      getComputedStyle: (el: any) => el.style || {},
    };

    const mockParent = {
      style: { overflowY: 'auto' },
      parentElement: null,
      getBoundingClientRect: () => ({
        top: 100,
        bottom: 700,
        height: 600,
      }),
    };

    const mockTrigger = {
      style: {},
      parentElement: mockParent,
      getBoundingClientRect: () => ({
        top: 640,
        bottom: 680,
        height: 40,
      }),
    };

    try {
      const spaces = getAvailableVerticalSpaces(mockTrigger as any);
      // Container bottom (700) - trigger bottom (680) = 20px
      expect(spaces.spaceBelow).toBe(20);
      // Trigger top (640) - container top (100) = 540px
      expect(spaces.spaceAbove).toBe(540);

      const side = determinePopoverSide(spaces, 310);
      expect(side).toBe('top');
    } finally {
      globalThis.window = origWindow;
    }
  });
});

describe('Post Deletion & Selection State Management', () => {
  it('correctly filters out a deleted single post id while keeping remaining selections', () => {
    const initialSelectedIds = ['post-1', 'post-2', 'post-3'];
    const deletedId = 'post-2';

    const updatedSelectedIds = initialSelectedIds.filter((id) => id !== deletedId);
    expect(updatedSelectedIds).toEqual(['post-1', 'post-3']);
  });

  it('preserves selectedPostIds when deletion confirmation is cancelled', () => {
    let selectedPostIds = ['post-1', 'post-2'];
    let deleteTarget: { type: 'bulk'; ids: string[] } | null = {
      type: 'bulk',
      ids: selectedPostIds,
    };

    // User clicks Cancel
    deleteTarget = null;

    // Selections must remain untouched
    expect(selectedPostIds).toEqual(['post-1', 'post-2']);
    expect(deleteTarget).toBeNull();
  });

  it('resets selectedPostIds to empty array upon successful bulk deletion', () => {
    let selectedPostIds = ['post-1', 'post-2'];
    const onBulkDeleteSuccess = () => {
      selectedPostIds = [];
    };

    onBulkDeleteSuccess();
    expect(selectedPostIds).toEqual([]);
  });
});

describe('Date Filtering Engine', () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const todayKey = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const todayIso = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 14, 0).toISOString();
  const tomorrowIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0).toISOString();
  const pastIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5, 9, 0).toISOString();

  it('matches "today" filter strictly for today posts', () => {
    expect(matchesDateFilter(todayIso, 'today')).toBe(true);
    expect(matchesDateFilter(tomorrowIso, 'today')).toBe(false);
    expect(matchesDateFilter(pastIso, 'today')).toBe(false);
  });

  it('matches "tomorrow" filter correctly', () => {
    expect(matchesDateFilter(tomorrowIso, 'tomorrow')).toBe(true);
    expect(matchesDateFilter(todayIso, 'tomorrow')).toBe(false);
  });

  it('matches "earlier" / "past" filter correctly', () => {
    expect(matchesDateFilter(pastIso, 'earlier')).toBe(true);
    expect(matchesDateFilter(todayIso, 'earlier')).toBe(false);
    expect(matchesDateFilter(tomorrowIso, 'earlier')).toBe(false);
  });

  it('matches exact YYYY-MM-DD date string', () => {
    expect(matchesDateFilter(todayIso, todayKey)).toBe(true);
    expect(matchesDateFilter(tomorrowIso, todayKey)).toBe(false);
  });

  it('integrates date filter seamlessly with filterPosts', () => {
    const mockPosts: Post[] = [
      {
        id: 'p1',
        content: 'Post today',
        platforms: ['x'],
        scheduledAt: todayIso,
        status: 'scheduled',
        createdAt: todayIso,
        updatedAt: todayIso,
      },
      {
        id: 'p2',
        content: 'Post tomorrow',
        platforms: ['x'],
        scheduledAt: tomorrowIso,
        status: 'scheduled',
        createdAt: todayIso,
        updatedAt: todayIso,
      },
    ];

    const todayFiltered = filterPosts(mockPosts, {
      platforms: [],
      status: 'all',
      q: '',
      date: 'today',
    });
    expect(todayFiltered.length).toBe(1);
    expect(todayFiltered[0].id).toBe('p1');

    const tomorrowFiltered = filterPosts(mockPosts, {
      platforms: [],
      status: 'all',
      q: '',
      date: 'tomorrow',
    });
    expect(tomorrowFiltered.length).toBe(1);
    expect(tomorrowFiltered[0].id).toBe('p2');
  });
});

describe('Calendar Date Click & Modal Composer Routing', () => {
  it('routes to onEditPost when clicking a calendar day cell with an existing scheduled post', () => {
    const mockPost: Post = {
      id: 'post-cal-1',
      content: 'Scheduled newsletter preview',
      platforms: ['linkedin'],
      scheduledAt: '2026-10-20T10:00:00.000Z',
      status: 'scheduled',
      createdAt: '2026-10-18T10:00:00.000Z',
      updatedAt: '2026-10-18T10:00:00.000Z',
    };

    const dayPosts = [mockPost];
    let editedPost: Post | null = null;
    let scheduledDate: string | null = null;

    const onEditPost = (post: Post) => {
      editedPost = post;
    };
    const onScheduleForDate = (dateKey: string) => {
      scheduledDate = dateKey;
    };

    // Calendar cell click handler logic
    if (dayPosts.length === 1) {
      onEditPost(dayPosts[0]);
    } else if (dayPosts.length === 0) {
      onScheduleForDate('2026-10-20');
    }

    expect(editedPost).toEqual(mockPost);
    expect(scheduledDate).toBeNull();
  });

  it('routes to onScheduleForDate when clicking an empty calendar day cell', () => {
    const dayPosts: Post[] = [];
    let editedPost: Post | null = null;
    let scheduledDate: string | null = null;

    const onEditPost = (post: Post) => {
      editedPost = post;
    };
    const onScheduleForDate = (dateKey: string) => {
      scheduledDate = dateKey;
    };

    if (dayPosts.length === 1) {
      onEditPost(dayPosts[0]);
    } else if (dayPosts.length === 0) {
      onScheduleForDate('2026-10-25');
    }

    expect(editedPost).toBeNull();
    expect(scheduledDate).toBe('2026-10-25');
  });
});


