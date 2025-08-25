-- Sample data for e-commerce store

-- Insert sample categories
INSERT INTO public.categories (name, description, slug, image_url) VALUES
('Electronics', 'Latest electronic devices and gadgets', 'electronics', '/placeholder.svg?height=200&width=300'),
('Clothing', 'Fashion and apparel for all occasions', 'clothing', '/placeholder.svg?height=200&width=300'),
('Home & Garden', 'Everything for your home and garden', 'home-garden', '/placeholder.svg?height=200&width=300'),
('Sports & Outdoors', 'Sports equipment and outdoor gear', 'sports-outdoors', '/placeholder.svg?height=200&width=300'),
('Books', 'Books and educational materials', 'books', '/placeholder.svg?height=200&width=300')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (name, description, price, compare_at_price, sku, slug, category_id, image_url, gallery_urls, stock_quantity, featured, tags) VALUES
(
  'Wireless Bluetooth Headphones',
  'Premium wireless headphones with noise cancellation and 30-hour battery life.',
  199.99,
  249.99,
  'WBH-001',
  'wireless-bluetooth-headphones',
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  '/placeholder.svg?height=400&width=400',
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'],
  50,
  true,
  ARRAY['wireless', 'bluetooth', 'noise-cancellation', 'premium']
),
(
  'Organic Cotton T-Shirt',
  'Comfortable organic cotton t-shirt available in multiple colors.',
  29.99,
  39.99,
  'OCT-001',
  'organic-cotton-t-shirt',
  (SELECT id FROM public.categories WHERE slug = 'clothing'),
  '/placeholder.svg?height=400&width=400',
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'],
  100,
  true,
  ARRAY['organic', 'cotton', 'comfortable', 'sustainable']
),
(
  'Smart Home Security Camera',
  '1080p HD security camera with night vision and mobile app control.',
  89.99,
  119.99,
  'SHSC-001',
  'smart-home-security-camera',
  (SELECT id FROM public.categories WHERE slug = 'electronics'),
  '/placeholder.svg?height=400&width=400',
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'],
  25,
  false,
  ARRAY['smart-home', 'security', 'hd', 'night-vision']
),
(
  'Yoga Mat Premium',
  'Non-slip premium yoga mat with carrying strap and alignment guides.',
  49.99,
  NULL,
  'YMP-001',
  'yoga-mat-premium',
  (SELECT id FROM public.categories WHERE slug = 'sports-outdoors'),
  '/placeholder.svg?height=400&width=400',
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'],
  75,
  true,
  ARRAY['yoga', 'fitness', 'non-slip', 'premium']
),
(
  'Modern Table Lamp',
  'Minimalist LED table lamp with adjustable brightness and USB charging port.',
  79.99,
  99.99,
  'MTL-001',
  'modern-table-lamp',
  (SELECT id FROM public.categories WHERE slug = 'home-garden'),
  '/placeholder.svg?height=400&width=400',
  ARRAY['/placeholder.svg?height=400&width=400', '/placeholder.svg?height=400&width=400'],
  30,
  false,
  ARRAY['modern', 'led', 'adjustable', 'usb-charging']
)
ON CONFLICT (slug) DO NOTHING;
