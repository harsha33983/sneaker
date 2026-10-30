/**
 * Sneaks-API and Marketplace Integration Types
 */

export interface MarketplacePrices {
  stockX?: number | null;
  goat?: number | null;
  flightClub?: number | null;
  stadiumGoods?: number | null;
  [key: string]: number | null | undefined;
}

export interface MarketplaceLinks {
  stockX?: string | null;
  goat?: string | null;
  flightClub?: string | null;
  stadiumGoods?: string | null;
  [key: string]: string | null | undefined;
}

export interface NormalizedSneaker {
  id: string; // generated ID or external ID
  shoeName: string;
  brand: string;
  silhouette: string;
  styleID: string;
  colorway: string;
  retailPrice: number | null; // USD
  releaseDate: string | null; // YYYY-MM-DD
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  lowestResellPrice: MarketplacePrices;
  resellLinks: MarketplaceLinks;
  source: 'sneaks-api' | 'goat' | 'flightclub' | 'stockx';
  externalId: string;
}

export interface ImportProductInput {
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number; // INR selling price set by administrator
  retailPrice?: number | null; // USD original retail price
  availability: 'available' | 'limited' | 'sold_out';
  isFeatured?: boolean;
  imageUrl: string;
  additionalImages?: string[];
  styleId: string;
  colorway?: string;
  releaseDate?: string | null;
  marketplacePrices?: MarketplacePrices;
  externalSource?: string;
  externalProductId?: string;
}

export interface CheckDuplicateResult {
  isDuplicate: boolean;
  existingProduct?: {
    id: string;
    name: string;
    slug: string;
    style_id?: string | null;
    price: number;
  } | null;
}

