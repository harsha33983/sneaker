import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getAvailabilityBadgeProps(availability: string) {
  switch (availability) {
    case 'available':
      return {
        label: 'AVAILABLE',
        className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
        dotClass: 'bg-emerald-400',
      };
    case 'limited':
      return {
        label: 'LIMITED DROP',
        className: 'bg-[#D7FF45]/10 text-[#D7FF45] border border-[#D7FF45]/30',
        dotClass: 'bg-[#D7FF45]',
      };
    case 'sold_out':
      return {
        label: 'SOLD OUT',
        className: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
        dotClass: 'bg-rose-400',
      };
    default:
      return {
        label: availability.toUpperCase(),
        className: 'bg-neutral-500/10 text-neutral-400 border border-neutral-500/30',
        dotClass: 'bg-neutral-400',
      };
  }
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

