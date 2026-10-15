'use client';

import React, { useState } from 'react';
import { PlatformIcon } from '@/components/shared/PlatformIcons';
import { PLATFORMS } from '@/config/platforms';
import { Heart, MessageCircle, Repeat2, Share, Bookmark, Music2, ThumbsUp } from 'lucide-react';
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
                  ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <PlatformIcon platform={pid} size={14} />
              <span>{PLATFORMS[pid].shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Simulated Preview Card */}
      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 overflow-y-auto overflow-x-hidden max-h-[480px] min-w-0 w-full">
        {/* X PREVIEW */}
        {currentPlatform === 'x' && (
          <div className="space-y-3 min-w-0 w-full">
            <div className="flex items-start gap-3 min-w-0 w-full">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
                F
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 leading-tight flex-wrap">
                  <span className="font-bold text-sm text-zinc-100">Flintzy</span>
                  <span className="text-xs text-zinc-500">{config.mockHandle}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-xs text-zinc-500">Now</span>
                </div>
                <p className="mt-2 text-sm text-zinc-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
                  {effectiveContent || <span className="text-zinc-600 italic">Start typing your post...</span>}
                </p>
              </div>
            </div>

            {mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-video w-full">
                <ProgressiveImage src={mediaUrl} alt="Preview" debounceMs={400} />
              </div>
            )}

            <div className="flex items-center justify-between text-zinc-500 text-xs pt-2 border-t border-zinc-900">
              <span className="flex items-center gap-1 hover:text-indigo-400">
                <MessageCircle className="w-4 h-4" /> 12
              </span>
              <span className="flex items-center gap-1 hover:text-emerald-400">
                <Repeat2 className="w-4 h-4" /> 4
              </span>
              <span className="flex items-center gap-1 hover:text-rose-400">
                <Heart className="w-4 h-4" /> 48
              </span>
              <span className="flex items-center gap-1 hover:text-zinc-300">
                <Share className="w-4 h-4" />
              </span>
            </div>
          </div>
        )}

        {/* INSTAGRAM PREVIEW */}
        {currentPlatform === 'instagram' && (
          <div className="space-y-3 max-w-sm mx-auto bg-black rounded-xl border border-zinc-800 p-3 min-w-0 w-full overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-xs font-bold text-white">
                    F
                  </div>
                </div>
                <span className="text-xs font-bold text-zinc-100">{config.mockHandle}</span>
              </div>
              <span className="text-zinc-500 text-xs">•••</span>
            </div>

            {mediaUrl ? (
              <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900 w-full">
                <ProgressiveImage src={mediaUrl} alt="Instagram Media" debounceMs={400} />
              </div>
            ) : (
              <div className="aspect-square rounded-lg bg-zinc-900/60 border border-dashed border-rose-900/50 flex flex-col items-center justify-center p-4 text-center w-full">
                <span className="text-xs text-rose-400 font-medium">⚠️ Media Required for Instagram</span>
                <span className="text-[10px] text-zinc-500 mt-1">Provide image URL to publish</span>
              </div>
            )}

            <div className="space-y-1.5 pt-1 min-w-0 w-full">
              <div className="flex items-center justify-between text-zinc-300">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <MessageCircle className="w-4 h-4" />
                  <Share className="w-4 h-4" />
                </div>
                <Bookmark className="w-4 h-4" />
              </div>

              <div className="text-xs text-zinc-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
                <strong className="mr-1 text-white">{config.mockHandle}</strong>
                {effectiveContent || <span className="text-zinc-600 italic">Caption preview will appear here...</span>}
              </div>
            </div>
          </div>
        )}

        {/* TIKTOK PREVIEW */}
        {currentPlatform === 'tiktok' && (
          <div className="space-y-3 max-w-sm mx-auto bg-black rounded-xl border border-zinc-800 p-4 text-white min-w-0 w-full overflow-hidden">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Following</span>
              <span className="font-bold text-white">For You</span>
              <span>🔍</span>
            </div>

            {mediaUrl ? (
              <div className="relative aspect-[9/12] rounded-lg overflow-hidden bg-zinc-900 w-full">
                <ProgressiveImage src={mediaUrl} alt="TikTok Media" debounceMs={400} />
                <div className="absolute bottom-3 left-3 right-3 text-xs drop-shadow-md">
                  <span className="font-bold">{config.mockHandle}</span>
                  <p className="text-xs text-zinc-200 line-clamp-3 mt-1 break-words [overflow-wrap:anywhere]">{effectiveContent}</p>
                </div>
              </div>
            ) : (
              <div className="aspect-[9/12] rounded-lg bg-zinc-900/60 border border-dashed border-rose-900/50 flex flex-col items-center justify-center p-4 text-center w-full">
                <span className="text-xs text-rose-400 font-medium">⚠️ Media Asset Required for TikTok</span>
                <span className="text-[10px] text-zinc-500 mt-1">Short-form video / image needed</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Music2 className="w-3.5 h-3.5 animate-spin" />
              <span>Original Audio - Flintzy Creators Studio</span>
            </div>
          </div>
        )}

        {/* FACEBOOK PREVIEW */}
        {currentPlatform === 'facebook' && (
          <div className="space-y-3 bg-zinc-900/50 rounded-xl border border-zinc-800 p-4 min-w-0 w-full overflow-hidden">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
                F
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100">{config.mockHandle}</p>
                <p className="text-[10px] text-zinc-500">Just now · 🌎 Public</p>
              </div>
            </div>

            <p className="text-xs text-zinc-200 whitespace-pre-wrap break-words [overflow-wrap:anywhere] leading-relaxed">
              {effectiveContent || <span className="text-zinc-600 italic">What is on your mind?</span>}
            </p>

            {mediaUrl && (
              <div className="rounded-lg overflow-hidden border border-zinc-800 aspect-video bg-zinc-950 w-full">
                <ProgressiveImage src={mediaUrl} alt="Facebook attachment" debounceMs={400} />
              </div>
            )}

            <div className="flex items-center justify-around pt-2 border-t border-zinc-800 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 hover:text-blue-400 cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5" /> Like
              </span>
              <span className="flex items-center gap-1.5 hover:text-zinc-200 cursor-pointer">
                <MessageCircle className="w-3.5 h-3.5" /> Comment
              </span>
              <span className="flex items-center gap-1.5 hover:text-zinc-200 cursor-pointer">
                <Share className="w-3.5 h-3.5" /> Share
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
