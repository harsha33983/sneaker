import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — SneakerDrop',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12 space-y-8">
          <div>
            <span className="text-xs font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
              LEGAL DOCUMENTATION
            </span>
            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#F5F3EE] mt-2">
              TERMS OF SERVICE
            </h1>
            <p className="text-xs text-[#888884] font-mono mt-2">EFFECTIVE DATE: OCTOBER 2026</p>
          </div>

          <div className="space-y-6 text-sm text-[#CCCCCC] leading-relaxed font-light">
            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                1. PLATFORM NATURE
              </h2>
              <p>
                SneakerDrop operates as an exclusive showcase, discovery, and notification platform for premium and limited-edition sneakers. Waitlist registration does not guarantee purchase rights or allocation.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                2. WAITLIST INTEGRITY & ANTI-BOT MEASURES
              </h2>
              <p>
                To maintain fairness for genuine sneaker culture enthusiasts, we enforce strict single-registration constraints per email and product. Automated script submissions and bot scraping violate these terms and result in immediate IP banning.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                3. INTELLECTUAL PROPERTY
              </h2>
              <p>
                All original silhouettes, editorial photography, graphics, and trademarks exhibited on SneakerDrop are proprietary assets of SneakerDrop Labs or their respective licensed rights-holders.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                4. AVAILABILITY DISCLAIMER
              </h2>
              <p>
                Product pricing and availability states (Available, Limited, Sold Out) are synchronized from real-time database records and subject to change without prior notice.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

