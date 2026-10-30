import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    if (session?.value === 'authenticated') {
      return {
        id: 'admin-local-id',
        email: process.env.ADMIN_EMAIL || 'admin@sneakerdrop.com',
      };
    }
    return null;
  }
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;
    return user;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    const session = cookieStore.get('admin_session');
    return session?.value === 'authenticated';
  }

  const user = await getCurrentUser();
  if (!user) return false;

  // 1. Check if email matches configured ADMIN_EMAIL env
  if (process.env.ADMIN_EMAIL && user.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  // 2. Check admin_profiles table via admin client
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('admin_profiles')
      .select('role')
      .eq('id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin_profile:', error);
      return false;
    }

    return Boolean(data);
  } catch (err) {
    console.error('Error verifying admin permissions:', err);
    return false;
  }
}

export async function requireAdmin() {
  const authorized = await isAdmin();
  if (!authorized) {
    throw new Error('Unauthorized: Administrator privilege required');
  }
}
