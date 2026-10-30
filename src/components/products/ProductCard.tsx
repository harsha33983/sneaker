'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Bell } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getAvailabilityBadgeProps } from '@/lib/utils';
import WaitlistModal from '@/components/waitlist/WaitlistModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const badge = getAvailabilityBadgeProps(product.availability);

  return (
    <>
      <div className="group relative bg-[#1c1c1c] border border-[#2d2d2d] hover:border-[#D7FF45]/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-black/60">
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md ${badge.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
            {badge.label}
          </span>
          {product.is_featured && (
            <span className="bg-[#111111]/80 text-[#A4A19B] border border-[#333333] px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md">
              FEATURED
            </span>
          )}
        </div>

        {/* Sneaker Image with Hover Zoom */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full aspect-[4/3] bg-gradient-to-b from-[#222222] to-[#181818] overflow-hidden flex items-center justify-center p-6 block"
        >
          <div className="relative w-full h-full">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
            />
          </div>
          {/* Subtle bottom shadow vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent opacity-80" />
        </Link>

        {/* Product Details */}
        <div className="p-6 pt-2 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#888884] mb-1">
              <span className="uppercase tracking-widest font-semibold">{product.brand}</span>
              <span className="font-mono text-[11px] text-[#666666]">{product.category}</span>
            </div>

            <Link href={`/products/${product.slug}`} className="block group-hover:text-[#D7FF45] transition-colors">
              <h3 className="font-[family-name:var(--font-space)] text-lg font-bold text-[#F5F3EE] uppercase tracking-tight line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-[#A4A19B] line-clamp-2 mt-1.5 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Pricing & Actions */}
          <div className="mt-5 pt-4 border-t border-[#2a2a2a] flex items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-[#777777]">
                PRICE
              </span>
              <span className="font-[family-name:var(--font-space)] text-lg font-black text-[#F5F3EE]">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Waitlist Modal Trigger */}
              <button
                onClick={() => setModalOpen(true)}
                className="p-2.5 rounded-xl bg-[#262626] border border-[#383838] hover:border-[#D7FF45] text-[#A4A19B] hover:text-[#D7FF45] transition-colors"
                title="Join Waitlist"
                aria-label={`Join waitlist for ${product.name}`}
              >
                <Bell className="w-4 h-4" />
              </button>

              {/* View Product Details */}
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center gap-1 bg-[#F5F3EE] hover:bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all"
              >
                <span>VIEW</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
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

