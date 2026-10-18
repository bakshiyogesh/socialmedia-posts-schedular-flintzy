'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, ChevronDown, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface DateFilterProps {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
  onClear: () => void;
}

const PRESETS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Dates' },
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'earlier', label: 'Earlier / Past' },
];

export function DateFilter({
  selectedDate = 'all',
  onSelectDate,
  onClear,
}: DateFilterProps) {
  const [open, setOpen] = React.useState(false);

  const selectedDateObj = React.useMemo(() => {
    if (!selectedDate || selectedDate === 'all') return undefined;
    if (selectedDate === 'today') return new Date();
    if (selectedDate === 'tomorrow') {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    }
    const parts = selectedDate.split('-').map(Number);
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return undefined;
  }, [selectedDate]);

  const activeLabel = React.useMemo(() => {
    if (!selectedDate || selectedDate === 'all') return 'All Dates';
    const preset = PRESETS.find((p) => p.id === selectedDate);
    if (preset) return preset.label;
    if (selectedDateObj) {
      return format(selectedDateObj, 'MMM d, yyyy');
    }
    return selectedDate;
  }, [selectedDate, selectedDateObj]);

  const isActive = selectedDate && selectedDate !== 'all';

  const handleCalendarSelect = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    const dateKey = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    onSelectDate(dateKey);
    setOpen(false);
  };

  const handlePresetSelect = (presetId: string) => {
    onSelectDate(presetId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="inline-flex items-center">
        <PopoverTrigger className="w-auto">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all select-none ${
              isActive
                ? 'bg-zinc-800 text-zinc-100 border-indigo-500/80 shadow-sm shadow-indigo-950 ring-1 ring-indigo-500/50'
                : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
            }`}
            title="Filter posts by scheduled date"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>{activeLabel}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400 ml-0.5 shrink-0" />
          </div>
        </PopoverTrigger>

        {isActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setOpen(false);
            }}
            className="p-1 -ml-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            title="Clear date filter"
            aria-label="Clear date filter"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      <PopoverContent
        side="auto"
        align="start"
        className="w-auto p-0 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
          {/* Quick Presets Column */}
          <div className="p-3 w-full sm:w-40 flex flex-col justify-between space-y-1 bg-zinc-950/60">
            <div>
              <div className="px-2 pb-2 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Presets
              </div>
              <div className="space-y-0.5">
                {PRESETS.map((preset) => {
                  const isSelected = selectedDate === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePresetSelect(preset.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                        isSelected
                          ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                          : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                      }`}
                    >
                      <span>{preset.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {isActive && (
              <div className="pt-2 border-t border-zinc-800/80">
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                    setOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1 text-[11px] text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>

          {/* Interactive Custom Calendar Picker */}
          <div className="p-2 bg-zinc-950 flex flex-col items-center">
            <div className="w-full px-2 pt-1 pb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                Pick a Date
              </span>
              {selectedDateObj && (
                <span className="text-[10px] font-mono text-indigo-400">
                  {format(selectedDateObj, 'yyyy-MM-dd')}
                </span>
              )}
            </div>
            <Calendar
              selected={selectedDateObj}
              onSelect={handleCalendarSelect}
              disabledBefore={null}
              className="w-[280px]"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
