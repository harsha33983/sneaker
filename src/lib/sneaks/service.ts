import {
  NormalizedSneaker,
  ImportProductInput,
  CheckDuplicateResult,
} from './types';
import { normalizeSneaker } from './normalizer';
import {
  getProductsAsync,
  getMostPopularAsync,
  getProductPricesAsync,
} from './client';
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
} from '@/lib/data/products';
import { Product } from '@/types';
import { createAdminClient, isSupabaseConfigured } from '@/lib/supabase/admin';

// In-memory cache for external queries to prevent excessive marketplace scraping
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// In-flight request deduplication map
const inflightRequests = new Map<string, Promise<any>>();

function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setInCache<T>(key: string, data: T, ttlMs: number = CACHE_TTL_MS): void {
  // Simple LRU-like limit to prevent unbounded memory growth
  if (cache.size > 200) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) cache.delete(oldestKey);
  }
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

/**
 * Search sneakers via sneaks-api with caching and deduplication
 */
export async function searchSneakers(
  query: string,
  limit: number = 20
): Promise<NormalizedSneaker[]> {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) {
    return getPopularSneakers(limit);
  }

  const boundedLimit = Math.min(Math.max(1, limit), 50);
  const cacheKey = `search:${cleanQuery.toLowerCase()}:${boundedLimit}`;

  const cached = getFromCache<NormalizedSneaker[]>(cacheKey);
  if (cached) return cached;

  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey)!;
  }

  const promise = (async () => {
    try {
      const rawProducts = await getProductsAsync(cleanQuery, boundedLimit);
      const normalized = (rawProducts || []).map((raw) => normalizeSneaker(raw));
      setInCache(cacheKey, normalized);
      return normalized;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  })();

  inflightRequests.set(cacheKey, promise);
  return promise;
}

/**
 * Fetch popular sneakers via sneaks-api
 */
export async function getPopularSneakers(
  limit: number = 20
): Promise<NormalizedSneaker[]> {
  const boundedLimit = Math.min(Math.max(1, limit), 50);
  const cacheKey = `popular:${boundedLimit}`;

  const cached = getFromCache<NormalizedSneaker[]>(cacheKey);
  if (cached) return cached;

  if (inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey)!;
  }

  const promise = (async () => {
    try {
      const rawProducts = await getMostPopularAsync(boundedLimit);
      const normalized = (rawProducts || []).map((raw) => normalizeSneaker(raw));
      setInCache(cacheKey, normalized);
      return normalized;
    } finally {
      inflightRequests.delete(cacheKey);
    }
  })();

  inflightRequests.set(cacheKey, promise);
  return promise;
}

/**
 * Fetch detailed sneaker information by style ID
 */
export async function getSneakerDetails(
  styleId: string
): Promise<NormalizedSneaker | null> {
  const cleanId = (styleId || '').trim();
  if (!cleanId) return null;

  const cacheKey = `details:${cleanId.toLowerCase()}`;
  const cached = getFromCache<NormalizedSneaker>(cacheKey);
  if (cached) return cached;

  try {
    const raw = await getProductPricesAsync(cleanId);
    if (!raw) return null;
    const normalized = normalizeSneaker(raw);
    setInCache(cacheKey, normalized);
    return normalized;
  } catch (err) {
    console.error(`[SneaksService] Error fetching details for ${cleanId}:`, err);
    return null;
  }
}

/**
 * Check whether a sneaker with the given style ID or external product ID already exists
 */
