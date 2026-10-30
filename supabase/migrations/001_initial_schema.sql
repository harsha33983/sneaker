-- SneakerDrop Database Schema
-- Migration: 001_initial_schema

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL,
  availability TEXT NOT NULL CHECK (
    availability IN ('available', 'limited', 'sold_out')
  ),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ADMIN PROFILES TABLE
-- ============================================
CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- WAITLIST TABLE
-- ============================================
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'notified', 'closed')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, email)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_availability ON products(availability);
CREATE INDEX idx_waitlist_product ON waitlist(product_id);
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_created ON waitlist(created_at DESC);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Products RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- Admin Profiles RLS
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view own profile"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (id = (SELECT auth.uid()));

-- Waitlist RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- No public SELECT on waitlist - insertions go through server action
CREATE POLICY "Admins can view waitlist"
  ON waitlist FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update waitlist"
  ON waitlist FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete waitlist"
  ON waitlist FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = (SELECT auth.uid())
      AND role = 'admin'
    )
  );

-- ============================================
-- STORAGE BUCKET
-- ============================================
-- Run in Supabase Dashboard > Storage:
-- Create bucket "product-images" with public access for reading
-- Policies:
--   Public can read: SELECT for anon, authenticated
--   Admins can upload: INSERT for authenticated with admin check
--   Admins can update: UPDATE for authenticated with admin check
--   Admins can delete: DELETE for authenticated with admin check

