'use client';

import React, { useState, useEffect } from 'react';
import { Campaign, CampaignObjective, MetaPage, MetaAdAccount, DatePreset } from '@/types/campaign';
import { MetricCard } from '@/components/MetricCard';
import { CampaignCard } from '@/components/CampaignCard';
import { PerformanceCharts } from '@/components/PerformanceCharts';
import { ObjectiveFilter } from '@/components/ObjectiveFilter';
import { PageFilter } from '@/components/PageFilter';
import { AdAccountFilter } from '@/components/AdAccountFilter';
import { TimeRangeFilter } from '@/components/TimeRangeFilter';
import { normalizeObjective, formatCurrency, formatNumber, formatPercent } from '@/lib/objective-config';
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  RefreshCw,
  Search,
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
  ThumbsUp,
  Heart,
} from 'lucide-react';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [accounts, setAccounts] = useState<MetaAdAccount[]>([]);
  const [pages, setPages] = useState<MetaPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filters state
  const [selectedAccountId, setSelectedAccountId] = useState<string>('ALL');
  const [selectedPageId, setSelectedPageId] = useState<string>('ALL');
  const [selectedObjective, setSelectedObjective] = useState<string>('ALL');
  const [selectedDatePreset, setSelectedDatePreset] = useState<DatePreset>('last_30d');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  async function loadData() {
    setLoading(true);
    try {
      const [accRes, campRes, pageRes] = await Promise.all([
        fetch('/api/ad-accounts'),
        fetch(`/api/campaigns?accountId=${selectedAccountId}&datePreset=${selectedDatePreset}`),
        fetch(`/api/pages?accountId=${selectedAccountId}`),
      ]);

      const accData = await accRes.json();
      const campData = await campRes.json();
      const pageData = await pageRes.json();

      setAccounts(accData.accounts || []);
      setCampaigns(campData.campaigns || []);
      setPages(pageData.pages || []);
      setIsMock(Boolean(campData.isMock));

      if (campData.error) {
        setErrorMsg(campData.error);
      } else {
        setErrorMsg(null);
      }
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [selectedAccountId, selectedDatePreset]);

  // Filter campaigns by:
  // 1. Selected Page
  // 2. Selected Objective (with normalized mapping)
  // 3. Search query
  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    // 1. Page Filter Logic
    if (selectedPageId !== 'ALL') {
      const matchesPageDirect = campaign.pageId === selectedPageId;
      const matchesPageCreative = campaign.ads?.data?.some((ad) => {
        const storyId = ad.creative?.effective_object_story_id;
        return storyId && (storyId.startsWith(`${selectedPageId}_`) || storyId === selectedPageId);
      });

      if (!matchesPageDirect && !matchesPageCreative) {
        return false;
      }
    }

    // 2. Objective Filter Logic
    if (selectedObjective !== 'ALL') {
      const normalizedCmpObj = normalizeObjective(campaign.objective);
      if (normalizedCmpObj !== selectedObjective && campaign.objective !== selectedObjective) {
        return false;
      }
    }

    // 3. Search Query Logic
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        campaign.name.toLowerCase().includes(q) ||
        campaign.id.toLowerCase().includes(q) ||
        (campaign.pageName && campaign.pageName.toLowerCase().includes(q)) ||
        (campaign.adAccountName && campaign.adAccountName.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Calculate high-level metrics dynamically based on currently page-filtered campaigns
  const activeBaseCampaigns = campaigns.filter((campaign) => {
    if (selectedPageId === 'ALL') return true;
    const matchesPageDirect = campaign.pageId === selectedPageId;
    const matchesPageCreative = campaign.ads?.data?.some((ad) => {
      const storyId = ad.creative?.effective_object_story_id;
      return storyId && (storyId.startsWith(`${selectedPageId}_`) || storyId === selectedPageId);
    });
    return matchesPageDirect || matchesPageCreative;
  });

  const totalSpend = activeBaseCampaigns.reduce((acc, c) => acc + c.metrics.spend, 0);
  const totalImpressions = activeBaseCampaigns.reduce((acc, c) => acc + c.metrics.impressions, 0);
  const totalClicks = activeBaseCampaigns.reduce((acc, c) => acc + c.metrics.clicks, 0);
  const totalPurchases = activeBaseCampaigns.reduce((acc, c) => acc + (c.metrics.purchases || 0), 0);
  const totalRevenue = activeBaseCampaigns.reduce((acc, c) => acc + (c.metrics.purchaseValue || 0), 0);
  const totalLeads = activeBaseCampaigns.reduce((acc, c) => acc + (c.metrics.leads || 0), 0);
  const totalPageLikes = activeBaseCampaigns.reduce((acc, c) => acc + (c.metrics.pageLikes || 0), 0);
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const overallRoas = totalSpend > 0 && totalRevenue > 0 ? totalRevenue / totalSpend : 0;

  // Objective counts for the page-filtered subset
  const counts: Record<string, number> = {
    ALL: activeBaseCampaigns.length,
    OUTCOME_SALES: activeBaseCampaigns.filter(
      (c) => normalizeObjective(c.objective) === 'OUTCOME_SALES'
    ).length,
    OUTCOME_LEADS: activeBaseCampaigns.filter(
      (c) => normalizeObjective(c.objective) === 'OUTCOME_LEADS'
    ).length,
    OUTCOME_TRAFFIC: activeBaseCampaigns.filter(
      (c) => normalizeObjective(c.objective) === 'OUTCOME_TRAFFIC'
    ).length,
    OUTCOME_ENGAGEMENT: activeBaseCampaigns.filter(
      (c) => normalizeObjective(c.objective) === 'OUTCOME_ENGAGEMENT'
    ).length,
    OUTCOME_AWARENESS: activeBaseCampaigns.filter(
      (c) => normalizeObjective(c.objective) === 'OUTCOME_AWARENESS'
    ).length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Banner / Notification */}
      {isMock && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>
                <strong>Demo Mode Active:</strong> Meta API credentials (.env.local) add කළ පසු සැබෑ Meta Ad Account data පෙන්වනු ඇත.
              </span>
            </div>
            {errorMsg && <span className="text-[11px] text-amber-400/80">{errorMsg}</span>}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Meta Ads Performance Dashboard
                </h1>
                <p className="text-xs text-zinc-400">
                  Multi-account monitor: Faith and hope, Poru Ads & Tantri
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Ad Account Selector Filter */}
            <AdAccountFilter
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onSelectAccount={(id) => {
                setSelectedAccountId(id);
                setSelectedPageId('ALL');
              }}
            />

            {/* Page Filter */}
            <PageFilter
              pages={pages}
              selectedPageId={selectedPageId}
              onSelectPage={setSelectedPageId}
            />

            {/* Time Range Filter */}
            <TimeRangeFilter
              selectedPreset={selectedDatePreset}
              onSelectPreset={setSelectedDatePreset}
            />

            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3.5 py-1.5 text-xs font-medium text-zinc-200 transition-all hover:bg-zinc-700 hover:text-white disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Syncing...' : 'Sync Data'}</span>
            </button>
          </div>
        </div>

        {/* Top KPI Cards Overview */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            title="Total Ad Spend"
            value={formatCurrency(totalSpend)}
            change="8.2%"
            changePositive={false}
            icon={DollarSign}
            subtext={
              selectedAccountId === 'ALL'
                ? 'Combined across all accounts'
                : accounts.find((a) => a.id === selectedAccountId)?.name || 'Selected account'
            }
            accentColor="text-blue-400"
          />
          <MetricCard
            title="Total Sales Value"
            value={formatCurrency(totalRevenue)}
            change="14.5%"
            changePositive={true}
            icon={TrendingUp}
            subtext={`${totalPurchases} conversion purchases`}
            accentColor="text-emerald-400"
          />
          <MetricCard
            title="Overall ROAS"
            value={overallRoas > 0 ? `${overallRoas.toFixed(2)}x` : '-'}
            change="0.4x"
            changePositive={true}
            icon={Target}
            subtext="Return on aggregate ad spend"
            accentColor="text-purple-400"
          />
          <MetricCard
            title="Total Inbound Leads"
            value={formatNumber(totalLeads)}
            change="21%"
            changePositive={true}
            icon={Users}
            subtext="Lead generation campaigns"
            accentColor="text-indigo-400"
          />
          <MetricCard
            title="Total Page Likes"
            value={formatNumber(totalPageLikes)}
            change="New"
            changePositive={true}
            icon={ThumbsUp}
            subtext="New followers acquired"
            accentColor="text-pink-400"
          />
        </div>

        {/* Secondary KPI Row */}
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-4">
            <span className="text-xs text-zinc-400">Total Impressions</span>
            <p className="mt-1 text-lg font-semibold text-white">{formatNumber(totalImpressions)}</p>
          </div>
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-4">
            <span className="text-xs text-zinc-400">Total Clicks</span>
            <p className="mt-1 text-lg font-semibold text-white">{formatNumber(totalClicks)}</p>
          </div>
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-4">
            <span className="text-xs text-zinc-400">Average CTR</span>
            <p className="mt-1 text-lg font-semibold text-emerald-400">{formatPercent(avgCtr)}</p>
          </div>
          <div className="rounded-xl border border-zinc-850 bg-zinc-900/40 p-4">
            <span className="text-xs text-zinc-400">Average CPC</span>
            <p className="mt-1 text-lg font-semibold text-zinc-200">{formatCurrency(avgCpc)}</p>
          </div>
        </div>

        {/* Performance Charts Section */}
        <div className="mt-8">
          <PerformanceCharts campaigns={activeBaseCampaigns} />
        </div>

        {/* Active Campaigns List Header with Objective Filtering */}
        <div className="mt-10">
          <div className="flex flex-col justify-between gap-4 border-b border-zinc-800 pb-4 md:flex-row md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-400" />
                Active Campaigns ({filteredCampaigns.length})
              </h2>
              <p className="text-xs text-zinc-400">
                Filter campaigns to inspect conversion metrics specifically tied to each goal
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search active campaign..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 py-1.5 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Objective Filters */}
          <div className="mt-4">
            <ObjectiveFilter
              selectedObjective={selectedObjective as any}
              onSelect={setSelectedObjective}
              counts={counts}
            />
          </div>

          {/* Campaign Cards Grid */}
          {filteredCampaigns.length === 0 ? (
            <div className="mt-8 rounded-xl border border-dashed border-zinc-800 p-12 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-zinc-500" />
              <p className="mt-2 text-sm font-medium text-zinc-300">No active campaigns found</p>
              <p className="mt-1 text-xs text-zinc-500">
                Try selecting &apos;All Accounts&apos; or changing your page / objective filter.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCampaigns.map((cmp) => (
                <CampaignCard key={cmp.id} campaign={cmp} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
