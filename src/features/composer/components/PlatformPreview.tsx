'use client';

import React, { useState } from 'react';
import { PlatformIcon } from '@/components/shared/PlatformIcons';
import { PLATFORMS } from '@/config/platforms';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Bookmark,
  Music2,
  ThumbsUp,
  Plus,
  Send,
  MoreHorizontal,
  BarChart2,
  Share2,
  Volume2,
} from 'lucide-react';
import type { PlatformId } from '@/types';
import { ProgressiveImage } from '@/components/shared/ProgressiveImage';
import { formatSocialTimestamp } from '@/lib/time';

export function InstagramVerifiedBadge({ size = 12 }: { size?: number }) {
  return (
    <svg
      aria-label="Verified"
      role="img"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className="shrink-0 inline-block align-middle"
    >
      <title>Verified</title>
      {/* White circle backing so the checkmark cutout renders crisp white */}
      <circle cx="20" cy="20" r="13" fill="#ffffff" />
      <path
        d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
        fill="rgb(0, 149, 246)"
        fillRule="evenodd"
      />
    </svg>
  );
}

export function TikTokVerifiedBadge({ size = 13 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className="shrink-0 inline-block align-middle"
      role="img"
      aria-label="Verified"
    >
      <title>Verified</title>
      <circle cx="8" cy="8" r="7.5" fill="#20D5EC" />
      <path
        d="M6.7 10.8L4.2 8.3L5.1 7.4L6.7 9L10.9 4.8L11.8 5.7L6.7 10.8Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function XVerifiedBadge({ size = 15 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-label="Verified"
      role="img"
      width={size}
      height={size}
      className="shrink-0 text-[#1D9BF0] fill-current inline-block align-middle"
    >
      <title>Verified</title>
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
  );
}

