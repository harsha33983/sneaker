import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Product, Availability } from '@/types';

// Default initial seed data defined in PRD Section 6.1 + Nova 01
export const SEED_PRODUCTS: Product[] = [
  {
    id: 'e1a2b3c4-d5e6-4f7a-8b9c-0d1e2f3a4b5c',
    name: 'Nova 01',
    slug: 'nova-01',
    brand: 'Nova Running',
    price: 12999,
    description:
      'A 198 g road-running shoe with a glowing foam midsole. One piece of foam, tuned to give back more than you put in. A light strip runs through it, so you are seen before you are heard.',
    image_url: 'https://prompts.picsmob.com/frames/nova/frame_0001.jpg',
    images: [
      'https://prompts.picsmob.com/frames/nova/frame_0001.jpg',
      'https://prompts.picsmob.com/frames/nova/frame_0060.jpg',
      'https://prompts.picsmob.com/frames/nova/frame_0120.jpg',
    ],
    category: 'Running',
    availability: 'limited',
    is_featured: true,
    created_at: new Date('2026-10-15T08:00:00Z').toISOString(),
    updated_at: new Date('2026-10-15T08:00:00Z').toISOString(),
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    name: 'Air Phantom X',
    slug: 'air-phantom-x',
    brand: 'SneakerDrop Originals',
    price: 12999,
    description:
      'The Air Phantom X redefines stealth luxury. Featuring a monochromatic upper with premium tumbled leather, responsive Air cushioning, and a translucent outsole that catches light like no other. Built for those who move in silence but leave a lasting impression.',
    image_url: '/images/sneaker-1.svg',
    images: ['/images/sneaker-1.svg', 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80'],
    category: 'Lifestyle',
    availability: 'available',
    is_featured: true,
    created_at: new Date('2026-10-01T10:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T10:00:00Z').toISOString(),
  },
  {
    id: 'c9a646d3-9c61-4cb7-89cd-8682c04e16bb',
    name: 'Urban Velocity 01',
    slug: 'urban-velocity-01',
    brand: 'SneakerDrop Originals',
    price: 9499,
    description:
      'Speed meets street. The Urban Velocity 01 pairs a breathable knit upper with a sculpted midsole designed for all-day comfort. The bold colorway and reflective accents make this a standout piece for the modern urbanite who refuses to blend in.',
    image_url: '/images/sneaker-2.svg',
    images: ['/images/sneaker-2.svg', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80'],
    category: 'Running',
    availability: 'limited',
    is_featured: true,
    created_at: new Date('2026-10-05T14:30:00Z').toISOString(),
    updated_at: new Date('2026-10-05T14:30:00Z').toISOString(),
  },
  {
    id: '7d35b91a-7b3b-4813-9c2b-4d436a536712',
    name: 'Shadow Runner Pro',
    slug: 'shadow-runner-pro',
    brand: 'SneakerDrop Originals',
    price: 14999,
    description:
      'Born from the shadows, built for the spotlight. The Shadow Runner Pro features a triple-black design with carbon fiber accents, ultra-responsive foam technology, and a silhouette that blurs the line between performance and fashion. Limited to 500 pairs worldwide.',
    image_url: '/images/sneaker-3.svg',
    images: ['/images/sneaker-3.svg', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80'],
    category: 'Performance',
    availability: 'sold_out',
    is_featured: true,
    created_at: new Date('2026-10-10T18:00:00Z').toISOString(),
    updated_at: new Date('2026-10-10T18:00:00Z').toISOString(),
  },
];

// In-memory cache for fallback mode when Supabase is not yet populated
let localProducts = [...SEED_PRODUCTS];

export async function getProducts(options?: {
  category?: string;
  availability?: string;
  search?: string;
  sort?: string;
}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      let query = supabase.from('products').select('*');

      if (options?.category && options.category !== 'all') {
        query = query.ilike('category', options.category);
      }
      if (options?.availability && options.availability !== 'all') {
        query = query.eq('availability', options.availability);
      }
      if (options?.search) {
        query = query.ilike('name', `%${options.search}%`);
      }

      if (options?.sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (options?.sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.error('Supabase getProducts error:', error);
        return fallbackFiltered(options);
      }
      if (data && data.length > 0) {
        return data as Product[];
      }
      // If table is empty, auto-seed to ensure at least 3 products exist
      return fallbackFiltered(options);
    } catch (err) {
      console.error('Supabase query failed, falling back to seed:', err);
      return fallbackFiltered(options);
    }
  }

  return fallbackFiltered(options);
}

function fallbackFiltered(options?: {
  category?: string;
  availability?: string;
  search?: string;
  sort?: string;
}): Product[] {
  let list = [...localProducts];
  if (options?.category && options.category !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === options.category?.toLowerCase());
  }
  if (options?.availability && options.availability !== 'all') {
    list = list.filter((p) => p.availability === options.availability);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s));
  }
  if (options?.sort === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options?.sort === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  return list;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.error('Supabase getProductBySlug error:', err);
    }
  }
  const found = localProducts.find((p) => p.slug === slug);
  return found || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.error('Supabase getProductById error:', err);
    }
  }
  const found = localProducts.find((p) => p.id === id);
  return found || null;
}

export async function createProduct(payload: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('products')
      .insert([
        {
          name: payload.name,
          slug: payload.slug,
          brand: payload.brand,
          price: payload.price,
          description: payload.description,
          image_url: payload.image_url,
          images: payload.images || [],
          category: payload.category,
          availability: payload.availability,
          is_featured: payload.is_featured ?? false,
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    return data as Product;
  }

  // Fallback storage
  const newProduct: Product = {
    ...payload,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localProducts.unshift(newProduct);
  return newProduct;
}

export async function updateProduct(
  id: string,
  payload: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product> {
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from('products')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    return data as Product;
  }

  const idx = localProducts.findIndex((p) => p.id === id);
  if (idx === -1) {
    throw new Error('Product not found');
  }
  localProducts[idx] = {
    ...localProducts[idx],
    ...payload,
    updated_at: new Date().toISOString(),
  };
  return localProducts[idx];
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const admin = createAdminClient();
    const { error } = await admin.from('products').delete().eq('id', id);
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    return true;
  }

  const initialLength = localProducts.length;
  localProducts = localProducts.filter((p) => p.id !== id);
  return localProducts.length < initialLength;
}

