import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CollectionsCatalogue from './CollectionsCatalogue';
import { getProducts } from '@/lib/data/products';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ArrowUpRight, Box } from 'lucide-react';

export const metadata: Metadata = {
  title: 'SneakerDrop Collection — Official Drops & Vault Archive',
  description: 'Explore the complete SneakerDrop Collection: authenticated inventory, vaulted drops, and exclusive releases.',
};

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Collection vs Discovery Navigation Pill Bar */}
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#D7FF45]/15">
              <Box className="w-3.5 h-3.5" />
              <span>SneakerDrop Collection</span>
            </div>

            <Link
              href="/discover"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181818] hover:bg-[#222222] border border-[#333333] hover:border-[#D7FF45]/50 text-[#A4A19B] hover:text-[#F5F3EE] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D7FF45]" />
              <span>Live Sneaker Discovery</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF45] animate-pulse" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-12 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
              AUTHENTICATED INVENTORY & ARCHIVE
            </span>
            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F5F3EE] mt-2">
              SNEAKERDROP COLLECTION
            </h1>
            <p className="text-sm text-[#A4A19B] max-w-xl mt-3 leading-relaxed">
              Official store releases and vaulted inventory stored in the SneakerDrop database. Filter by availability, status, or search for specific models.
            </p>
          </div>

          {/* Interactive catalogue */}
          <CollectionsCatalogue initialProducts={products} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
