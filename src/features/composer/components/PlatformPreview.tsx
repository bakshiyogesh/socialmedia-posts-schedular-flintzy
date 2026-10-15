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
          <div className="relative h-[470px] w-[265px] bg-black rounded-[32px] border-[3px] border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between text-white select-none shrink-0 ring-1 ring-zinc-700/50">
            {/* Background Media Layer */}
            {mediaUrl ? (
              <div className="absolute inset-0 w-full h-full">
                <ProgressiveImage src={mediaUrl} alt="TikTok Media" debounceMs={400} />
                {/* Top & Bottom localized gradients (center remains bright and vivid) */}
                <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-[1]" />
                <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-[1]" />
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

            {/* Top Smartphone Bar & Header */}
            <div className="relative z-10 pt-3 px-3.5 space-y-1">
              {/* Status Bar */}
              <div className="flex items-center justify-between text-[10px] font-semibold text-white/90 px-0.5">
                <span>8:00</span>
                <div className="flex items-center gap-1.5 text-[9px]">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-white/80 rounded-[2px] p-[1px] flex items-center">
                    <div className="w-2.5 h-full bg-white rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Top Navigation: LIVE | Following | For You | Search */}
              <div className="flex items-center justify-between pt-1">
                {/* LIVE TV Badge */}
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/70 bg-black/30 backdrop-blur-sm text-[9px] font-black tracking-wider text-white">
                  LIVE
                </div>

                {/* Following / For You Tabs */}
                <div className="flex items-center gap-3.5 text-xs">
                  <span className="text-white/60 hover:text-white cursor-pointer font-medium text-[12px] transition-colors">
                    Following
                  </span>
                  <div className="flex flex-col items-center cursor-pointer">
                    <span className="font-bold text-white text-[13px] tracking-wide">For You</span>
                    <span className="w-4 h-[2px] bg-white rounded-full mt-0.5 shadow-sm" />
                  </div>
                </div>

                {/* Search Icon */}
                <button
                  type="button"
                  aria-label="Search TikTok"
                  className="p-1 text-white hover:text-zinc-200 transition-colors"
                >
                  <Search className="w-4 h-4 stroke-[2.2]" />
                </button>
              </div>
            </div>

            {/* Right-Side Vertical Floating Action Stack */}
            <div className="relative z-10 flex-1 flex items-end justify-end px-2.5 pb-1 pointer-events-none">
              <div className="flex flex-col items-center gap-2.5 pointer-events-auto">
                {/* Creator Avatar with Red Plus Follow Badge */}
                <div className="relative group cursor-pointer mb-0.5">
                  <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    {config.mockHandle.slice(1, 2).toUpperCase() || 'F'}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#FE2C55] text-white flex items-center justify-center shadow-md">
                    <Plus className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                {/* Like Button */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <Heart className="w-6 h-6 text-white drop-shadow-lg fill-white transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold text-white drop-shadow mt-0.5">142.8K</span>
                </div>

                {/* Comment Button (TikTok speech bubble with 3 dots) */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-lg transition-transform group-hover:scale-110">
                    <path d="M12 2C6.477 2 2 6.03 2 11c0 2.68 1.34 5.08 3.44 6.72-.25 1.48-.96 2.92-1.95 4.02a.5.5 0 0 0 .51.81c2.42-.4 4.58-1.5 6-2.55.65.1 1.32.16 2 .16 5.523 0 10-4.03 10-9s-4.477-9-10-9z" />
                    <circle cx="8" cy="11" r="1.1" fill="#000" />
                    <circle cx="12" cy="11" r="1.1" fill="#000" />
                    <circle cx="16" cy="11" r="1.1" fill="#000" />
                  </svg>
                  <span className="text-[10px] font-bold text-white drop-shadow mt-0.5">1,280</span>
                </div>

                {/* Bookmark Button */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <Bookmark className="w-6 h-6 text-white drop-shadow-lg fill-white transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold text-white drop-shadow mt-0.5">4,892</span>
                </div>

                {/* Share Button (Curved Arrow) */}
                <div className="flex flex-col items-center group cursor-pointer">
                  <Share2 className="w-6 h-6 text-white drop-shadow-lg fill-white transition-transform group-hover:scale-110" />
                  <span className="text-[10px] font-bold text-white drop-shadow mt-0.5">Share</span>
                </div>

                {/* Authentic TikTok Spinning Vinyl Disc */}
                <div className="relative pt-0.5 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-zinc-950 border-2 border-zinc-800 shadow-xl flex items-center justify-center animate-[spin_4s_linear_infinite]">
                    <div className="w-6 h-6 rounded-full border border-zinc-700/60 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Overlay: Handle, Photo Badge, Caption, Audio */}
            <div className="relative z-10 px-3.5 pb-3 space-y-1.5 pointer-events-none">
              {/* Handle & Photo Badge */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs text-white drop-shadow-md tracking-tight">
                  {config.mockHandle}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/40 backdrop-blur-md border border-white/20 text-[9px] font-semibold text-white shadow-sm">
                  <Camera className="w-2.5 h-2.5 text-white" />
                  <span>Photo</span>
                </span>
              </div>

              {/* Caption Text */}
              <p className="text-[11px] text-white/95 line-clamp-2 leading-relaxed drop-shadow-md break-words [overflow-wrap:anywhere] font-normal">
                {effectiveContent || (
                  <span className="text-zinc-300 italic">Caption preview will appear here...</span>
                )}
              </p>

              {/* Audio Track Row */}
              <div className="flex items-center gap-1.5 text-[10px] text-white/90 drop-shadow">
                <Music2 className="w-3 h-3 text-white shrink-0 animate-pulse" />
                <span className="truncate font-medium">
                  Original sound - {config.mockHandle.replace('@', '')}
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
