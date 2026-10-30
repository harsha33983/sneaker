'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Sparkles, Store, ShieldCheck } from 'lucide-react';
import { SoleScoutSearchResultItem } from '@/lib/solescout/types';

interface LiveDiscoverSectionProps {
  sneakers: SoleScoutSearchResultItem[];
}

export default function LiveDiscoverSection({ sneakers }: LiveDiscoverSectionProps) {
  if (!sneakers || sneakers.length === 0) return null;

  return (
    <section className="py-24 bg-[#0d0d0d] relative border-t border-[#222222]">
      {/* Ambient background highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#D7FF45]/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-[#222222] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D7FF45] uppercase tracking-widest mb-2 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIVE SOLESCOUT GLOBAL FEED</span>
            </div>
            <h2 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F5F3EE]">
              DISCOVER THE LATEST DROPS
            </h2>
            <p className="text-xs sm:text-sm text-[#A4A19B] mt-2 max-w-xl font-light">
              Real-time market availability tracked across 690+ verified retailers worldwide. Updated continuously via the SoleScout API.
            </p>
          </div>

          <Link
            href="/discover"
            className="inline-flex items-center gap-2 bg-[#181818] hover:bg-[#D7FF45] text-[#F5F3EE] hover:text-[#111111] border border-[#333333] hover:border-[#D7FF45] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all shrink-0 active:scale-95"
          >
            <span>VIEW ALL SNEAKERS</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Sneaker Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sneakers.slice(0, 4).map((sneaker) => {
            const hasLowestPrice = typeof sneaker.lowest_price_usd === 'number' && sneaker.lowest_price_usd > 0;
            const hasRetailPrice = typeof sneaker.retail_price_usd === 'number' && sneaker.retail_price_usd > 0;

            return (
              <div
                key={sneaker.slug}
                className="group relative bg-[#141414] border border-[#262626] hover:border-[#D7FF45]/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/70"
              >
                {/* Brand Tag */}
                <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-[#111111]/85 border border-[#333333] text-[#A4A19B] backdrop-blur-md">
                    {sneaker.brand || 'Sneaker'}
                  </span>
                </div>

                {/* Sneaker Image Frame */}
                <Link
                  href={`/discover/${sneaker.slug}`}
                  className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#1c1c1c] to-[#121212] overflow-hidden flex items-center justify-center p-6 block"
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
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60" />
                </Link>

                {/* Sneaker Information */}
                <div className="p-5 pt-1 flex flex-col flex-1 justify-between">
                  <div>
                    {sneaker.style_code && (
                      <span className="text-[10px] font-mono text-[#777777] block mb-1">
                        SKU: {sneaker.style_code}
                      </span>
                    )}

                    <Link href={`/discover/${sneaker.slug}`} className="block group-hover:text-[#D7FF45] transition-colors">
                      <h3 className="font-[family-name:var(--font-space)] text-sm font-bold text-[#F5F3EE] uppercase tracking-tight line-clamp-2 leading-snug">
                        {sneaker.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Price & Explore Button */}
                  <div className="mt-4 pt-3.5 border-t border-[#222222] flex items-end justify-between gap-3">
                    <div>
                      <span className="block text-[9px] uppercase font-bold tracking-wider text-[#777777]">
                        LOWEST PRICE
                      </span>
                      {hasLowestPrice ? (
                        <div className="flex items-baseline gap-1">
                          <span className="font-[family-name:var(--font-space)] text-base font-black text-[#D7FF45]">
                            ${sneaker.lowest_price_usd}
                          </span>
                          <span className="text-[9px] font-mono text-[#777777]">USD</span>
                        </div>
                      ) : (
                        <span className="text-xs font-mono text-[#777777]">Compare</span>
                      )}
                      {hasRetailPrice && (
                        <span className="block text-[9px] font-mono text-[#666666] line-through">
                          Retail: ${sneaker.retail_price_usd}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/discover/${sneaker.slug}`}
                      className="inline-flex items-center gap-1 bg-[#202020] hover:bg-[#D7FF45] text-[#F5F3EE] hover:text-[#111111] px-3 py-1.5 rounded-xl text-xs font-[family-name:var(--font-space)] font-bold tracking-wider uppercase transition-all shrink-0"
                    >
                      <span>EXPLORE</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner linking to /discover */}
        <div className="mt-12 p-6 rounded-2xl bg-[#141414] border border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-[#D7FF45] shrink-0" />
            <p className="text-xs text-[#A4A19B] leading-relaxed">
              Explore 190,000+ live sneaker prices and inventory across StockX, GOAT, Flight Club, and 690+ verified retailers.
            </p>
          </div>

          <Link
            href="/discover"
            className="text-xs font-mono font-bold text-[#D7FF45] hover:underline shrink-0 flex items-center gap-1 uppercase tracking-wider"
          >
            <span>Open Discovery Hub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
