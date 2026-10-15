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
  Search,
  Plus,
  Send,
  MoreHorizontal,
  BarChart2,
  Radio,
  Camera,
  Share2,
} from 'lucide-react';
import type { PlatformId } from '@/types';
import { ProgressiveImage } from '@/components/shared/ProgressiveImage';

interface PlatformPreviewProps {
  selectedPlatforms: PlatformId[];
  content: string;
  mediaUrl?: string;
  overrides?: Partial<Record<PlatformId, { content?: string }>>;
}

export function PlatformPreview({
  selectedPlatforms,
  content,
  mediaUrl,
  overrides,
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

  return (
    <div className="flex flex-col h-full space-y-3 min-w-0 w-full overflow-hidden">
      {/* Platform Switcher Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto shrink-0">
        {selectedPlatforms.map((pid) => {
          const isCurrent = currentPlatform === pid;
          return (
            <button
              key={pid}
              type="button"
              onClick={() => setActiveTab(pid)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                isCurrent
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
      <div className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 sm:p-4 overflow-y-auto overflow-x-hidden max-h-[500px] min-w-0 w-full flex items-center justify-center">
        {/* ============================================================== */}
        {/* TIKTOK LIVE FEED SIMULATION (Authentic Smartphone Mockup)      */}
        {/* ============================================================== */}
        {currentPlatform === 'tiktok' && (
          <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] bg-black rounded-3xl border-2 border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between text-white select-none">
            {/* Background Media Layer */}
            {mediaUrl ? (
              <div className="absolute inset-0 w-full h-full">
                <ProgressiveImage src={mediaUrl} alt="TikTok Media" debounceMs={400} />
                {/* Vignette Gradients for Legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-950/90 border border-dashed border-rose-900/60">
                <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-3">
                  <PlatformIcon platform="tiktok" size={24} />
                </div>
                <span className="text-xs text-rose-400 font-semibold">Media Required for TikTok</span>
                <span className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed">
                  TikTok feeds require vertical video or photo attachment to schedule.
                </span>
              </div>
            )}

            {/* Top Smartphone Bar & Header */}
            <div className="relative z-10 pt-2 px-3.5 space-y-1.5">
              {/* Mini Status Bar (Clock & Icons) */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300 px-1">
                <span>8:00</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px]">5G</span>
                  <div className="w-5 h-2.5 border border-zinc-300 rounded-sm p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Feed Header: LIVE | Following | For You | Search */}
              <div className="flex items-center justify-between pt-1">
                {/* LIVE Badge */}
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white tracking-wide">
                  <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
                  <span>LIVE</span>
                </div>

                {/* Following / For You Tabs */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer font-medium">Following</span>
                  <div className="relative font-bold text-white cursor-pointer">
                    <span>For You</span>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-white rounded-full" />
                  </div>
                </div>

                {/* Search Icon */}
                <button type="button" aria-label="Search TikTok" className="p-1 text-white hover:text-zinc-300 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle Section with Right Vertical Floating Action Stack */}
            <div className="relative z-10 flex-1 flex items-end justify-end px-3 pb-2 pointer-events-none">
              <div className="flex flex-col items-center gap-3.5 pointer-events-auto">
                {/* Creator Avatar with Follow Plus Badge */}
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
                      {config.mockHandle.slice(1, 2).toUpperCase() || 'F'}
                    </div>
                  </div>
                  {/* Plus Follow Badge */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md">
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </div>
                </div>

                {/* Like Button */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Heart className="w-6 h-6 text-white drop-shadow-md group-hover:scale-110 transition-transform fill-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-white drop-shadow">142.8K</span>
                </div>

                {/* Comments Button */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <MessageCircle className="w-6 h-6 text-white drop-shadow-md group-hover:scale-110 transition-transform fill-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-white drop-shadow">1,280</span>
                </div>

                {/* Bookmark Button */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Bookmark className="w-6 h-6 text-white drop-shadow-md group-hover:scale-110 transition-transform fill-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-white drop-shadow">4,892</span>
                </div>

                {/* Share Button */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <div className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Share2 className="w-6 h-6 text-white drop-shadow-md group-hover:scale-110 transition-transform fill-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-white drop-shadow">Share</span>
                </div>

                {/* Spinning Vinyl Record Disc */}
                <div className="relative pt-1 cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-zinc-950 border-2 border-zinc-700/80 shadow-xl flex items-center justify-center animate-[spin_5s_linear_infinite]">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-black" />
                    </div>
                  </div>
                  <Music2 className="w-3 h-3 text-white absolute -top-1 -left-1 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bottom Overlay: Handle, Tag, Caption, Audio */}
            <div className="relative z-10 px-3.5 pb-3.5 space-y-2 pointer-events-none">
              {/* Creator Handle + Photo Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-white drop-shadow-md">
                  {config.mockHandle}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md border border-white/20 text-[9px] font-medium text-zinc-200">
                  <Camera className="w-2.5 h-2.5 text-zinc-300" />
                  <span>Photo</span>
                </span>
              </div>

              {/* Caption Text */}
              <p className="text-xs text-zinc-100 line-clamp-3 leading-relaxed drop-shadow-md break-words [overflow-wrap:anywhere]">
                {effectiveContent || (
                  <span className="text-zinc-400 italic">Caption will appear here...</span>
                )}
              </p>

              {/* Audio Track Row */}
              <div className="flex items-center gap-2 text-[10px] text-zinc-300 drop-shadow">
                <Music2 className="w-3 h-3 text-white shrink-0" />
                <span className="truncate">
                  Original sound - {config.mockHandle} · Flintzy Studio
                </span>
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
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white">{config.mockHandle}</span>
                    <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">Flintzy Creators Studio</p>
                </div>
              </div>
              <button type="button" aria-label="Post options" className="text-zinc-400 hover:text-white p-1">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Media Asset (1:1 Ratio) */}
            {mediaUrl ? (
              <div className="aspect-square rounded-xl overflow-hidden bg-zinc-900 w-full border border-zinc-800/80">
                <ProgressiveImage src={mediaUrl} alt="Instagram Media" debounceMs={400} />
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
                <strong className="mr-1.5 text-white">{config.mockHandle}</strong>
                {effectiveContent || (
                  <span className="text-zinc-500 italic">Caption preview will appear here...</span>
                )}
              </div>
              <p className="text-[11px] text-zinc-500 pt-0.5">View all 34 comments</p>
              <p className="text-[9px] uppercase tracking-wider text-zinc-600">2 HOURS AGO · SEE TRANSLATION</p>
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-zinc-100">Flintzy</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">{config.mockHandle}</span>
                    <span className="text-zinc-600">·</span>
                    <span className="text-xs text-zinc-500">Just now</span>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer" />
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
                    <ProgressiveImage src={mediaUrl} alt="X media attachment" debounceMs={400} />
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
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-zinc-100">{config.mockHandle.replace('@', '')} Page</p>
                    <span className="w-3 h-3 rounded-full bg-blue-500 text-white flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400">Just now · 🌎 Public</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-zinc-500 hover:text-zinc-300 cursor-pointer" />
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
                <ProgressiveImage src={mediaUrl} alt="Facebook attachment" debounceMs={400} />
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
      </div>
    </div>
  );
}
