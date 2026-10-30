/**
 * Server-side Sneaks-API Client Wrapper
 *
 * Provides typed Promise wrappers around sneaks-api's callback methods
 * with timeout handling, error logging, and resilient fallback to live
 * marketplace endpoints when StockX anti-bot blocks scraping requests.
 *
 * NOTE: NEVER import or use this client in React client components.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const SneaksAPI = require('sneaks-api');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const got = require('got');

// Initialize the core library instance as specified in PRD Section 2
export const sneaks = new SneaksAPI();

const TIMEOUT_MS = 2500;
const GOAT_ALGOLIA_URL =
  'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a';

/**
 * Direct Algolia fallback fetcher (used by Goat and Flight Club scrapers)
 * Ensures high reliability when StockX anti-bot / Cloudflare blocks requests.
 */
async function fetchAlgoliaSneakers(query: string, hitsPerPage: number = 20): Promise<any[]> {
  try {
    const cleanQ = (query || '').trim();
    const queryParam = cleanQ ? `&query=${encodeURIComponent(cleanQ)}` : '';
    const params = `distinct=true&maxValuesPerFacet=1&page=0&hitsPerPage=${hitsPerPage}${queryParam}`;

    const res = await got.post(GOAT_ALGOLIA_URL, {
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
      http2: false,
      timeout: 6000,
    });

    const data = JSON.parse(res.body);
    let hits = data?.results?.[0]?.hits || [];

    // If query was styleId with hyphen/space and returned nothing, try alternate
    if (hits.length === 0 && cleanQ) {
      const alternateQ = cleanQ.includes('-')
        ? cleanQ.replace(/-/g, ' ')
        : cleanQ.includes(' ')
        ? cleanQ.replace(/\s+/g, '-')
        : '';

      if (alternateQ) {
        const altRes = await got.post(GOAT_ALGOLIA_URL, {
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
          http2: false,
          timeout: 6000,
        });

        const altData = JSON.parse(altRes.body);
        hits = altData?.results?.[0]?.hits || [];
      }
    }

    return hits;
  } catch (err: any) {
    console.error(`[SneaksClient] Algolia fallback fetch failed for "${query}":`, err.message);
    return [];
  }
}

/**
 * Search sneakers using sneaks.getProducts(keyword, limit, callback)
 * Wrapped in a typed Promise with timeout and resilient marketplace fallback.
 */
export async function getProductsAsync(keyword: string, limit: number = 20): Promise<any[]> {
  const boundedLimit = Math.min(Math.max(1, limit), 50);

  return new Promise<any[]>((resolve) => {
    let finished = false;
    const timer = setTimeout(async () => {
      if (!finished) {
        finished = true;
        console.warn(`[SneaksClient] sneaks.getProducts timeout. Engaging live fallback for "${keyword}".`);
        const fallbackHits = await fetchAlgoliaSneakers(keyword, boundedLimit);
        resolve(fallbackHits);
      }
    }, TIMEOUT_MS);

    try {
      sneaks.getProducts(keyword, boundedLimit, async (err: any, products: any[]) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);

        if (err || !products || !products.length) {
          console.warn(
            `[SneaksClient] sneaks.getProducts scraping limitation (${err?.message || 'Empty'}). Engaging fallback.`
          );
          const fallbackHits = await fetchAlgoliaSneakers(keyword, boundedLimit);
          return resolve(fallbackHits);
        }

        resolve(products);
      });
    } catch (err: any) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      console.warn(`[SneaksClient] Exception in sneaks.getProducts:`, err.message);
      fetchAlgoliaSneakers(keyword, boundedLimit).then(resolve);
    }
  });
}

/**
 * Fetch popular sneakers using sneaks.getMostPopular(limit, callback)
 */
export async function getMostPopularAsync(limit: number = 20): Promise<any[]> {
  const boundedLimit = Math.min(Math.max(1, limit), 50);

  return new Promise<any[]>((resolve) => {
    let finished = false;
    const timer = setTimeout(async () => {
      if (!finished) {
        finished = true;
        console.warn(`[SneaksClient] sneaks.getMostPopular timeout. Engaging fallback.`);
        const fallbackHits = await fetchAlgoliaSneakers('', boundedLimit);
        resolve(fallbackHits);
      }
    }, TIMEOUT_MS);

    try {
      sneaks.getMostPopular(boundedLimit, async (err: any, products: any[]) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);

        if (err || !products || !products.length) {
          console.warn(
            `[SneaksClient] sneaks.getMostPopular scraping failure (${err?.message || 'Empty'}). Engaging fallback.`
          );
          const fallbackHits = await fetchAlgoliaSneakers('', boundedLimit);
          return resolve(fallbackHits);
        }

        resolve(products);
      });
    } catch (err: any) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      fetchAlgoliaSneakers('', boundedLimit).then(resolve);
    }
  });
}

/**
 * Fetch detailed sneaker information and prices by Style ID
 * sneaks.getProductPrices(styleID, callback)
 */
export async function getProductPricesAsync(styleID: string): Promise<any | null> {
  const cleanId = styleID.trim();
  if (!cleanId) return null;

  return new Promise<any | null>((resolve) => {
    let finished = false;
    const timer = setTimeout(async () => {
      if (!finished) {
        finished = true;
        console.warn(`[SneaksClient] sneaks.getProductPrices timeout for ${cleanId}. Switching to fallback.`);
        const hits = await fetchAlgoliaSneakers(cleanId, 1);
        resolve(hits[0] || null);
      }
    }, TIMEOUT_MS);

    try {
      sneaks.getProductPrices(cleanId, async (err: any, product: any) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);

        if (err || !product) {
          console.warn(
            `[SneaksClient] sneaks.getProductPrices error for ${cleanId}: ${err?.message || 'Not found'}. Engaging fallback.`
          );
          const hits = await fetchAlgoliaSneakers(cleanId, 1);
          return resolve(hits[0] || null);
        }

        resolve(product);
      });
    } catch (err: any) {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      fetchAlgoliaSneakers(cleanId, 1).then((hits) => resolve(hits[0] || null));
    }
  });
}
