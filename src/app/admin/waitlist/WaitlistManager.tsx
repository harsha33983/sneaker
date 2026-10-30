'use client';

import React, { useState } from 'react';
import { WaitlistEntry, Product, WaitlistStatus } from '@/types';
import { formatDate } from '@/lib/utils';
import { Search, Download, Filter, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface WaitlistManagerProps {
  initialEntries: WaitlistEntry[];
  products: Product[];
}

export default function WaitlistManager({ initialEntries, products }: WaitlistManagerProps) {
  const [entries, setEntries] = useState<WaitlistEntry[]>(initialEntries);
  const [emailSearch, setEmailSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = entries.filter((entry) => {
    const matchesEmail =
      emailSearch === '' || entry.email.toLowerCase().includes(emailSearch.toLowerCase());

    const matchesProduct =
      selectedProduct === 'all' || entry.product_id === selectedProduct;

    const matchesStatus =
      selectedStatus === 'all' || entry.status === selectedStatus;

    return matchesEmail && matchesProduct && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: WaitlistStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/waitlist/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Status update failed');
      } else {
        toast.success(`Registration status updated to ${newStatus}`);
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
        );
      }
    } catch {
      toast.error('Network error updating waitlist status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      toast.error('No waitlist entries to export');
      return;
    }

    const headers = ['ID', 'Email', 'Product Name', 'Product ID', 'Status', 'Registration Date'];
    const rows = filtered.map((e) => [
      e.id,
      e.email,
      `"${e.product?.name || 'Unknown'}"`,
      e.product_id,
      e.status,
      e.created_at,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sneakerdrop_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filtered.length} registrations to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#181818] border border-[#2b2b2b] p-4 rounded-2xl">
        {/* Email Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#888884] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            placeholder="Search registrations by email..."
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F3EE] placeholder-[#666666] outline-none"
          />
        </div>

        {/* Product & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-3 py-2.5 text-xs text-[#F5F3EE] outline-none cursor-pointer"
          >
            <option value="all">All Products</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-3 py-2.5 text-xs uppercase text-[#F5F3EE] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="notified">Notified</option>
            <option value="closed">Closed</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-[#222222] border border-[#383838] hover:border-[#D7FF45] text-[#F5F3EE] hover:text-[#D7FF45] font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Count */}
      <div className="flex items-center justify-between text-xs font-mono text-[#888884] px-1">
        <span>SHOWING {filtered.length} OF {entries.length} REGISTRATIONS</span>
        {(emailSearch || selectedProduct !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setEmailSearch('');
              setSelectedProduct('all');
              setSelectedStatus('all');
            }}
            className="text-[#D7FF45] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-[#181818] border border-[#2b2b2b] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#CCCCCC]">
            <thead className="bg-[#131313] border-b border-[#262626] text-[#888884] uppercase font-mono tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-6">EMAIL ADDRESS</th>
                <th className="py-4 px-6">SNEAKER TARGET</th>
                <th className="py-4 px-6">SUBMISSION DATE</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#888884]">
                    No waitlist registrations found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => {
                  const isUpdating = updatingId === entry.id;

                  const statusBadgeColors = {
                    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
                    notified: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                    closed: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
                  }[entry.status];

                  return (
                    <tr key={entry.id} className="hover:bg-[#1f1f1f]/60 transition-colors">
                      {/* Email */}
                      <td className="py-4 px-6 font-semibold text-[#F5F3EE]">
                        {entry.email}
                      </td>

                      {/* Sneaker */}
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#F5F3EE] uppercase font-[family-name:var(--font-space)] block">
                          {entry.product?.name || 'Sneaker silhouette'}
                        </span>
                        <span className="text-[10px] text-[#777777] font-mono">
                          ID: {entry.product_id.slice(0, 8)}...
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 font-mono text-[#888884]">
                        {formatDate(entry.created_at)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${statusBadgeColors}`}
                        >
                          {entry.status}
                        </span>
                      </td>

                      {/* Action Status Switcher */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-2">
                          <select
                            disabled={isUpdating}
                            value={entry.status}
                            onChange={(e) =>
                              handleStatusChange(entry.id, e.target.value as WaitlistStatus)
                            }
                            className="bg-[#202020] border border-[#333333] focus:border-[#D7FF45] rounded-lg px-2.5 py-1 text-[11px] text-[#F5F3EE] outline-none cursor-pointer"
                          >
                            <option value="pending">Pending</option>
                            <option value="notified">Mark Notified</option>
                            <option value="closed">Close</option>
                          </select>
                          {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D7FF45]" />}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
