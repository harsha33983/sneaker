'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface EditProductClientProps {
  product: Product;
}

export default function EditProductClient({ product }: EditProductClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [name, setName] = useState(product.name);
  const [brand, setBrand] = useState(product.brand);
  const [price, setPrice] = useState<number | string>(product.price);
  const [description, setDescription] = useState(product.description);
  const [category, setCategory] = useState(product.category);
  const [availability, setAvailability] = useState(product.availability);
  const [isFeatured, setIsFeatured] = useState(product.is_featured);
  const [imageUrl, setImageUrl] = useState(product.image_url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (Number(price) <= 0) {
      toast.error('Price must be greater than zero');
      return;
    }
    if (description.trim().length < 10) {
      toast.error('Description must be at least 10 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          brand: brand.trim(),
          price: Number(price),
          description: description.trim(),
          category: category.trim(),
          availability,
          is_featured: isFeatured,
          image_url: imageUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || 'Failed to update product');
      } else {
        toast.success('Product updated in database!');
        router.push('/admin/products');
        router.refresh();
      }
    } catch {
      toast.error('Network error during update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#888884] hover:text-[#D7FF45] transition-colors uppercase tracking-wider mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO ALL PRODUCTS</span>
        </Link>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-black uppercase tracking-tight text-[#F5F3EE]">
          EDIT SNEAKER: {product.name}
        </h1>
        <p className="text-xs text-[#888884] mt-1">
          ID: <span className="font-mono text-[#D7FF45]">{product.id}</span> // Slug: <span className="font-mono">{product.slug}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#181818] border border-[#2b2b2b] rounded-3xl p-6 md:p-8 shadow-xl space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D7FF45]">
            1. SILHOUETTE IDENTITY
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2">
                PRODUCT NAME *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2">
                BRAND *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2">
                PRICE (INR ₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-4 py-3 text-sm font-mono text-[#F5F3EE] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2">
                CATEGORY *
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Availability & Featured */}
        <div className="space-y-4 pt-4 border-t border-[#262626]">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D7FF45]">
            2. ALLOCATION STATUS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2">
                DROP AVAILABILITY *
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] outline-none cursor-pointer"
              >
                <option value="available">Available</option>
                <option value="limited">Limited Drop</option>
                <option value="sold_out">Sold Out Archive</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                id="is-featured-edit"
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 rounded border-[#333333] text-[#D7FF45] focus:ring-0 focus:ring-offset-0 bg-[#111111] cursor-pointer"
              />
              <label htmlFor="is-featured-edit" className="text-xs font-semibold text-[#F5F3EE] cursor-pointer">
                FEATURE ON HOMEPAGE VAULT
              </label>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-4 pt-4 border-t border-[#262626]">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D7FF45]">
            3. PRODUCT PHOTOGRAPHY
          </h2>
          <div>
            <label className="block text-[11px] uppercase font-bold tracking-wider text-[#A4A19B] mb-2">
              IMAGE URL *
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl px-4 py-3 text-sm font-mono text-[#F5F3EE] outline-none"
            />
          </div>

          {imageUrl && (
            <div className="p-4 bg-[#111111] rounded-2xl border border-[#2d2d2d] flex items-center gap-4">
              <div className="relative w-24 h-20 bg-[#1a1a1a] rounded-xl overflow-hidden shrink-0 border border-[#333333]">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#D7FF45] uppercase">CURRENT IMAGE</span>
                <p className="text-xs text-[#888884] truncate max-w-md">{imageUrl}</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-4 pt-4 border-t border-[#262626]">
          <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-[#D7FF45]">
            4. ARCHIVE EDITORIAL DESCRIPTION
          </h2>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl p-4 text-sm text-[#F5F3EE] outline-none resize-y"
          />
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-[#262626] flex items-center justify-end gap-4">
          <Link
            href="/admin/products"
            className="px-6 py-3.5 rounded-xl text-xs font-semibold text-[#A4A19B] hover:text-[#F5F3EE] bg-[#222222] border border-[#333333]"
          >
            CANCEL
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl hover:bg-[#c4ec30] disabled:opacity-50 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-[#D7FF45]/15"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>UPDATING IN DATABASE...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>SAVE CHANGES</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
