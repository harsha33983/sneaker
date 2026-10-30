import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { updateProduct, deleteProduct, getProductById } from '@/lib/data/products';
import { productSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isAdmin();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Partial schema validation for updates
    const parsed = productSchema.partial().safeParse(body);
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

    const updated = await updateProduct(id, parsed.data);

    revalidatePath('/');
    revalidatePath('/collections');
    revalidatePath(`/products/${updated.slug}`);
    revalidatePath('/admin/products');

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error: any) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export const PUT = PATCH;

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isAdmin();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const existing = await getProductById(id);

    await deleteProduct(id);

    revalidatePath('/');
    revalidatePath('/collections');
    if (existing?.slug) {
      revalidatePath(`/products/${existing.slug}`);
    }
    revalidatePath('/admin/products');

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}

