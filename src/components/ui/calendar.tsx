'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { cn } from '@/lib/utils';

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  disabledBefore?: Date | null;
  className?: string;
}

export function Calendar({
  selected,
  onSelect,
  disabledBefore = startOfDay(new Date()),
  className,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(
    () => selected || new Date()
  );

  const prevMonth = () => setCurrentMonth((prev) => subMonths(prev, 1));
  const nextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onSelect?.(today);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const days: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={cn('p-2 w-[280px] select-none text-zinc-100', className)}>
      {/* Header: Month Year + Arrows */}
      <div className="flex items-center justify-between pb-3 px-1 border-b border-zinc-800/80">
        <span className="text-xs font-bold text-zinc-100 tracking-wide">
          {format(currentMonth, 'MMMM yyyy')}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goToToday}
            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Row */}
      <div className="grid grid-cols-7 gap-1 pt-3 pb-1 text-center">
        {weekDays.map((wd) => (
          <span key={wd} className="text-[11px] font-semibold text-zinc-500">
            {wd}
          </span>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className="h-8 w-8" />;
          }

          const isSelected = selected && isSameDay(date, selected);
          const isDateToday = isToday(date);
          const isDisabled = Boolean(disabledBefore && isBefore(date, disabledBefore));

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect?.(date)}
              className={cn(
                'h-8 w-8 rounded-lg text-xs flex items-center justify-center transition-all font-medium',
                isSelected &&
                  'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40',
                !isSelected && isDateToday &&
                  'border border-indigo-500/60 text-indigo-400 font-bold bg-indigo-500/10',
                !isSelected && !isDateToday && !isDisabled &&
                  'text-zinc-300 hover:bg-zinc-800 hover:text-white',
                isDisabled &&
                  'text-zinc-600 cursor-not-allowed opacity-30 hover:bg-transparent'
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
