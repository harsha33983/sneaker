-- SneakerDrop Seed Data
-- Run after creating the schema and an admin user

-- ============================================
-- SEED PRODUCTS
-- ============================================
INSERT INTO products (name, slug, brand, price, description, image_url, images, category, availability, is_featured)
VALUES
(
  'Nova 01',
  'nova-01',
  'Nova Running',
  12999.00,
  'A 198 g road-running shoe with a glowing foam midsole. One piece of foam, tuned to give back more than you put in. A light strip runs through it, so you are seen before you are heard.',
  'https://prompts.picsmob.com/frames/nova/frame_0001.jpg',
  '["https://prompts.picsmob.com/frames/nova/frame_0001.jpg", "https://prompts.picsmob.com/frames/nova/frame_0060.jpg", "https://prompts.picsmob.com/frames/nova/frame_0120.jpg"]'::jsonb,
  'Running',
  'limited',
  true
),
(
  'Air Phantom X',
  'air-phantom-x',
  'SneakerDrop Originals',
  12999.00,
  'The Air Phantom X redefines stealth luxury. Featuring a monochromatic upper with premium tumbled leather, responsive Air cushioning, and a translucent outsole that catches light like no other. Built for those who move in silence but leave a lasting impression.',
  '/images/sneaker-1.svg',
  '["/images/sneaker-1.svg", "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Lifestyle',
  'available',
  true
),
(
  'Urban Velocity 01',
  'urban-velocity-01',
  'SneakerDrop Originals',
  9499.00,
  'Speed meets street. The Urban Velocity 01 pairs a breathable knit upper with a sculpted midsole designed for all-day comfort. The bold colorway and reflective accents make this a standout piece for the modern urbanite who refuses to blend in.',
  '/images/sneaker-2.svg',
  '["/images/sneaker-2.svg", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Running',
  'limited',
  true
),
(
  'Shadow Runner Pro',
  'shadow-runner-pro',
  'SneakerDrop Originals',
  14999.00,
  'Born from the shadows, built for the spotlight. The Shadow Runner Pro features a triple-black design with carbon fiber accents, ultra-responsive foam technology, and a silhouette that blurs the line between performance and fashion. Limited to 500 pairs worldwide.',
  '/images/sneaker-3.svg',
  '["/images/sneaker-3.svg", "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Performance',
  'sold_out',
  true
);
