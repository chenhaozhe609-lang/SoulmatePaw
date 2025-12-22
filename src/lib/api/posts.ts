import { supabase } from '@/lib/supabaseClient';

export interface Post {
  id: string;
  user_name: string;
  content: string;
  image_url?: string;
  likes_count: number;
  is_official: boolean;
  category?: string;
  created_at: string;
}

export async function getPosts(sortBy: 'latest' | 'oldest' = 'latest', category?: string) {
  let query = supabase
    .from('posts')
    .select('*');

  if (category) {
    query = query.eq('category', category);
  }

  query = query.order('created_at', { ascending: sortBy === 'oldest' });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return data as Post[];
}

export async function getTrendingPosts() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data, error } = await supabase
    .from('posts')
    .select('id, content, likes_count')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('likes_count', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching trending posts:', error);
    return [];
  }

  return data as Partial<Post>[];
}
