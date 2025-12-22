create table if not exists generated_names ( 
  id bigint primary key generated always as identity, 
  created_at timestamp with time zone default now(), 
  pet_type text not null, -- 'dog' or 'cat' 
  gender text, -- 'boy', 'girl', 'unisex' 
  style text, -- e.g., 'funny', 'royal', 'cute', 'mythical' 
  generated_result jsonb not null, -- Store the array of names/meanings returned by AI 
  is_featured boolean default false 
); 

alter table generated_names enable row level security; 
create policy "Allow public read access" on generated_names for select using (true); 
create policy "Allow insert for anon" on generated_names for insert with check (true);
