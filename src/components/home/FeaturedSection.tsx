'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Flame } from 'lucide-react';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';

interface FeaturedSectionProps {
  products: Product[];
}

export default function FeaturedSection({ products }: FeaturedSectionProps) {
  return (
    <section id="featured-drops" className="py-24 bg-[#111111] relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#222222] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D7FF45] uppercase tracking-widest mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>THE DROP VAULT</span>
            </div>
            <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F5F3EE]">
              FEATURED RELEASES
            </h2>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#A4A19B] hover:text-[#D7FF45] transition-colors tracking-widest uppercase font-[family-name:var(--font-space)]"
          >
            <span>VIEW COMPLETE CATALOGUE</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </section>
  );
}

