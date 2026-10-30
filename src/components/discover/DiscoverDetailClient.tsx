'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  Tag,
  Store,
  DollarSign,
  TrendingDown,
  Layers,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { SoleScoutProductDetail } from '@/lib/solescout/types';

interface DiscoverDetailClientProps {
  product: SoleScoutProductDetail;
}

export default function DiscoverDetailClient({ product }: DiscoverDetailClientProps) {
  const hasLowestPrice = typeof product.lowest_price_usd === 'number' && product.lowest_price_usd > 0;
  const hasRetailPrice = typeof product.retail_price_usd === 'number' && product.retail_price_usd > 0;
  const savings =
    hasLowestPrice && hasRetailPrice && product.retail_price_usd! > product.lowest_price_usd!
      ? product.retail_price_usd! - product.lowest_price_usd!
      : null;
  const discountPct = savings && product.retail_price_usd ? Math.round((savings / product.retail_price_usd) * 100) : null;

  const totalRetailersCount =
    (product.stores?.length || 0) + (product.hidden_stores?.count || 0) || product.stores_carrying || 1;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
      {/* Back Link */}
      <Link
        href="/discover"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#888884] hover:text-[#D7FF45] transition-colors uppercase tracking-wider mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO GLOBAL DISCOVERY</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Sneaker High-Res Showcase */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Stage */}
          <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-[#222222] to-[#141414] border border-[#333333] rounded-3xl overflow-hidden p-8 flex items-center justify-center shadow-2xl group">
            {/* Ambient backlight glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,255,69,0.08)_0%,transparent_70%)] pointer-events-none" />

            {/* Brand / Feed pill */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#111111]/80 backdrop-blur-md border border-[#333333] text-[#A4A19B]">
                {product.brand}
              </span>
              {discountPct && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase bg-[#D7FF45] text-[#111111] shadow-lg">
                  {discountPct}% OFF RETAIL
                </span>
              )}
            </div>

            {/* Image */}
            {product.image ? (
              <div className="relative w-full h-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  unoptimized
                />
              </div>
            ) : (
              <div className="text-sm font-mono text-[#666666]">NO IMAGE PROVIDED</div>
            )}
          </div>

          {/* Specifications Matrix */}
          <div className="p-6 bg-[#181818] border border-[#2d2d2d] rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#777777] block font-bold">STYLE CODE / SKU</span>
              <span className="text-xs font-mono font-bold text-[#F5F3EE]">{product.style_code || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#777777] block font-bold">COLORWAY</span>
              <span className="text-xs font-mono text-[#F5F3EE] truncate block">{product.color || 'Original Spec'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#777777] block font-bold">GENDER</span>
              <span className="text-xs font-mono text-[#F5F3EE] uppercase">{product.gender || 'Unisex'}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#777777] block font-bold">CATEGORY</span>
              <span className="text-xs font-mono text-[#F5F3EE] uppercase">{product.category || 'Footwear'}</span>
            </div>
          </div>
        </div>

        {/* Right: Pricing, Retailer Comparison & Sizes */}
        <div className="lg:col-span-5 space-y-8">
          {/* Header Title & Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#D7FF45] font-bold">
                {product.brand}
              </span>
              <span className="text-xs text-[#555555]">•</span>
              <span className="text-xs font-mono text-[#888884] uppercase">Live Market Data</span>
            </div>

            <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#F5F3EE] leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Pricing Highlight Card */}
          <div className="p-6 bg-[#181818] rounded-2xl border border-[#2e2e2e] space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-bold">
                  LOWEST AVAILABLE PRICE
                </span>
                {hasLowestPrice ? (
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-[family-name:var(--font-space)] text-4xl font-black text-[#D7FF45]">
                      ${product.lowest_price_usd}
                    </span>
                    <span className="text-xs font-mono text-[#888884]">USD</span>
                  </div>
                ) : (
                  <span className="font-mono text-lg text-[#F5F3EE]">Check Retailers Below</span>
                )}
              </div>

              {hasRetailPrice && (
                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] block font-bold">
                    ORIGINAL RETAIL
                  </span>
                  <span className="font-mono text-base text-[#888884] line-through">${product.retail_price_usd} USD</span>
                </div>
              )}
            </div>

            {savings && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D7FF45]/10 border border-[#D7FF45]/30 text-xs font-mono text-[#D7FF45]">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>Save ${savings} USD ({discountPct}%) under retail right now</span>
              </div>
            )}
          </div>

          {/* Retailer Comparison Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-[#D7FF45]" />
                <h3 className="font-[family-name:var(--font-space)] text-base font-bold uppercase tracking-tight text-[#F5F3EE]">
                  RETAILER COMPARISON
                </h3>
              </div>
              <span className="text-xs font-mono text-[#888884]">
                {totalRetailersCount} Retailers Tracked
              </span>
            </div>

            {/* Retailer List */}
            <div className="space-y-2.5">
              {product.stores && product.stores.length > 0 ? (
                product.stores.map((store, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#181818] border border-[#2d2d2d] rounded-xl flex items-center justify-between hover:border-[#444444] transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#F5F3EE]">{store.name}</h4>
                      <p className="text-[11px] font-mono text-[#777777]">
                        {store.price_usd ? `$${store.price_usd} USD` : 'Live Stock Available'}
                      </p>
                    </div>

                    {store.url && (
                      <a
                        href={store.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#222222] hover:bg-[#D7FF45] text-[#F5F3EE] hover:text-[#111111] text-xs font-mono font-bold transition-colors"
                      >
                        <span>Visit {store.name}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))
              ) : null}

              {/* Hidden Cheapest Retailer Summary */}
              {product.hidden_stores && product.hidden_stores.count > 0 && (
                <div className="p-4 bg-[#1a1a1a] border border-[#333333] rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D7FF45]" />
                      <h4 className="font-bold text-sm text-[#F5F3EE]">
                        +{product.hidden_stores.count} Additional Retailers
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#A4A19B] mt-0.5">
                      Lowest recorded from ${product.hidden_stores.lowest_price_usd} USD
                    </p>
                  </div>

                  {product.url && (
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] text-xs font-mono text-[#F5F3EE] transition-colors"
                    >
                      <span>View on SoleScout</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Available Sizes Matrix */}
          {product.sizes_in_stock && product.sizes_in_stock.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="uppercase text-[#888884] font-bold">AVAILABLE US SIZES</span>
                <span className="text-[#D7FF45]">{product.sizes_in_stock.length} Sizes In Stock</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.sizes_in_stock.map((sizeItem) => (
                  <div
                    key={sizeItem.size}
                    className="p-2.5 rounded-xl bg-[#181818] border border-[#2d2d2d] text-center hover:border-[#D7FF45]/50 transition-colors"
                  >
                    <span className="block text-xs font-bold font-mono text-[#F5F3EE]">US {sizeItem.size}</span>
                    {sizeItem.lowest_price_usd && (
                      <span className="block text-[11px] font-mono text-[#D7FF45] font-semibold mt-0.5">
                        ${sizeItem.lowest_price_usd}
                      </span>
                    )}
                    {sizeItem.discount_pct ? (
                      <span className="block text-[9px] font-mono text-[#A4A19B]">-{sizeItem.discount_pct}%</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outbound SoleScout Action Link */}
          {product.url && (
            <div className="pt-2">
              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 rounded-full bg-[#D7FF45] text-[#111111] hover:bg-[#c6f030] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#D7FF45]/20 active:scale-[0.98]"
              >
                <span>VIEW FULL COMPARISON ON SOLESCOUT</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* API Disclaimer & Attribution */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#282828] text-xs text-[#777777] space-y-2">
            <div className="flex items-center gap-1.5 text-[#A4A19B] font-semibold font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D7FF45]" />
              <span>SoleScout Verified Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              {product.disclaimer ||
                'SoleScout compares 690+ verified retailers and does not sell products directly. Prices and size availability change daily; please confirm details on the destination retailer page.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
