import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { updateWaitlistStatus } from '@/lib/data/waitlist';
import { WaitlistStatus } from '@/types';

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
    const { status } = body;

    if (!['pending', 'notified', 'closed'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid waitlist status' },
        { status: 400 }
      );
    }

    const ok = await updateWaitlistStatus(id, status as WaitlistStatus);
    if (!ok) {
      return NextResponse.json(
        { success: false, message: 'Record not found or update failed' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Waitlist status updated to ${status}`,
    });
  } catch (error) {
    console.error('Waitlist update error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

