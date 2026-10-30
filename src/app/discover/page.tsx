import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DiscoverClient from '@/components/discover/DiscoverClient';
import { searchSoleScoutSneakers } from '@/lib/solescout/client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Live Sneaker Discovery — SneakerDrop & SoleScout',
  description:
    'Search live sneaker availability and compare retailer prices across 690+ verified global marketplaces powered by SoleScout.',
};

export default async function DiscoverPage() {
  let initialData = null;
  try {
    initialData = await searchSoleScoutSneakers('jordan', 24);
  } catch (error) {
    console.warn('Initial server-side SoleScout fetch error, client will retry:', error);
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <DiscoverClient initialData={initialData} initialQuery="jordan" />
      </main>
      <Footer />
    </div>
  );
}

