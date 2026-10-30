import { NormalizedSneaker, MarketplacePrices, MarketplaceLinks } from './types';

/**
 * Strip HTML tags and entities from raw story/description strings
 */
export function stripHtml(input?: string | null): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean and format dates into ISO YYYY-MM-DD
 */
export function normalizeDate(dateStr?: string | null): string | null {
  if (!dateStr) return null;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {
    // Ignore invalid dates
  }
  return null;
}

/**
 * Standardize image URLs, preferring high-res and providing fallback
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '/images/sneaker-1.svg';
  }
  const trimmed = url.trim();
  // Ensure protocol
  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }
  return trimmed;
}

/**
 * Normalize raw sneaker data from sneaks-api or Algolia Goat/FlightClub feed
 */
export function normalizeSneaker(raw: any, sourceHint: 'sneaks-api' | 'goat' | 'flightclub' | 'stockx' = 'sneaks-api'): NormalizedSneaker {
  // Case 1: Raw Algolia hit from Goat/FlightClub
  if (raw.product_template_id || raw.sku || raw.brand_name) {
    const styleId = (raw.sku || raw.search_sku || `GT-${raw.product_template_id || Math.random().toString(36).substring(7)}`).trim().toUpperCase();
    const retailCents = raw.retail_price_cents_usd ?? raw.retail_price_cents;
    const lowestCents = raw.lowest_price_cents_usd ?? raw.lowest_price_cents ?? raw.instant_ship_lowest_price_cents_usd;

    const retailPrice = typeof retailCents === 'number' && retailCents > 0 ? retailCents / 100 : null;
    const lowestResell = typeof lowestCents === 'number' && lowestCents > 0 ? lowestCents / 100 : null;

    const rawImg = raw.original_picture_url || raw.main_picture_url || raw.grid_picture_url;
    const imageUrl = normalizeImageUrl(rawImg);

    const resellPrices: MarketplacePrices = {};
    if (lowestResell) {
      resellPrices.goat = lowestResell;
      resellPrices.flightClub = lowestResell;
    }

    const resellLinks: MarketplaceLinks = {};
    if (raw.slug) {
      resellLinks.goat = `https://www.goat.com/sneakers/${raw.slug}`;
      resellLinks.flightClub = `https://www.flightclub.com/${raw.slug}`;
    }

    return {
      id: `ext-${raw.product_template_id || styleId.replace(/[^a-zA-Z0-9]/g, '-')}`,
      externalId: String(raw.product_template_id || styleId),
      shoeName: raw.name || raw.nickname || 'Unknown Sneaker',
      brand: raw.brand_name || 'SneakerDrop',
      silhouette: raw.silhouette || raw.category?.[0] || 'Sneakers',
      styleID: styleId,
      colorway: raw.details || raw.color || 'Original Colorway',
      retailPrice,
      releaseDate: normalizeDate(raw.release_date),
      description:
        stripHtml(raw.story_html || raw.story) ||
        `Authentic ${raw.brand_name || ''} ${raw.name || ''} featuring an iconic silhouette, distinct ${raw.details || raw.color || 'colorway'}, and premium construction.`,
      imageUrl,
      additionalImages: raw.grid_glow_picture_url ? [raw.grid_glow_picture_url] : [],
      lowestResellPrice: resellPrices,
      resellLinks,
      source: 'goat',
    };
  }

  // Case 2: Standard sneaks-api object
  const styleId = (raw.styleID || raw.style_id || `SNK-${Math.random().toString(36).substring(7)}`).trim().toUpperCase();
  const retailPrice = typeof raw.retailPrice === 'number' && raw.retailPrice > 0 ? raw.retailPrice : null;

  const resellPrices: MarketplacePrices = {
    stockX: raw.lowestResellPrice?.stockX ?? null,
    goat: raw.lowestResellPrice?.goat ?? null,
    flightClub: raw.lowestResellPrice?.flightClub ?? null,
    stadiumGoods: raw.lowestResellPrice?.stadiumGoods ?? null,
  };

  const resellLinks: MarketplaceLinks = {
    stockX: raw.resellLinks?.stockX ?? null,
    goat: raw.resellLinks?.goat ?? null,
    flightClub: raw.resellLinks?.flightClub ?? null,
    stadiumGoods: raw.resellLinks?.stadiumGoods ?? null,
  };

  return {
    id: `ext-${styleId.replace(/[^a-zA-Z0-9]/g, '-')}`,
    externalId: styleId,
    shoeName: raw.shoeName || raw.name || 'Unknown Sneaker',
    brand: raw.brand || 'SneakerDrop',
    silhouette: raw.silhoutte || raw.silhouette || raw.make || 'Sneakers',
    styleID: styleId,
    colorway: raw.colorway || 'Original Colorway',
    retailPrice,
    releaseDate: normalizeDate(raw.releaseDate),
    description:
      stripHtml(raw.description) ||
      `Authentic ${raw.brand || ''} ${raw.shoeName || ''} with style ID ${styleId}.`,
    imageUrl: normalizeImageUrl(raw.thumbnail || raw.image),
    additionalImages: Array.isArray(raw.imageLinks) ? raw.imageLinks : [],
    lowestResellPrice: resellPrices,
    resellLinks,
    source: sourceHint,
  };
}
