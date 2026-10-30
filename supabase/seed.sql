-- SneakerDrop Seed Data
-- Run after creating the schema and an admin user

-- ============================================
-- SEED PRODUCTS
-- ============================================
INSERT INTO products (name, slug, brand, price, description, image_url, images, category, availability, is_featured)
VALUES
(
  'Air Phantom X',
  'air-phantom-x',
  'SneakerDrop Originals',
  12999.00,
  'The Air Phantom X redefines stealth luxury. Featuring a monochromatic upper with premium tumbled leather, responsive Air cushioning, and a translucent outsole that catches light like no other. Built for those who move in silence but leave a lasting impression.',
  '/images/sneaker-1.jpg',
  '[]'::jsonb,
  'lifestyle',
  'available',
  true
),
(
  'Urban Velocity 01',
  'urban-velocity-01',
  'SneakerDrop Originals',
  9499.00,
  'Speed meets street. The Urban Velocity 01 pairs a breathable knit upper with a sculpted midsole designed for all-day comfort. The bold colorway and reflective accents make this a standout piece for the modern urbanite who refuses to blend in.',
  '/images/sneaker-2.jpg',
  '[]'::jsonb,
  'running',
  'limited',
  true
),
(
  'Shadow Runner Pro',
  'shadow-runner-pro',
  'SneakerDrop Originals',
  14999.00,
  'Born from the shadows, built for the spotlight. The Shadow Runner Pro features a triple-black design with carbon fiber accents, ultra-responsive foam technology, and a silhouette that blurs the line between performance and fashion. Limited to 500 pairs worldwide.',
  '/images/sneaker-3.jpg',
  '[]'::jsonb,
  'performance',
  'sold_out',
  true
);

-- ============================================
-- ADMIN PROFILE
-- After creating an admin user via Supabase Auth,
-- insert their user ID here:
-- ============================================
-- INSERT INTO admin_profiles (id, role)
-- VALUES ('YOUR_ADMIN_USER_UUID', 'admin');

