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
      <div className="flex-1 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-3 sm:p-4 overflow-y-auto overflow-x-hidden min-h-[580px] max-h-[660px] min-w-0 w-full flex items-center justify-center">
        {/* ============================================================== */}
        {/* TIKTOK LIVE FEED SIMULATION (Exact Pixel-Matched Mockup)       */}
        {/* ============================================================== */}
        {currentPlatform === 'tiktok' && (
          <div className="relative h-[580px] w-[295px] bg-black rounded-[42px] border-[4px] border-zinc-800/90 shadow-2xl overflow-hidden flex flex-col justify-between text-white select-none shrink-0 ring-1 ring-white/10">
            {/* Top Section: Status Bar & TikTok Header */}
            <div className="relative z-30 pt-3.5 px-4 space-y-2 bg-gradient-to-b from-black/90 to-transparent pb-3">
              {/* iOS Status Bar */}
              <div className="flex items-center justify-between text-[11px] font-semibold text-white px-0.5">
                <span className="tracking-tight">8:00</span>
                <div className="flex items-center gap-1.5 text-[9px]">
                  {/* Signal bars */}
                  <div className="flex items-end gap-[1.5px] h-2.5">
                    <div className="w-[2px] h-1 bg-white rounded-2xs" />
                    <div className="w-[2px] h-1.5 bg-white rounded-2xs" />
                    <div className="w-[2px] h-2 bg-white rounded-2xs" />
                    <div className="w-[2px] h-2.5 bg-white rounded-2xs" />
                  </div>
                  <span className="font-bold">5G</span>
                  {/* Battery */}
                  <div className="w-4 h-2 border border-white/80 rounded-[2px] p-[1px] flex items-center">
                    <div className="w-full h-full bg-white rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* TikTok Top Nav: LIVE | Following | For You | Search */}
              <div className="flex items-center justify-between pt-1">
                {/* LIVE TV Badge */}
                <div className="flex items-center justify-center border-[1.5px] border-white/80 rounded-[5px] px-1.5 py-[1px] text-[9px] font-black tracking-wider text-white">
                  LIVE
                </div>

                {/* Following / For You Tabs */}
                <div className="flex items-center gap-5 text-xs">
                  <span className="text-white/60 hover:text-white cursor-pointer font-medium text-[13px] transition-colors">
                    Following
                  </span>
                  <div className="flex flex-col items-center cursor-pointer">
                    <span className="font-bold text-white text-[14px] tracking-wide">For You</span>
                    <span className="w-5 h-[2px] bg-white rounded-full mt-0.5 shadow-sm" />
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

            {/* Central Media Content (Pure Black Letterboxed for Photos) */}
            <div className="relative flex-1 w-full bg-black flex items-center justify-center overflow-hidden my-auto">
              {mediaUrl ? (
                <div className="relative w-full aspect-[4/5] flex items-center justify-center bg-black">
                  <ProgressiveImage src={mediaUrl} alt="TikTok Media" debounceMs={400} />
                </div>
              ) : (
                <div className="w-full aspect-[4/5] flex flex-col items-center justify-center p-4 text-center bg-zinc-950 border-y border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-2">
                    <PlatformIcon platform="tiktok" size={20} />
                  </div>
                  <span className="text-xs text-rose-400 font-bold">Media Required for TikTok</span>
                  <span className="text-[10px] text-zinc-400 mt-1">Photo or video attachment required</span>
                </div>
              )}
            </div>

            {/* Right Action Rail (Overlay with Generous Vertical Spacing) */}
            <div className="absolute right-3 bottom-20 z-30 flex flex-col items-center gap-4">
              {/* Avatar + Plus Follow Badge */}
              <div className="relative cursor-pointer mb-1">
                <div className="w-10 h-10 rounded-full bg-[#E04B2F] border-2 border-white flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {config.mockHandle.slice(1, 2).toUpperCase() || 'H'}
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FE2C55] text-white flex items-center justify-center shadow-md">
                  <Plus className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              {/* Heart Button */}
              <div className="flex flex-col items-center cursor-pointer group">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="drop-shadow-md transition-transform group-hover:scale-110">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-[11px] font-bold text-white drop-shadow mt-0.5 tracking-wider">...</span>
              </div>

              {/* Comments Button (Speech bubble with 3 dots) */}
              <div className="flex flex-col items-center cursor-pointer group">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="white" className="drop-shadow-md transition-transform group-hover:scale-110">
                  <path d="M12 2C6.48 2 2 6.03 2 11c0 2.68 1.34 5.08 3.44 6.72-.25 1.48-.96 2.92-1.95 4.02a.5.5 0 0 0 .51.81c2.42-.4 4.58-1.5 6-2.55.65.1 1.32.16 2 .16 5.52 0 10-4.03 10-9s-4.48-9-10-9z" />
                  <circle cx="8" cy="11" r="1.1" fill="black" />
                  <circle cx="12" cy="11" r="1.1" fill="black" />
                  <circle cx="16" cy="11" r="1.1" fill="black" />
                </svg>
                <span className="text-[11px] font-bold text-white drop-shadow mt-0.5 tracking-wider">...</span>
              </div>

              {/* Bookmark Ribbon */}
              <div className="flex flex-col items-center cursor-pointer group">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="drop-shadow-md transition-transform group-hover:scale-110">
                  <path d="M5 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v19l-7-4-7 4V3z" />
                </svg>
                <span className="text-[11px] font-bold text-white drop-shadow mt-0.5 tracking-wider">...</span>
              </div>

              {/* Share Curved Arrow */}
              <div className="flex flex-col items-center cursor-pointer group">
                <svg width="25" height="25" viewBox="0 0 24 24" fill="white" className="drop-shadow-md transition-transform group-hover:scale-110">
                  <path d="M14 4.5V9C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19.5L22 12l-8-7.5z" />
                </svg>
                <span className="text-[11px] font-bold text-white drop-shadow mt-0.5 tracking-wider">...</span>
              </div>

              {/* Spinning Vinyl Record Disc */}
              <div className="relative pt-1 cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-[#18181b] border-2 border-[#27272a] shadow-xl flex items-center justify-center animate-[spin_4s_linear_infinite] overflow-hidden relative">
                  <div className="w-6 h-6 rounded-full border border-zinc-700/60 flex items-center justify-center z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Caption & Audio Overlay (Above Bottom Bar) */}
            <div className="relative z-20 px-4 pb-3 space-y-1.5 bg-gradient-to-t from-black via-black/90 to-transparent pt-4 pr-16">
              {/* Username + Photo Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[13px] text-white tracking-tight">
                  {config.mockHandle.replace('@', '')}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800/90 border border-zinc-700/60 text-[10px] font-semibold text-white shadow-sm">
                  <Camera className="w-3 h-3 text-white" />
                  <span>Photo</span>
                </span>
              </div>

              {/* Caption Text */}
              {effectiveContent && (
                <p className="text-xs text-white/95 leading-relaxed break-words [overflow-wrap:anywhere] pt-0.5">
                  {effectiveContent}
                </p>
              )}

              {/* Audio Track Row */}
              <div className="flex items-center gap-2 text-[11px] text-zinc-300 pt-1">
                <Music2 className="w-3 h-3 text-white shrink-0 animate-pulse" />
                <span className="truncate">
                  sound - {config.mockHandle.replace('@', '')} &nbsp;&nbsp;&nbsp; Original sound - {config.mockHandle.replace('@', '')}
                </span>
              </div>
            </div>

            {/* Bottom Navigation Bar (Home | Friends | '+' | Inbox | Me) */}
            <div className="relative z-30 bg-black border-t border-zinc-900 px-4 py-2.5 flex items-center justify-between text-zinc-400">
              {/* Home (Active) */}
              <div className="flex flex-col items-center gap-1 cursor-pointer text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span className="text-[10px] font-bold">Home</span>
              </div>

              {/* Friends */}
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-zinc-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <span className="text-[10px] font-medium">Friends</span>
              </div>

              {/* Iconic TikTok Create '+' Button (Cyan & Magenta Layers) */}
              <div className="relative cursor-pointer mx-1.5">
                <div className="w-10 h-7 rounded-lg relative flex items-center justify-center">
                  {/* Cyan left layer */}
                  <div className="absolute inset-y-0 left-0 w-8 bg-[#25F4EE] rounded-lg -translate-x-1" />
                  {/* Magenta right layer */}
                  <div className="absolute inset-y-0 right-0 w-8 bg-[#FE2C55] rounded-lg translate-x-1" />
                  {/* White center pill */}
                  <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center z-10 shadow-sm">
                    <Plus className="w-4 h-4 text-black stroke-[3]" />
                  </div>
                </div>
              </div>

              {/* Inbox */}
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-zinc-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
                <span className="text-[10px] font-medium">Inbox</span>
              </div>

              {/* Me */}
              <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-zinc-200">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="text-[10px] font-medium">Me</span>
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
