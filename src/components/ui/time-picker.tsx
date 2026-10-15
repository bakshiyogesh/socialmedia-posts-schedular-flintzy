'use client';

import * as React from 'react';
import { Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface TimePickerProps {
  timeStr?: string; // "HH:mm" (24h format, e.g. "15:30")
  onChange?: (timeStr: string) => void;
  placeholder?: string;
  className?: string;
}

export function TimePicker({
  timeStr = '12:00',
  onChange,
  placeholder = 'Pick a time',
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse timeStr (24h "HH:mm") into 12h parts
  const parseParts = React.useCallback((val: string) => {
    const [hStr, mStr] = val.split(':');
    let h = parseInt(hStr || '12', 10);
    const m = parseInt(mStr || '0', 10);
    if (isNaN(h)) h = 12;
    const isPm = h >= 12;
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return {
      hours12: h12,
      minutes: isNaN(m) ? 0 : m,
      period: isPm ? ('PM' as const) : ('AM' as const),
    };
  }, []);

  const parts = parseParts(timeStr);

  const updateTime = (h12: number, m: number, period: 'AM' | 'PM') => {
    let h24 = h12 % 12;
    if (period === 'PM') h24 += 12;
    const hFormatted = String(h24).padStart(2, '0');
    const mFormatted = String(m).padStart(2, '0');
    onChange?.(`${hFormatted}:${mFormatted}`);
  };

  const formattedDisplay = React.useMemo(() => {
    if (!timeStr) return '';
    const { hours12, minutes, period } = parts;
    const mm = String(minutes).padStart(2, '0');
    return `${hours12}:${mm} ${period}`;
  }, [timeStr, parts]);

  const presetTimes = [
    { label: '09:00 AM', time: '09:00' },
    { label: '12:00 PM', time: '12:00' },
    { label: '03:00 PM', time: '15:00' },
    { label: '06:00 PM', time: '18:00' },
    { label: '08:00 PM', time: '20:00' },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal h-10 px-3 rounded-xl border-zinc-800 bg-zinc-900/90 hover:bg-zinc-900 hover:border-zinc-700 focus-visible:ring-indigo-500/30',
            !timeStr && 'text-zinc-500',
            className
          )}
        >
          <div className="p-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mr-2.5 shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <span className="truncate text-xs font-mono font-medium text-zinc-100">
            {formattedDisplay || placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-3.5 bg-zinc-950 border-zinc-800 shadow-2xl space-y-3" align="start">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
          <span className="text-xs font-bold text-zinc-200">Select Time</span>
          <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            {formattedDisplay}
          </span>
        </div>

        {/* Hour / Minute / AM-PM Picker Controls */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Hours (1-12) */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Hour</span>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5 py-0.5">
              {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => updateTime(h, parts.minutes, parts.period)}
                  className={cn(
                    'w-full py-1 text-xs font-mono rounded-lg transition-colors',
                    parts.hours12 === h
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  )}
                >
                  {String(h).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* Minutes (00, 15, 30, 45, etc.) */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Minute</span>
            <div className="max-h-36 overflow-y-auto space-y-1 pr-0.5 py-0.5">
              {[0, 15, 30, 45, 5, 10, 20, 25, 35, 40, 50, 55].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => updateTime(parts.hours12, m, parts.period)}
                  className={cn(
                    'w-full py-1 text-xs font-mono rounded-lg transition-colors',
                    parts.minutes === m
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                  )}
                >
                  :{String(m).padStart(2, '0')}
                </button>
              ))}
            </div>
          </div>

          {/* AM / PM Toggle */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Period</span>
            <div className="space-y-1.5 pt-1">
              {(['AM', 'PM'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => updateTime(parts.hours12, parts.minutes, p)}
                  className={cn(
                    'w-full py-2 text-xs font-bold rounded-lg transition-colors',
                    parts.period === p
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
          <span className="text-[10px] font-medium text-zinc-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Quick time shortcuts:</span>
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {presetTimes.map((preset) => (
              <button
                key={preset.time}
                type="button"
                onClick={() => {
                  onChange?.(preset.time);
                  setOpen(false);
                }}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 hover:bg-zinc-800 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Done Button */}
        <div className="pt-1">
          <Button
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full text-xs font-semibold"
          >
            Apply Time
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
