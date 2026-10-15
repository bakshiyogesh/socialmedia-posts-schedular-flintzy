import type { PlatformId } from '@/types';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  shortName: string;
  charLimit: number;
  requiresMedia: boolean;
  supportedMediaTypes: ('image' | 'video')[];
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  mockHandle: string;
  placeholder: string;
}

export const PLATFORMS: Record<PlatformId, PlatformConfig> = {
  x: {
    id: 'x',
    name: 'X (formerly Twitter)',
    shortName: 'X',
    charLimit: 280,
    requiresMedia: false,
    supportedMediaTypes: ['image', 'video'],
    brandColor: '#000000',
    badgeBg: 'bg-zinc-900 text-zinc-100 dark:bg-zinc-100 dark:text-zinc-900',
    badgeText: 'text-zinc-900 dark:text-zinc-100',
    mockHandle: '@flintzyhq',
    placeholder: "What's happening? Keep it under 280 chars...",
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    shortName: 'Instagram',
    charLimit: 2200,
    requiresMedia: true,
    supportedMediaTypes: ['image', 'video'],
    brandColor: '#E4405F',
    badgeBg: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white',
    badgeText: 'text-rose-500',
    mockHandle: '@flintzy.app',
    placeholder: 'Write an engaging caption... Media required for Instagram.',
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    shortName: 'TikTok',
    charLimit: 2200,
    requiresMedia: true,
    supportedMediaTypes: ['video', 'image'],
    brandColor: '#00F2FE',
    badgeBg: 'bg-zinc-950 text-cyan-400 border border-cyan-500/30',
    badgeText: 'text-cyan-500',
    mockHandle: '@flintzy_creators',
    placeholder: 'Drop trending hashtags and description... Media required.',
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    shortName: 'Facebook',
    charLimit: 5000,
    requiresMedia: false,
    supportedMediaTypes: ['image', 'video'],
    brandColor: '#1877F2',
    badgeBg: 'bg-blue-600 text-white',
    badgeText: 'text-blue-600',
    mockHandle: 'Flintzy Official',
    placeholder: 'Share an update with your community...',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    shortName: 'LinkedIn',
    charLimit: 3000,
    requiresMedia: false,
    supportedMediaTypes: ['image', 'video'],
    brandColor: '#0A66C2',
    badgeBg: 'bg-[#0A66C2] text-white',
    badgeText: 'text-[#0A66C2]',
    mockHandle: 'Flintzy Official',
    placeholder: 'What do you want to talk about? Share industry insights...',
  },
};

export const ALL_PLATFORMS: PlatformId[] = ['x', 'instagram', 'tiktok', 'facebook', 'linkedin'];
