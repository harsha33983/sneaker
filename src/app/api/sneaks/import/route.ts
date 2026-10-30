import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { importSneakerProduct } from '@/lib/sneaks/service';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // 1. Authorization check: admin privileges required
    const authorized = await isAdmin();
    if (!authorized) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized: Administrator access required to import sneakers.',
        },
        { status: 403 }
      );
    }

    // 2. Parse request body
    const body = await req.json();

    // 3. Validation
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Valid sneaker name is required.' },
        { status: 400 }
      );
    }
    if (typeof body.price !== 'number' || isNaN(body.price) || body.price <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid selling price in INR must be greater than zero.' },
        { status: 400 }
      );
    }
    if (!body.styleId || typeof body.styleId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Style ID is required for sneaker import.' },
        { status: 400 }
      );
    }

    // 4. Import sneaker into Supabase / local catalogue
    const importedProduct = await importSneakerProduct({
      name: body.name,
      brand: body.brand || 'SneakerDrop',
      category: body.category || 'Lifestyle',
      description: body.description || '',
      price: body.price,
      retailPrice: body.retailPrice ?? null,
      availability: body.availability || 'limited',
      isFeatured: Boolean(body.isFeatured),
      imageUrl: body.imageUrl,
      additionalImages: body.additionalImages || [],
      styleId: body.styleId,
      colorway: body.colorway,
      releaseDate: body.releaseDate,
      marketplacePrices: body.marketplacePrices,
      externalSource: body.externalSource || 'sneaks-api',
      externalProductId: body.externalProductId || body.styleId,
    });

    // 5. Revalidate public catalogue cache
    revalidatePath('/');
    revalidatePath('/collections');
    revalidatePath('/admin/products');

    return NextResponse.json(
      {
        success: true,
        message: `Successfully imported "${importedProduct.name}" into SneakerDrop catalogue.`,
        data: importedProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[API /api/sneaks/import] Error:', error);

    // If duplicate error, return 409 Conflict
    const isDuplicate = error.message && error.message.includes('already exists');
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to import sneaker product.',
      },
      { status: isDuplicate ? 409 : 500 }
    );
  }
}

