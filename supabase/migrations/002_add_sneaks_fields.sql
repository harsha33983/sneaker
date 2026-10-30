-- SneakerDrop Database Schema
-- Migration: 002_add_sneaks_fields
-- Extends the products table to support external Sneaks-API and marketplace imports.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS external_source TEXT,
  ADD COLUMN IF NOT EXISTS external_product_id TEXT,
  ADD COLUMN IF NOT EXISTS style_id TEXT,
  ADD COLUMN IF NOT EXISTS colorway TEXT,
  ADD COLUMN IF NOT EXISTS release_date DATE,
  ADD COLUMN IF NOT EXISTS retail_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS marketplace_prices JSONB DEFAULT '{}'::jsonb;

-- Create partial unique index for external_source and external_product_id
-- Ensures we don't import duplicates from the same external source, while
-- allowing manually created products without an external ID.
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_external_unique
  ON products(external_source, external_product_id)
  WHERE external_product_id IS NOT NULL;

-- Fast index on style_id for duplicate lookups
CREATE INDEX IF NOT EXISTS idx_products_style_id
  ON products(style_id)
  WHERE style_id IS NOT NULL;
