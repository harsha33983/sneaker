import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center pt-32 pb-24 px-6 text-center">
        <div className="max-w-md space-y-6">
          <span className="font-mono text-xs font-bold text-[#D7FF45] uppercase tracking-widest">
            ERROR 404 // DROP NOT LOCATED
          </span>
          <h1 className="font-[family-name:var(--font-space)] text-6xl font-black text-[#F5F3EE] tracking-tight">
            GONE.
          </h1>
          <p className="text-sm text-[#A4A19B] leading-relaxed">
            The sneaker silhouette or page you are looking for has either been archived, deleted, or does not exist.
          </p>
          <div className="pt-2">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 bg-[#D7FF45] text-[#111111] hover:bg-[#c4ec30] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-transform active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO VAULT</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

