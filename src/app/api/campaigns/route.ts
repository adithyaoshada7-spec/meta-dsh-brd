import { NextRequest, NextResponse } from 'next/server';
import { fetchMetaCampaigns } from '@/lib/meta-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || undefined;
    const datePreset = searchParams.get('datePreset') || 'last_30d';
    const since = searchParams.get('since') || undefined;
    const until = searchParams.get('until') || undefined;

    const data = await fetchMetaCampaigns(accountId, datePreset, since, until);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
