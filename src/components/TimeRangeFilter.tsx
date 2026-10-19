'use client';

import React from 'react';
import { DatePreset } from '@/types/campaign';
import { Calendar } from 'lucide-react';

interface TimeRangeFilterProps {
  selectedPreset: DatePreset;
  onSelectPreset: (preset: DatePreset) => void;
  customSince?: string;
  customUntil?: string;
  onSelectCustom?: (since: string, until: string) => void;
}

export const DATE_PRESETS: { id: DatePreset; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7d', label: 'Last 7 Days' },
  { id: 'last_14d', label: 'Last 14 Days' },
  { id: 'last_30d', label: 'Last 30 Days' },
  { id: 'this_month', label: 'This Month' },
  { id: 'last_month', label: 'Last Month' },
  { id: 'maximum', label: 'Lifetime' },
];

export function TimeRangeFilter({
  selectedPreset,
  onSelectPreset,
}: TimeRangeFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <Calendar className="h-3.5 w-3.5 text-blue-400" />
        <label htmlFor="time-range-select" className="whitespace-nowrap">
          Time Range:
        </label>
      </div>
      <select
        id="time-range-select"
        value={selectedPreset}
        onChange={(e) => onSelectPreset(e.target.value as DatePreset)}
        className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-100 shadow-sm transition-colors hover:border-zinc-750 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
      >
        {DATE_PRESETS.map((p) => (
          <option key={p.id} value={p.id} className="bg-zinc-900 text-zinc-100">
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TimeRangeFilter;
