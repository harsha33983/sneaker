'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, Flame, ShieldCheck, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background Gradients & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D7FF45]/5 blur-[140px] pointer-events-none rounded-full" />
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
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1e1e1e] border border-[#333333] text-xs font-semibold text-[#D7FF45]">
              <Flame className="w-3.5 h-3.5" />
              <span className="font-[family-name:var(--font-space)] tracking-widest uppercase">
                SEASON 2026 // LIMITED ARCHIVE
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
              Discover sneakers that define individuality. Limited releases. Iconic silhouettes. Introducing the 198 g <span className="text-[#D7FF45] font-medium">Nova 01</span> with a continuous light strip and glowing foam midsole.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/nova"
                className="inline-flex items-center gap-2 bg-[#ff6a1f] text-[#140802] hover:bg-[#ff7d3a] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-lg shadow-[#ff6a1f]/25"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>EXPERIENCE NOVA 01 (120-FRAME STAGE)</span>
              </Link>

              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-[#1c1c1c] text-[#F5F3EE] hover:bg-[#252525] border border-[#333333] hover:border-[#D7FF45]/50 font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-7 py-4 rounded-full transition-all duration-200"
              >
                <span>EXPLORE ALL DROPS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Trust Metrics */}
            <div className="pt-8 flex items-center gap-8 border-t border-[#222222] text-xs text-[#888884]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D7FF45]" />
                <span>100% Verified Originals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF45]" />
                <span>120-Frame Interactive 3D Canvas</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Sneaker Showcase Graphic */}
          <div className="lg:col-span-5 relative">
            {/* Visual Frame */}
            <Link
              href="/nova"
              className="relative aspect-square max-w-[500px] w-full mx-auto rounded-3xl bg-gradient-to-b from-[#222222] to-[#141414] border border-[#333333] hover:border-[#ff6a1f]/60 p-8 flex items-center justify-center overflow-hidden shadow-2xl group transition-colors"
            >
              {/* Radial backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,31,0.12)_0%,transparent_70%)] pointer-events-none" />

              {/* Floating Sneaker Graphic */}
              <motion.div
                animate={{
                  y: [-8, 8, -8],
                  rotate: [-1, 2, -1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: 'easeInOut',
                }}
                className="relative w-full h-full min-h-[260px] flex items-center justify-center"
              >
                <Image
                  src="https://prompts.picsmob.com/frames/nova/frame_0001.jpg"
                  alt="Nova 01 — 198g Road Runner"
                  fill
                  priority
                  className="object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,0.9)] filter group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </motion.div>

              {/* Floating Drop Tag */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#111111]/90 backdrop-blur-md border border-[#333333] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#ff6a1f] uppercase tracking-wider block font-bold">
                    HEADLINER // SCROLL 360°
                  </span>
                  <span className="font-[family-name:var(--font-space)] text-sm font-bold text-[#F5F3EE]">
                    NOVA 01 — 198g ROAD RUNNER
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-[#140802] bg-[#ff6a1f] px-3 py-1.5 rounded-lg">
                  ₹12,999
                </span>
              </div>
            </Link>
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
