'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface DatePickerPreset {
  label: string;
  isActive?: boolean;
  onSelect: () => void;
}

export interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date) => void;
  onClear?: () => void;
  disabledBefore?: Date | null;
  placeholder?: string;
  displayValue?: string;
  className?: string;
  side?: 'top' | 'bottom' | 'auto';
  align?: 'start' | 'center' | 'end';
  presets?: DatePickerPreset[];
}

export function DatePicker({
  date,
  onSelect,
  onClear,
  disabledBefore,
  placeholder = 'Pick a date',
  displayValue,
  className,
  side = 'auto',
  align = 'start',
  presets,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const labelText = displayValue || (date ? format(date, 'PPP') : placeholder);
  const hasValue = Boolean(date || (displayValue && displayValue !== placeholder));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal h-10 px-3 rounded-xl border-zinc-800 bg-zinc-900/90 hover:bg-zinc-900 hover:border-zinc-700 focus-visible:ring-indigo-500/30',
            !hasValue && 'text-zinc-500',
            hasValue && 'border-indigo-500/60 ring-1 ring-indigo-500/20 text-zinc-100',
            className
          )}
        >
          <div className="p-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mr-2 shrink-0">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <span className="truncate text-xs font-medium text-zinc-100 flex-1">
            {labelText}
          </span>
          {onClear && hasValue && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                setOpen(false);
              }}
              className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors shrink-0 ml-1.5"
              title="Clear date"
              aria-label="Clear date"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className="w-auto p-2 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl space-y-1.5"
      >
        {presets && presets.length > 0 && (
          <div className="flex items-center gap-1 pb-2 border-b border-zinc-800/80 overflow-x-auto no-scrollbar max-w-[280px]">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  preset.onSelect();
                  setOpen(false);
                }}
                className={cn(
                  'px-2 py-1 rounded-md text-[10px] font-medium transition-colors whitespace-nowrap',
                  preset.isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}
        <Calendar
          selected={date}
          disabledBefore={disabledBefore}
          onSelect={(selectedDate) => {
            onSelect?.(selectedDate);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
