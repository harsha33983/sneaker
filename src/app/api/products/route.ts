import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const availability = searchParams.get('availability') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;

    const products = await getProducts({ category, availability, search, sort });

    return NextResponse.json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
    });
  } catch (error) {
    console.error('API /products error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
