'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Users,
  LogOut,
  ArrowUpRight,
  Shield,
} from 'lucide-react';
import { toast } from 'sonner';

function AdminSidebarContent() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'All Products', href: '/admin/products', icon: Package },
    { name: 'Add Sneaker', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Waitlist Entries', href: '/admin/waitlist', icon: Users },
  ];

  return (
    <aside className="w-64 bg-[#141414] border-r border-[#262626] min-h-screen flex flex-col justify-between p-6 shrink-0">
      <div className="space-y-8">
        {/* Logo & Portal Badge */}
        <div>
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-[family-name:var(--font-space)] text-xl font-black tracking-tight text-[#F5F3EE] uppercase">
              SNEAKER<span className="text-[#D7FF45]">DROP</span>
            </span>
          </Link>
          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#222222] border border-[#333333] text-[10px] font-mono text-[#D7FF45] uppercase">
            <Shield className="w-3 h-3" />
            <span>ADMIN CONSOLE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-[#D7FF45] text-[#111111] font-bold shadow-md shadow-[#D7FF45]/10'
                    : 'text-[#A4A19B] hover:text-[#F5F3EE] hover:bg-[#1c1c1c]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls */}
      <div className="pt-6 border-t border-[#262626] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-[#888884] hover:text-[#F5F3EE] hover:bg-[#1c1c1c] transition-colors"
        >
          <span>Live Storefront</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function AdminSidebar() {
  return (
    <Suspense fallback={<aside className="w-64 bg-[#141414] border-r border-[#262626] min-h-screen" />}>
      <AdminSidebarContent />
    </Suspense>
  );
}
