-- Create reviews table
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  pet_breed text not null,
  user_name text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  content text not null,
  context_tags text[] not null default '{}',
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table reviews enable row level security;
create policy "Public read access" on reviews for select using (true);
create policy "Anon insert access" on reviews for insert with check (true);

-- Seed Data
insert into reviews (pet_breed, user_name, rating, content, context_tags) values
-- Golden Retriever
('Golden Retriever', 'Sarah J.', 5, 'Absolutely the best family dog. He is so gentle with my toddler and never gets aggressive.', ARRAY['Has Kids', 'First-time Owner']),
('Golden Retriever', 'Mike T.', 4, 'Great dog but shedding is real! I live in a small apartment and vacuuming is a daily chore. He needs more space.', ARRAY['Apartment Living', 'High Shedding']),
('Golden Retriever', 'Emily R.', 5, 'My running partner! We do 5k every morning. High energy but so rewarding.', ARRAY['Active Lifestyle', 'House with Yard']),
('Golden Retriever', 'David L.', 3, 'A bit too big for my studio apartment, felt guilty leaving him alone while I worked.', ARRAY['Apartment Living', 'Busy Schedule']),
('Golden Retriever', 'Jessica M.', 5, 'Perfect first dog. Very easy to train and eager to please.', ARRAY['First-time Owner', 'House with Yard']),
('Golden Retriever', 'Tom H.', 5, 'Loves the kids, loves the pool. Needs a big backyard to really thrive.', ARRAY['Has Kids', 'House with Yard']),

-- British Shorthair
('British Shorthair', 'Alice W.', 5, 'The perfect apartment cat. She just chills on the sofa all day while I work.', ARRAY['Apartment Living', 'Busy Schedule']),
('British Shorthair', 'Bob K.', 4, 'Very independent. Not a lap cat, but likes to be in the same room. Great if you work a lot.', ARRAY['Busy Schedule', 'First-time Owner']),
('British Shorthair', 'Chloe D.', 5, 'My kids love him! He is sturdy and patient, unlike my previous Siamese.', ARRAY['Has Kids', 'House with Yard']),
('British Shorthair', 'Dan P.', 5, 'Zero drama. Quiet, clean, and handles my small apartment perfectly.', ARRAY['Apartment Living', 'First-time Owner']),
('British Shorthair', 'Fiona G.', 3, 'Sheds more than I expected for a shorthair! But personality is gold.', ARRAY['High Shedding', 'Apartment Living']);
