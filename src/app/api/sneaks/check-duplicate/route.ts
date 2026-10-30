import { NextRequest, NextResponse } from 'next/server';
import { checkDuplicate } from '@/lib/sneaks/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const styleId = (searchParams.get('styleId') || '').trim();
    const externalProductId = (searchParams.get('externalProductId') || '').trim();

    if (!styleId && !externalProductId) {
      return NextResponse.json(
        { success: false, error: 'styleId or externalProductId is required.' },
        { status: 400 }
      );
    }

    const result = await checkDuplicate(styleId, externalProductId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error('[API /api/sneaks/check-duplicate] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}

