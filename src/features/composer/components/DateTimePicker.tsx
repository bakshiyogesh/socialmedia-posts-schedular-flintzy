'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { formatLocalDateTimeWithTz, getUserTimeZoneAbbr } from '@/lib/time';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { startOfDay } from 'date-fns';

interface DateTimePickerProps {
  scheduledAtUtc?: string; // ISO UTC string
  onChange: (isoUtcString: string) => void;
}

export function DateTimePicker({ scheduledAtUtc, onChange }: DateTimePickerProps) {
  // Current local Date object
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = scheduledAtUtc ? new Date(scheduledAtUtc) : new Date(Date.now() + 1000 * 60 * 60 * 2);
    return isNaN(d.getTime()) ? new Date() : d;
  });

  // Current local time string in "HH:mm" (24h)
  const [timeStr, setTimeStr] = useState<string>(() => {
    const d = scheduledAtUtc ? new Date(scheduledAtUtc) : new Date(Date.now() + 1000 * 60 * 60 * 2);
    const valid = isNaN(d.getTime()) ? new Date() : d;
    const hours = String(valid.getHours()).padStart(2, '0');
    const minutes = String(valid.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const tzAbbr = getUserTimeZoneAbbr();

  // Sync state whenever external scheduledAtUtc prop updates (e.g. restore draft, duplicate, reset)
  useEffect(() => {
    if (!scheduledAtUtc) return;
    const d = new Date(scheduledAtUtc);
    if (!isNaN(d.getTime())) {
      setSelectedDate((curr) => (curr.getTime() !== d.getTime() ? d : curr));
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const nextTime = `${hours}:${minutes}`;
      setTimeStr((curr) => (curr !== nextTime ? nextTime : curr));
    }
  }, [scheduledAtUtc]);

  // Recompute UTC when date or time changes
  useEffect(() => {
    if (!selectedDate || !timeStr) return;
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (hours !== undefined && minutes !== undefined) {
        const localDate = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          hours,
          minutes,
          0
        );
        onChange(localDate.toISOString());
      }
    } catch {
      // Ignore parse errors
    }
  }, [selectedDate, timeStr, onChange]);

  // Suggested posting times (AI / High-engagement slots)
  const suggestions = [
    {
      label: 'Today 3:00 PM',
      badge: 'Best for B2B',
      getDate: () => {
        const d = new Date();
        d.setHours(15, 0, 0, 0);
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
    setSelectedDate(d);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    setTimeStr(`${hours}:${minutes}`);
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

      {/* Side-by-side shadcn DatePicker & TimePicker with Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* shadcn Date Picker with Calendar Icon */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Date</span>
            <span className="text-zinc-600 font-normal">Calendar</span>
          </span>
          <DatePicker
            date={selectedDate}
            onSelect={(newDate) => setSelectedDate(newDate)}
            disabledBefore={startOfDay(new Date())}
            placeholder="Select publish date"
          />
        </div>

        {/* shadcn Time Picker with Clock Icon */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 flex items-center justify-between">
            <span>Time</span>
            <span className="text-zinc-600 font-normal">12h / 24h</span>
          </span>
          <TimePicker
            timeStr={timeStr}
            onChange={(newTime) => setTimeStr(newTime)}
            placeholder="Select publish time"
          />
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
