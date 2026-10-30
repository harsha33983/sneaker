import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { getWaitlistEntries } from '@/lib/data/waitlist';

export async function GET(request: NextRequest) {
  try {
    const authorized = await isAdmin();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Admin privileges required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || undefined;
    const status = searchParams.get('status') || undefined;
    const emailSearch = searchParams.get('emailSearch') || undefined;

    const entries = await getWaitlistEntries({ productId, status, emailSearch });

    return NextResponse.json({
      success: true,
      message: 'Waitlist records retrieved',
      data: entries,
    });
  } catch (error) {
    console.error('Admin waitlist GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve waitlist' },
      { status: 500 }
    );
  }
}

