-- Create posts table
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null, -- Ideally references auth.users(id), but kept flexible for now
  user_name text not null default 'Anonymous',
  user_avatar text,
  content text not null,
  image_url text,
  likes_count int default 0,
  is_official boolean default false,
  created_at timestamp with time zone default now()
);

-- Create comments table
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  user_id uuid not null,
  user_name text not null default 'Anonymous',
  content text not null,
  created_at timestamp with time zone default now()
);

-- Create likes table
create table if not exists likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null,
  post_id uuid references posts(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, post_id) -- Prevent duplicate likes
);

-- Enable RLS
alter table posts enable row level security;
alter table comments enable row level security;
alter table likes enable row level security;

-- Policies (Simplified for demo)
create policy "Public read posts" on posts for select using (true);
create policy "Anon insert posts" on posts for insert with check (true);

create policy "Public read comments" on comments for select using (true);
create policy "Anon insert comments" on comments for insert with check (true);

create policy "Public read likes" on likes for select using (true);
create policy "Anon insert likes" on likes for insert with check (true);
