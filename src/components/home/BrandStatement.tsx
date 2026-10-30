import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function BrandStatement() {
  return (
    <section className="py-28 bg-[#161616] border-y border-[#262626] relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D7FF45]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Large Headline */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono font-bold tracking-widest text-[#D7FF45] uppercase">
              MANIFESTO // 01
            </span>
            <h2 className="font-[family-name:var(--font-space)] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#F5F3EE] leading-[0.95]">
              MORE THAN A SNEAKER. <br />
              <span className="text-[#D7FF45]">IT&apos;S AN IDENTITY.</span>
            </h2>
            <div className="space-y-4 text-base sm:text-lg text-[#A4A19B] font-light leading-relaxed max-w-xl">
              <p>
                SneakerDrop was conceived at the intersection of haute couture streetwear and underground sneaker obsession. We treat every release not as inventory, but as an aesthetic statement.
              </p>
              <p>
                From meticulous material curation to strictly limited distribution runs, each silhouette is engineered for those who demand distinction over mass production.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#F5F3EE] hover:text-[#D7FF45] uppercase tracking-wider font-[family-name:var(--font-space)] transition-colors border-b border-[#333333] hover:border-[#D7FF45] pb-1"
              >
                <span>READ THE FULL MANIFESTO</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Editorial Card Column */}
          <div className="lg:col-span-5">
            <div className="bg-[#1c1c1c] border border-[#333333] rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="space-y-6">
                <div className="border-b border-[#2e2e2e] pb-6">
                  <span className="text-3xl font-[family-name:var(--font-space)] font-black text-[#D7FF45] block">
                    01
                  </span>
                  <h3 className="text-lg font-bold uppercase text-[#F5F3EE] font-[family-name:var(--font-space)] mt-1">
                    CRAFT & INTEGRITY
                  </h3>
                  <p className="text-xs text-[#888884] mt-1 leading-relaxed">
                    Zero shortcuts. Hand-selected full grain leathers, custom sculpted outsoles, and archival silhouettes.
                  </p>
                </div>

                <div className="border-b border-[#2e2e2e] pb-6">
                  <span className="text-3xl font-[family-name:var(--font-space)] font-black text-[#D7FF45] block">
                    02
                  </span>
                  <h3 className="text-lg font-bold uppercase text-[#F5F3EE] font-[family-name:var(--font-space)] mt-1">
                    GUARANTEED AUTHENTIC
                  </h3>
                  <p className="text-xs text-[#888884] mt-1 leading-relaxed">
                    Every drop is catalogued, serialized, and verified through our internal standard prior to dispatch.
                  </p>
                </div>

                <div>
                  <span className="text-3xl font-[family-name:var(--font-space)] font-black text-[#D7FF45] block">
                    03
                  </span>
                  <h3 className="text-lg font-bold uppercase text-[#F5F3EE] font-[family-name:var(--font-space)] mt-1">
                    RESTRICTED ALLOCATIONS
                  </h3>
                  <p className="text-xs text-[#888884] mt-1 leading-relaxed">
                    Strict caps per drop ensure true exclusivity. No mass restocks, no diluted collector value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
