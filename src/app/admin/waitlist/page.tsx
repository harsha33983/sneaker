import React from 'react';
import { getWaitlistEntries } from '@/lib/data/waitlist';
import { getProducts } from '@/lib/data/products';
import WaitlistManager from './WaitlistManager';

export default async function AdminWaitlistPage() {
  const [entries, products] = await Promise.all([
    getWaitlistEntries(),
    getProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono font-bold text-[#D7FF45] uppercase tracking-widest">
          PRIORITY ALLOCATION REGISTRY
        </span>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-black uppercase tracking-tight text-[#F5F3EE] mt-1">
          WAITLIST MANAGEMENT
        </h1>
        <p className="text-xs text-[#888884] mt-1">
          Review customer drop registrations, search by email, filter by target sneaker, and export records.
        </p>
      </div>

      <WaitlistManager initialEntries={entries} products={products} />
    </div>
  );
}
