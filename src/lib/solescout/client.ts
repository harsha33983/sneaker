import { SoleScoutSearchResponse, SoleScoutProductDetail } from './types';

const BASE_URL = 'https://solescout.ai/api/public';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// In-memory cache to stay safely within the 60 requests/minute limit
const searchCache = new Map<string, CacheEntry<SoleScoutSearchResponse>>();
const productCache = new Map<string, CacheEntry<SoleScoutProductDetail>>();

const SEARCH_TTL_MS = 5 * 60 * 1000; // 5 minutes
const PRODUCT_TTL_MS = 15 * 60 * 1000; // 15 minutes

// Rate limit helper: simple rolling window tracker
let requestCountInWindow = 0;
let windowStartTime = Date.now();
const MAX_REQUESTS_PER_MINUTE = 55; // Leave safety margin below 60

function checkRateLimit(): boolean {
  const now = Date.now();
  if (now - windowStartTime > 60_000) {
    windowStartTime = now;
    requestCountInWindow = 0;
  }
  if (requestCountInWindow >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  requestCountInWindow++;
  return true;
}

/**
 * Search sneakers via SoleScout Public API
 */
export async function searchSoleScoutSneakers(
  query: string,
  limit: number = 20,
  page: number = 1
): Promise<SoleScoutSearchResponse> {
  const cleanQuery = (query || 'sneakers').trim();
  const boundedLimit = Math.min(Math.max(1, limit), 50);
  const boundedPage = Math.max(1, page);
  const cacheKey = `${cleanQuery.toLowerCase()}_${boundedLimit}_${boundedPage}`;

  // Check cache
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < SEARCH_TTL_MS) {
    return cached.data;
  }

  if (!checkRateLimit()) {
    // If rate limited, return cached if available, or throw rate limit error
    if (cached) return cached.data;
    throw new Error('SoleScout API rate limit reached. Please wait a moment and try again.');
  }

  const url = `${BASE_URL}/search?q=${encodeURIComponent(cleanQuery)}&limit=${boundedLimit}&page=${boundedPage}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SneakerDrop-Client/1.0',
      },
      next: { revalidate: 300 }, // Next.js ISR 5 min cache
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 429) {
        throw new Error('SoleScout API rate limit exceeded (429). Please try again shortly.');
      }
      throw new Error(`SoleScout API error: ${res.status} ${res.statusText}`);
    }

    const data: SoleScoutSearchResponse = await res.json();

    // Cache valid response
    searchCache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('SoleScout API request timed out.');
    }
    throw error;
  }
}

/**
 * Get detailed sneaker information via SoleScout Public API
 */
export async function getSoleScoutProductDetails(slug: string): Promise<SoleScoutProductDetail> {
  const cleanSlug = slug.trim();
  if (!cleanSlug) {
    throw new Error('Product slug is required.');
  }

  // Check cache
  const cached = productCache.get(cleanSlug);
  if (cached && Date.now() - cached.timestamp < PRODUCT_TTL_MS) {
    return cached.data;
  }

  if (!checkRateLimit()) {
    if (cached) return cached.data;
    throw new Error('SoleScout API rate limit reached. Please wait a moment.');
  }

  const url = `${BASE_URL}/product?slug=${encodeURIComponent(cleanSlug)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SneakerDrop-Client/1.0',
      },
      next: { revalidate: 900 }, // Next.js ISR 15 min cache
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('Sneaker not found on SoleScout.');
      }
      if (res.status === 429) {
        throw new Error('SoleScout API rate limit exceeded (429).');
      }
      throw new Error(`SoleScout API error: ${res.status} ${res.statusText}`);
    }

    const data: SoleScoutProductDetail = await res.json();

    // Cache valid response
    productCache.set(cleanSlug, { data, timestamp: Date.now() });

    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('SoleScout API request timed out.');
    }
    throw error;
  }
}

