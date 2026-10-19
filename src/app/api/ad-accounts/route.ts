import { NextResponse } from 'next/server';
import { fetchMetaAdAccounts } from '@/lib/meta-api';

export async function GET() {
  try {
    const data = await fetchMetaAdAccounts();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch ad accounts' },
      { status: 500 }
    );
  }
}
