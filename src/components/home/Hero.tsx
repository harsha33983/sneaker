'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDown, Flame, ShieldCheck, Sparkles } from 'lucide-react';
import HeroSneakerCanvas from './HeroSneakerCanvas';

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-[#010101]">
      {/* Full-Bleed 120-Frame Interactive Sneaker Canvas throughout the Hero */}
      <HeroSneakerCanvas />

      {/* Grid texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[2]"
        style={{
          backgroundImage: `linear-gradient(#F5F3EE 1px, transparent 1px), linear-gradient(90deg, #F5F3EE 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient background glow highlights */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[800px] h-[450px] bg-[#D7FF45]/5 blur-[160px] pointer-events-none rounded-full z-[1]" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#2a2a2a]/40 blur-[130px] pointer-events-none rounded-full z-[1]" />

      {/* Hero Editorial Content Layer */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 pt-32 pb-16 pointer-events-none flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 my-auto">
          {/* Left Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161616]/90 border border-[#333333] text-xs font-semibold text-[#D7FF45] backdrop-blur-md pointer-events-auto shadow-lg">
              <Flame className="w-3.5 h-3.5 text-[#D7FF45]" />
              <span className="font-[family-name:var(--font-space)] tracking-widest uppercase">
                SEASON 2026 // FLAGSHIP DROP
              </span>
            </div>

            {/* Oversized Headline */}
            <h1 className="font-[family-name:var(--font-space)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-[#F5F3EE] leading-[0.92] drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
              NOT MADE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F3EE] via-[#D7FF45] to-[#F5F3EE]">
                FOR EVERYONE.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#A4A19B] max-w-xl leading-relaxed font-light drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              Discover sneakers that define individuality. Strictly limited distribution runs, archival silhouettes, and an uncompromising luxury streetwear aesthetic engineered for distinction over mass production.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4 pointer-events-auto">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-[#D7FF45] text-[#111111] hover:bg-[#c6f030] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-xl shadow-[#D7FF45]/20"
              >
                <span>EXPLORE DROP VAULT</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <a
                href="#featured-drops"
                className="inline-flex items-center gap-2 bg-[#1c1c1c]/90 text-[#F5F3EE] hover:bg-[#252525] border border-[#333333] hover:border-[#D7FF45]/50 font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full transition-all duration-200 backdrop-blur-md"
              >
                <span>FEATURED RELEASES</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 flex flex-wrap items-center gap-6 md:gap-8 border-t border-[#333333]/50 text-xs text-[#888884] pointer-events-auto">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D7FF45]" />
                <span>100% Verified Originals</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D7FF45]" />
                <span>Full-Stage 360° Studio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hero HUD bar */}
        <div className="pt-8 flex items-center justify-between pointer-events-none">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#888884] pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-[#D7FF45] animate-ping" />
            <span className="uppercase tracking-widest text-[11px]">FLAGSHIP PULSE 01 // 360° DYNAMIC STAGE</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#666666] pointer-events-auto mx-auto sm:mx-0">
            <span className="font-mono tracking-widest text-[10px] uppercase">SCROLL TO EXPLORE</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-3 rounded-full bg-[#D7FF45]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
