import { supabase } from '@/lib/supabaseClient';

export interface Review {
  id: string;
  pet_breed: string;
  user_name: string;
  rating: number;
  content: string;
  context_tags: string[];
  created_at: string;
}

export async function getReviewsByBreed(breed: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('pet_breed', breed)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}
