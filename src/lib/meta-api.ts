import { Campaign, MetaPage, MetaAdAccount } from '@/types/campaign';
import { mockCampaigns, mockPages } from './mock-data';

export const KNOWN_ACCOUNTS: MetaAdAccount[] = [
  { id: 'act_1397457568798633', account_id: '1397457568798633', name: 'Faith and hope', currency: 'LKR' },
  { id: 'act_807839915453401', account_id: '807839915453401', name: 'Poru Ads', currency: 'LKR' },
  { id: 'act_1091726590095051', account_id: '1091726590095051', name: 'Tantri', currency: 'LKR' },
];

export async function fetchMetaAdAccounts(): Promise<{
  accounts: MetaAdAccount[];
  isMock: boolean;
}> {
  const token = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_API_VERSION || 'v25.0';
  const useMock = process.env.USE_MOCK_DATA === 'true' || !token;

  if (useMock) {
    return {
      accounts: KNOWN_ACCOUNTS,
      isMock: true,
    };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${apiVersion}/me/adaccounts?fields=id,name,account_id,currency&access_token=${token}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      return { accounts: KNOWN_ACCOUNTS, isMock: false };
    }
    const data = await res.json();
    const accounts: MetaAdAccount[] = (data.data || []).map((a: any) => ({
      id: a.id,
      name: a.name.trim(),
      account_id: a.account_id,
      currency: a.currency || 'LKR',
    }));
    return { accounts: accounts.length > 0 ? accounts : KNOWN_ACCOUNTS, isMock: false };
  } catch (err) {
    return { accounts: KNOWN_ACCOUNTS, isMock: false };
  }
}

export async function fetchMetaCampaigns(
  requestedAccountId?: string,
  datePreset: string = 'last_30d',
  since?: string,
  until?: string
): Promise<{
  campaigns: Campaign[];
  isMock: boolean;
  error?: string;
}> {
  const token = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_API_VERSION || 'v25.0';
  const defaultAccountId = process.env.META_AD_ACCOUNT_ID || 'act_1397457568798633';
  const useMock = process.env.USE_MOCK_DATA === 'true' || !token;

  if (useMock) {
    return {
      campaigns: mockCampaigns,
      isMock: true,
    };
  }

  // Determine which accounts to query:
  let targetAccounts: MetaAdAccount[] = [];
  if (requestedAccountId && requestedAccountId !== 'ALL') {
    const formattedId = requestedAccountId.startsWith('act_')
      ? requestedAccountId
      : `act_${requestedAccountId}`;
    const found = KNOWN_ACCOUNTS.find((a) => a.id === formattedId);
    targetAccounts = [found || { id: formattedId, name: formattedId, account_id: formattedId.replace('act_', ''), currency: 'LKR' }];
  } else if (requestedAccountId === 'ALL') {
    targetAccounts = KNOWN_ACCOUNTS;
  } else {
    const formattedId = defaultAccountId.startsWith('act_')
      ? defaultAccountId
      : `act_${defaultAccountId}`;
    const found = KNOWN_ACCOUNTS.find((a) => a.id === formattedId);
    targetAccounts = [found || { id: formattedId, name: 'Default Account', account_id: formattedId.replace('act_', ''), currency: 'LKR' }];
  }

  // Construct insights time range filter
  let insightsParam = `insights.date_preset(${datePreset || 'last_30d'})`;
  if (since && until) {
    insightsParam = `insights.time_range({'since':'${since}','until':'${until}'})`;
  }

  const allCampaigns: Campaign[] = [];
  const fields = [
    'id',
    'name',
    'status',
    'effective_status',
    'objective',
    'daily_budget',
    'lifetime_budget',
    'created_time',
    'start_time',
    'stop_time',
    'ads{id,name,creative{effective_object_story_id}}',
    `${insightsParam}{spend,impressions,clicks,reach,cpm,cpc,ctr,actions,action_values,frequency}`,
  ].join(',');

  try {
    for (const act of targetAccounts) {
      const url = `https://graph.facebook.com/${apiVersion}/${act.id}/campaigns?effective_status=['ACTIVE']&fields=${fields}&limit=100&access_token=${token}`;
      const res = await fetch(url, { next: { revalidate: 300 } });
      if (!res.ok) {
        continue;
      }
      const data = await res.json();
      const rawCampaigns = data.data || [];

      for (const item of rawCampaigns) {
        const insight = item.insights?.data?.[0] || {};
        const spend = parseFloat(insight.spend || '0');
        const impressions = parseInt(insight.impressions || '0', 10);
        const clicks = parseInt(insight.clicks || '0', 10);
        const reach = parseInt(insight.reach || '0', 10);
        const cpm = parseFloat(insight.cpm || '0');
        const cpc = parseFloat(insight.cpc || '0');
        const ctr = parseFloat(insight.ctr || '0');
        const frequency = parseFloat(insight.frequency || '1');

        const actions = insight.actions || [];
        const actionValues = insight.action_values || [];

        const purchaseAction = actions.find((a: any) => a.action_type === 'purchase');
        const purchases = purchaseAction ? parseInt(purchaseAction.value, 10) : 0;
        const purchaseValAction = actionValues.find((a: any) => a.action_type === 'purchase');
        const purchaseValue = purchaseValAction ? parseFloat(purchaseValAction.value) : 0;

        const leadAction = actions.find((a: any) =>
          a.action_type === 'lead' || a.action_type === 'onsite_conversion.lead_grouped'
        );
        const leads = leadAction ? parseInt(leadAction.value, 10) : 0;

        const engAction = actions.find((a: any) =>
          a.action_type === 'post_engagement' || a.action_type === 'page_engagement'
        );
        const engagements = engAction ? parseInt(engAction.value, 10) : 0;

        // Page Likes (Followers)
        const likeAction = actions.find((a: any) =>
          a.action_type === 'like' || a.action_type === 'page_like'
        );
        const pageLikes = likeAction ? parseInt(likeAction.value, 10) : 0;

        const roas = spend > 0 && purchaseValue > 0 ? purchaseValue / spend : undefined;
        const cpa = purchases > 0 ? spend / purchases : undefined;
        const costPerLead = leads > 0 ? spend / leads : undefined;
        const costPerEngagement = engagements > 0 ? spend / engagements : undefined;
        const costPerPageLike = pageLikes > 0 && spend > 0 ? spend / pageLikes : undefined;

        const budgetVal = item.daily_budget
          ? parseFloat(item.daily_budget) / 100
          : item.lifetime_budget
          ? parseFloat(item.lifetime_budget) / 100
          : 0;

        // Extract Page ID from ads creative
        const adsData = item.ads?.data || [];
        let detectedPageId: string | undefined;
        for (const ad of adsData) {
          const storyId = ad.creative?.effective_object_story_id;
          if (storyId && storyId.includes('_')) {
            detectedPageId = storyId.split('_')[0];
            break;
          }
        }

        // Known page names mapping
        let detectedPageName: string | undefined;
        if (detectedPageId === '123625740839340') {
          detectedPageName = 'poru.flore';
        } else if (detectedPageId === '210332835652476') {
          detectedPageName = 'TANTRI';
        }

        // Check live delivery status vs schedule
        const now = new Date();
        const stopTimeStr = item.stop_time;
        const startTimeStr = item.start_time;
        let deliveryStatus: 'DELIVERING' | 'COMPLETED' | 'INACTIVE' = 'DELIVERING';

        if (stopTimeStr && new Date(stopTimeStr) < now) {
          deliveryStatus = 'COMPLETED'; // Scheduled campaign has ended
        } else if (item.effective_status !== 'ACTIVE') {
          deliveryStatus = 'INACTIVE';
        }

        allCampaigns.push({
          id: item.id,
          name: item.name,
          status: item.status,
          deliveryStatus,
          startTime: startTimeStr ? startTimeStr.split('T')[0] : undefined,
          stopTime: stopTimeStr ? stopTimeStr.split('T')[0] : undefined,
          objective: item.objective || 'OUTCOME_TRAFFIC',
          budget: budgetVal,
          budgetType: item.daily_budget ? 'DAILY' : 'LIFETIME',
          createdAt: item.created_time?.split('T')[0] || new Date().toISOString().split('T')[0],
          adAccountId: act.id,
          adAccountName: act.name,
          currency: act.currency || 'LKR',
          pageId: detectedPageId,
          pageName: detectedPageName,
          ads: item.ads,
          metrics: {
            spend,
            impressions,
            clicks,
            reach,
            cpm,
            cpc,
            ctr,
            frequency,
            purchases,
            purchaseValue,
            roas,
            cpa,
            leads,
            costPerLead,
            engagements,
            costPerEngagement,
            pageLikes,
            costPerPageLike,
          },
          history: [],
        });
      }
    }

    return { campaigns: allCampaigns, isMock: false };
  } catch (err: any) {
    console.error('Error in fetchMetaCampaigns:', err);
    return {
      campaigns: mockCampaigns,
      isMock: true,
      error: err.message || 'Failed to fetch campaigns',
    };
  }
}

