import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/data/products';
import { getWaitlistEntries } from '@/lib/data/waitlist';
import { formatPrice, formatDate, getAvailabilityBadgeProps } from '@/lib/utils';
import {
  Package,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PlusCircle,
  ArrowUpRight,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const waitlist = await getWaitlistEntries();

  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.availability === 'available').length;
  const limitedProducts = products.filter((p) => p.availability === 'limited').length;
  const soldOutProducts = products.filter((p) => p.availability === 'sold_out').length;
  const totalWaitlist = waitlist.length;

  const recentProducts = products.slice(0, 4);
  const recentWaitlist = waitlist.slice(0, 5);

  const statsCards = [
    {
      title: 'TOTAL PRODUCTS',
      value: totalProducts,
      icon: Package,
      color: 'text-[#F5F3EE]',
      bg: 'bg-[#222222]',
      border: 'border-[#333333]',
    },
    {
      title: 'AVAILABLE DROPS',
      value: availableProducts,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
    },
    {
      title: 'LIMITED RELEASES',
      value: limitedProducts,
      icon: AlertTriangle,
      color: 'text-[#D7FF45]',
      bg: 'bg-[#D7FF45]/10',
      border: 'border-[#D7FF45]/20',
    },
    {
      title: 'SOLD OUT ARCHIVE',
      value: soldOutProducts,
      icon: XCircle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
    {
      title: 'WAITLIST ENTRIES',
      value: totalWaitlist,
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10',
      border: 'border-sky-500/20',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#D7FF45] uppercase tracking-widest">
            MANAGEMENT CONSOLE
          </span>
          <h1 className="font-[family-name:var(--font-space)] text-3xl font-black uppercase tracking-tight text-[#F5F3EE] mt-1">
            DASHBOARD OVERVIEW
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#D7FF45] text-[#111111] hover:bg-[#c4ec30] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all self-start sm:self-auto shadow-md shadow-[#D7FF45]/10"
        >
          <PlusCircle className="w-4 h-4" />
          <span>ADD NEW SNEAKER</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-[#181818] border border-[#2b2b2b] rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider font-semibold text-[#888884] uppercase">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bg} ${card.border} border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className={`font-[family-name:var(--font-space)] text-3xl font-black ${card.color}`}>
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Recent Products & Recent Waitlists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-7 bg-[#181818] border border-[#2b2b2b] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <h2 className="font-[family-name:var(--font-space)] text-lg font-bold uppercase tracking-tight text-[#F5F3EE]">
              RECENT SNEAKER DROPS
            </h2>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-[#A4A19B] hover:text-[#D7FF45] transition-colors flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentProducts.map((p) => {
              const badge = getAvailabilityBadgeProps(p.availability);
              return (
                <div
                  key={p.id}
                  className="p-3 bg-[#131313] border border-[#262626] rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 bg-[#202020] rounded-lg overflow-hidden shrink-0 border border-[#333333]">
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-[#F5F3EE] truncate uppercase">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-[#888884] font-mono">{formatPrice(p.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-xs text-[#A4A19B] hover:text-[#D7FF45] underline font-mono"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Waitlist Registrations */}
        <div className="lg:col-span-5 bg-[#181818] border border-[#2b2b2b] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <h2 className="font-[family-name:var(--font-space)] text-lg font-bold uppercase tracking-tight text-[#F5F3EE]">
              LATEST WAITLIST SUBMISSIONS
            </h2>
            <Link
              href="/admin/waitlist"
              className="text-xs font-semibold text-[#A4A19B] hover:text-[#D7FF45] transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentWaitlist.length === 0 ? (
              <p className="text-xs text-[#888884] py-8 text-center">No waitlist submissions yet.</p>
            ) : (
              recentWaitlist.map((entry) => (
                <div
                  key={entry.id}
                  className="p-3 bg-[#131313] border border-[#262626] rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#F5F3EE] truncate">{entry.email}</p>
                    <p className="text-[10px] text-[#D7FF45] truncate font-mono">
                      {entry.product?.name || 'Sneaker drop'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-[#888884] block">
                      {formatDate(entry.created_at)}
                    </span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#222222] text-[#A4A19B] font-mono">
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
