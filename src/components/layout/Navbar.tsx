'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight, Shield } from 'lucide-react';

function NavbarContent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'DISCOVER', href: '/discover' },
    { name: 'COLLECTIONS', href: '/collections' },
    { name: 'ABOUT', href: '/about' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#111111]/90 backdrop-blur-md border-b border-[#333333]/80 py-4 shadow-xl'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-[family-name:var(--font-space)] text-2xl font-black tracking-tighter text-[#F5F3EE] uppercase">
              SNEAKER<span className="text-[#D7FF45]">DROP</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#D7FF45] animate-pulse" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold tracking-widest transition-colors duration-200 relative py-1 ${
                    active ? 'text-[#D7FF45]' : 'text-[#A4A19B] hover:text-[#F5F3EE]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D7FF45]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Button & Admin Link */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin"
              className="text-xs text-[#A4A19B] hover:text-[#D7FF45] flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#333333] hover:border-[#D7FF45]/50 transition-colors"
              title="Administrator Portal"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN</span>
            </Link>

            <Link
              href="/collections"
              className="inline-flex items-center gap-1.5 bg-[#D7FF45] text-[#111111] hover:bg-[#c4ec30] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full transition-transform active:scale-95 shadow-sm shadow-[#D7FF45]/10"
            >
              <span>EXPLORE DROPS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#F5F3EE] p-2 rounded-lg border border-[#333333] bg-[#1A1A1A] focus:outline-none focus:border-[#D7FF45]"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#D7FF45]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[73px] z-40 bg-[#111111]/98 backdrop-blur-xl border-b border-[#333333] p-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-semibold tracking-wider py-2 border-b border-[#222222] ${
                    pathname === link.href ? 'text-[#D7FF45]' : 'text-[#F5F3EE]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-[#A4A19B] py-2"
              >
                <Shield className="w-4 h-4 text-[#D7FF45]" />
                <span>Admin Dashboard</span>
              </Link>
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-2 text-center bg-[#D7FF45] text-[#111111] font-bold text-xs uppercase tracking-wider py-3 rounded-full"
              >
                Explore Drops
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Navbar() {
  return <NavbarContent />;
}