export async function fetchMetaPages(requestedAccountId?: string): Promise<{
  pages: MetaPage[];
  isMock: boolean;
  error?: string;
}> {
  const token = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_API_VERSION || 'v25.0';
  const useMock = process.env.USE_MOCK_DATA === 'true' || !token;

  if (useMock) {
    return { pages: mockPages, isMock: true };
  }

  // Pre-seed with known pages across these 3 accounts
  const pageMap = new Map<string, MetaPage>();
  pageMap.set('123625740839340', { id: '123625740839340', name: 'poru.flore' });
  pageMap.set('210332835652476', { id: '210332835652476', name: 'TANTRI' });

  // Query promote_pages for target accounts
  let targetAccounts = KNOWN_ACCOUNTS;
  if (requestedAccountId && requestedAccountId !== 'ALL') {
    const formatted = requestedAccountId.startsWith('act_') ? requestedAccountId : `act_${requestedAccountId}`;
    targetAccounts = KNOWN_ACCOUNTS.filter((a) => a.id === formatted);
  }

  try {
    for (const act of targetAccounts) {
      const url = `https://graph.facebook.com/${apiVersion}/${act.id}/promote_pages?fields=id,name,picture&access_token=${token}`;
      const res = await fetch(url, { next: { revalidate: 3600 } });
      if (res.ok) {
        const data = await res.json();
        (data.data || []).forEach((p: any) => {
          pageMap.set(p.id, { id: p.id, name: p.name, picture: p.picture });
        });
      }
    }
    return { pages: Array.from(pageMap.values()), isMock: false };
  } catch (err: any) {
    return { pages: Array.from(pageMap.values()), isMock: false };
  }
}
