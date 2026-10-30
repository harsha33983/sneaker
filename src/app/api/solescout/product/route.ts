import { NextRequest, NextResponse } from 'next/server';
import { getSoleScoutProductDetails } from '@/lib/solescout/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Missing required "slug" parameter.' }, { status: 400 });
    }

    const data = await getSoleScoutProductDetails(slug);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[SoleScout API Product Error]:', error);
    const status = error.message?.includes('not found') ? 404 : error.message?.includes('429') ? 429 : 500;
    return NextResponse.json(
      { error: error.message || 'Failed to fetch SoleScout product details' },
      { status }
    );
  }
}
