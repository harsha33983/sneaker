import { NextRequest, NextResponse } from 'next/server';
import { getSneakerDetails, checkDuplicate } from '@/lib/sneaks/service';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    styleId: string;
  }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { styleId } = await context.params;
    const cleanId = decodeURIComponent(styleId || '').trim();

    if (!cleanId) {
      return NextResponse.json(
        { success: false, error: 'Style ID parameter is required.' },
        { status: 400 }
      );
    }

    const sneaker = await getSneakerDetails(cleanId);

    if (!sneaker) {
      return NextResponse.json(
        {
          success: false,
          error: `Sneaker with Style ID "${cleanId}" not found in external marketplaces.`,
        },
        { status: 404 }
      );
    }

    // Check if this sneaker has already been imported into SneakerDrop
    const duplicateCheck = await checkDuplicate(cleanId, sneaker.externalId);

    return NextResponse.json({
      success: true,
      data: sneaker,
      isImported: duplicateCheck.isDuplicate,
      existingProduct: duplicateCheck.existingProduct,
    });
  } catch (error: any) {
    console.error('[API /api/sneaks/details/[styleId]] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to retrieve sneaker marketplace details.',
      },
      { status: 500 }
    );
  }
}
