import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedSection from '@/components/home/FeaturedSection';
import BrandStatement from '@/components/home/BrandStatement';
import WhyUs from '@/components/home/WhyUs';
import NewsletterCta from '@/components/home/NewsletterCta';
import { getProducts } from '@/lib/data/products';

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.filter((p) => p.is_featured);
  const displayProducts = featured.length > 0 ? featured : products.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedSection products={displayProducts} />
        <BrandStatement />
        <WhyUs />
        <NewsletterCta />
      </main>
      <Footer />
    </div>
  );
}
