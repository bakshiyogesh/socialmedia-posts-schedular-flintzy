'use client';

import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { formatLocalDateTimeWithTz, getUserTimeZoneAbbr } from '@/lib/time';

interface DateTimePickerProps {
  scheduledAtUtc?: string; // ISO UTC string
  onChange: (isoUtcString: string) => void;
}

export function DateTimePicker({ scheduledAtUtc, onChange }: DateTimePickerProps) {
  // Local date formatted as YYYY-MM-DD for native date input
  const [dateStr, setDateStr] = useState<string>(() => {
    const d = scheduledAtUtc ? new Date(scheduledAtUtc) : new Date(Date.now() + 1000 * 60 * 60 * 2); // +2 hours
    return d.toISOString().split('T')[0] || '';
  });

  // Local time formatted as HH:mm
  const [timeStr, setTimeStr] = useState<string>(() => {
    const d = scheduledAtUtc ? new Date(scheduledAtUtc) : new Date(Date.now() + 1000 * 60 * 60 * 2);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const tzAbbr = getUserTimeZoneAbbr();

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

  // Suggested posting times (Mock configuration)
  const suggestions = [
    {
      label: 'Today 3:00 PM',
      badge: 'Best for B2B',
      getDate: () => {
        const d = new Date();
        d.setHours(15, 0, 0, 0);
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
    setDateStr(d.toISOString().split('T')[0] || '');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    setTimeStr(`${hours}:${minutes}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-zinc-300">
          Scheduled Time <span className="text-rose-400">*</span>
        </label>
        <span className="text-[11px] text-zinc-400 font-mono">
          Local Zone: <strong className="text-indigo-400">{tzAbbr || 'Local'}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Date Selector */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <input
            type="date"
            value={dateStr}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDateStr(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Time Selector */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
            <Clock className="w-4 h-4" />
          </div>
          <input
            type="time"
            value={timeStr}
            onChange={(e) => setTimeStr(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
          />
        </div>
      </div>

      {/* Suggested Posting Times */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Recommended AI timeslots (mock config):</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applySuggestion(s.getDate)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[11px] text-zinc-300 transition-colors"
            >
              <span>{s.label}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {s.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stored In UTC Confirmation Pill */}
      {scheduledAtUtc && (
        <div className="text-[11px] text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 px-3 py-1.5 rounded-lg flex items-center justify-between font-mono">
          <span>Display: {formatLocalDateTimeWithTz(scheduledAtUtc)}</span>
          <span className="text-zinc-500 text-[10px]">
            Stored UTC: {new Date(scheduledAtUtc).toISOString().slice(11, 19)}Z
          </span>
        </div>
      )}
    </div>
  );
}
