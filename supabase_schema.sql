-- Create a table for products
create table products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null check (price >= 0),
  image_url text,
  stock_quantity integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for orders
create table orders (
  id uuid default gen_random_uuid() primary key,
  customer_name text not null,
  total_amount numeric not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a table for order items
create table order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price_at_time numeric not null check (price_at_time >= 0)
);

-- Enable Row Level Security (RLS)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create policies (Simplification: allow authenticated users to do everything for this dashboard)
-- In a real app, you might want more granular permissions
create policy "Allow all operations for authenticated users on products"
  on products for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow all operations for authenticated users on orders"
  on orders for all
  to authenticated
  using (true)
  with check (true);

create policy "Allow all operations for authenticated users on order_items"
  on order_items for all
  to authenticated
  using (true)
  with check (true);

-- Optional: Storage bucket for product images
-- insert into storage.buckets (id, name) values ('products', 'products');
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'products' );
-- create policy "Authenticated Insert" on storage.objects for insert to authenticated with check ( bucket_id = 'products' );

create table public.users (
  id uuid primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.users enable row level security;

create policy users_select_own
  on public.users for select
  to authenticated
  using (id = auth.uid());

create policy users_update_own
  on public.users for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create or replace function public.handle_deleted_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.users where id = old.id;
  return old;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists on_auth_user_deleted on auth.users;
create trigger on_auth_user_deleted
  after delete on auth.users
  for each row execute procedure public.handle_deleted_user();
