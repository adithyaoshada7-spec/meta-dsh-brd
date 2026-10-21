export type DatePreset =
  | 'today'
  | 'yesterday'
  | 'last_7d'
  | 'last_14d'
  | 'last_30d'
  | 'this_month'
  | 'last_month'
  | 'maximum';

export interface DateRangeFilter {
  preset: DatePreset | 'custom';
  since?: string;
  until?: string;
}

export type CampaignObjective =
  | 'OUTCOME_SALES'
  | 'OUTCOME_LEADS'
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_AWARENESS'
  | 'LINK_CLICKS'
  | 'POST_ENGAGEMENT'
  | 'PAGE_LIKES'
  | 'REACH'
  | 'CONVERSIONS'
  | 'LEAD_GENERATION';

export interface CampaignMetrics {
  spend: number;
  impressions: number;
  clicks: number;
  reach: number;
  cpm: number;
  cpc: number;
  ctr: number;
  purchases?: number;
  purchaseValue?: number;
  roas?: number;
  cpa?: number;
  leads?: number;
  costPerLead?: number;
  engagements?: number;
  costPerEngagement?: number;
  pageLikes?: number;
  costPerPageLike?: number;
  frequency?: number;
}

export interface DailyInsight {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface AdCreative {
  effective_object_story_id?: string;
}

export interface AdItem {
  id: string;
  name: string;
  creative?: AdCreative;
}

export interface MetaPage {
  id: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
}

export interface MetaAdAccount {
  id: string;
  name: string;
  account_id: string;
  currency?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  objective: CampaignObjective | string;
  budget: number;
  budgetType: 'DAILY' | 'LIFETIME';
  metrics: CampaignMetrics;
  history: DailyInsight[];
  createdAt: string;
  adAccountId?: string;
  adAccountName?: string;
  currency?: string;
  pageId?: string;
  pageName?: string;
  deliveryStatus?: 'DELIVERING' | 'COMPLETED' | 'INACTIVE';
  startTime?: string;
  stopTime?: string;
  ads?: {
    data: AdItem[];
  };
}

export interface DashboardSummary {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalPurchases: number;
  totalRevenue: number;
  totalLeads: number;
  averageRoas: number;
  averageCpc: number;
  averageCtr: number;
  activeCampaignsCount: number;
}
