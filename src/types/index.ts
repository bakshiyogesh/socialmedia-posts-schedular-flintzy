export type PlatformId = 'x' | 'instagram' | 'tiktok' | 'facebook' | 'linkedin';

export type PostStatus = 'scheduled' | 'published' | 'failed';

export type ErrorCategory = 'token_expired' | 'media_rejected' | 'rate_limited';

export interface Post {
  id: string;
  content: string;
  platforms: PlatformId[];
  mediaUrl?: string;
  scheduledAt: string; // ISO 8601 UTC string (e.g. 2026-10-16T18:00:00.000Z)
  status: PostStatus;
  errorType?: ErrorCategory;
  errorMessage?: string;
  platformOverrides?: Partial<Record<PlatformId, { content?: string; mediaUrl?: string }>>;
  createdAt: string;
  updatedAt: string;
}

export interface DraftPost {
  content: string;
  platforms: PlatformId[];
  mediaUrl?: string;
  scheduledAt?: string;
  platformOverrides?: Partial<Record<PlatformId, { content?: string }>>;
  savedAt: string;
}

export interface PreFlightIssue {
  platformId?: PlatformId;
  type: 'error' | 'warning';
  message: string;
  field: 'content' | 'media' | 'schedule' | 'platform';
}

export interface FilterState {
  platforms: PlatformId[];
  status: PostStatus | 'all';
  q: string;
}

export interface StatusCounts {
  all: number;
  scheduled: number;
  published: number;
  failed: number;
}
