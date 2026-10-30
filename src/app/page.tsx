import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedSection from '@/components/home/FeaturedSection';
import LiveDiscoverSection from '@/components/home/LiveDiscoverSection';
import BrandStatement from '@/components/home/BrandStatement';
import WhyUs from '@/components/home/WhyUs';
import NewsletterCta from '@/components/home/NewsletterCta';
import { getProducts } from '@/lib/data/products';
import { searchSoleScoutSneakers } from '@/lib/solescout/client';
import { SoleScoutSearchResultItem } from '@/lib/solescout/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.is_featured);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 3);

  let liveSneakers: SoleScoutSearchResultItem[] = [];
  try {
    const liveFeed = await searchSoleScoutSneakers('travis scott', 4);
    liveSneakers = liveFeed?.results || [];
  } catch (e) {
    console.warn('SoleScout homepage live feed fetch error:', e);
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedSection products={displayProducts} />
        <LiveDiscoverSection sneakers={liveSneakers} />
        <BrandStatement />
        <WhyUs />
        <NewsletterCta />
      </main>
      <Footer />
    </div>
  );
}
