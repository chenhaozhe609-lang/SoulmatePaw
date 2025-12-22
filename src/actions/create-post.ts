'use server';

import { supabase } from '@/lib/supabaseClient';
import OpenAI from 'openai';
import { revalidatePath } from 'next/cache';

// Initialize DeepSeek client
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function createPost(formData: FormData) {
  const content = formData.get('content') as string;
  const imageUrl = formData.get('image_url') as string;
  // In a real app, we'd get the user ID from the session
  const userId = '00000000-0000-0000-0000-000000000000'; // Mock ID for anon
  const userName = 'Pet Lover';

  if (!content) {
    throw new Error('Content is required');
  }

  // 1. AI Moderation (DeepSeek)
  try {
    const moderationResponse = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are a content moderator. Classify the following text. 
          If it contains hate speech, violence, explicit adult content, or spam, return 'UNSAFE'. 
          Otherwise, return 'SAFE'.
          Output ONLY the word 'SAFE' or 'UNSAFE'.`
        },
        {
          role: 'user',
          content: content
        }
      ],
      temperature: 0,
    });

    const moderationResult = moderationResponse.choices[0].message.content?.trim().toUpperCase();

    if (moderationResult === 'UNSAFE') {
      throw new Error('Content violation detected. Please keep the community safe and friendly.');
    }

  } catch (error: any) {
    // If it's our custom error, rethrow it
    if (error.message.includes('Content violation')) {
      throw error;
    }
    // If API fails, we might choose to fail safe or block. For now, let's log and block.
    console.error('AI Moderation failed:', error);
    throw new Error('Unable to verify content safety at this time. Please try again.');
  }

  // 2. Insert into Database
  const { error } = await supabase
    .from('posts')
    .insert({
      user_id: userId,
      user_name: userName,
      content,
      image_url: imageUrl || null,
    });

  if (error) {
    console.error('Database insertion error:', error);
    throw new Error('Failed to post content.');
  }

  // 3. Revalidate
  revalidatePath('/animunity');
  
  return { success: true };
}
