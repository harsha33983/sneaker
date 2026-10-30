'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Flame, ShieldCheck, Sparkles } from 'lucide-react';
import HeroSneakerCanvas from './HeroSneakerCanvas';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Gradients & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#D7FF45]/5 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2a2a2a]/30 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#1c1c1c] blur-[100px] pointer-events-none" />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#F5F3EE 1px, transparent 1px), linear-gradient(90deg, #F5F3EE 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1e1e] border border-[#333333] text-xs font-semibold text-[#D7FF45]">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-[family-name:var(--font-space)] tracking-widest uppercase">
                SEASON 2026 // FLAGSHIP DROP
              </span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-[family-name:var(--font-space)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-[#F5F3EE] leading-[0.92]">
              NOT MADE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EE] via-[#D7FF45] to-[#F5F3EE]">
                FOR EVERYONE.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#A4A19B] max-w-xl leading-relaxed font-light">
              Discover sneakers that define individuality. Strictly limited distribution runs, archival silhouettes, and an uncompromising luxury streetwear aesthetic engineered for distinction over mass production.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-[#D7FF45] text-[#111111] hover:bg-[#c6f030] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-lg shadow-[#D7FF45]/20"
              >
                <span>EXPLORE DROP VAULT</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <a
                href="#featured-drops"
                className="inline-flex items-center gap-2 bg-[#1c1c1c] text-[#F5F3EE] hover:bg-[#252525] border border-[#333333] hover:border-[#D7FF45]/50 font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full transition-all duration-200"
              >
                <span>FEATURED RELEASES</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 flex flex-wrap items-center gap-6 md:gap-8 border-t border-[#222222] text-xs text-[#888884]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D7FF45]" />
                <span>100% Verified Originals</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D7FF45]" />
                <span>360° Interactive Canvas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Interactive 360 Sneaker Canvas */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            <HeroSneakerCanvas />
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-xs text-[#666666]">
        <span className="font-mono tracking-widest text-[10px] uppercase">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1 h-3 rounded-full bg-[#D7FF45]"
        />
      </div>
    </section>
  );
}
