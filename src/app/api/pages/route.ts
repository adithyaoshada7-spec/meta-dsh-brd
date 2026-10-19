import { NextRequest, NextResponse } from 'next/server';
import { fetchMetaPages } from '@/lib/meta-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId') || undefined;

    const data = await fetchMetaPages(accountId);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}
