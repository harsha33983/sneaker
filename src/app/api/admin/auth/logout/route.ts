import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    }

    const cookieStore = await cookies();
    cookieStore.delete('admin_session');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, message: 'Logout failed' }, { status: 500 });
  }
}
