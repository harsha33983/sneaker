import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SneakerDrop',
};

export default function PrivacyPage() {
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
              PRIVACY POLICY
            </h1>
            <p className="text-xs text-[#888884] font-mono mt-2">LAST UPDATED: OCTOBER 2026</p>
          </div>

          <div className="space-y-6 text-sm text-[#CCCCCC] leading-relaxed font-light">
            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                1. INFORMATION COLLECTION
              </h2>
              <p>
                SneakerDrop collects minimal personal information necessary to deliver exclusive drop notifications. When joining a product waitlist, we collect your verified email address and your chosen product affinity.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                2. DATA USAGE & PRODUCT WAITLIST
              </h2>
              <p>
                Your email is used solely to notify you regarding the availability, release timing, and allocation details of the specific sneaker drops you subscribed to. We do not sell, rent, or lease waitlist registries to third-party data brokers.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                3. DATABASE SECURITY & RLS
              </h2>
              <p>
                Our infrastructure is anchored on Supabase PostgreSQL with strict Row Level Security (RLS) policies. Waitlist entries are protected from public inspection, and administrative mutations require cryptographic server authentication.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-[#F5F3EE] font-[family-name:var(--font-space)]">
                4. DATA DELETION
              </h2>
              <p>
                You may request immediate removal from any active drop waitlist at any time by contacting our privacy compliance desk at privacy@sneakerdrop.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
