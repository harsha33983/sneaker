'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { formatPrice, getAvailabilityBadgeProps } from '@/lib/utils';
import WaitlistModal from '@/components/waitlist/WaitlistModal';
import { ArrowLeft, Bell, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image_url);

  const badge = getAvailabilityBadgeProps(product.availability);
  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean);

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Back Link */}
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#888884] hover:text-[#D7FF45] transition-colors uppercase tracking-wider mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO CATALOGUE</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: Product Images Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-[#222222] to-[#141414] border border-[#333333] rounded-3xl overflow-hidden p-8 flex items-center justify-center shadow-2xl group">
              {/* Radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(215,255,69,0.06)_0%,transparent_70%)] pointer-events-none" />

              <div className="relative w-full h-full">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  unoptimized
                />
              </div>

              {/* Status Badge in corner */}
              <div className="absolute top-6 left-6">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase backdrop-blur-md ${badge.className}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
                  {badge.label}
                </span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#181818] border-2 transition-all shrink-0 p-1 ${
                      activeImage === img ? 'border-[#D7FF45]' : 'border-[#333333] hover:border-[#555555]'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumb ${idx}`}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Waitlist Action */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono uppercase text-[#888884]">
                <span className="text-[#D7FF45] font-bold tracking-widest">{product.brand}</span>
                <span>CATEGORY: {product.category}</span>
              </div>

              <h1 className="font-[family-name:var(--font-space)] text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F5F3EE] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="font-[family-name:var(--font-space)] text-3xl font-black text-[#F5F3EE]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-[#888884] uppercase font-mono">
                  TAX INCLUDED // EXCLUSIVE RELEASE
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-y border-[#262626] py-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#A4A19B] font-[family-name:var(--font-space)]">
                SILHOUETTE ARCHIVE NOTES
              </h3>
              <p className="text-sm text-[#CCCCCC] leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            {/* CTA / Waitlist Interaction */}
            <div className="space-y-4">
              <button
                onClick={() => setModalOpen(true)}
                className="w-full bg-[#D7FF45] hover:bg-[#c4ec30] text-[#111111] font-[family-name:var(--font-space)] font-bold text-sm uppercase tracking-wider py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] shadow-xl shadow-[#D7FF45]/15 flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                <span>
                  {product.availability === 'sold_out'
                    ? 'JOIN RESTOCK WAITLIST'
                    : product.availability === 'limited'
                    ? 'SECURE DROP ACCESS'
                    : 'JOIN WAITLIST / ALLOCATE'}
                </span>
              </button>

              <p className="text-xs text-center text-[#777777]">
                Product-specific waitlist entry. Direct notification dispatched prior to live drops.
              </p>
            </div>

            {/* Quality & Service Guarantees */}
            <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#A4A19B]">
                <ShieldCheck className="w-4 h-4 text-[#D7FF45] shrink-0" />
                <span>Individually inspected and authenticated before shipment.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#A4A19B]">
                <Truck className="w-4 h-4 text-[#D7FF45] shrink-0" />
                <span>Dispatched in bespoke collector archival packaging.</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#A4A19B]">
                <RefreshCw className="w-4 h-4 text-[#D7FF45] shrink-0" />
                <span>Live status synced to central release database.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        product={product}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
