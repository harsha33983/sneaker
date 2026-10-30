'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface WaitlistModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ product, isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          product_id: product.id,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || data.duplicate) {
        setStatus('duplicate');
        setMessage(data.message || 'You are already registered for this sneaker drop waitlist.');
      } else if (!res.ok || !data.success) {
        setStatus('error');
        setMessage(data.message || 'Unable to join waitlist. Please try again.');
      } else {
        setStatus('success');
        setMessage(data.message || "You're on the list! We'll notify you the moment this drop goes live.");
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setStatus('idle');
    setMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleReset}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.15 }}
            className="relative w-full max-w-lg bg-[#181818] border border-[#333333] rounded-2xl p-6 md:p-8 shadow-2xl z-10 overflow-hidden"
          >
            {/* Ambient accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D7FF45] to-transparent" />

            {/* Close Button */}
            <button
              onClick={handleReset}
              className="absolute top-5 right-5 text-[#A4A19B] hover:text-[#F5F3EE] p-2 rounded-lg bg-[#222222] border border-[#333333] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            {status === 'success' ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-[#D7FF45]/10 border border-[#D7FF45]/30 rounded-full flex items-center justify-center mx-auto text-[#D7FF45]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-[family-name:var(--font-space)] text-2xl font-bold uppercase tracking-tight text-[#F5F3EE]">
                  SPOT RESERVED
                </h3>
                <p className="text-sm text-[#A4A19B] max-w-sm mx-auto leading-relaxed">{message}</p>
                <div className="p-4 bg-[#202020] rounded-xl border border-[#2e2e2e] flex items-center gap-4 text-left">
                  <div className="relative w-14 h-14 bg-[#111111] rounded-lg overflow-hidden shrink-0 border border-[#333333]">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F5F3EE]">{product.name}</h4>
                    <p className="text-xs text-[#D7FF45] font-semibold">{formatPrice(product.price)}</p>
                    <p className="text-xs text-[#888884]">{email}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="w-full bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#c4ec30] transition-colors"
                >
                  DONE
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#D7FF45] uppercase tracking-widest mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>WAITLIST PRIORITY ACCESS</span>
                </div>
                <h2 className="font-[family-name:var(--font-space)] text-2xl md:text-3xl font-black uppercase tracking-tight text-[#F5F3EE]">
                  DON&apos;T MISS THE DROP.
                </h2>
                <p className="text-xs text-[#A4A19B] mt-1 mb-6">
                  Get notified the instant this sneaker release goes live or restocks.
                </p>

                {/* Sneaker Thumbnail Summary */}
                <div className="p-3.5 bg-[#202020] rounded-xl border border-[#333333] flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 bg-[#111111] rounded-lg overflow-hidden shrink-0 border border-[#2a2a2a]">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#A4A19B]">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-bold text-[#F5F3EE] truncate">{product.name}</h3>
                    <p className="text-xs text-[#D7FF45] font-semibold">{formatPrice(product.price)}</p>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="waitlist-email"
                      className="block text-xs uppercase font-semibold tracking-wider text-[#A4A19B] mb-2"
                    >
                      YOUR EMAIL ADDRESS
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full bg-[#111111] border border-[#333333] focus:border-[#D7FF45] focus:ring-1 focus:ring-[#D7FF45] rounded-xl px-4 py-3 text-sm text-[#F5F3EE] placeholder-[#666666] outline-none transition-all"
                    />
                  </div>

                  {status === 'duplicate' && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start gap-2.5 text-xs text-yellow-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{message}</p>
                    </div>
                  )}

                  {status === 'error' && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{message}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D7FF45] text-[#111111] font-[family-name:var(--font-space)] font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:bg-[#c4ec30] disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>REGISTERING SPOT...</span>
                      </>
                    ) : (
                      <span>JOIN THE WAITLIST</span>
                    )}
                  </button>

                  <p className="text-[11px] text-[#777777] text-center leading-normal pt-1">
                    By joining, you agree to receive release updates for this sneaker. Unsubscribe at any time.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

