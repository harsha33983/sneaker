import { z } from 'zod';

export const waitlistSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(255, 'Email is too long')
    .email('Please enter a valid email address')
    .transform((val) => val.toLowerCase()),
  product_id: z.string().uuid('Invalid product ID'),
});

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required').max(150),
  slug: z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens'),
  brand: z.string().trim().min(1, 'Brand is required').max(100),
  price: z.coerce.number().positive('Price must be greater than 0'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters'),
  category: z.string().trim().min(1, 'Category is required'),
  availability: z.enum(['available', 'limited', 'sold_out']),
  is_featured: z.boolean().default(false),
  image_url: z.string().trim().min(1, 'Image URL is required'),
  images: z.array(z.string()).default([]),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid admin email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
