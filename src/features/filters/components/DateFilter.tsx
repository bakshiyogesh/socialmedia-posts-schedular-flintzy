'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { DatePicker, DatePickerPreset } from '@/components/ui/date-picker';

interface DateFilterProps {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
  onClear: () => void;
  className?: string;
}

export function DateFilter({
  selectedDate = 'all',
  onSelectDate,
  onClear,
  className,
}: DateFilterProps) {
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

  const displayValue = React.useMemo(() => {
    if (!selectedDate || selectedDate === 'all') return undefined;
    if (selectedDate === 'today') return 'Today';
    if (selectedDate === 'tomorrow') return 'Tomorrow';
    if (selectedDate === 'this_week') return 'This Week';
    if (selectedDate === 'this_month') return 'This Month';
    if (selectedDate === 'earlier') return 'Earlier / Past';
    if (selectedDateObj) {
      return format(selectedDateObj, 'MMM d, yyyy');
    }
    return selectedDate;
  }, [selectedDate, selectedDateObj]);

  const presets: DatePickerPreset[] = React.useMemo(
    () => [
      {
        label: 'All Dates',
        isActive: !selectedDate || selectedDate === 'all',
        onSelect: () => onClear(),
      },
      {
        label: 'Today',
        isActive: selectedDate === 'today',
        onSelect: () => onSelectDate('today'),
      },
      {
        label: 'Tomorrow',
        isActive: selectedDate === 'tomorrow',
        onSelect: () => onSelectDate('tomorrow'),
      },
      {
        label: 'This Week',
        isActive: selectedDate === 'this_week',
        onSelect: () => onSelectDate('this_week'),
      },
      {
        label: 'This Month',
        isActive: selectedDate === 'this_month',
        onSelect: () => onSelectDate('this_month'),
      },
      {
        label: 'Earlier',
        isActive: selectedDate === 'earlier',
        onSelect: () => onSelectDate('earlier'),
      },
    ],
    [selectedDate, onClear, onSelectDate]
  );

  return (
    <DatePicker
      date={selectedDateObj}
      displayValue={displayValue}
      placeholder="All Dates"
      disabledBefore={null}
      onSelect={(date) => {
        onSelectDate(format(date, 'yyyy-MM-dd'));
      }}
      onClear={onClear}
      presets={presets}
      className={className}
      side="auto"
      align="end"
    />
  );
}
