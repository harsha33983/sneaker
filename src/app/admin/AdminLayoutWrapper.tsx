'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#111111]">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#111111] text-[#F5F3EE] flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1 min-w-0 overflow-y-auto">
        <main className="p-6 md:p-10 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#111111]">{children}</div>}>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
