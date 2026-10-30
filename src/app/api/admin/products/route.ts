import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { createProduct } from '@/lib/data/products';
import { productSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // 1. Authorization check
    const authorized = await isAdmin();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    // 2. Validate input
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || 'Validation error',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // 3. Create product
    const product = await createProduct(parsed.data);

    // 4. Revalidate paths
    revalidatePath('/');
    revalidatePath('/collections');
    revalidatePath('/admin/products');

    return NextResponse.json(
      {
        success: true,
        message: 'Product created successfully',
        data: product,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to create product',
      },
      { status: 500 }
    );
  }
}

