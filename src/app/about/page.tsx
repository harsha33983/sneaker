import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { ArrowUpRight, Flame, Layers, ShieldCheck, Zap } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manifesto & Brand Story — SneakerDrop',
  description: 'The ethos behind SneakerDrop: luxury streetwear meets exclusive limited-edition product architecture.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-16">
          {/* Header */}
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
              ABOUT SNEAKERDROP
            </span>
            <h1 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F5F3EE]">
              THE ART OF THE DROP.
            </h1>
            <p className="text-lg text-[#A4A19B] leading-relaxed font-light">
              SneakerDrop was founded on a singular conviction: sneakers are not mere functional wear, but sculptural artifacts of contemporary urban culture.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#333333] flex items-center justify-center text-[#D7FF45]">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-[family-name:var(--font-space)] text-xl font-bold uppercase text-[#F5F3EE]">
                RADICAL EXCLUSIVITY
              </h3>
              <p className="text-xs text-[#A4A19B] leading-relaxed">
                We reject infinite production cycles. Every sneaker on our platform is released in strictly numbered quantities, ensuring that what you wear remains as unique as your personal expression.
              </p>
            </div>

            <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#333333] flex items-center justify-center text-[#D7FF45]">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-[family-name:var(--font-space)] text-xl font-bold uppercase text-[#F5F3EE]">
                EDITORIAL INTEGRITY
              </h3>
              <p className="text-xs text-[#A4A19B] leading-relaxed">
                Rather than treating shoes as catalog commodity, we contextualize each silhouette with its design pedigree, material origins, and cultural resonance.
              </p>
            </div>

            <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#333333] flex items-center justify-center text-[#D7FF45]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-[family-name:var(--font-space)] text-xl font-bold uppercase text-[#F5F3EE]">
                DATABASE VERIFIED
              </h3>
              <p className="text-xs text-[#A4A19B] leading-relaxed">
                Every release, inventory fluctuation, and waitlist entry is synchronized directly to real PostgreSQL databases, eliminating phantom stock and speculative claims.
              </p>
            </div>

            <div className="bg-[#181818] border border-[#2d2d2d] rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#222222] border border-[#333333] flex items-center justify-center text-[#D7FF45]">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-[family-name:var(--font-space)] text-xl font-bold uppercase text-[#F5F3EE]">
                PRIORITY ACCESS
              </h3>
              <p className="text-xs text-[#A4A19B] leading-relaxed">
                Our waitlist pipeline distributes notifications systematically with zero bot favoritism. First in, first informed.
              </p>
            </div>
          </div>

          {/* Action CTA */}
          <div className="p-8 bg-[#161616] border border-[#2a2a2a] rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-[family-name:var(--font-space)] text-2xl font-black uppercase text-[#F5F3EE]">
                READY TO JOIN THE VAULT?
              </h3>
              <p className="text-xs text-[#888884] mt-1">Explore available silhouettes and register your interest.</p>
            </div>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-[#D7FF45] text-[#111111] hover:bg-[#c4ec30] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full shrink-0 transition-transform active:scale-95"
            >
              <span>VIEW CATALOGUE</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

