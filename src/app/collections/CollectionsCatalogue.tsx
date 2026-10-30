'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/types';
import ProductGrid from '@/components/products/ProductGrid';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface CollectionsCatalogueProps {
  initialProducts: Product[];
}

export default function CollectionsCatalogue({ initialProducts }: CollectionsCatalogueProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['all', ...Array.from(set)];
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Search
        const matchesSearch =
          search === '' ||
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.brand.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase());

        // Category
        const matchesCategory =
          selectedCategory === 'all' ||
          product.category.toLowerCase() === selectedCategory.toLowerCase();

        // Availability
        const matchesAvailability =
          selectedAvailability === 'all' || product.availability === selectedAvailability;

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price_desc') {
          return b.price - a.price;
        }
        // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [initialProducts, search, selectedCategory, selectedAvailability, sortBy]);

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-4 md:p-6 shadow-xl space-y-4">
        {/* Top: Search & Sort */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#888884] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by silhouette, model, or brand..."
              className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl pl-11 pr-4 py-3 text-sm text-[#F5F3EE] placeholder-[#666666] outline-none transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-[#888884]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-4 py-3 text-xs uppercase tracking-wider font-semibold text-[#F5F3EE] outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest Drops</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Bottom: Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#262626]">
          {/* Availability Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-[#777777] mr-1">STATUS:</span>
            {[
              { id: 'all', label: 'ALL STATUS' },
              { id: 'available', label: 'AVAILABLE' },
              { id: 'limited', label: 'LIMITED' },
              { id: 'sold_out', label: 'SOLD OUT' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedAvailability(st.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                  selectedAvailability === st.id
                    ? 'bg-[#D7FF45] text-[#111111] border-[#D7FF45]'
                    : 'bg-[#141414] text-[#A4A19B] border-[#2e2e2e] hover:border-[#444444]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-[#777777] mr-1">CATEGORY:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#F5F3EE] text-[#111111] border-[#F5F3EE]'
                    : 'bg-[#141414] text-[#A4A19B] border-[#2e2e2e] hover:border-[#444444]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-[#888884] px-1 font-mono">
        <span>SHOWING {filteredProducts.length} RELEASES</span>
        {(search || selectedCategory !== 'all' || selectedAvailability !== 'all') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setSelectedAvailability('all');
              setSortBy('newest');
            }}
            className="text-[#D7FF45] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Product Grid */}
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
