export type Availability = 'available' | 'limited' | 'sold_out';
export type WaitlistStatus = 'pending' | 'notified' | 'closed';

export interface Product {
  id: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  description: string;
  image_url: string;
  images: string[];
  category: string;
  availability: Availability;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface WaitlistEntry {
  id: string;
  product_id: string;
  email: string;
  status: WaitlistStatus;
  created_at: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    image_url: string;
    price: number;
    brand: string;
  };
}

export interface AdminProfile {
  id: string;
  role: 'admin';
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface DashboardStats {
  totalProducts: number;
  availableProducts: number;
  limitedProducts: number;
  soldOutProducts: number;
  totalWaitlist: number;
}
