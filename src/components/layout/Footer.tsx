import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Globe, Share2, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[#262626] text-[#A4A19B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#222222]">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-space)] text-2xl font-black tracking-tighter text-[#F5F3EE] uppercase">
                SNEAKER<span className="text-[#D7FF45]">DROP</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-[#888884]">
              The Art of the Drop. A curated platform connecting collectors with limited edition silhouettes, luxury streetwear aesthetics, and exclusive access.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1c1c1c] border border-[#333333] flex items-center justify-center text-[#F5F3EE] hover:text-[#D7FF45] hover:border-[#D7FF45]/50 transition-colors"
                aria-label="Community"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1c1c1c] border border-[#333333] flex items-center justify-center text-[#F5F3EE] hover:text-[#D7FF45] hover:border-[#D7FF45]/50 transition-colors"
                aria-label="Editorial"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#1c1c1c] border border-[#333333] flex items-center justify-center text-[#F5F3EE] hover:text-[#D7FF45] hover:border-[#D7FF45]/50 transition-colors"
                aria-label="Repository"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#F5F3EE] uppercase font-[family-name:var(--font-space)]">
              DISCOVER
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collections" className="hover:text-[#D7FF45] transition-colors flex items-center gap-1">
                  <span>Current Catalogue</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </Link>
              </li>
              <li>
                <Link href="/collections?availability=available" className="hover:text-[#D7FF45] transition-colors">
                  Available Drops
                </Link>
              </li>
              <li>
                <Link href="/collections?availability=limited" className="hover:text-[#D7FF45] transition-colors">
                  Limited Editions
                </Link>
              </li>
              <li>
                <Link href="/collections?availability=sold_out" className="hover:text-[#D7FF45] transition-colors">
                  Sold Out Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#F5F3EE] uppercase font-[family-name:var(--font-space)]">
              BRAND
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-[#D7FF45] transition-colors">
                  Our Manifesto
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#D7FF45] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#D7FF45] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Administration portal */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold tracking-widest text-[#F5F3EE] uppercase font-[family-name:var(--font-space)]">
              OPERATIONS
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin/login" className="hover:text-[#D7FF45] transition-colors">
                  Admin Sign In
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#D7FF45] transition-colors">
                  Dashboard Overview
                </Link>
              </li>
              <li>
                <Link href="/admin/waitlist" className="hover:text-[#D7FF45] transition-colors">
                  Waitlist Manager
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#666666] gap-4">
          <p>© 2026 SNEAKERDROP INC. ALL RIGHTS RESERVED.</p>
          <p className="flex items-center gap-1.5 font-mono">
            <span>ENGINEERED FOR THE DROP</span>
            <span className="w-1 h-1 rounded-full bg-[#D7FF45]" />
            <span className="text-[#A4A19B]">EST. 2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
