import { CampaignObjective } from '@/types/campaign';

export const OBJECTIVE_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    badgeBg: string;
    badgeText: string;
    keyMetrics: string[];
  }
> = {
  OUTCOME_SALES: {
    label: 'Sales',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400 border-emerald-500/30',
    keyMetrics: ['ROAS', 'CPA', 'Purchases', 'Revenue'],
  },
  CONVERSIONS: {
    label: 'Sales / Conversions',
    color: '#10b981',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400 border-emerald-500/30',
    keyMetrics: ['ROAS', 'CPA', 'Purchases', 'Revenue'],
  },
  OUTCOME_LEADS: {
    label: 'Leads',
    color: '#6366f1',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-400 border-indigo-500/30',
    keyMetrics: ['Leads', 'Cost / Lead', 'CTR', 'Spend'],
  },
  LEAD_GENERATION: {
    label: 'Leads',
    color: '#6366f1',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-400 border-indigo-500/30',
    keyMetrics: ['Leads', 'Cost / Lead', 'CTR', 'Spend'],
  },
  OUTCOME_TRAFFIC: {
    label: 'Traffic',
    color: '#0ea5e9',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400 border-sky-500/30',
    keyMetrics: ['Clicks', 'CPC', 'CTR', 'Reach'],
  },
  LINK_CLICKS: {
    label: 'Traffic / Clicks',
    color: '#0ea5e9',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400 border-sky-500/30',
    keyMetrics: ['Clicks', 'CPC', 'CTR', 'Reach'],
  },
  OUTCOME_ENGAGEMENT: {
    label: 'Engagement',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400 border-amber-500/30',
    keyMetrics: ['Engagements', 'Cost / Eng', 'Clicks', 'Impressions'],
  },
  POST_ENGAGEMENT: {
    label: 'Post Engagement',
    color: '#f59e0b',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400 border-amber-500/30',
    keyMetrics: ['Engagements', 'Cost / Eng', 'Clicks', 'Impressions'],
  },
  PAGE_LIKES: {
    label: 'Page Likes',
    color: '#ec4899',
    badgeBg: 'bg-pink-500/10',
    badgeText: 'text-pink-400 border-pink-500/30',
    keyMetrics: ['Page Likes', 'Clicks', 'Reach'],
  },
  OUTCOME_AWARENESS: {
    label: 'Awareness',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400 border-purple-500/30',
    keyMetrics: ['Reach', 'Impressions', 'CPM', 'Frequency'],
  },
  REACH: {
    label: 'Reach',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400 border-purple-500/30',
    keyMetrics: ['Reach', 'Impressions', 'CPM', 'Frequency'],
  },
};

export function normalizeObjective(raw: string): string {
  if (raw === 'CONVERSIONS') return 'OUTCOME_SALES';
  if (raw === 'LEAD_GENERATION') return 'OUTCOME_LEADS';
  if (raw === 'LINK_CLICKS') return 'OUTCOME_TRAFFIC';
  if (raw === 'POST_ENGAGEMENT' || raw === 'PAGE_LIKES') return 'OUTCOME_ENGAGEMENT';
  if (raw === 'REACH') return 'OUTCOME_AWARENESS';
  return raw;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatPercent(val: number): string {
  return `${val.toFixed(2)}%`;
}
