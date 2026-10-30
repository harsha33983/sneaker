import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiscoverDetailClient from '@/components/discover/DiscoverDetailClient';
import { getSoleScoutProductDetails } from '@/lib/solescout/client';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await getSoleScoutProductDetails(slug);
    return {
      title: `${product.title} — Live Price Comparison | SneakerDrop`,
      description: `Compare prices across 690+ verified retailers for ${product.title}. Lowest market price: $${product.lowest_price_usd || 'N/A'} USD via SoleScout.`,
    };
  } catch {
    return {
      title: 'Sneaker Not Found — SneakerDrop',
    };
  }
}

export default async function DiscoverDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product = null;
  let errorMsg = null;

  try {
    product = await getSoleScoutProductDetails(slug);
  } catch (error: any) {
    console.error(`Error loading SoleScout product (${slug}):`, error);
    errorMsg = error.message || 'Product information unavailable.';
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {product ? (
          <DiscoverDetailClient product={product} />
        ) : (
          <div className="max-w-xl mx-auto px-6 pt-44 pb-28 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-800/40 text-red-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold uppercase text-[#F5F3EE]">
              Sneaker Details Unavailable
            </h1>
            <p className="text-sm text-[#A4A19B] leading-relaxed">
              {errorMsg || 'We were unable to locate this silhouette on SoleScout or the product is temporarily inactive.'}
            </p>
            <div className="pt-4">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider hover:bg-[#c6f030] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Discovery Feed</span>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