export async function checkDuplicate(
  styleId: string,
  externalProductId?: string
): Promise<CheckDuplicateResult> {
  const cleanStyleId = (styleId || '').trim().toUpperCase();
  const cleanExternalId = (externalProductId || '').trim();

  // 1. Check Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const admin = createAdminClient();
      let query = admin.from('products').select('id, name, slug, style_id, price');

      if (cleanStyleId && cleanExternalId) {
        query = query.or(`style_id.eq.${cleanStyleId},external_product_id.eq.${cleanExternalId}`);
      } else if (cleanStyleId) {
        query = query.eq('style_id', cleanStyleId);
      } else if (cleanExternalId) {
        query = query.eq('external_product_id', cleanExternalId);
      } else {
        return { isDuplicate: false, existingProduct: null };
      }

      const { data, error } = await query.limit(1).maybeSingle();

      if (!error && data) {
        return {
          isDuplicate: true,
          existingProduct: data,
        };
      }
    } catch (err) {
      console.error('[SneaksService] Supabase duplicate check error:', err);
    }
  }

  // 2. Check local fallback products
  const localProducts = await getAllProducts();
  const found = localProducts.find(
    (p) =>
      (cleanStyleId && p.style_id?.toUpperCase() === cleanStyleId) ||
      (cleanExternalId && p.external_product_id === cleanExternalId)
  );

  if (found) {
    return {
      isDuplicate: true,
      existingProduct: {
        id: found.id,
        name: found.name,
        slug: found.slug,
        style_id: found.style_id,
        price: found.price,
      },
    };
  }

  return { isDuplicate: false, existingProduct: null };
}

/**
 * Helper: Generate unique URL slug
 */
async function generateUniqueSlug(baseName: string, styleId?: string): Promise<string> {
  const rawSlug = (baseName || 'sneaker')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let candidate = rawSlug;
  let counter = 1;

  while (await getProductBySlug(candidate)) {
    if (counter === 1 && styleId) {
      const cleanStyle = styleId.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      candidate = `${rawSlug}-${cleanStyle}`;
    } else {
      candidate = `${rawSlug}-${counter}`;
    }
    counter++;
    if (counter > 20) {
      candidate = `${rawSlug}-${Date.now()}`;
      break;
    }
  }

  return candidate;
}

/**
 * Import an approved sneaker into Supabase / catalogue
 */
export async function importSneakerProduct(input: ImportProductInput): Promise<Product> {
  // 1. Validation
  if (!input.name || input.name.trim().length < 2) {
    throw new Error('Product name is required (min 2 characters).');
  }
  if (!input.brand || input.brand.trim().length < 1) {
    throw new Error('Brand name is required.');
  }
  if (typeof input.price !== 'number' || isNaN(input.price) || input.price <= 0) {
    throw new Error('Selling price in INR must be a positive number.');
  }

  const cleanStyleId = (input.styleId || '').trim().toUpperCase();

  // 2. Duplicate check
  const duplicateCheck = await checkDuplicate(cleanStyleId, input.externalProductId);
  if (duplicateCheck.isDuplicate) {
    throw new Error(
      `Product with Style ID "${cleanStyleId}" already exists in the catalogue: "${duplicateCheck.existingProduct?.name}" (slug: ${duplicateCheck.existingProduct?.slug}).`
    );
  }

  // 3. Generate unique slug
  const slug = await generateUniqueSlug(input.name, cleanStyleId);

  // 4. Clean image URLs
  const imageUrl = input.imageUrl || '/images/sneaker-1.svg';
  const additionalImages = input.additionalImages || [];
  const allImages = Array.from(new Set([imageUrl, ...additionalImages]));

  // 5. Build payload
  const productPayload: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
    name: input.name.trim(),
    slug,
    brand: input.brand.trim(),
    price: Math.round(input.price), // In INR
    description:
      input.description ||
      `Authentic ${input.brand} ${input.name} sneaker. Limited collection release.`,
    image_url: imageUrl,
    images: allImages,
    category: input.category || 'Lifestyle',
    availability: input.availability || 'limited',
    is_featured: Boolean(input.isFeatured),
    external_source: input.externalSource || 'sneaks-api',
    external_product_id: input.externalProductId || cleanStyleId,
    style_id: cleanStyleId || null,
    colorway: input.colorway || null,
    release_date: input.releaseDate || null,
    retail_price: input.retailPrice ? Number(input.retailPrice) : null,
    marketplace_prices: (input.marketplacePrices as Record<string, number | null>) || null,
  };

  // 6. Persist to database
  const created = await createProduct(productPayload);

  // Clear search cache so updated listings reflect accurately
  cache.clear();

  return created;
}
