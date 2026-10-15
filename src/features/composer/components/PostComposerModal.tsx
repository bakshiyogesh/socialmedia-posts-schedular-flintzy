'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Send, Image as ImageIcon, SlidersHorizontal } from 'lucide-react';
import { PlatformSelector } from './PlatformSelector';
import { CharacterCounters } from './CharacterCounters';
import { PreFlightPanel } from './PreFlightPanel';
import { DateTimePicker } from './DateTimePicker';
import { PlatformPreview } from './PlatformPreview';
import { validatePost, type PostFormInput } from '../utils/validation';
import { useCreatePostMutation } from '@/features/posts/hooks/usePosts';
import { PLATFORMS } from '@/config/platforms';
import type { PlatformId, Post, DraftPost } from '@/types';
import { toast } from 'sonner';
import { ProgressiveImage, type ImageLoadState } from '@/components/shared/ProgressiveImage';

const DRAFT_STORAGE_KEY = 'flintzy_composer_draft';
const DEFAULT_PLATFORMS: PlatformId[] = ['x', 'instagram'];
const defaultScheduledAt = () => new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString();

interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPost?: Post | null;
}

export function PostComposerModal({
  isOpen,
  onClose,
  initialPost,
}: PostComposerModalProps) {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<PlatformId[]>(DEFAULT_PLATFORMS);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaLoadState, setMediaLoadState] = useState<ImageLoadState>('idle');
  // Default +2 hours in future
  const [scheduledAt, setScheduledAt] = useState<string>(defaultScheduledAt);
  const [overrides, setOverrides] = useState<Partial<Record<PlatformId, { content?: string }>>>({});
  const [showOverrides, setShowOverrides] = useState(false);
  const [hasDraftPrompt, setHasDraftPrompt] = useState(false);

  /**
   * The modal stays mounted while closed, so state must be reset explicitly.
   * Prefills from `source` when duplicating, otherwise returns to a blank form.
   */
  const resetForm = useCallback((source?: Post | null) => {
    setContent(source?.content ?? '');
    setPlatforms(source?.platforms ?? DEFAULT_PLATFORMS);
    setMediaUrl(source?.mediaUrl ?? '');
    setMediaLoadState('idle');
    setScheduledAt(defaultScheduledAt());
    setOverrides(source?.platformOverrides ?? {});
    setShowOverrides(false);
    setHasDraftPrompt(false);
  }, []);

  // Start every open from a clean slate (or the duplicated post),
  // then offer to restore an unsent draft for brand-new posts.
  // Also clear on close so stale state never leaks into the next session
  // (unsent work is already persisted by the autosave below).
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }
    resetForm(initialPost);

    if (initialPost) return;
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const draft: DraftPost = JSON.parse(saved);
        if (draft.content || draft.mediaUrl) {
          setHasDraftPrompt(true);
        }
      }
    } catch {
      // Ignore JSON error
    }
  }, [isOpen, initialPost, resetForm]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // Autosave draft to localStorage (only while open, and only when there is real work to save)
  useEffect(() => {
    if (isOpen && !initialPost && (content.trim() || mediaUrl.trim())) {
      const draft: DraftPost = {
        content,
        platforms,
        mediaUrl,
        scheduledAt,
        platformOverrides: overrides,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }
  }, [isOpen, content, platforms, mediaUrl, scheduledAt, overrides, initialPost]);

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const draft: DraftPost = JSON.parse(saved);
        setContent(draft.content || '');
        setPlatforms(draft.platforms || ['x']);
        setMediaUrl(draft.mediaUrl || '');
        if (draft.scheduledAt) setScheduledAt(draft.scheduledAt);
        if (draft.platformOverrides) setOverrides(draft.platformOverrides);
        toast.success('Draft restored');
      }
    } catch {
      toast.error('Failed to restore draft');
    }
    setHasDraftPrompt(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraftPrompt(false);
  };

  const handleTogglePlatform = (pid: PlatformId) => {
    setPlatforms((prev) =>
      prev.includes(pid) ? prev.filter((p) => p !== pid) : [...prev, pid]
    );
  };

  // Pre-flight validation calculation
  const formInput: PostFormInput = useMemo(
    () => ({
      content,
      platforms,
      mediaUrl: mediaUrl.trim()
        ? mediaUrl.trim().startsWith('http')
          ? mediaUrl.trim()
          : `https://${mediaUrl.trim()}`
        : undefined,
      scheduledAt,
      platformOverrides: overrides,
    }),
    [content, platforms, mediaUrl, scheduledAt, overrides]
  );

  const validation = useMemo(() => validatePost(formInput), [formInput]);

  const createMutation = useCreatePostMutation(() => {
    // Post is persisted: drop the draft and clear the form so the next open is blank.
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    resetForm();
    onClose();
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      toast.error('Cannot schedule: Please resolve pre-flight issues.');
      return;
    }
    createMutation.mutate(formInput);
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to schedule
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isOpen && validation.isValid) {
        e.preventDefault();
        createMutation.mutate(formInput);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, validation.isValid, createMutation, formInput]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="composer-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
          <div>
            <h2 id="composer-title" className="text-base font-bold text-zinc-100">
              {initialPost ? 'Duplicate Post' : 'New Multi-Channel Post'}
            </h2>
            <p className="text-xs text-zinc-400">
              One composer. Live pre-flight verification across all channel APIs.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Close composer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Draft Recovery Notification */}
        {hasDraftPrompt && (
          <div className="bg-indigo-950/50 border-b border-indigo-900/50 px-5 py-2.5 flex items-center justify-between text-xs text-indigo-300">
            <span>You have an unsaved draft from a previous session.</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={restoreDraft}
                className="font-semibold text-white underline hover:no-underline"
              >
                Restore
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={discardDraft}
                className="text-indigo-400 hover:text-indigo-200"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Main Body: Two Column Layout on Desktop */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0 w-full">
          {/* Left Column: Form Controls (7 cols) */}
          <div className="lg:col-span-7 min-w-0 w-full space-y-5">
            {/* Target Channel Selection */}
            <PlatformSelector
              selectedPlatforms={platforms}
              onTogglePlatform={handleTogglePlatform}
            />

            {/* Post Content Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-300">
                  Caption / Text Copy <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowOverrides(!showOverrides)}
                  className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>{showOverrides ? 'Hide overrides' : 'Customize per platform'}</span>
                </button>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                placeholder="What do you want to share with your audience? Write once, verify everywhere..."
                className="w-full min-w-0 p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y leading-relaxed font-sans"
              />

              {/* Per-Platform Live Counters */}
              <CharacterCounters
                selectedPlatforms={platforms}
                charCounts={validation.charCounts}
              />
            </div>

            {/* Per-Platform Overrides Section (Optional staff differentiator) */}
            {showOverrides && platforms.length > 0 && (
              <div className="p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-semibold text-zinc-300">
                  Platform Specific Content Overrides
                </h4>
                {platforms.map((pid) => (
                  <div key={pid} className="space-y-1">
                    <span className="text-[11px] text-zinc-400 font-medium">
                      Customize caption for {PLATFORMS[pid].name}:
                    </span>
                    <input
                      type="text"
                      value={overrides[pid]?.content || ''}
                      placeholder={`Leave blank to use main caption (${PLATFORMS[pid].charLimit} max)`}
                      onChange={(e) =>
                        setOverrides({
                          ...overrides,
                          [pid]: { content: e.target.value },
                        })
                      }
                      className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Media Attachment URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center justify-between">
                <span>Media Attachment URL (Image or Video)</span>
                <span className="text-[11px] text-zinc-500 font-normal">
                  Required for Instagram & TikTok
                </span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or paste image link"
                  className="w-full pl-9 pr-8 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                />
                {mediaUrl && (
                  <button
                    type="button"
                    onClick={() => setMediaUrl('')}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-500 hover:text-zinc-300"
                    title="Remove media"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sample Media Presets */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500">Or pick a verified sample asset:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { label: '🚀 Launch Graphic', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
                    { label: '☕ Creative Workspace', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80' },
                    { label: '📊 Analytics Chart', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80' },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMediaUrl(preset.url)}
                      className="px-2 py-0.5 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Thumbnail Preview in Composer */}
              {mediaUrl.trim() && (
                <div className="flex items-center gap-3 p-2 bg-zinc-900/60 rounded-xl border border-zinc-800">
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shrink-0">
                    <ProgressiveImage
                      src={mediaUrl}
                      alt="Thumbnail preview"
                      debounceMs={400}
                      compact
                      onStateChange={setMediaLoadState}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    {mediaLoadState === 'error' ? (
                      <p className="text-xs font-semibold text-rose-400 flex items-center gap-1">
                        <span>✕</span> Couldn&apos;t load this media URL
                      </p>
                    ) : mediaLoadState === 'loaded' ? (
                      <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <span>✓</span> Media Attached
                      </p>
                    ) : (
                      <p className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border-2 border-zinc-600 border-t-indigo-400 animate-spin" />
                        Fetching media…
                      </p>
                    )}
                    <p className="text-[11px] text-zinc-400 truncate font-mono">
                      {mediaUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Date-Time Picker with Local / UTC logic */}
            <DateTimePicker
              scheduledAtUtc={scheduledAt}
              onChange={(utc) => setScheduledAt(utc)}
            />

            {/* Pre-Flight Panel */}
            <PreFlightPanel validation={validation} />
          </div>

          {/* Right Column: Live Simulated Preview (5 cols) */}
          <div className="lg:col-span-5 min-w-0 w-full flex flex-col min-h-[380px] lg:border-l lg:border-zinc-800/80 lg:pl-6 overflow-hidden">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Live Feed Simulation
            </h3>
            <PlatformPreview
              selectedPlatforms={platforms}
              content={content}
              mediaUrl={mediaUrl}
              overrides={overrides}
            />
          </div>
        </form>

        {/* Footer Actions Bar */}
        <div className="px-5 py-3 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between">
          <div className="text-[11px] text-zinc-400 hidden sm:block">
            <span>Press </span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 font-mono text-zinc-300">
              Cmd + Enter
            </kbd>
            <span> to schedule when ready.</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!validation.isValid || createMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/25 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {createMutation.isPending ? 'Scheduling...' : 'Schedule Post'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
