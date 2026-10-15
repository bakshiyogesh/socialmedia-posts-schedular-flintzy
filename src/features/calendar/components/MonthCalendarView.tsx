'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { PostCard } from '@/features/posts/components/PostCard';
import type { Post } from '@/types';

interface MonthCalendarViewProps {
  posts: Post[];
  onDuplicatePost: (post: Post) => void;
  onScheduleForDate?: (dateKey: string) => void;
}

export function MonthCalendarView({
  posts,
  onDuplicatePost,
  onScheduleForDate,
}: MonthCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigate months
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const resetToToday = () => {
    setCurrentDate(new Date());
    setSelectedDayKey(null);
  };

  // Month metadata
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate);
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Map posts by local YYYY-MM-DD
  const postsByDate = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of posts) {
      const d = new Date(post.scheduledAt);
      if (!isNaN(d.getTime())) {
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(post);
      }
    }
    return map;
  }, [posts]);

  // Generate calendar days
  const calendarCells = useMemo(() => {
    const cells: { dayNumber: number | null; dateKey: string | null }[] = [];
    // Blank leading days
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push({ dayNumber: null, dateKey: null });
    }
    // Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cells.push({ dayNumber: day, dateKey });
    }
    return cells;
  }, [year, month, firstDayOfWeek, daysInMonth]);

  const todayKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const selectedPosts = selectedDayKey ? postsByDate.get(selectedDayKey) || [] : [];

  return (
    <div className="space-y-6">
      {/* Month Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">{monthName}</h2>
            <p className="text-xs text-zinc-400">Post density by calendar day</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetToToday}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors border border-zinc-700"
          >
            Today
          </button>
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-l-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-r-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        {/* Days of Week */}
        <div className="grid grid-cols-7 border-b border-zinc-800 bg-zinc-900/60 text-center py-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 gap-px bg-zinc-800/40">
          {calendarCells.map((cell, idx) => {
            if (!cell.dayNumber || !cell.dateKey) {
              return <div key={`empty-${idx}`} className="bg-zinc-950/40 min-h-[75px] sm:min-h-[90px]" />;
            }

            const dayPosts = postsByDate.get(cell.dateKey) || [];
            const isToday = cell.dateKey === todayKey;
            const isSelected = cell.dateKey === selectedDayKey;

            const scheduledCount = dayPosts.filter((p) => p.status === 'scheduled').length;
            const publishedCount = dayPosts.filter((p) => p.status === 'published').length;
            const failedCount = dayPosts.filter((p) => p.status === 'failed').length;

            return (
              <button
                key={cell.dateKey}
                type="button"
                onClick={() => {
                  setSelectedDayKey(cell.dateKey);
                  onScheduleForDate?.(cell.dateKey!);
                }}
                className={`group min-h-[75px] sm:min-h-[90px] p-2 text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-950/40 ring-2 ring-indigo-500 z-10'
                    : 'bg-zinc-950/90 hover:bg-zinc-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold rounded-md px-1.5 py-0.5 ${
                      isToday
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-zinc-300'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  <div className="flex items-center gap-1">
                    {dayPosts.length > 0 && (
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {dayPosts.length}
                      </span>
                    )}

                    {onScheduleForDate && (
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onScheduleForDate(cell.dateKey!);
                        }}
                        title={`Schedule post for ${cell.dateKey}`}
                        className="w-5 h-5 rounded flex items-center justify-center text-zinc-500 hover:text-white hover:bg-indigo-600 transition-colors opacity-70 sm:opacity-0 group-hover:opacity-100"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Post Count Indicator Dots */}
                <div className="flex items-center gap-1 flex-wrap mt-1">
                  {scheduledCount > 0 && (
                    <span
                      title={`${scheduledCount} scheduled`}
                      className="w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-indigo-500/20"
                    />
                  )}
                  {publishedCount > 0 && (
                    <span
                      title={`${publishedCount} published`}
                      className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"
                    />
                  )}
                  {failedCount > 0 && (
                    <span
                      title={`${failedCount} failed`}
                      className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/30 animate-pulse"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Posts Drawer/List */}
      {selectedDayKey && (
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Posts for {selectedDayKey}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedPosts.length} {selectedPosts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>

            {onScheduleForDate && (
              <button
                type="button"
                onClick={() => onScheduleForDate(selectedDayKey)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule for this Day</span>
              </button>
            )}
          </div>

          {selectedPosts.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-2">
              No posts scheduled for this day.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedPosts.map((post) => (
                <PostCard key={post.id} post={post} onDuplicate={onDuplicatePost} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
