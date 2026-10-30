export interface SoleScoutSearchResultItem {
  slug: string;
  title: string;
  brand: string;
  style_code?: string | null;
  category?: string | null;
  gender?: string | null;
  color?: string | null;
  lowest_price_usd?: number | null;
  retail_price_usd?: number | null;
  image?: string | null;
  url?: string | null;
}

export interface SoleScoutSearchResponse {
  total: number;
  page: number;
  limit: number;
  count: number;
  results: SoleScoutSearchResultItem[];
  source: string;
  docs?: string;
}

export interface SoleScoutStore {
  name: string;
  price_usd: number | null;
  below_retail?: boolean;
  saving_usd?: number | null;
  sizes_in_stock?: string[];
  url?: string | null;
}

export interface SoleScoutHiddenStores {
  count: number;
  lowest_price_usd?: number | null;
  lowest_landed_usd?: number | null;
  unlock?: string;
  note?: string;
}

export interface SoleScoutSizeInStock {
  size: string;
  lowest_price_usd?: number | null;
  discount_pct?: number | null;
}

export interface SoleScoutProductDetail {
  slug: string;
  title: string;
  brand: string;
  style_code?: string | null;
  category?: string | null;
  gender?: string | null;
  color?: string | null;
  image?: string | null;
  url?: string | null;
  retail_price_usd?: number | null;
  lowest_price_usd?: number | null;
  highest_price_usd?: number | null;
  stores_carrying?: number;
  stores?: SoleScoutStore[];
  hidden_stores?: SoleScoutHiddenStores;
  sizes_in_stock?: SoleScoutSizeInStock[];
  disclaimer?: string;
  source?: string;
  docs?: string;
}

