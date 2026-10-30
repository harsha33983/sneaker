import { NextRequest, NextResponse } from 'next/server';
import { searchSneakers } from '@/lib/sneaks/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { success: false, error: 'Limit must be a positive number.' },
        { status: 400 }
      );
    }

    const boundedLimit = Math.min(limit, 50);
    const sneakers = await searchSneakers(q, boundedLimit);

    return NextResponse.json({
      success: true,
      query: q,
      count: sneakers.length,
      data: sneakers,
    });
  } catch (error: any) {
    console.error('[API /api/sneaks/search] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to search sneakers from marketplace.',
      },
      { status: 500 }
    );
  }
}
