'use client';

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Sparkles, ArrowUpRight, Filter, ShieldCheck, Tag, RefreshCw, AlertCircle } from 'lucide-react';
import { SoleScoutSearchResultItem, SoleScoutSearchResponse } from '@/lib/solescout/types';

interface DiscoverClientProps {
  initialData: SoleScoutSearchResponse | null;
  initialQuery?: string;
}

const POPULAR_BRANDS = [
  { label: 'All', value: '' },
  { label: 'Nike', value: 'Nike' },
  { label: 'Air Jordan', value: 'Jordan' },
  { label: 'Adidas', value: 'Adidas' },
  { label: 'New Balance', value: 'New Balance' },
  { label: 'Asics', value: 'Asics' },
  { label: 'Yeezy', value: 'Yeezy' },
];

export default function DiscoverClient({ initialData, initialQuery = 'jordan' }: DiscoverClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [results, setResults] = useState<SoleScoutSearchResultItem[]>(initialData?.results || []);
  const [totalCount, setTotalCount] = useState<number>(initialData?.total || 0);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Search fetch function
  const fetchSneakers = useCallback(async (searchQuery: string, brandFilter: string, pageNum: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const combinedQuery = [searchQuery.trim(), brandFilter.trim()].filter(Boolean).join(' ') || 'sneakers';
      const res = await fetch(`/api/solescout/search?q=${encodeURIComponent(combinedQuery)}&limit=24&page=${pageNum}`);
      
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Failed to fetch search results (${res.status})`);
      }

      const data: SoleScoutSearchResponse = await res.json();
      startTransition(() => {
        setResults(data.results || []);
        setTotalCount(data.total || 0);
        setPage(pageNum);
      });
    } catch (err: any) {
      console.error('Discover search error:', err);
      setError(err.message || 'Unable to retrieve sneakers from SoleScout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search on query or brand change
  useEffect(() => {
    // Skip initial trigger if query matches initial data
    if (query === initialQuery && selectedBrand === '' && initialData?.results?.length) {
      return;
    }

    const timer = setTimeout(() => {
      fetchSneakers(query, selectedBrand, 1);
    }, 350);

    return () => clearTimeout(timer);
  }, [query, selectedBrand, fetchSneakers, initialQuery, initialData]);

  const handleBrandClick = (brandValue: string) => {
    setSelectedBrand((prev) => (prev === brandValue ? '' : brandValue));
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Hero */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1c1c] border border-[#333333] text-xs font-semibold text-[#D7FF45]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-[family-name:var(--font-space)] tracking-widest uppercase">
              LIVE SOLESCOUT INTELLIGENCE
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F5F3EE]">
                GLOBAL SNEAKER DISCOVERY
              </h1>
              <p className="text-sm md:text-base text-[#A4A19B] max-w-2xl mt-2 font-light">
                Search live market listings across 690+ verified retailers. Real-time pricing, size availability, and global market comparisons directly via the official SoleScout API.
              </p>
            </div>

            {/* Results Counter & Attribution Badge */}
            <div className="flex items-center gap-3 text-xs font-mono text-[#888884] shrink-0">
              <span className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#2d2d2d]">
                {totalCount ? `${totalCount.toLocaleString()} Silhouettes` : 'Live Feed'}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-[#D7FF45]/10 text-[#D7FF45] border border-[#D7FF45]/30">
                SoleScout Verified
              </span>
            </div>
          </div>
        </div>

        {/* Large Search Bar & Brand Filters */}
        <div className="space-y-6 mb-12">
          {/* Search Input Box */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#777777]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by sneaker name, silhouette, or SKU (e.g., Jordan 4, Dunk Low, Travis Scott, CQ4018)..."
              className="w-full bg-[#181818] border-2 border-[#2d2d2d] focus:border-[#D7FF45] rounded-2xl pl-14 pr-12 py-5 text-base md:text-lg text-[#F5F3EE] placeholder-[#666666] outline-none transition-all shadow-xl font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#888884] hover:text-[#F5F3EE] px-2 py-1 bg-[#222222] rounded-md transition-colors"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Quick Brand Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#777777] pr-2 shrink-0">
              <Filter className="w-3.5 h-3.5" />
              <span>BRANDS:</span>
            </div>
            {POPULAR_BRANDS.map((b) => {
              const active = selectedBrand === b.value;
              return (
                <button
                  key={b.label}
                  type="button"
                  onClick={() => handleBrandClick(b.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-[family-name:var(--font-space)] uppercase tracking-wider font-bold transition-all shrink-0 border ${
                    active
                      ? 'bg-[#D7FF45] text-[#111111] border-[#D7FF45] shadow-lg shadow-[#D7FF45]/15'
                      : 'bg-[#181818] text-[#A4A19B] border-[#2d2d2d] hover:border-[#444444] hover:text-[#F5F3EE]'
                  }`}
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-10 p-5 rounded-2xl bg-red-950/30 border border-red-800/50 flex items-start gap-4 text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-sm">Error Retrieving SoleScout Feed</h4>
              <p className="text-xs text-red-400 mt-1">{error}</p>
              <button
                type="button"
                onClick={() => fetchSneakers(query, selectedBrand, page)}
                className="mt-3 px-4 py-1.5 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-xs font-mono font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Search</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#181818] border border-[#2d2d2d] rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between h-[380px]"
              >
                <div className="w-full aspect-[4/3] bg-[#222222]" />
                <div className="p-5 space-y-3">
                  <div className="w-20 h-3 bg-[#2a2a2a] rounded" />
                  <div className="w-full h-5 bg-[#2a2a2a] rounded" />
                  <div className="w-3/4 h-3 bg-[#2a2a2a] rounded" />
                  <div className="pt-3 border-t border-[#252525] flex justify-between items-center">
                    <div className="w-16 h-5 bg-[#2a2a2a] rounded" />
                    <div className="w-20 h-7 bg-[#2a2a2a] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((sneaker) => {
              const hasLowestPrice = typeof sneaker.lowest_price_usd === 'number' && sneaker.lowest_price_usd > 0;
              const hasRetailPrice = typeof sneaker.retail_price_usd === 'number' && sneaker.retail_price_usd > 0;
              const isDiscounted =
                hasLowestPrice && hasRetailPrice && sneaker.lowest_price_usd! < sneaker.retail_price_usd!;

              return (
                <div
                  key={sneaker.slug}
                  className="group relative bg-[#181818] border border-[#2d2d2d] hover:border-[#D7FF45]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/70"
                >
                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#111111]/85 border border-[#333333] text-[#A4A19B] backdrop-blur-md">
                      {sneaker.brand || 'Sneaker'}
                    </span>

                    {isDiscounted && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase bg-[#D7FF45] text-[#111111] shadow-sm">
                        BELOW RETAIL
                      </span>
                    )}
                  </div>

                  {/* Sneaker Image Frame */}
                  <Link
                    href={`/discover/${sneaker.slug}`}
                    className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#202020] to-[#161616] overflow-hidden flex items-center justify-center p-6 block"
                  >
                    {sneaker.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={sneaker.image}
                          alt={sneaker.title}
                          fill
                          className="object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-2"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-[#666666]">IMAGE COMING SOON</div>
                    )}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-60" />
                  </Link>

                  {/* Sneaker Details */}
                  <div className="p-5 pt-1 flex flex-col flex-1 justify-between">
                    <div>
                      {/* SKU / Style code & Color */}
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#777777] mb-1.5">
                        {sneaker.style_code && (
                          <span className="px-1.5 py-0.5 rounded bg-[#202020] border border-[#2d2d2d] text-[#A4A19B]">
                            {sneaker.style_code}
                          </span>
                        )}
                        {sneaker.color && <span className="truncate max-w-[120px]">{sneaker.color}</span>}
                      </div>

                      <Link href={`/discover/${sneaker.slug}`} className="block group-hover:text-[#D7FF45] transition-colors">
                        <h3 className="font-[family-name:var(--font-space)] text-base font-bold text-[#F5F3EE] uppercase tracking-tight line-clamp-2 leading-snug">
                          {sneaker.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-4 pt-3.5 border-t border-[#262626] flex items-end justify-between gap-3">
                      <div>
                        <span className="block text-[9px] uppercase font-bold tracking-wider text-[#777777]">
                          LOWEST MARKET
                        </span>
                        {hasLowestPrice ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-[family-name:var(--font-space)] text-lg font-black text-[#F5F3EE]">
                              ${sneaker.lowest_price_usd}
                            </span>
                            <span className="text-[10px] font-mono text-[#777777]">USD</span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-[#777777]">See Retailers</span>
                        )}
                        {hasRetailPrice && (
                          <span className="block text-[10px] font-mono text-[#666666] line-through">
                            Retail: ${sneaker.retail_price_usd}
                          </span>
                        )}
                      </div>

                      <Link
                        href={`/discover/${sneaker.slug}`}
                        className="inline-flex items-center gap-1 bg-[#242424] hover:bg-[#D7FF45] text-[#F5F3EE] hover:text-[#111111] px-3.5 py-2 rounded-xl text-xs font-[family-name:var(--font-space)] font-bold tracking-wider uppercase transition-all shrink-0"
                      >
                        <span>COMPARE</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && !error && (
          <div className="text-center py-20 px-6 rounded-3xl bg-[#181818] border border-[#2d2d2d] max-w-xl mx-auto space-y-4">
            <Search className="w-10 h-10 text-[#666666] mx-auto" />
            <h3 className="font-[family-name:var(--font-space)] text-xl font-bold uppercase text-[#F5F3EE]">
              No Live Listings Found
            </h3>
            <p className="text-xs text-[#A4A19B] max-w-sm mx-auto">
              We couldn&apos;t find any sneakers matching &ldquo;{query}&rdquo; on SoleScout. Try searching by model name like &ldquo;Jordan 1&rdquo;, &ldquo;Dunk&rdquo;, or &ldquo;Yeezy&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('jordan');
                setSelectedBrand('');
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider"
            >
              Reset to Popular Drops
            </button>
          </div>
        )}

        {/* SoleScout Attribution & Disclaimer Footer */}
        <div className="mt-16 pt-8 border-t border-[#262626] flex flex-col md:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D7FF45]" />
            <span>Live pricing and availability data powered by SoleScout. SoleScout compares 690+ verified retailers.</span>
          </div>

          <a
            href="https://solescout.ai"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#D7FF45] transition-colors font-mono inline-flex items-center gap-1"
          >
            <span>solescout.ai</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

