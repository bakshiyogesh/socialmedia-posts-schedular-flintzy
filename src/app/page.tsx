'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Plus, Layers, Calendar } from 'lucide-react';
import {
  usePostsQuery,
  useBulkDeleteMutation,
  useDeletePostMutation,
} from '@/features/posts/hooks/usePosts';
import { StatusSummaryStrip } from '@/features/posts/components/StatusSummaryStrip';
import { BulkRetryBanner } from '@/features/posts/components/BulkRetryBanner';
import { FilterBar } from '@/features/filters/components/FilterBar';
import { PostQueue } from '@/features/posts/components/PostQueue';
import { MonthCalendarView } from '@/features/calendar/components/MonthCalendarView';
import { PostComposerModal } from '@/features/composer/components/PostComposerModal';
import { OAuthReconnectModal } from '@/features/posts/components/OAuthReconnectModal';
import { RescheduleModal } from '@/features/posts/components/RescheduleModal';
import { DeleteConfirmModal } from '@/features/posts/components/DeleteConfirmModal';
import { BulkActionsFloatingBar } from '@/features/posts/components/BulkActionsFloatingBar';
import { filterPosts, computeStatusCounts } from '@/features/filters/utils/filterPosts';
import type { FilterState, PlatformId, Post, PostStatus } from '@/types';

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<'queue' | 'calendar'>('queue');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerPost, setComposerPost] = useState<Post | null>(null);
  const [composerMode, setComposerMode] = useState<'create' | 'edit'>('create');
  const [composerInitialDate, setComposerInitialDate] = useState<string | null>(null);
  const [reconnectPost, setReconnectPost] = useState<Post | null>(null);
  const [reschedulePost, setReschedulePost] = useState<Post | null>(null);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [bulkRescheduleIds, setBulkRescheduleIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'single' | 'bulk';
    ids: string[];
    post?: Post;
  } | null>(null);

  const bulkDeleteMutation = useBulkDeleteMutation();
  const singleDeleteMutation = useDeletePostMutation();

  // 1. Synchronize Filter State with URL Query Parameters
  const activePlatforms = useMemo<PlatformId[]>(() => {
    const raw = searchParams.get('platforms');
    if (!raw) return [];
    return raw.split(',').filter(Boolean) as PlatformId[];
  }, [searchParams]);

  const activeStatus = useMemo<PostStatus | 'all'>(() => {
    const raw = searchParams.get('status');
    if (raw === 'scheduled' || raw === 'published' || raw === 'failed') {
      return raw;
    }
    return 'all';
  }, [searchParams]);

  const searchQuery = useMemo<string>(() => {
    return searchParams.get('q') || '';
  }, [searchParams]);

  const activeDate = useMemo<string>(() => {
    return searchParams.get('date') || 'all';
  }, [searchParams]);

  const filters: FilterState = useMemo(
    () => ({
      platforms: activePlatforms,
      status: activeStatus,
      q: searchQuery,
      date: activeDate,
    }),
    [activePlatforms, activeStatus, searchQuery, activeDate]
  );

  const updateFiltersInUrl = useCallback(
    (newFilters: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newFilters.platforms !== undefined) {
        if (newFilters.platforms.length > 0) {
          params.set('platforms', newFilters.platforms.join(','));
        } else {
          params.delete('platforms');
        }
      }

      if (newFilters.status !== undefined) {
        if (newFilters.status !== 'all') {
          params.set('status', newFilters.status);
        } else {
          params.delete('status');
        }
      }

      if (newFilters.q !== undefined) {
        if (newFilters.q.trim().length > 0) {
          params.set('q', newFilters.q.trim());
        } else {
          params.delete('q');
        }
      }

      if (newFilters.date !== undefined) {
        if (newFilters.date && newFilters.date !== 'all') {
          params.set('date', newFilters.date.trim());
        } else {
          params.delete('date');
        }
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  const handleResetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  // 2. Fetch Posts via TanStack Query
  const { data: allPosts = [], isLoading, isError, refetch } = usePostsQuery();

  // 3. Compute live summary counts derived from full unfiltered collection
  const statusCounts = useMemo(() => computeStatusCounts(allPosts), [allPosts]);

  // 4. Apply pure client-side filter
  const filteredPosts = useMemo(
    () => filterPosts(allPosts, filters),
    [allPosts, filters]
  );

  const hasActiveFilters =
    filters.platforms.length > 0 ||
    filters.status !== 'all' ||
    filters.q !== '' ||
    (Boolean(filters.date) && filters.date !== 'all');

  // 5. Global 'C' shortcut to open composer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'c' || e.key === 'C') &&
        !isComposerOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setComposerPost(null);
        setIsComposerOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isComposerOpen]);

  const handleDuplicate = (post: Post) => {
    setComposerPost(post);
    setComposerMode('create');
    setComposerInitialDate(null);
    setIsComposerOpen(true);
  };

  const handleEdit = (post: Post) => {
    setComposerPost(post);
    setComposerMode('edit');
    setComposerInitialDate(null);
    setIsComposerOpen(true);
  };

  const handleFixDimensions = (post: Post) => {
    // Open in composer with compliant Unsplash 4:5 image URL
    setComposerPost({
      ...post,
      mediaUrl: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=800&auto=format&fit=crop&q=80',
    });
    setComposerMode('create');
    setComposerInitialDate(null);
    setIsComposerOpen(true);
  };

  const handleOpenNew = () => {
    setComposerPost(null);
    setComposerMode('create');
    setComposerInitialDate(null);
    setIsComposerOpen(true);
  };

  const handleScheduleForDate = (dateKey: string) => {
    setComposerPost(null);
    setComposerMode('create');
    setComposerInitialDate(dateKey);
    setIsComposerOpen(true);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeletePost = (post: Post) => {
    setDeleteTarget({
      type: 'single',
      ids: [post.id],
      post,
    });
  };

  const handleBulkDelete = () => {
    if (selectedPostIds.length === 0) return;
    setDeleteTarget({
      type: 'bulk',
      ids: selectedPostIds,
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'bulk') {
      const idsToDelete = deleteTarget.ids;
      setDeleteTarget(null);
      bulkDeleteMutation.mutate(idsToDelete, {
        onSuccess: () => {
          setSelectedPostIds([]);
        },
      });
    } else {
      const singleId = deleteTarget.ids[0];
      setDeleteTarget(null);
      singleDeleteMutation.mutate(singleId, {
        onSuccess: () => {
          setSelectedPostIds((prev) => prev.filter((id) => id !== singleId));
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Value Proposition */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white font-black text-lg">
              F
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Flintzy
                </span>
                {/* <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Scheduler
                </span> */}
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Never publish something broken.
              </p>
            </div>
          </div>

          {/* Action CTAs & View Switcher */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle (Queue vs Calendar) */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('queue')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'queue'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Timeline</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('calendar')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'calendar'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                  }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Month</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px]">C</kbd>
              <span>Compose</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] ml-1">/</kbd>
              <span>Search</span>
            </div>

            <button
              type="button"
              onClick={handleOpenNew}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule Post</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Bulk Retry Banner for Failed Posts */}
        <BulkRetryBanner failedCount={statusCounts.failed} />

        {/* Status Summary Strip (Clickable status counts driving URL filter) */}
        <StatusSummaryStrip
          counts={statusCounts}
          activeStatus={filters.status}
          onSelectStatus={(status) => updateFiltersInUrl({ status })}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          filters={filters}
          onUpdateFilters={updateFiltersInUrl}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Mode View Rendering */}
        {viewMode === 'calendar' ? (
          <MonthCalendarView
            posts={filteredPosts}
            onDuplicatePost={handleDuplicate}
            onScheduleForDate={handleScheduleForDate}
            onEditPost={handleEdit}
            onReschedulePost={(post) => setReschedulePost(post)}
            onDeletePost={handleDeletePost}
          />
        ) : (
          <>
            {/* Queue Header & Active Count */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-zinc-200">
                  Publishing Timeline
                </h2>
                <span className="text-xs text-zinc-500">
                  ({filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} displayed)
                </span>
              </div>
            </div>

            {/* Grouped Queue */}
            <PostQueue
              posts={filteredPosts}
              isLoading={isLoading}
              isError={isError}
              onRetryQuery={() => refetch()}
              hasFilters={hasActiveFilters}
              onClearFilters={handleResetFilters}
              onOpenComposer={handleOpenNew}
              selectedPostIds={selectedPostIds}
              onToggleSelectPost={handleToggleSelect}
              onEditPost={handleEdit}
              onDuplicatePost={handleDuplicate}
              onReschedulePost={(post) => setReschedulePost(post)}
              onReconnectAccount={(post) => setReconnectPost(post)}
              onFixDimensions={handleFixDimensions}
              onDeletePost={handleDeletePost}
            />
          </>
        )}
      </main>

      {/* Floating Bulk Actions Toolbar */}
      <BulkActionsFloatingBar
        selectedCount={selectedPostIds.length}
        onReschedule={() => setBulkRescheduleIds(selectedPostIds)}
        onDelete={handleBulkDelete}
        onClear={() => setSelectedPostIds([])}
        isDeleting={bulkDeleteMutation.isPending || singleDeleteMutation.isPending}
      />

      {/* Post Composer Modal */}
      <PostComposerModal
        isOpen={isComposerOpen}
        mode={composerMode}
        onClose={() => {
          setIsComposerOpen(false);
          setComposerPost(null);
          setComposerInitialDate(null);
          setComposerMode('create');
        }}
        initialPost={composerPost}
        initialDate={composerInitialDate}
      />

      {/* OAuth Reconnect Dialog */}
      <OAuthReconnectModal
        post={reconnectPost}
        onClose={() => setReconnectPost(null)}
      />

      {/* Inline Reschedule Dialog (Supports Single & Bulk) */}
      <RescheduleModal
        post={reschedulePost}
        postIds={bulkRescheduleIds}
        onClose={() => {
          setReschedulePost(null);
          setBulkRescheduleIds([]);
        }}
        onSuccess={() => {
          setSelectedPostIds([]);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={singleDeleteMutation.isPending || bulkDeleteMutation.isPending}
        count={deleteTarget?.ids.length ?? 1}
        postExcerpt={deleteTarget?.post?.content}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs">
          Loading Flintzy Scheduler...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
