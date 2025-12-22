import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize DeepSeek client (using OpenAI SDK)
const openai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

interface RequestBody {
  petType: 'dog' | 'cat';
  gender: 'boy' | 'girl' | 'unisex';
  style: string;
  description?: string;
}

interface GeneratedName {
  name: string;
  meaning: string;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();
    const { petType, gender, style, description } = body;

    // Validate input
    if (!petType || !gender) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Construct the prompt
    const userPrompt = `
      I need names for a ${gender === 'unisex' ? '' : gender} ${petType}.
      Style/Vibe: ${style || 'General'}.
      ${description ? `Additional Description: ${description}` : ''}
    `;

    // Call DeepSeek API
    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are a creative pet naming expert for Western markets.
          Your task is to generate 5 unique, creative, and suitable names based on the user's input.
          
          Constraints:
          1.  **Output Language:** STRICTLY ENGLISH ONLY. Even if the user input is in another language, translate the intent and generate English names and meanings.
          2.  **Format:** Return a valid JSON object strictly matching this schema:
              {
                "names": [
                  { "name": "Name1", "meaning": "Short meaning/reason in English" },
                  ...
                ]
              }
          3.  **Creativity:** Avoid overly common names (like "Spot" or "Kitty") unless requested. Focus on the "Style" provided.
          `
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    
    if (!content) {
      throw new Error('No content received from AI');
    }

    let generatedNames: GeneratedName[] = [];
    try {
      const parsed = JSON.parse(content);
      generatedNames = parsed.names;
    } catch (e) {
      console.error('Failed to parse JSON from AI:', content);
      throw new Error('Invalid JSON format from AI');
    }

    // Save to Database (for SEO and history)
    // We do this asynchronously and don't block the response
    supabase
      .from('generated_names')
      .insert({
        pet_type: petType,
        gender: gender,
        style: style,
        generated_result: generatedNames, // Stored as JSONB
      })
      .then(({ error }) => {
        if (error) console.error('Error saving to DB:', error);
      });

    // Return response
    return NextResponse.json({ names: generatedNames });

  } catch (error) {
    console.error('Error in name generation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
