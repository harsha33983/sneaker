import React from 'react';
import { Metadata } from 'next';
import SneakerImportClient from './SneakerImportClient';
import { getPopularSneakers } from '@/lib/sneaks/service';
import { getAllProducts } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Sneaker Import Discovery — SneakerDrop Admin',
  description: 'Search global marketplace releases and import real authenticated sneakers into SneakerDrop.',
};

export const dynamic = 'force-dynamic';

export default async function ImportSneakersPage() {
  // Fetch initial popular sneakers and existing products for duplicate tagging
  let initialSneakers: any[] = [];
  try {
    initialSneakers = await getPopularSneakers(16);
  } catch (err) {
    console.error('Failed to load initial popular sneakers:', err);
  }

  const existingProducts = await getAllProducts();
  const existingStyleIds = existingProducts
    .map((p) => p.style_id?.toUpperCase())
    .filter(Boolean) as string[];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#D7FF45] uppercase tracking-widest">
            SNEAKS-API // MARKETPLACE ENGINE
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#222222] text-[#A4A19B] border border-[#333333]">
            LIVE FEED
          </span>
        </div>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-black uppercase tracking-tight text-[#F5F3EE] mt-1">
          SNEAKER IMPORT DASHBOARD
        </h1>
        <p className="text-xs text-[#888884] mt-1 max-w-3xl">
          Search, inspect, and import authentic footwear models from global resale marketplaces (StockX, Goat, Flight Club). Review original retail specifications and configure custom INR selling prices.
        </p>
      </div>

      <SneakerImportClient
        initialSneakers={initialSneakers}
        existingStyleIds={existingStyleIds}
      />
    </div>
  );
}

