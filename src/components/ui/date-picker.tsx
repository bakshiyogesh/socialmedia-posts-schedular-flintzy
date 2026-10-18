'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date) => void;
  disabledBefore?: Date;
  placeholder?: string;
  className?: string;
  side?: 'top' | 'bottom' | 'auto';
  align?: 'start' | 'center' | 'end';
}

export function DatePicker({
  date,
  onSelect,
  disabledBefore,
  placeholder = 'Pick a date',
  className,
  side = 'auto',
  align = 'start',
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal h-10 px-3 rounded-xl border-zinc-800 bg-zinc-900/90 hover:bg-zinc-900 hover:border-zinc-700 focus-visible:ring-indigo-500/30',
            !date && 'text-zinc-500',
            className
          )}
        >
          <div className="p-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mr-2.5 shrink-0">
            <CalendarIcon className="h-4 w-4" />
          </div>
          <span className="truncate text-xs font-medium text-zinc-100">
            {date ? format(date, 'PPP') : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align={align}
        className="w-auto p-1.5 bg-zinc-950 border-zinc-800 shadow-2xl"
      >
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
