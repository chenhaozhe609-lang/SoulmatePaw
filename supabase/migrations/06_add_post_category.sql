-- Add category column to posts table
alter table posts add column if not exists category text;

-- Update existing posts with random categories (Daily, Help, Showcase, Nutrition, Health)
update posts 
set category = (array['Daily', 'Help', 'Showcase', 'Nutrition', 'Health'])[floor(random() * 5 + 1)]
where category is null;
