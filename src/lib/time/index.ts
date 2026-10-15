import type { Post } from '@/types';

/**
 * Returns the user's active IANA timezone (e.g. "America/New_York", "Europe/London").
 */
export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Returns short timezone abbreviation or offset (e.g. "EDT", "GMT+2").
 */
export function getUserTimeZoneAbbr(date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
    }).formatToParts(date);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    return tzPart ? tzPart.value : '';
  } catch {
    return '';
  }
}

/**
 * Formats an ISO UTC string into local time display (e.g., "2:30 PM").
 */
export function formatLocalTime(isoUtc: string): string {
  try {
    const date = new Date(isoUtc);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Formats an ISO UTC string into local date display (e.g., "Oct 16, 2026").
 */
export function formatLocalDate(isoUtc: string): string {
  try {
    const date = new Date(isoUtc);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Formats full timestamp with timezone (e.g., "Oct 16, 2:30 PM EDT").
 */
export function formatLocalDateTimeWithTz(isoUtc: string): string {
  try {
    const date = new Date(isoUtc);
    if (isNaN(date.getTime())) return 'Invalid date';
    const dateStr = formatLocalDate(isoUtc);
    const timeStr = formatLocalTime(isoUtc);
    const tzStr = getUserTimeZoneAbbr(date);
    return `${dateStr}, ${timeStr} ${tzStr}`.trim();
  } catch {
    return 'Invalid date';
  }
}

/**
 * Validates that a given ISO string is strictly in the future compared to current time.
 */
export function isFutureDate(isoUtc: string): boolean {
  try {
    const time = new Date(isoUtc).getTime();
    return !isNaN(time) && time > Date.now();
  } catch {
    return false;
  }
}

/**
 * Converts a local date and a "HH:mm" time string into an exact ISO 8601 UTC string.
 */
export function combineLocalDateTimeToUtc(date: Date, timeString: string): string {
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = parseInt(hoursStr || '0', 10);
  const minutes = parseInt(minutesStr || '0', 10);

  const localDate = new Date(date);
  localDate.setHours(hours, minutes, 0, 0);

  return localDate.toISOString();
}

/**
 * Normalizes a Date to midnight (00:00:00.000) in local timezone.
 */
function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Computes calendar day difference in the user's local timezone.
 * Resilient against UTC offsets, DST boundaries, and late-night (23:30) posts.
 */
export function getCalendarDayDifference(targetDate: Date, baseDate = new Date()): number {
  const targetMidnight = startOfLocalDay(targetDate);
  const baseMidnight = startOfLocalDay(baseDate);

  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((targetMidnight.getTime() - baseMidnight.getTime()) / msPerDay);
}

/**
 * Resolves a human-readable day section label for a given ISO UTC timestamp:
 * - "Today"
 * - "Tomorrow"
 * - Formatted date (e.g. "Friday, Oct 17")
 * - "Earlier / Past" (for historical or failed posts)
 */
export function getDayGroupLabel(isoUtc: string, referenceDate = new Date()): string {
  const postDate = new Date(isoUtc);
  if (isNaN(postDate.getTime())) return 'Unscheduled';

  const diff = getCalendarDayDifference(postDate, referenceDate);

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return 'Earlier';

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(postDate);
}

export interface DayGroup {
  label: string;
  orderKey: string; // for sorting groups chronologically
  posts: Post[];
}

/**
 * Groups an array of posts by day (Today, Tomorrow, subsequent dates, Earlier).
 * Scheduled posts are sorted by scheduledAt ascending within each group.
 */
export function groupPostsByDay(posts: Post[], referenceDate = new Date()): DayGroup[] {
  const groupsMap = new Map<string, { label: string; orderKey: string; posts: Post[] }>();

  // Sort posts chronologically by scheduledAt
  const sorted = [...posts].sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());

  for (const post of sorted) {
    const postDate = new Date(post.scheduledAt);
    const diff = isNaN(postDate.getTime()) ? 999 : getCalendarDayDifference(postDate, referenceDate);
    const label = getDayGroupLabel(post.scheduledAt, referenceDate);

    // Order key ensures chronological ordering:
    // Earlier: negative numbers (or placed last/first depending on UX; for queue we put Earlier at the top or bottom)
    const orderKey = diff < 0 ? `past_${Math.abs(diff)}` : `future_${String(diff).padStart(4, '0')}`;

    if (!groupsMap.has(label)) {
      groupsMap.set(label, { label, orderKey, posts: [] });
    }
    groupsMap.get(label)!.posts.push(post);
  }

  // Desired display order: Today -> Tomorrow -> Upcoming future dates -> Earlier (or Earlier first)
  // In a queue, users want to see Today, Tomorrow, then future dates, with Earlier grouped together
  const groups = Array.from(groupsMap.values());

  const todayGroup = groups.filter((g) => g.label === 'Today');
  const tomorrowGroup = groups.filter((g) => g.label === 'Tomorrow');
  const futureGroups = groups
    .filter((g) => g.label !== 'Today' && g.label !== 'Tomorrow' && g.label !== 'Earlier')
    .sort((a, b) => a.orderKey.localeCompare(b.orderKey));
  const earlierGroup = groups.filter((g) => g.label === 'Earlier');

  return [...todayGroup, ...tomorrowGroup, ...futureGroups, ...earlierGroup];
}
