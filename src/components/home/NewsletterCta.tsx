import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function NewsletterCta() {
  return (
    <section className="py-24 bg-[#141414] border-t border-[#262626] relative overflow-hidden">
      {/* Decorative gradient beam */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(215,255,69,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10 space-y-8">
        <span className="text-xs font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
          NEXT RELEASE WINDOW // IMMINENT
        </span>

        <h2 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F5F3EE] max-w-3xl mx-auto leading-tight">
          YOUR NEXT FAVORITE DROP <br />
          <span className="text-[#D7FF45]">STARTS HERE.</span>
        </h2>

        <p className="text-base sm:text-lg text-[#A4A19B] max-w-xl mx-auto font-light leading-relaxed">
          Explore our real-time release vault, track silhouette availability, and join product-specific waitlists to lock in your chance.
        </p>

        <div className="pt-2">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 bg-[#D7FF45] text-[#111111] hover:bg-[#c4ec30] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-200 active:scale-95 shadow-xl shadow-[#D7FF45]/15"
          >
            <span>EXPLORE THE COLLECTION</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

