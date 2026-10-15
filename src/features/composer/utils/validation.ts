import { PLATFORMS } from '@/config/platforms';
import { isFutureDate } from '@/lib/time';
import type { PlatformId, PreFlightIssue } from '@/types';

export interface PostFormInput {
  content: string;
  platforms: PlatformId[];
  mediaUrl?: string;
  scheduledAt?: string; // ISO UTC string
  platformOverrides?: Partial<Record<PlatformId, { content?: string }>>;
}

export interface ValidationResult {
  isValid: boolean;
  blockers: PreFlightIssue[];
  warnings: PreFlightIssue[];
  charCounts: Record<PlatformId, { count: number; limit: number; remaining: number; isOver: boolean }>;
}

export function validatePost(input: PostFormInput): ValidationResult {
  const blockers: PreFlightIssue[] = [];
  const warnings: PreFlightIssue[] = [];
  const charCounts: Record<PlatformId, { count: number; limit: number; remaining: number; isOver: boolean }> = {
    x: { count: 0, limit: PLATFORMS.x.charLimit, remaining: PLATFORMS.x.charLimit, isOver: false },
    instagram: { count: 0, limit: PLATFORMS.instagram.charLimit, remaining: PLATFORMS.instagram.charLimit, isOver: false },
    tiktok: { count: 0, limit: PLATFORMS.tiktok.charLimit, remaining: PLATFORMS.tiktok.charLimit, isOver: false },
    facebook: { count: 0, limit: PLATFORMS.facebook.charLimit, remaining: PLATFORMS.facebook.charLimit, isOver: false },
  };

  // 1. Platform Selection Check
  if (input.platforms.length === 0) {
    blockers.push({
      type: 'error',
      field: 'platform',
      message: 'Select at least one social media platform.',
    });
  }

  // 2. Content & Character Limit Checks per Platform
  for (const platformId of input.platforms) {
    const config = PLATFORMS[platformId];
    // Check override or base content
    const overrideContent = input.platformOverrides?.[platformId]?.content;
    const effectiveContent = (overrideContent !== undefined && overrideContent !== '') ? overrideContent : input.content;
    const charCount = effectiveContent.trim().length;
    const remaining = config.charLimit - charCount;
    const isOver = remaining < 0;

    charCounts[platformId] = {
      count: charCount,
      limit: config.charLimit,
      remaining,
      isOver,
    };

    if (charCount === 0) {
      blockers.push({
        platformId,
        type: 'error',
        field: 'content',
        message: `${config.name} post content is empty.`,
      });
    }

    if (isOver) {
      blockers.push({
        platformId,
        type: 'error',
        field: 'content',
        message: `${config.name} exceeds character limit by ${Math.abs(remaining)} chars (${charCount}/${config.charLimit}).`,
      });
    }

    // 3. Media Requirement Check (Instagram & TikTok require media)
    if (config.requiresMedia) {
      const hasMedia = Boolean(input.mediaUrl && input.mediaUrl.trim().length > 0);
      if (!hasMedia) {
        blockers.push({
          platformId,
          type: 'error',
          field: 'media',
          message: `${config.name} requires media (image or video) to publish.`,
        });
      }
    }
  }

  // 4. Media URL format validation (if provided)
  if (input.mediaUrl && input.mediaUrl.trim().length > 0) {
    try {
      const url = new URL(input.mediaUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) {
        blockers.push({
          type: 'error',
          field: 'media',
          message: 'Media URL must use http:// or https:// protocol.',
        });
      }
    } catch {
      blockers.push({
        type: 'error',
        field: 'media',
        message: 'Invalid media URL format.',
      });
    }
  }

  // 5. Future Date & Time Check
  if (!input.scheduledAt) {
    blockers.push({
      type: 'error',
      field: 'schedule',
      message: 'Select a scheduled date and time.',
    });
  } else if (!isFutureDate(input.scheduledAt)) {
    blockers.push({
      type: 'error',
      field: 'schedule',
      message: 'Scheduled time must be in the future (minimum 1 minute ahead).',
    });
  }

  return {
    isValid: blockers.length === 0,
    blockers,
    warnings,
    charCounts,
  };
}
