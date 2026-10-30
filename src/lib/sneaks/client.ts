/**
 * Server-side Sneaker Marketplace Discovery Client Wrapper
 *
 * Provides direct, high-performance querying against verified sneaker marketplace
 * feeds (Goat / Flight Club Algolia product index) with zero external scraping
 * dependencies (eliminates broken sneaks-api, Mongoose compilation errors, and Express).
 *
 * NOTE: NEVER import or use this client in React client components.
 */

const GOAT_ALGOLIA_URL =
  'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a';

/**
 * Direct Algolia fetcher (Goat and Flight Club verified inventory feed).
 * High reliability, zero timeouts, and clean JSON payloads without scraping.
 */
async function fetchAlgoliaSneakers(query: string, hitsPerPage: number = 20): Promise<any[]> {
  try {
    const cleanQ = (query || '').trim();
    const queryParam = cleanQ ? `&query=${encodeURIComponent(cleanQ)}` : '';
    const params = `distinct=true&maxValuesPerFacet=1&page=0&hitsPerPage=${hitsPerPage}${queryParam}`;

    const res = await fetch(GOAT_ALGOLIA_URL, {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            indexName: 'product_variants_v2',
            params,
          },
        ],
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`[SneaksClient] Algolia response failed with status ${res.status}`);
      return [];
    }

    const data = await res.json();
    let hits = data?.results?.[0]?.hits || [];

    // If query was styleId with hyphen/space and returned nothing, try alternate format
    if (hits.length === 0 && cleanQ) {
      const alternateQ = cleanQ.includes('-')
        ? cleanQ.replace(/-/g, ' ')
        : cleanQ.includes(' ')
        ? cleanQ.replace(/\s+/g, '-')
        : '';

      if (alternateQ) {
        const altRes = await fetch(GOAT_ALGOLIA_URL, {
          method: 'POST',
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                indexName: 'product_variants_v2',
                params: `distinct=true&maxValuesPerFacet=1&page=0&hitsPerPage=${hitsPerPage}&query=${encodeURIComponent(
                  alternateQ
                )}`,
              },
            ],
          }),
          cache: 'no-store',
        });

        if (altRes.ok) {
          const altData = await altRes.json();
          hits = altData?.results?.[0]?.hits || [];
        }
      }
    }

    return hits;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[SneaksClient] Algolia fetch failed for "${query}":`, message);
    return [];
  }
}

/**
 * Search sneakers by keyword or style query
 */
export async function getProductsAsync(keyword: string, limit: number = 20): Promise<any[]> {
  const boundedLimit = Math.min(Math.max(1, limit), 50);
  return fetchAlgoliaSneakers(keyword, boundedLimit);
}

/**
 * Fetch popular sneakers feed
 */
export async function getMostPopularAsync(limit: number = 20): Promise<any[]> {
  const boundedLimit = Math.min(Math.max(1, limit), 50);
  return fetchAlgoliaSneakers('', boundedLimit);
}

/**
 * Fetch detailed sneaker information and prices by Style ID
 */
export async function getProductPricesAsync(styleID: string): Promise<any | null> {
  const cleanId = styleID.trim();
  if (!cleanId) return null;
  const hits = await fetchAlgoliaSneakers(cleanId, 1);
  return hits[0] || null;
}

/**
 * Mock / fallback client interface for backwards compatibility
 */
export const sneaks = {
  getProducts: (keyword: string, limit: number, cb: (err: any, data: any[]) => void) => {
    getProductsAsync(keyword, limit).then((res) => cb(null, res)).catch((err) => cb(err, []));
  },
  getMostPopular: (limit: number, cb: (err: any, data: any[]) => void) => {
    getMostPopularAsync(limit).then((res) => cb(null, res)).catch((err) => cb(err, []));
  },
  getProductPrices: (styleID: string, cb: (err: any, data: any) => void) => {
    getProductPricesAsync(styleID).then((res) => cb(null, res)).catch((err) => cb(err, null));
  },
};
