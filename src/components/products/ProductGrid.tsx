'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/types';
import { Sparkles } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl p-6 animate-pulse space-y-4"
          >
            <div className="aspect-[4/3] bg-[#242424] rounded-xl" />
            <div className="h-4 bg-[#242424] rounded w-1/3" />
            <div className="h-6 bg-[#242424] rounded w-3/4" />
            <div className="h-10 bg-[#242424] rounded w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-24 bg-[#181818] border border-dashed border-[#333333] rounded-3xl p-8">
        <div className="w-16 h-16 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center mx-auto text-[#A4A19B] mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-[family-name:var(--font-space)] text-xl font-bold uppercase tracking-tight text-[#F5F3EE]">
          NO DROPS FOUND
        </h3>
        <p className="text-sm text-[#A4A19B] max-w-md mx-auto mt-2">
          There are currently no sneakers matching your filters. Try selecting a different category or clearing search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
