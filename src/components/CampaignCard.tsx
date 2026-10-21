import React from 'react';
import { Campaign } from '@/types/campaign';
import {
  OBJECTIVE_CONFIG,
  formatCurrency,
  formatNumber,
  formatPercent,
} from '@/lib/objective-config';
import { TrendingUp, Users, MousePointer, Eye, DollarSign } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const config = OBJECTIVE_CONFIG[campaign.objective] || {
    label: campaign.objective,
    badgeBg: 'bg-zinc-800',
    badgeText: 'text-zinc-300 border-zinc-700',
    color: '#a1a1aa',
  };

  const { metrics } = campaign;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md transition-all hover:border-zinc-700 hover:shadow-lg">
      <div>
        {/* Top Header: Status & Objective Badge */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.badgeBg} ${config.badgeText}`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            {config.label}
          </span>
          {campaign.deliveryStatus === 'COMPLETED' ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
              <span className="h-2 w-2 rounded-full bg-zinc-500" />
              COMPLETED
            </span>
          ) : campaign.deliveryStatus === 'INACTIVE' ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              INACTIVE
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              ACTIVE
            </span>
          )}
        </div>

        {/* Campaign Name & Page */}
        <h3 className="mt-3 text-base font-semibold text-white break-words leading-snug" title={campaign.name}>
          {campaign.name}
        </h3>
          <div className="mt-1 flex items-center justify-between text-xs text-zinc-400">
          <p>
            Budget: <span className="font-medium text-zinc-200">{formatCurrency(campaign.budget)}</span> / day
          </p>
          <div className="flex items-center gap-1.5">
            {campaign.adAccountName && (
              <span className="rounded bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-300 border border-zinc-700">
                {campaign.adAccountName}
              </span>
            )}
            {campaign.pageName && (
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                {campaign.pageName}
              </span>
            )}
          </div>
        </div>

        {/* Primary Objective-Specific Highlight Hero Box */}
        <div className="mt-4 rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-3.5">
          {/* Page Likes Specific Highlight */}
          {(campaign.objective === 'PAGE_LIKES' || (metrics.pageLikes !== undefined && metrics.pageLikes > 0)) && (
            <div className="grid grid-cols-2 gap-2 text-center rounded-lg border border-pink-500/20 bg-pink-500/5 p-2.5">
              <div className="border-r border-pink-500/20">
                <p className="text-[11px] font-medium uppercase tracking-wider text-pink-300">New Page Likes (Fans)</p>
                <p className="mt-0.5 text-xl font-extrabold text-pink-400">
                  +{formatNumber(metrics.pageLikes ?? 0)}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">Cost / Page Like</p>
                <p className="mt-0.5 text-lg font-bold text-white">
                  {metrics.costPerPageLike ? formatCurrency(metrics.costPerPageLike) : '-'}
                </p>
              </div>
            </div>
          )}

          {/* Sales Highlight */}
          {(campaign.objective === 'OUTCOME_SALES' || campaign.objective === 'CONVERSIONS') && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-400">ROAS</p>
                <p className="mt-0.5 text-base font-bold text-emerald-400">
                  {metrics.roas ? `${metrics.roas.toFixed(2)}x` : '-'}
                </p>
              </div>
              <div className="border-x border-zinc-800">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400">Purchases</p>
                <p className="mt-0.5 text-base font-bold text-white">{metrics.purchases ?? 0}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-400">CPA</p>
                <p className="mt-0.5 text-base font-bold text-zinc-200">
                  {metrics.cpa ? formatCurrency(metrics.cpa) : '-'}
                </p>
              </div>
            </div>
          )}

          {/* Leads Highlight */}
          {(campaign.objective === 'OUTCOME_LEADS' || campaign.objective === 'LEAD_GENERATION') && (
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="border-r border-zinc-800">
                <p className="text-[11px] uppercase tracking-wider text-zinc-400">Total Leads</p>
                <p className="mt-0.5 text-lg font-bold text-indigo-400">{metrics.leads ?? 0}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-zinc-400">Cost / Lead (CPL)</p>
                <p className="mt-0.5 text-lg font-bold text-white">
                  {metrics.costPerLead ? formatCurrency(metrics.costPerLead) : '-'}
                </p>
              </div>
            </div>
          )}

          {/* Traffic / Link Clicks Highlight */}
          {(campaign.objective === 'OUTCOME_TRAFFIC' || campaign.objective === 'LINK_CLICKS') &&
            !(metrics.pageLikes && metrics.pageLikes > 0) && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">Link Clicks</p>
                  <p className="mt-0.5 text-base font-bold text-sky-400">{formatNumber(metrics.clicks)}</p>
                </div>
                <div className="border-x border-zinc-800">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">CPC</p>
                  <p className="mt-0.5 text-base font-bold text-white">{formatCurrency(metrics.cpc)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">CTR</p>
                  <p className="mt-0.5 text-base font-bold text-emerald-400">{formatPercent(metrics.ctr)}</p>
                </div>
              </div>
            )}

          {/* Engagement Highlight */}
          {(campaign.objective === 'OUTCOME_ENGAGEMENT' || campaign.objective === 'POST_ENGAGEMENT') &&
            !(metrics.pageLikes && metrics.pageLikes > 0) && (
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="border-r border-zinc-800">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">Engagements</p>
                  <p className="mt-0.5 text-lg font-bold text-amber-400">
                    {formatNumber(metrics.engagements ?? 0)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">Cost / Eng</p>
                  <p className="mt-0.5 text-lg font-bold text-white">
                    {metrics.costPerEngagement ? formatCurrency(metrics.costPerEngagement) : '-'}
                  </p>
                </div>
              </div>
            )}

          {/* Awareness / Reach Highlight */}
          {(campaign.objective === 'OUTCOME_AWARENESS' || campaign.objective === 'REACH') &&
            !(metrics.pageLikes && metrics.pageLikes > 0) && (
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">Reach</p>
                  <p className="mt-0.5 text-base font-bold text-purple-400">{formatNumber(metrics.reach)}</p>
                </div>
                <div className="border-x border-zinc-800">
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">CPM</p>
                  <p className="mt-0.5 text-base font-bold text-white">{formatCurrency(metrics.cpm)}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-zinc-400">Frequency</p>
                  <p className="mt-0.5 text-base font-bold text-zinc-200">
                    {metrics.frequency ? metrics.frequency.toFixed(2) : '1.0'}
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Standard Metric Grid */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-800/80 pt-3 text-xs">
          <div>
            <span className="text-zinc-500">Total Spend</span>
            <p className="font-semibold text-white">{formatCurrency(metrics.spend)}</p>
          </div>
          <div>
            <span className="text-zinc-500">Impressions</span>
            <p className="font-semibold text-white">{formatNumber(metrics.impressions)}</p>
          </div>
          <div>
            <span className="text-zinc-500">CTR (Click-Through)</span>
            <p className="font-semibold text-zinc-300">{formatPercent(metrics.ctr)}</p>
          </div>
          <div>
            <span className="text-zinc-500">Avg CPC</span>
            <p className="font-semibold text-zinc-300">{formatCurrency(metrics.cpc)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-800 pt-3 text-[11px] text-zinc-500 flex justify-between items-center">
        <span>ID: {campaign.id}</span>
        <span>
          {campaign.stopTime ? `Ended: ${campaign.stopTime}` : `Started: ${campaign.createdAt}`}
        </span>
      </div>
    </div>
  );
}
