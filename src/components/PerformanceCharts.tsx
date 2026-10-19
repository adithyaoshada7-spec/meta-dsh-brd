'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Campaign } from '@/types/campaign';
import { OBJECTIVE_CONFIG, formatCurrency, formatNumber } from '@/lib/objective-config';

interface PerformanceChartsProps {
  campaigns: Campaign[];
}

export function PerformanceCharts({ campaigns }: PerformanceChartsProps) {
  // Aggregate daily trends across all campaigns
  const dateMap: Record<string, { date: string; spend: number; conversions: number; clicks: number }> = {};

  campaigns.forEach((cmp) => {
    (cmp.history || []).forEach((item) => {
      if (!dateMap[item.date]) {
        dateMap[item.date] = { date: item.date, spend: 0, conversions: 0, clicks: 0 };
      }
      dateMap[item.date].spend += item.spend;
      dateMap[item.date].conversions += item.conversions;
      dateMap[item.date].clicks += item.clicks;
    });
  });

  const trendData = Object.values(dateMap);

  // Spend breakdown by Objective
  const objectiveDataMap: Record<string, number> = {};
  campaigns.forEach((cmp) => {
    const label = OBJECTIVE_CONFIG[cmp.objective]?.label || cmp.objective;
    objectiveDataMap[label] = (objectiveDataMap[label] || 0) + cmp.metrics.spend;
  });

  const objectiveSpendData = Object.entries(objectiveDataMap).map(([name, spend]) => ({
    name: name.split('/')[0].trim(),
    spend: Math.round(spend),
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 7-Day Performance Trend Chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 backdrop-blur-md lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Daily Ad Spend & Clicks Trend</h3>
            <p className="text-xs text-zinc-400">Past 7 days performance across active campaigns</p>
          </div>
          <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs text-zinc-300">
            Last 7 Days
          </span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis yAxisId="left" stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                }}
                formatter={(val: any, name: any) => {
                  if (name === 'Daily Spend') return [formatCurrency(val), name];
                  return [formatNumber(val), name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '0.75rem', paddingTop: '10px' }} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="spend"
                name="Daily Spend"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spendGrad)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="clicks"
                name="Clicks"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#clicksGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spend by Objective Bar Chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 backdrop-blur-md">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">Spend by Objective</h3>
          <p className="text-xs text-zinc-400">Budget allocation across campaign types</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={objectiveSpendData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
              <XAxis type="number" stroke="#71717a" fontSize={11} tickFormatter={(v) => `$${v}`} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#a1a1aa" fontSize={11} tickLine={false} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  borderColor: '#27272a',
                  borderRadius: '0.5rem',
                  fontSize: '0.75rem',
                }}
                formatter={(v: any) => [formatCurrency(v), 'Spend']}
              />
              <Bar dataKey="spend" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
