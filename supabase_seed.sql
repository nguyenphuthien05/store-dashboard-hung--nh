-- Seed Data for Products
INSERT INTO products (name, description, price, stock_quantity, image_url)
VALUES
  ('Premium Wireless Headphones', 'High-quality noise cancelling headphones with 30h battery life.', 299.99, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
  ('Ergonomic Office Chair', 'Comfortable mesh chair with lumbar support for long working hours.', 199.50, 20, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80'),
  ('Mechanical Keyboard', 'RGB backlit mechanical keyboard with Cherry MX Blue switches.', 129.00, 35, 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80'),
  ('4K Monitor 27"', 'Ultra HD IPS monitor with 99% sRGB color accuracy.', 349.00, 15, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'),
  ('USB-C Docking Station', '12-in-1 docking station with HDMI, Ethernet, and 100W PD charging.', 89.99, 100, 'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&q=80');

-- Seed Data for Orders (Assuming products are created first, we use subqueries or just placeholders if running manually)
-- Note: In a real SQL execution, we might need valid IDs. 
-- Here we use a CTE (Common Table Expression) to make it runnable if tables are empty.

WITH inserted_products AS (
  SELECT id, name, price FROM products
)
INSERT INTO orders (id, customer_name, total_amount, created_at)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'John Doe', 428.99, NOW() - INTERVAL '2 days'),
  ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Jane Smith', 199.50, NOW() - INTERVAL '1 day'),
  ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Alice Johnson', 349.00, NOW());

-- Seed Data for Order Items
INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
SELECT 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', id, 1, 299.99 
FROM products WHERE name = 'Premium Wireless Headphones';

INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
SELECT 
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', id, 1, 129.00
FROM products WHERE name = 'Mechanical Keyboard';

INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
SELECT 
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', id, 1, 199.50
FROM products WHERE name = 'Ergonomic Office Chair';

INSERT INTO order_items (order_id, product_id, quantity, price_at_time)
SELECT 
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', id, 1, 349.00
FROM products WHERE name = '4K Monitor 27"';
