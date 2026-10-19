import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  subtext?: string;
  accentColor?: string;
}

export function MetricCard({
  title,
  value,
  change,
  changePositive = true,
  icon: Icon,
  subtext,
  accentColor = 'text-blue-400',
}: MetricCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 backdrop-blur-md transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/90 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">{title}</p>
        <div className={`rounded-lg p-2 bg-zinc-800/80 ${accentColor}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {change && (
          <span
            className={`text-xs font-semibold ${
              changePositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {changePositive ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
      {subtext && <p className="mt-1 text-xs text-zinc-500">{subtext}</p>}
    </div>
  );
}
