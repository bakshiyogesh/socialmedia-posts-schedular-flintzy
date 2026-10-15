'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { formatLocalDateTimeWithTz, getUserTimeZoneAbbr } from '@/lib/time';

interface DateTimePickerProps {
  scheduledAtUtc?: string; // ISO UTC string
  onChange: (isoUtcString: string) => void;
}

/**
 * Format a Date to local YYYY-MM-DD for native date input without UTC day-shift
 */
function toLocalDateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a Date to local HH:mm for native time input
 */
function toLocalTimeString(d: Date): string {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function DateTimePicker({ scheduledAtUtc, onChange }: DateTimePickerProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);

  // Local date formatted as YYYY-MM-DD
  const [dateStr, setDateStr] = useState<string>(() => {
    const d = scheduledAtUtc ? new Date(scheduledAtUtc) : new Date(Date.now() + 1000 * 60 * 60 * 2);
    return toLocalDateString(isNaN(d.getTime()) ? new Date() : d);
  });

  // Local time formatted as HH:mm
  const [timeStr, setTimeStr] = useState<string>(() => {
    const d = scheduledAtUtc ? new Date(scheduledAtUtc) : new Date(Date.now() + 1000 * 60 * 60 * 2);
    return toLocalTimeString(isNaN(d.getTime()) ? new Date() : d);
  });

  const tzAbbr = getUserTimeZoneAbbr();
  const minDateStr = toLocalDateString(new Date());

  // Synchronize internal state whenever external scheduledAtUtc changes (e.g. restore draft, duplicate, reset)
  useEffect(() => {
    if (!scheduledAtUtc) return;
    const d = new Date(scheduledAtUtc);
    if (!isNaN(d.getTime())) {
      const nextDate = toLocalDateString(d);
      const nextTime = toLocalTimeString(d);
      setDateStr((curr) => (curr !== nextDate ? nextDate : curr));
      setTimeStr((curr) => (curr !== nextTime ? nextTime : curr));
    }
  }, [scheduledAtUtc]);

  // Recompute UTC when date or time changes
  useEffect(() => {
    if (!dateStr || !timeStr) return;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (year && month && day && hours !== undefined && minutes !== undefined) {
        const localDate = new Date(year, month - 1, day, hours, minutes, 0);
        onChange(localDate.toISOString());
      }
    } catch {
      // Ignore parse errors while typing
    }
  }, [dateStr, timeStr, onChange]);

  // Suggested posting times (AI / High-engagement slots)
  const suggestions = [
    {
      label: 'Today 3:00 PM',
      badge: 'Best for B2B',
      getDate: () => {
        const d = new Date();
        d.setHours(15, 0, 0, 0);
        // If 3 PM today has already passed, schedule for tomorrow 3 PM
        if (d.getTime() <= Date.now()) {
          d.setDate(d.getDate() + 1);
        }
        return d;
      },
    },
    {
      label: 'Tomorrow 9:00 AM',
      badge: 'Peak Engagement',
      getDate: () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(9, 0, 0, 0);
        return d;
      },
    },
    {
      label: 'Tomorrow 7:00 PM',
      badge: 'High Reach',
      getDate: () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        d.setHours(19, 0, 0, 0);
        return d;
      },
    },
  ];

  const applySuggestion = (getDate: () => Date) => {
    const d = getDate();
    setDateStr(toLocalDateString(d));
    setTimeStr(toLocalTimeString(d));
  };

  const handleOpenDatePicker = () => {
    try {
      dateInputRef.current?.showPicker?.();
    } catch {
      dateInputRef.current?.focus();
    }
  };

  const handleOpenTimePicker = () => {
    try {
      timeInputRef.current?.showPicker?.();
    } catch {
      timeInputRef.current?.focus();
    }
  };

  return (
    <div className="space-y-3">
      {/* Header with Zone Badge */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span>Publish Date & Time</span>
          <span className="text-rose-400">*</span>
        </label>
        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md flex items-center gap-1">
          <span>Timezone:</span>
          <strong className="text-indigo-400 font-semibold">{tzAbbr || 'Local'}</strong>
        </span>
      </div>

      {/* Date & Time Input Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Date Selector Card */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Date</span>
            <span className="text-zinc-600 font-normal">YYYY-MM-DD</span>
          </span>
          <div
            onClick={handleOpenDatePicker}
            className="group relative flex items-center bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {/* Themed Prominent Icon Badge */}
            <div className="pl-3 pr-2 py-2 flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors pointer-events-none">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <CalendarIcon className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <input
              ref={dateInputRef}
              type="date"
              value={dateStr}
              min={minDateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full pr-3 py-2.5 bg-transparent text-xs font-medium text-zinc-100 placeholder-zinc-500 focus:outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Time Selector Card */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Time</span>
            <span className="text-zinc-600 font-normal">HH : MM</span>
          </span>
          <div
            onClick={handleOpenTimePicker}
            className="group relative flex items-center bg-zinc-900/90 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {/* Themed Prominent Icon Badge */}
            <div className="pl-3 pr-2 py-2 flex items-center text-indigo-400 group-hover:text-indigo-300 transition-colors pointer-events-none">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Clock className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <input
              ref={timeInputRef}
              type="time"
              value={timeStr}
              onChange={(e) => setTimeStr(e.target.value)}
              className="w-full pr-3 py-2.5 bg-transparent text-xs font-mono font-medium text-zinc-100 focus:outline-none cursor-pointer [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {/* Suggested Posting Times */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Recommended peak timeslots:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applySuggestion(s.getDate)}
              className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-indigo-500/40 text-[11px] text-zinc-300 hover:text-white transition-all shadow-sm"
            >
              <span className="font-medium">{s.label}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                {s.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Live Confirmation Preview Card */}
      {scheduledAtUtc && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 p-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/70 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-zinc-300 font-medium truncate">
              {formatLocalDateTimeWithTz(scheduledAtUtc)}
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 self-start sm:self-auto shrink-0">
            UTC {new Date(scheduledAtUtc).toISOString().replace('T', ' ').slice(0, 16)}Z
          </span>
        </div>
      )}
    </div>
  );
}
