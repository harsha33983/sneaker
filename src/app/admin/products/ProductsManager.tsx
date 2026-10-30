'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, Availability } from '@/types';
import { formatPrice, getAvailabilityBadgeProps } from '@/lib/utils';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';

interface ProductsManagerProps {
  initialProducts: Product[];
}

export default function ProductsManager({ initialProducts }: ProductsManagerProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState<string | null>(null);

  const filtered = products.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.availability === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleQuickAvailabilityChange = async (productId: string, newAvailability: Availability) => {
    setUpdatingAvailabilityId(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability: newAvailability }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to update status');
      } else {
        toast.success(`Availability changed to ${newAvailability}`);
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, availability: newAvailability } : p))
        );
        router.refresh();
      }
    } catch {
      toast.error('Network error updating availability');
    } finally {
      setUpdatingAvailabilityId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deletingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to delete product');
      } else {
        toast.success('Product removed from database');
        setProducts((prev) => prev.filter((p) => p.id !== deletingId));
        setDeletingId(null);
        router.refresh();
      }
    } catch {
      toast.error('Network error during deletion');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#181818] border border-[#2b2b2b] p-4 rounded-2xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#888884] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or brand..."
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F5F3EE] placeholder-[#666666] outline-none"
          />
        </div>

        {/* Availability Filter & Add CTA */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-3 py-2.5 text-xs uppercase font-semibold text-[#F5F3EE] outline-none cursor-pointer"
          >
            <option value="all">All Availabilities</option>
            <option value="available">Available</option>
            <option value="limited">Limited</option>
            <option value="sold_out">Sold Out</option>
          </select>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#D7FF45] text-[#111111] hover:bg-[#c4ec30] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-transform active:scale-95 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>ADD PRODUCT</span>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-[#181818] border border-[#2b2b2b] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#CCCCCC]">
            <thead className="bg-[#131313] border-b border-[#262626] text-[#888884] uppercase font-mono tracking-wider text-[11px]">
              <tr>
                <th className="py-4 px-6">PRODUCT</th>
                <th className="py-4 px-6">PRICE</th>
                <th className="py-4 px-6">CATEGORY</th>
                <th className="py-4 px-6">AVAILABILITY</th>
                <th className="py-4 px-6">FEATURED</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#888884]">
                    No sneakers matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => {
                  const badge = getAvailabilityBadgeProps(product.availability);
                  const isUpdating = updatingAvailabilityId === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-[#1f1f1f]/60 transition-colors">
                      {/* Product Thumbnail & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 bg-[#111111] rounded-xl overflow-hidden shrink-0 border border-[#2d2d2d]">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                              unoptimized
                            />
                          </div>
                          <div>
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="font-[family-name:var(--font-space)] font-bold text-sm text-[#F5F3EE] hover:text-[#D7FF45] uppercase tracking-tight block"
                            >
                              {product.name}
                            </Link>
                            <span className="text-[11px] text-[#888884]">{product.brand}</span>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 font-mono font-bold text-[#F5F3EE]">
                        {formatPrice(product.price)}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 capitalize">{product.category}</td>

                      {/* Availability (With quick inline selector) */}
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-2">
                          <select
                            disabled={isUpdating}
                            value={product.availability}
                            onChange={(e) =>
                              handleQuickAvailabilityChange(
                                product.id,
                                e.target.value as Availability
                              )
                            }
                            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full outline-none cursor-pointer border ${badge.className} bg-transparent`}
                          >
                            <option value="available" className="bg-[#202020] text-emerald-400">
                              AVAILABLE
                            </option>
                            <option value="limited" className="bg-[#202020] text-[#D7FF45]">
                              LIMITED
                            </option>
                            <option value="sold_out" className="bg-[#202020] text-rose-400">
                              SOLD OUT
                            </option>
                          </select>
                          {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D7FF45]" />}
                        </div>
                      </td>

                      {/* Featured */}
                      <td className="py-4 px-6">
                        {product.is_featured ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase font-mono">
                            <CheckCircle className="w-3 h-3" /> YES
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#666666] uppercase font-mono">NO</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 rounded-lg bg-[#222222] border border-[#333333] hover:border-[#D7FF45] hover:text-[#D7FF45] text-[#A4A19B] transition-colors"
                            title="Edit Sneaker"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => setDeletingId(product.id)}
                            className="p-2 rounded-lg bg-[#222222] border border-[#333333] hover:border-rose-500/50 hover:text-rose-400 text-[#A4A19B] transition-colors"
                            title="Delete Sneaker"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#181818] border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-[family-name:var(--font-space)] text-lg font-bold uppercase text-[#F5F3EE]">
                CONFIRM DELETION
              </h3>
            </div>
            <p className="text-xs text-[#A4A19B] leading-relaxed">
              Are you sure you want to permanently delete this sneaker from the database? Customer waitlist entries will be retained safely according to retention rules.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
              <button
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A4A19B] hover:text-[#F5F3EE] bg-[#222222] border border-[#333333]"
              >
                CANCEL
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>CONFIRM DELETE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

