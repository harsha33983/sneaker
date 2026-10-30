import { NextRequest, NextResponse } from 'next/server';
import { getPopularSneakers } from '@/lib/sneaks/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { success: false, error: 'Limit must be a positive number.' },
        { status: 400 }
      );
    }

    const boundedLimit = Math.min(limit, 50);
    const sneakers = await getPopularSneakers(boundedLimit);

    return NextResponse.json({
      success: true,
      count: sneakers.length,
      data: sneakers,
    });
  } catch (error: any) {
    console.error('[API /api/sneaks/popular] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch popular sneakers from marketplace.',
      },
      { status: 500 }
    );
  }
}
