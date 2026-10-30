import { NextRequest, NextResponse } from 'next/server';
import { searchSoleScoutSneakers } from '@/lib/solescout/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || 'jordan';
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const data = await searchSoleScoutSneakers(query, limit, page);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[SoleScout API Search Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search SoleScout API' },
      { status: error.message?.includes('429') ? 429 : 500 }
    );
  }
}
