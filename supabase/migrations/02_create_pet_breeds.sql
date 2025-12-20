-- Create pet_breeds table
create table if not exists public.pet_breeds (
  id uuid default gen_random_uuid() primary key,
  category text not null,
  breed_name text not null,
  min_space text not null check (min_space in ('small', 'medium', 'large')),
  energy_level text not null check (energy_level in ('low', 'medium', 'high')),
  budget_tier text not null check (budget_tier in ('low', 'medium', 'high')),
  tags text[] not null default '{}',
  description text not null,
  image_url text,
  affiliate_link text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.pet_breeds enable row level security;

-- Policy for public read access
create policy "Enable read access for all users"
  on public.pet_breeds
  for select
  using (true);