export function FacebookVerifiedBadge({ size = 13 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className="shrink-0 inline-block align-middle"
      role="img"
      aria-label="Verified"
    >
      <title>Verified</title>
      <path
        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0z"
        fill="#0866FF"
      />
      <path
        d="M11.8 5.5l-5.3 5.3-2.3-2.3 1.1-1.1 1.2 1.2 4.2-4.2 1.1 1.1z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function LinkedInVerifiedBadge({ size = 13 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      className="shrink-0 inline-block align-middle"
      role="img"
      aria-label="Verified"
    >
      <title>Verified</title>
      <path
        d="M8 1.5l1.6 1.4 2.1-.3.9 1.9 2 .8-.2 2.1 1.3 1.6-1.3 1.6.2 2.1-2 .8-.9 1.9-2.1-.3L8 16.5l-1.6-1.4-2.1.3-.9-1.9-2-.8.2-2.1L.3 9 1.6 7.4 1.4 5.3l2-.8.9-1.9 2.1.3L8 1.5z"
        fill="#0A66C2"
      />
      <path
        d="M6.8 11.2L4.2 8.6l1-1 1.6 1.6 4-4 1 1-5 5z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

interface PlatformPreviewProps {
  selectedPlatforms: PlatformId[];
  content: string;
  mediaUrl?: string;
  overrides?: Partial<Record<PlatformId, { content?: string }>>;
  scheduledAt?: string;
}

export function PlatformPreview({
  selectedPlatforms,
  content,
  mediaUrl,
  overrides,
  scheduledAt,
}: PlatformPreviewProps) {
  const [activeTab, setActiveTab] = useState<PlatformId>(
    selectedPlatforms[0] || 'x'
  );

  // Fallback to first available if active platform is deselected
  const currentPlatform = selectedPlatforms.includes(activeTab)
    ? activeTab
    : selectedPlatforms[0] || 'x';

  if (selectedPlatforms.length === 0) {
    return (
      <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40 text-zinc-500">
        <p className="text-xs">Select a channel to see real-time simulated feed preview.</p>
      </div>
    );
  }

  const effectiveContent = overrides?.[currentPlatform]?.content || content;
  const config = PLATFORMS[currentPlatform];
  const timeDisplay = formatSocialTimestamp(scheduledAt);

  return (
    <div className="flex flex-col min-w-0 w-full space-y-3">
      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto shrink-0">
        {selectedPlatforms.map((pid) => {
          const isCurrent = currentPlatform === pid;
          return (
            <button
              key={pid}
              type="button"
              onClick={() => setActiveTab(pid)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${isCurrent
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
            >
              <PlatformIcon platform={pid} size={15} />
              <span>{PLATFORMS[pid].name}</span>
            </button>
          );
        })}
      </div>

      {/* Simulated Preview Card */}
      <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 sm:p-4 overflow-y-auto overflow-x-hidden min-h-[340px] sm:min-h-[500px] max-h-none sm:max-h-[600px] min-w-0 w-full flex flex-col items-center justify-start sm:justify-center py-4 sm:py-6">
        {/* ============================================================== */}
        {/* TIKTOK WEB (DESKTOP) FEED SIMULATION                           */}
        {/* ============================================================== */}
        {currentPlatform === 'tiktok' && (
          <div className="flex items-end justify-center gap-3.5 w-full max-w-sm mx-auto select-none py-1">
            {/* Left: TikTok Web Video Player Frame */}
            <div className="relative w-[275px] sm:w-[285px] aspect-[9/16] h-[480px] bg-black rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between text-white shrink-0">
              {/* Media Layer */}
              {mediaUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <ProgressiveImage src={mediaUrl} alt="TikTok Web Media" />
                  {/* Top & Bottom localized gradients for web player legibility */}
                  <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none z-[1]" />
                  <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none z-[1]" />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-zinc-950/95 border border-dashed border-rose-900/60 z-[1]">
                  <div className="w-11 h-11 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2.5">
                    <PlatformIcon platform="tiktok" size={22} />
                  </div>
                  <span className="text-xs text-rose-400 font-bold">Media Required for TikTok</span>
                  <span className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    TikTok feeds require vertical video or photo attachment to schedule.
                  </span>
                </div>
              )}

              {/* Top Web Player Controls: Speaker (Volume) & Options */}
              <div className="relative z-10 p-3.5 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Toggle sound"
                  className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="More options"
                  className="p-1.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors shadow-sm"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Video Overlay: Creator Info, Caption & Sound */}
              <div className="relative z-10 p-3.5 space-y-1.5">
                {/* Creator Handle + Verified Badge + Timestamp */}
                <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
                  <span className="font-bold text-xs text-white drop-shadow tracking-tight truncate">
                    {config.mockHandle.replace('@', '')}
                  </span>
                  <TikTokVerifiedBadge size={13} />
                  <span className="text-[11px] text-zinc-300 font-medium drop-shadow shrink-0">
                    · {timeDisplay.short}
                  </span>
                </div>

                {/* Caption with Hashtags + "more" Toggle */}
                <div className="text-xs text-zinc-100 leading-relaxed break-words [overflow-wrap:anywhere] drop-shadow">
                  <span>
                    {effectiveContent || 'Add your caption with trending #hashtags...'}
                  </span>
                  <span className="font-bold text-white ml-1.5 cursor-pointer hover:underline text-[11px]">
                    more
                  </span>
                </div>

                {/* Sound Info */}
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 pt-0.5 drop-shadow">
                  <Music2 className="w-3 h-3 text-white shrink-0" />
                  <span className="truncate font-medium">
                    Original sound - {config.mockHandle.replace('@', '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: External Circular Action Rail (TikTok Web Format) */}
            <div className="flex flex-col items-center gap-3.5 pb-1">
              {/* Creator Profile Avatar with Red '+' Follow Badge */}
              <div className="relative cursor-pointer mb-0.5 group">
                <div className="w-10 h-10 rounded-full border-2 border-zinc-700 bg-[#E04B2F] flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-105 transition-transform">
                  {config.mockHandle.slice(1, 2).toUpperCase() || 'H'}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FE2C55] text-white flex items-center justify-center shadow-md">
                  <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              {/* Heart (Like) Button */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-zinc-800/90 hover:bg-zinc-700/90 flex items-center justify-center text-white transition-all shadow-md group-hover:scale-105">
                  <Heart className="w-5 h-5 fill-white text-white" />
                </div>
                <span className="text-[11px] font-bold text-zinc-300 mt-1">326.1K</span>
              </div>

              {/* Comment Button */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-zinc-800/90 hover:bg-zinc-700/90 flex items-center justify-center text-white transition-all shadow-md group-hover:scale-105">
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                </div>
                <span className="text-[11px] font-bold text-zinc-300 mt-1">784</span>
              </div>

              {/* Bookmark Button */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-zinc-800/90 hover:bg-zinc-700/90 flex items-center justify-center text-white transition-all shadow-md group-hover:scale-105">
                  <Bookmark className="w-5 h-5 fill-white text-white" />
                </div>
                <span className="text-[11px] font-bold text-zinc-300 mt-1">19.2K</span>
              </div>

              {/* Share Button (Authentic TikTok curved share arrow) */}
              <div className="flex flex-col items-center cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-zinc-800/90 hover:bg-zinc-700/90 flex items-center justify-center text-white transition-all shadow-md group-hover:scale-105">
                  <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                    <path d="M14 4.5V9C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19.5L22 12l-8-7.5z" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold text-zinc-300 mt-1">28.8K</span>
              </div>

              {/* Sound Vinyl Disc with Album Art Thumbnail */}
              <div className="relative pt-0.5 cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-zinc-950 border-2 border-zinc-700 shadow-xl flex items-center justify-center animate-[spin_4s_linear_infinite] overflow-hidden relative">
                  <div className="w-6 h-6 rounded-full border border-zinc-600 flex items-center justify-center overflow-hidden">
                    {mediaUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={mediaUrl} alt="Album track" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-rose-500 to-indigo-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* INSTAGRAM LIVE FEED SIMULATION (Authentic Post Card)            */}
        {/* ============================================================== */}
        {currentPlatform === 'instagram' && (
          <div className="w-full max-w-sm bg-black rounded-2xl border border-zinc-800 p-3.5 text-white shadow-xl space-y-3 min-w-0">
            {/* Header: Avatar, Handle, Location, Menu */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5 shrink-0">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                    F
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
                    <span className="text-xs font-bold text-white truncate">{config.mockHandle}</span>
                    <InstagramVerifiedBadge size={12} />
                    <span className="text-zinc-500 text-xs shrink-0">•</span>
                    <span className="text-xs text-zinc-400 font-normal shrink-0">{timeDisplay.short}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">Flintzy Creators Studio</p>
                </div>
              </div>
              <button type="button" aria-label="Post options" className="text-zinc-400 hover:text-white p-1 shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Media Asset (1:1 Ratio) */}
            {mediaUrl ? (
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 w-full border border-zinc-800/80">
                <ProgressiveImage src={mediaUrl} alt="Instagram Media" />
              </div>
            ) : (
              <div className="aspect-square rounded-xl bg-zinc-900/60 border border-dashed border-rose-900/50 flex flex-col items-center justify-center p-4 text-center w-full">
                <PlatformIcon platform="instagram" size={28} className="text-rose-400 mb-2" />
                <span className="text-xs text-rose-400 font-semibold">Media Required for Instagram</span>
                <span className="text-[10px] text-zinc-400 mt-1">Photo or video attachment required</span>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3.5">
                <Heart className="w-5 h-5 text-white hover:text-rose-500 cursor-pointer transition-colors" />
                <MessageCircle className="w-5 h-5 text-white hover:text-zinc-300 cursor-pointer transition-colors" />
                <Send className="w-5 h-5 text-white hover:text-zinc-300 cursor-pointer transition-colors" />
              </div>
              <Bookmark className="w-5 h-5 text-white hover:text-zinc-300 cursor-pointer transition-colors" />
            </div>

            {/* Likes & Caption */}
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-white">Liked by flintzy_team and 1,842 others</p>
              <div className="text-zinc-200 leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                <span className="inline-flex items-center gap-1 mr-1.5 font-bold text-white">
                  <span>{config.mockHandle}</span>
                  <InstagramVerifiedBadge size={11} />
                </span>
                {effectiveContent || (
                  <span className="text-zinc-500 italic">Caption preview will appear here...</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 pt-0.5">View all 34 comments</p>
              <p className="text-[9px] tracking-wider text-zinc-500"> See translation</p>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* X (TWITTER) LIVE FEED SIMULATION (Authentic Post Card)          */}
        {/* ============================================================== */}
        {currentPlatform === 'x' && (
          <div className="w-full max-w-md bg-black rounded-2xl border border-zinc-800 p-4 text-white shadow-xl space-y-3 min-w-0">
            {/* Header: Avatar, Display Name, Handle, Time, Menu */}
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow">
                F
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-nowrap overflow-hidden">
                    <span className="font-bold text-sm text-zinc-100 shrink-0">Flintzy</span>
                    <XVerifiedBadge size={15} />
                    <span className="text-xs text-zinc-400 font-mono truncate">{config.mockHandle}</span>
                    <span className="text-zinc-500 shrink-0">·</span>
                    <span className="text-xs text-zinc-400 shrink-0">{timeDisplay.short}</span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer shrink-0" />
                </div>

                {/* Post Text */}
                <p className="mt-2 text-sm text-zinc-100 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
                  {effectiveContent || (
                    <span className="text-zinc-600 italic">What is happening?! Type your post content...</span>
                  )}
                </p>

                {/* Media Attachment (16:9 Video/Image Card) */}
                {mediaUrl && (
                  <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video w-full shadow-md">
                    <ProgressiveImage src={mediaUrl} alt="X media attachment" />
                  </div>
                )}

                {/* Action Metrics Bar */}
                <div className="flex items-center justify-between text-zinc-400 text-xs mt-3 pt-2.5 border-t border-zinc-900">
                  <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span>24</span>
                  </button>
                  <button type="button" className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                    <Repeat2 className="w-4 h-4" />
                    <span>18</span>
                  </button>
                  <button type="button" className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                    <Heart className="w-4 h-4" />
                    <span>142</span>
                  </button>
                  <button type="button" className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                    <BarChart2 className="w-4 h-4" />
                    <span>3.2K</span>
                  </button>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Bookmark className="w-4 h-4 hover:text-zinc-300 cursor-pointer" />
                    <Share2 className="w-4 h-4 hover:text-zinc-300 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* FACEBOOK LIVE FEED SIMULATION (Authentic Page Card)             */}
        {/* ============================================================== */}
        {currentPlatform === 'facebook' && (
          <div className="w-full max-w-md bg-zinc-900/60 rounded-2xl border border-zinc-800 p-4 text-white shadow-xl space-y-3 min-w-0">
            {/* Header: Blue Avatar, Page Name, Privacy & Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center font-bold text-white text-base shrink-0 shadow">
                  F
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
                    <p className="text-xs font-bold text-zinc-100 truncate">{config.mockHandle.replace('@', '')} Page</p>
                    <FacebookVerifiedBadge size={13} />
                    <span className="text-zinc-500 text-xs shrink-0">·</span>
                    <span className="text-xs text-zinc-400 shrink-0">{timeDisplay.short}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400">{timeDisplay.ago} · 🌎 Public</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer shrink-0" />
            </div>

            {/* Post Content */}
            <p className="text-xs text-zinc-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
              {effectiveContent || (
                <span className="text-zinc-500 italic">What is on your mind?</span>
              )}
            </p>

            {/* Media Attachment */}
            {mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-950 w-full shadow-md">
                <ProgressiveImage src={mediaUrl} alt="Facebook attachment" />
              </div>
            )}

            {/* Reactions Count Bar */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">👍</span>
                  <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[8px]">❤️</span>
                </div>
                <span className="text-zinc-300 font-medium">128</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <span>18 comments</span>
                <span>4 shares</span>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center justify-around pt-1 text-xs text-zinc-400">
              <button type="button" className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-zinc-800 hover:text-blue-400 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* LINKEDIN LIVE FEED SIMULATION (Authentic Professional Post)     */}
        {/* ============================================================== */}
        {currentPlatform === 'linkedin' && (
          <div className="w-full max-w-md bg-zinc-900/60 rounded-2xl border border-zinc-800 p-4 text-white shadow-xl space-y-3 min-w-0">
            {/* Header: Company Avatar, Name, Followers & Time */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#0A66C2] flex items-center justify-center font-bold text-white text-base shrink-0 shadow">
                  in
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
                    <p className="text-xs font-bold text-zinc-100 truncate">{config.mockHandle}</p>
                    <LinkedInVerifiedBadge size={13} />
                    <span className="text-[10px] text-zinc-400 font-medium shrink-0">• 1st</span>
                    <span className="text-zinc-500 text-xs shrink-0">•</span>
                    <span className="text-xs text-zinc-400 shrink-0">{timeDisplay.short}</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">Social Media Operations & Automation</p>
                  <p className="text-[10px] text-zinc-500">{timeDisplay.short} • 🌐</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer shrink-0" />
            </div>

            {/* Post Content */}
            <p className="text-xs text-zinc-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
              {effectiveContent || (
                <span className="text-zinc-500 italic">Share insights, industry trends, or company announcements...</span>
              )}
            </p>

            {/* Media Attachment */}
            {mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-zinc-800 aspect-video bg-zinc-950 w-full shadow-md">
                <ProgressiveImage src={mediaUrl} alt="LinkedIn attachment" />
              </div>
            )}

            {/* Reactions Count Bar */}
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-b border-zinc-800/80 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px]">👍</span>
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px]">👏</span>
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px]">💡</span>
                </div>
                <span className="text-zinc-300 font-medium">184</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <span>32 comments</span>
                <span>7 reposts</span>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center justify-around pt-1 text-xs text-zinc-400">
              <button type="button" className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-zinc-800 hover:text-[#0A66C2] transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                <Repeat2 className="w-4 h-4" />
                <span>Repost</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors">
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
