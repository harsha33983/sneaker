import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';
import { WaitlistEntry, WaitlistStatus } from '@/types';
import { getProductById } from './products';

// Fallback in-memory waitlist cache
let localWaitlist: WaitlistEntry[] = [
  {
    id: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    product_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    email: 'marcus.vance@streetstyle.io',
    status: 'pending',
    created_at: new Date('2026-10-25T11:20:00Z').toISOString(),
    product: {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      name: 'Air Phantom X',
      slug: 'air-phantom-x',
      brand: 'SneakerDrop Originals',
      price: 12999,
      image_url: '/images/sneaker-1.svg',
    },
  },
  {
    id: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    product_id: 'c9a646d3-9c61-4cb7-89cd-8682c04e16bb',
    email: 'elena.kicks@hypebeast.com',
    status: 'pending',
    created_at: new Date('2026-10-26T16:45:00Z').toISOString(),
    product: {
      id: 'c9a646d3-9c61-4cb7-89cd-8682c04e16bb',
      name: 'Urban Velocity 01',
      slug: 'urban-velocity-01',
      brand: 'SneakerDrop Originals',
      price: 9499,
      image_url: '/images/sneaker-2.svg',
    },
  },
  {
    id: 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    product_id: '7d35b91a-7b3b-4813-9c2b-4d436a536712',
    email: 'kofi.mensah@tokyodrip.jp',
    status: 'notified',
    created_at: new Date('2026-10-27T09:15:00Z').toISOString(),
    product: {
      id: '7d35b91a-7b3b-4813-9c2b-4d436a536712',
      name: 'Shadow Runner Pro',
      slug: 'shadow-runner-pro',
      brand: 'SneakerDrop Originals',
      price: 14999,
      image_url: '/images/sneaker-3.svg',
    },
  },
];

// Simple IP / identifier rate limiter for MVP (Section 11.2 & 12)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(identifier: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function submitWaitlist(
  productId: string,
  rawEmail: string
): Promise<{ success: boolean; message: string; duplicate?: boolean }> {
  const email = rawEmail.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();

      // Check if registration exists
      const { data: existing } = await admin
        .from('waitlist')
        .select('id')
        .eq('product_id', productId)
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          duplicate: true,
          message: 'You are already registered for this sneaker drop waitlist.',
        };
      }

      // Insert into PostgreSQL
      const { error } = await admin.from('waitlist').insert([
        {
          product_id: productId,
          email,
          status: 'pending',
        },
      ]);

      if (error) {
        // PostgreSQL unique constraint error code 23505
        if (error.code === '23505' || error.message.includes('unique')) {
          return {
            success: false,
            duplicate: true,
            message: 'You are already registered for this sneaker drop waitlist.',
          };
        }
        throw new Error(error.message);
      }

      return {
        success: true,
        message: "You're on the list! We'll notify you the moment this drop goes live.",
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Database error';
      console.error('Waitlist submit error:', message);
      return {
        success: false,
        message: 'Unable to register at this time. Please try again.',
      };
    }
  }

  // Fallback storage check
  const duplicate = localWaitlist.some(
    (entry) => entry.product_id === productId && entry.email.toLowerCase() === email
  );

  if (duplicate) {
    return {
      success: false,
      duplicate: true,
      message: 'You are already registered for this sneaker drop waitlist.',
    };
  }

  const product = await getProductById(productId);

  const newEntry: WaitlistEntry = {
    id: crypto.randomUUID(),
    product_id: productId,
    email,
    status: 'pending',
    created_at: new Date().toISOString(),
    product: product
      ? {
          id: product.id,
          name: product.name,
          slug: product.slug,
          brand: product.brand,
          price: product.price,
          image_url: product.image_url,
        }
      : undefined,
  };

  localWaitlist.unshift(newEntry);

  return {
    success: true,
    message: "You're on the list! We'll notify you the moment this drop goes live.",
  };
}

export async function getWaitlistEntries(options?: {
  productId?: string;
  emailSearch?: string;
  status?: string;
}): Promise<WaitlistEntry[]> {
  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();
      let query = admin
        .from('waitlist')
        .select(`
          id,
          product_id,
          email,
          status,
          created_at,
          products (
            id,
            name,
            slug,
            brand,
            price,
            image_url
          )
        `)
        .order('created_at', { ascending: false });

      if (options?.productId && options.productId !== 'all') {
        query = query.eq('product_id', options.productId);
      }
      if (options?.status && options.status !== 'all') {
        query = query.eq('status', options.status);
      }
      if (options?.emailSearch) {
        query = query.ilike('email', `%${options.emailSearch}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          email: item.email,
          status: item.status,
          created_at: item.created_at,
          product: item.products ? {
            id: item.products.id,
            name: item.products.name,
            slug: item.products.slug,
            brand: item.products.brand,
            price: item.products.price,
            image_url: item.products.image_url,
          } : undefined,
        }));
      }
    } catch (err) {
      console.error('getWaitlistEntries error:', err);
    }
  }

  let list = [...localWaitlist];
  if (options?.productId && options.productId !== 'all') {
    list = list.filter((w) => w.product_id === options.productId);
  }
  if (options?.status && options.status !== 'all') {
    list = list.filter((w) => w.status === options.status);
  }
  if (options?.emailSearch) {
    const s = options.emailSearch.toLowerCase();
    list = list.filter((w) => w.email.toLowerCase().includes(s));
  }
  return list;
}

export async function updateWaitlistStatus(id: string, status: WaitlistStatus): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();
      const { error } = await admin.from('waitlist').update({ status }).eq('id', id);
      return !error;
    } catch (err) {
      console.error('updateWaitlistStatus error:', err);
      return false;
    }
  }

  const found = localWaitlist.find((w) => w.id === id);
  if (found) {
    found.status = status;
    return true;
  }
  return false;
}

