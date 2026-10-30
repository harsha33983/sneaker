import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CollectionsCatalogue from './CollectionsCatalogue';
import { getProducts } from '@/lib/data/products';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drop Catalogue — SneakerDrop',
  description: 'Explore the complete collection of exclusive sneaker drops, archival silhouettes, and limited releases.',
};

export default async function CollectionsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="mb-12 text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
              ARCHIVE & RUNTIME
            </span>
            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F5F3EE] mt-2">
              CATALOGUE RELEASES
            </h1>
            <p className="text-sm text-[#A4A19B] max-w-xl mt-3 leading-relaxed">
              Real-time inventory and drop availability across our current season. Filter by release status or search for specific models.
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
