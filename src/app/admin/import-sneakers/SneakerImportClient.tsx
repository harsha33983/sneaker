'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Info,
  X,
  RefreshCw,
  Eye,
  DollarSign,
  Tag,
  Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { NormalizedSneaker } from '@/lib/sneaks/types';

interface SneakerImportClientProps {
  initialSneakers: NormalizedSneaker[];
  existingStyleIds: string[];
}

const BRAND_PRESETS = [
  { label: 'Popular Releases', query: '' },
  { label: 'Nike', query: 'Nike' },
  { label: 'Jordan', query: 'Air Jordan' },
  { label: 'Adidas', query: 'Adidas' },
  { label: 'New Balance', query: 'New Balance' },
  { label: 'Yeezy', query: 'Yeezy' },
  { label: 'Asics', query: 'Asics' },
];

export default function SneakerImportClient({
  initialSneakers,
  existingStyleIds: initialExistingIds,
}: SneakerImportClientProps) {
  const [sneakers, setSneakers] = useState<NormalizedSneaker[]>(initialSneakers);
  const [existingIds, setExistingIds] = useState<string[]>(initialExistingIds);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('Popular Releases');
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Modal state
  const [selectedSneaker, setSelectedSneaker] = useState<NormalizedSneaker | null>(null);
  const [modalMode, setModalMode] = useState<'preview' | 'import'>('preview');

  // Import form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'Lifestyle',
    description: '',
    priceInr: 12999,
    retailPriceUsd: 0 as number | null,
    availability: 'limited' as 'available' | 'limited' | 'sold_out',
    isFeatured: false,
    imageUrl: '',
    styleId: '',
    colorway: '',
    releaseDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Search execution
  const executeSearch = async (query: string) => {
    setLoading(true);
    try {
      const endpoint = query.trim()
        ? `/api/sneaks/search?q=${encodeURIComponent(query.trim())}&limit=24`
        : `/api/sneaks/popular?limit=24`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setSneakers(data.data);
      } else {
        toast.error(data.error || 'Failed to fetch sneakers');
      }
    } catch {
      toast.error('Network error while searching sneakers.');
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (preset: { label: string; query: string }) => {
    setActiveBrand(preset.label);
    setSearchQuery(preset.query);
    executeSearch(preset.query);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const openImportModal = (sneaker: NormalizedSneaker, mode: 'preview' | 'import' = 'import') => {
    setSelectedSneaker(sneaker);
    setModalMode(mode);

    // Default INR price suggestion (roughly 85x USD retail or fallback 12999)
    const suggestedInr = sneaker.retailPrice
      ? Math.round((sneaker.retailPrice * 85) / 100) * 100 - 1
      : 12999;

    setFormData({
      name: sneaker.shoeName,
      brand: sneaker.brand,
      category: sneaker.silhouette || 'Lifestyle',
      description: sneaker.description,
      priceInr: suggestedInr > 0 ? suggestedInr : 12999,
      retailPriceUsd: sneaker.retailPrice,
      availability: 'limited',
      isFeatured: false,
      imageUrl: sneaker.imageUrl,
      styleId: sneaker.styleID,
      colorway: sneaker.colorway,
      releaseDate: sneaker.releaseDate || '',
    });
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSneaker) return;

    if (!formData.priceInr || formData.priceInr <= 0) {
      toast.error('Please enter a valid INR selling price.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/sneaks/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          brand: formData.brand,
          category: formData.category,
          description: formData.description,
          price: Number(formData.priceInr),
          retailPrice: formData.retailPriceUsd,
          availability: formData.availability,
          isFeatured: formData.isFeatured,
          imageUrl: formData.imageUrl,
          styleId: formData.styleId,
          colorway: formData.colorway,
          releaseDate: formData.releaseDate || null,
          marketplacePrices: selectedSneaker.lowestResellPrice,
          externalSource: selectedSneaker.source,
          externalProductId: selectedSneaker.externalId,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(`Successfully imported ${result.data.name}!`, {
          description: `Now visible in the public catalogue at /products/${result.data.slug}`,
          action: {
            label: 'View Product',
            onClick: () => window.open(`/products/${result.data.slug}`, '_blank'),
          },
        });

        // Add to imported IDs
        startTransition(() => {
          setExistingIds((prev) => [...prev, formData.styleId.toUpperCase()]);
        });

        setSelectedSneaker(null);
      } else {
        toast.error(result.error || 'Failed to import product.');
      }
    } catch {
      toast.error('An unexpected network error occurred during import.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Brand Bar */}
      <div className="p-6 rounded-2xl bg-[#181818] border border-[#2a2a2a] space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777777] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by sneaker name (e.g., Dunk Low, Jordan 4, Samba, 990v6)..."
              className="w-full pl-11 pr-4 py-3 bg-[#111111] border border-[#333333] focus:border-[#D7FF45] rounded-xl text-sm text-[#F5F3EE] outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D7FF45] text-[#111111] hover:bg-[#c2eb38] font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 shrink-0 font-[family-name:var(--font-space)]"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>SEARCH MARKETPLACES</span>
          </button>
        </form>

        {/* Quick Brand Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#777777] shrink-0 mr-1">
            FILTERS:
          </span>
          {BRAND_PRESETS.map((preset) => {
            const active = activeBrand === preset.label;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleBrandClick(preset)}
                className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all whitespace-nowrap font-medium ${
                  active
                    ? 'bg-[#262626] border-[#D7FF45] text-[#D7FF45]'
                    : 'bg-[#141414] border-[#2e2e2e] text-[#A4A19B] hover:text-[#F5F3EE] hover:border-[#444444]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-[#888884] px-1">
        <div>
          Showing <span className="text-[#F5F3EE] font-bold">{sneakers.length}</span> sneakers
          {activeBrand !== 'Popular Releases' && (
            <span> for <strong className="text-[#D7FF45]">{activeBrand}</strong></span>
          )}
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D7FF45]" />
            New Discovery
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            In Catalogue
          </span>
        </div>
      </div>

      {/* Sneaker Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[#181818] border border-[#262626] space-y-4 animate-pulse"
            >
              <div className="w-full aspect-[4/3] bg-[#222222] rounded-xl" />
              <div className="h-4 bg-[#262626] rounded w-3/4" />
              <div className="h-3 bg-[#262626] rounded w-1/2" />
              <div className="h-8 bg-[#222222] rounded-lg" />
            </div>
          ))}
        </div>
      ) : sneakers.length === 0 ? (
        <div className="text-center py-20 bg-[#161616] border border-[#262626] rounded-2xl p-8 space-y-4">
          <Info className="w-10 h-10 text-[#777777] mx-auto" />
          <h3 className="text-lg font-bold text-[#F5F3EE]">No sneakers found</h3>
          <p className="text-xs text-[#888884] max-w-md mx-auto">
            Try searching with broader terms like &quot;Jordan&quot;, &quot;Dunk&quot;, or &quot;Air Max&quot;.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sneakers.map((sneaker) => {
            const isImported = existingIds.includes(sneaker.styleID.toUpperCase());

            return (
              <div
                key={sneaker.id}
                className="group relative rounded-2xl bg-[#181818] border border-[#2a2a2a] hover:border-[#D7FF45]/40 transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Image Showcase */}
                <div className="relative aspect-[4/3] bg-gradient-to-b from-[#222222] to-[#161616] flex items-center justify-center p-6 overflow-hidden">
                  <div className="relative w-full h-full">
                    <Image
                      src={sneaker.imageUrl}
                      alt={sneaker.shoeName}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      unoptimized
                    />
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#111111]/80 backdrop-blur-md text-[#F5F3EE] border border-[#333333]">
                      {sneaker.brand}
                    </span>

                    {isImported ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" />
                        IMPORTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#777777] bg-[#111111]/70 border border-[#333333]">
                        {sneaker.source.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#777777] mb-1">
                      <span>SKU: {sneaker.styleID}</span>
                      {sneaker.releaseDate && (
                        <span>{sneaker.releaseDate.split('-')[0]}</span>
                      )}
                    </div>

                    <h3 className="font-[family-name:var(--font-space)] font-bold text-sm text-[#F5F3EE] line-clamp-2 leading-snug">
                      {sneaker.shoeName}
                    </h3>

                    <p className="text-xs text-[#888884] line-clamp-1 mt-1">
                      {sneaker.colorway || 'Original Colorway'}
                    </p>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-3 border-t border-[#262626] grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="block text-[10px] font-mono text-[#666666] uppercase">
                        RETAIL (USD)
                      </span>
                      <span className="font-bold text-[#F5F3EE]">
                        {sneaker.retailPrice ? `$${sneaker.retailPrice}` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-[#666666] uppercase">
                        RESALE MARKET
                      </span>
                      <span className="font-bold text-[#D7FF45]">
                        {sneaker.lowestResellPrice.goat
                          ? `$${sneaker.lowestResellPrice.goat}`
                          : sneaker.lowestResellPrice.stockX
                          ? `$${sneaker.lowestResellPrice.stockX}`
                          : 'Market Listed'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openImportModal(sneaker, 'preview')}
                      className="p-2 rounded-xl bg-[#222222] border border-[#333333] hover:border-[#666666] text-[#A4A19B] hover:text-[#F5F3EE] transition-colors"
                      title="Preview details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openImportModal(sneaker, 'import')}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs uppercase tracking-wider font-[family-name:var(--font-space)] transition-all ${
                        isImported
                          ? 'bg-[#222222] text-[#A4A19B] border border-[#333333] hover:text-[#F5F3EE]'
                          : 'bg-[#D7FF45] text-[#111111] hover:bg-[#c2eb38] shadow-sm shadow-[#D7FF45]/10'
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isImported ? 'RE-IMPORT / EDIT' : 'IMPORT PRODUCT'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review & Import Modal */}
      {selectedSneaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#181818] border border-[#333333] rounded-3xl p-6 sm:p-8 shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D7FF45]" />
                <h3 className="font-[family-name:var(--font-space)] text-lg font-black uppercase text-[#F5F3EE]">
                  {modalMode === 'preview' ? 'SNEAKER SPECIFICATIONS' : 'IMPORT INTO SNEAKERDROP'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSneaker(null)}
                className="p-1 rounded-lg text-[#777777] hover:text-[#F5F3EE] hover:bg-[#252525]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Duplicate warning alert if already exists */}
            {existingIds.includes(selectedSneaker.styleID.toUpperCase()) && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Catalogue Duplicate Detected</strong>
                  This Style ID (<code>{selectedSneaker.styleID}</code>) has already been imported into SneakerDrop. Importing again may create a duplicate entry or require updating the existing listing.
                </div>
              </div>
            )}

            {/* Preview Sneaker Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#121212] border border-[#262626]">
              <div className="relative aspect-square sm:aspect-auto h-32 rounded-xl bg-[#1c1c1c] overflow-hidden flex items-center justify-center">
                <Image
                  src={formData.imageUrl || selectedSneaker.imageUrl}
                  alt={selectedSneaker.shoeName}
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <div className="sm:col-span-2 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#D7FF45] font-bold">{selectedSneaker.brand}</span>
                  <span className="text-[#666666]">•</span>
                  <span className="font-mono text-[#A4A19B]">Style: {selectedSneaker.styleID}</span>
                </div>
                <h4 className="font-bold text-sm text-[#F5F3EE]">{selectedSneaker.shoeName}</h4>
                <p className="text-[#888884]">{selectedSneaker.colorway}</p>
                <div className="pt-2 flex items-center gap-4 text-[11px] font-mono text-[#A4A19B]">
                  <span>Retail USD: <strong>${selectedSneaker.retailPrice ?? 'N/A'}</strong></span>
                  <span>Market Resale: <strong>${selectedSneaker.lowestResellPrice.goat ?? selectedSneaker.lowestResellPrice.stockX ?? 'N/A'}</strong></span>
                </div>
              </div>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex rounded-xl bg-[#141414] p-1 border border-[#2a2a2a]">
              <button
                type="button"
                onClick={() => setModalMode('preview')}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  modalMode === 'preview'
                    ? 'bg-[#262626] text-[#D7FF45]'
                    : 'text-[#888884] hover:text-[#F5F3EE]'
                }`}
              >
                Marketplace Specs
              </button>
              <button
                type="button"
                onClick={() => setModalMode('import')}
                className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  modalMode === 'import'
                    ? 'bg-[#262626] text-[#D7FF45]'
                    : 'text-[#888884] hover:text-[#F5F3EE]'
                }`}
              >
                Import Configuration
              </button>
            </div>

            {modalMode === 'preview' ? (
              /* Marketplace Specs Detail Tab */
              <div className="space-y-4 text-xs">
                <div>
                  <h5 className="font-bold text-[#F5F3EE] uppercase tracking-wider mb-2 font-mono text-[11px]">
                    PRODUCT DESCRIPTION & STORY
                  </h5>
                  <p className="text-[#A4A19B] leading-relaxed bg-[#141414] p-4 rounded-xl border border-[#262626]">
                    {selectedSneaker.description || 'No detailed editorial story available for this silhouette.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                    <span className="block text-[10px] font-mono text-[#666666]">RELEASE DATE</span>
                    <span className="font-bold text-[#F5F3EE]">{selectedSneaker.releaseDate || 'Undisclosed'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                    <span className="block text-[10px] font-mono text-[#666666]">SILHOUETTE</span>
                    <span className="font-bold text-[#F5F3EE]">{selectedSneaker.silhouette}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                    <span className="block text-[10px] font-mono text-[#666666]">DATA SOURCE</span>
                    <span className="font-bold text-[#D7FF45] uppercase">{selectedSneaker.source}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#141414] border border-[#262626]">
                    <span className="block text-[10px] font-mono text-[#666666]">GOAT / FLIGHTCLUB</span>
                    <span className="font-bold text-[#F5F3EE]">
                      {selectedSneaker.resellLinks.goat ? (
                        <a
                          href={selectedSneaker.resellLinks.goat}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#D7FF45] hover:underline inline-flex items-center gap-1"
                        >
                          View Link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setModalMode('import')}
                    className="px-6 py-3 rounded-xl bg-[#D7FF45] text-[#111111] font-bold text-xs uppercase tracking-wider font-[family-name:var(--font-space)] hover:bg-[#c2eb38]"
                  >
                    Configure & Import This Sneaker →
                  </button>
                </div>
              </div>
            ) : (
              /* Import Form Tab */
              <form onSubmit={handleImportSubmit} className="space-y-4 text-xs">
                {/* Product Name */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#A4A19B] mb-1">
                    Display Name in SneakerDrop *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#121212] border border-[#333333] focus:border-[#D7FF45] rounded-xl text-sm text-[#F5F3EE] outline-none"
                  />
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A4A19B] mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#121212] border border-[#333333] focus:border-[#D7FF45] rounded-xl text-sm text-[#F5F3EE] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A4A19B] mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#121212] border border-[#333333] focus:border-[#D7FF45] rounded-xl text-sm text-[#F5F3EE] outline-none"
                    >
                      <option value="Lifestyle">Lifestyle</option>
                      <option value="Running">Running</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Skateboarding">Skateboarding</option>
                      <option value="Limited Archive">Limited Archive</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Rules */}
                <div className="p-4 rounded-2xl bg-[#141414] border border-[#262626] space-y-3">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#D7FF45]">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>PRICING SPECIFICATIONS (SEPARATE FIELDS)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="block text-[10px] font-mono text-[#666666]">
                        ORIGINAL RETAIL
                      </span>
                      <span className="font-bold text-[#A4A19B] text-sm">
                        {formData.retailPriceUsd ? `$${formData.retailPriceUsd} USD` : 'N/A'}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-mono text-[#666666]">
                        RESALE MARKETPLACE
                      </span>
                      <span className="font-bold text-[#A4A19B] text-sm">
                        {selectedSneaker.lowestResellPrice.goat
                          ? `$${selectedSneaker.lowestResellPrice.goat} USD`
                          : 'Market Listed'}
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-[#D7FF45] uppercase font-bold mb-1">
                        SNEAKERDROP PRICE (INR) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#F5F3EE]">
                          ₹
                        </span>
                        <input
                          type="number"
                          required
                          min={100}
                          step={100}
                          value={formData.priceInr}
                          onChange={(e) =>
                            setFormData({ ...formData, priceInr: parseInt(e.target.value, 10) || 0 })
                          }
                          className="w-full pl-8 pr-3 py-1.5 bg-[#1a1a1a] border border-[#444444] focus:border-[#D7FF45] rounded-lg text-sm text-[#F5F3EE] font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Availability & Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-[#A4A19B] mb-1">
                      Drop Availability
                    </label>
                    <select
                      value={formData.availability}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          availability: e.target.value as 'available' | 'limited' | 'sold_out',
                        })
                      }
                      className="w-full px-4 py-2.5 bg-[#121212] border border-[#333333] focus:border-[#D7FF45] rounded-xl text-sm text-[#F5F3EE] outline-none"
                    >
                      <option value="limited">Limited Drop (Waitlist active)</option>
                      <option value="available">Available in Stock</option>
                      <option value="sold_out">Vault Archive (Sold Out)</option>
                    </select>
                  </div>

                  <div className="pt-4 flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5F3EE]">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded bg-[#121212] border-[#333333] text-[#D7FF45] focus:ring-0"
                      />
                      <span>Pin to Homepage Featured Vault</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#A4A19B] mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#121212] border border-[#333333] focus:border-[#D7FF45] rounded-xl text-xs text-[#F5F3EE] outline-none"
                  />
                </div>

                {/* Image URL with validation note */}
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#A4A19B] mb-1">
                    Image URL (Authorized CDN or Supabase Storage)
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#121212] border border-[#333333] focus:border-[#D7FF45] rounded-xl text-xs text-[#F5F3EE] outline-none"
                  />
                </div>

                {/* Submit buttons */}
                <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setSelectedSneaker(null)}
                    className="px-5 py-2.5 rounded-xl border border-[#333333] text-[#A4A19B] hover:text-[#F5F3EE] transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#D7FF45] text-[#111111] hover:bg-[#c2eb38] font-bold text-xs uppercase tracking-wider font-[family-name:var(--font-space)] transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{submitting ? 'IMPORTING...' : 'SAVE & PUBLISH TO CATALOGUE'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
