import { supabase } from './supabaseClient';

export interface PetBreed {
  id: string;
  name: string;
  category: string; // 'Dog', 'Cat', 'Bird', 'Reptile', 'Small Mammal'
  imageUrl?: string;
  description: string;
  tags: {
    space: 'tiny' | 'apartment' | 'house';
    budget: 'low' | 'medium' | 'high';
    time: 'low' | 'medium' | 'high';
  };
  whyItFits?: string; // Dynamic field populated at runtime
  isCompromise?: boolean; // Flag for fallback results
}

export interface UserConstraints {
  space: 'tiny' | 'apartment' | 'house';
  budget: 'low' | 'medium' | 'high';
  time: 'low' | 'medium' | 'high';
}

const PET_DATABASE: PetBreed[] = [
  // --- DOGS ---
  {
    id: 'dog_golden',
    name: 'Golden Retriever',
    category: 'Dog',
    description: 'The ultimate family companion. Friendly, energetic, and loves everyone.',
    tags: { space: 'house', budget: 'high', time: 'high' },
  },
  {
    id: 'dog_frenchie',
    name: 'French Bulldog',
    category: 'Dog',
    description: 'A charming couch potato who loves attention but needs minimal exercise.',
    tags: { space: 'apartment', budget: 'high', time: 'medium' },
  },
  {
    id: 'dog_greyhound',
    name: 'Greyhound',
    category: 'Dog',
    description: 'Surprisingly lazy! A 45mph couch potato that fits well in apartments.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'dog_chihuahua',
    name: 'Chihuahua',
    category: 'Dog',
    description: 'Tiny dog, big personality. Perfect for small living spaces.',
    tags: { space: 'tiny', budget: 'low', time: 'medium' },
  },

  // --- CATS ---
  {
    id: 'cat_siamese',
    name: 'Siamese Cat',
    category: 'Cat',
    description: 'Vocal, social, and intelligent. They want to be involved in everything you do.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'cat_ragdoll',
    name: 'Ragdoll',
    category: 'Cat',
    description: 'A large, floppy, affectionate cat that goes limp when held.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'cat_bsh',
    name: 'British Shorthair',
    category: 'Cat',
    description: 'The teddy bear of cats. Calm, independent, and low maintenance.',
    tags: { space: 'apartment', budget: 'medium', time: 'low' },
  },

  // --- SMALL MAMMALS ---
  {
    id: 'small_hamster',
    name: 'Syrian Hamster',
    category: 'Hamster', // Mapped from 'Hamster' outcome
    description: 'Solitary, nocturnal, and easy to care for. Great starter pet.',
    tags: { space: 'tiny', budget: 'low', time: 'low' },
  },
  {
    id: 'small_ferret',
    name: 'Ferret',
    category: 'Ferret',
    description: 'Playful chaos noodles. High energy and super inquisitive.',
    tags: { space: 'apartment', budget: 'medium', time: 'high' },
  },
  {
    id: 'small_rabbit',
    name: 'Holland Lop Rabbit',
    category: 'Rabbit',
    description: 'Gentle and affectionate, but needs space to hop and chew-proofed home.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },

  // --- REPTILES & OTHERS ---
  {
    id: 'rep_cornsnake',
    name: 'Corn Snake',
    category: 'Snake',
    description: 'Docile, colorful, and easy to handle. The perfect beginner snake.',
    tags: { space: 'tiny', budget: 'low', time: 'low' },
  },
  {
    id: 'rep_bearded',
    name: 'Bearded Dragon',
    category: 'Lizard',
    description: 'The dog of the reptile world. Friendly, chill, and loves bugs.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'bird_budgie',
    name: 'Budgerigar (Budgie)',
    category: 'Bird',
    description: 'Chatty, colorful, and smart. Can learn to talk with patience.',
    tags: { space: 'apartment', budget: 'low', time: 'medium' },
  },
  {
    id: 'fish_goldfish',
    name: 'Fancy Goldfish',
    category: 'Goldfish',
    description: 'Beautiful swimmers, but they need bigger tanks than you think!',
    tags: { space: 'apartment', budget: 'medium', time: 'low' },
  },
  {
    id: 'spider_tarantula',
    name: 'Mexican Red Knee Tarantula',
    category: 'Spider',
    description: 'Slow moving, docile, and fascinating to watch. Very low maintenance.',
    tags: { space: 'tiny', budget: 'low', time: 'low' },
  },
];

// Fallback options per category if exact match fails
const FALLBACK_PETS: Record<string, string> = {
  'Dog': 'dog_chihuahua', // Easiest fit
  'Cat': 'cat_bsh',
  'Small Mammal': 'small_hamster',
  'Reptile': 'rep_cornsnake',
  'Bird': 'bird_budgie',
};

// Helper to convert ordinal values for comparison
const SCORES = {
  space: { tiny: 1, apartment: 2, house: 3 },
  budget: { low: 1, medium: 2, high: 3 },
  time: { low: 1, medium: 2, high: 3 },
};

function mapDbRowToPetBreed(row: any): PetBreed {
  // Map min_space to space tag
  // 'small' -> 'apartment' (closest fit for UI)
  // 'medium' -> 'apartment' (fits in apartment)
  // 'large' -> 'house'
  let spaceTag: 'tiny' | 'apartment' | 'house' = 'house';
  if (row.min_space === 'small') spaceTag = 'apartment';
  else if (row.min_space === 'medium') spaceTag = 'apartment';
  
  return {
    id: row.id,
    name: row.breed_name,
    category: row.category,
    imageUrl: row.image_url,
    description: row.description,
    tags: {
      space: spaceTag,
      budget: row.budget_tier as 'low' | 'medium' | 'high',
      time: row.energy_level === 'low' ? 'low' : (row.energy_level === 'medium' ? 'medium' : 'high') as 'low' | 'medium' | 'high'
    }
  };
}

export async function findBestMatch(category: string, constraints: UserConstraints): Promise<PetBreed> {
  console.log(`[Engine] Finding match for ${category}`, constraints);

  // 1. Supabase Query for Dogs
  if (category === 'Dog') {
    try {
      let query = supabase.from('pet_breeds').select('*').eq('category', 'Dog');

      // Space Logic
      if (constraints.space === 'apartment' || constraints.space === 'tiny') {
        query = query.in('min_space', ['small', 'medium']);
      }
      
      // Energy Logic
      if (constraints.time === 'low') {
        query = query.eq('energy_level', 'low');
      } else if (constraints.time === 'medium') {
        query = query.in('energy_level', ['low', 'medium']);
      }

      // Budget Logic
      if (constraints.budget === 'low') {
        query = query.eq('budget_tier', 'low');
      }

      const { data, error } = await query.limit(1);

      if (!error && data && data.length > 0) {
        console.log('[Engine] Found exact match in DB:', data[0].breed_name);
        return mapDbRowToPetBreed(data[0]);
      }

      // Fallback: Relaxed Filter (Remove Budget)
      console.log('[Engine] No exact match, trying relaxed filter (ignoring budget)...');
      let relaxedQuery = supabase.from('pet_breeds').select('*').eq('category', 'Dog');
      
      if (constraints.space === 'apartment' || constraints.space === 'tiny') {
        relaxedQuery = relaxedQuery.in('min_space', ['small', 'medium']);
      }
      
      if (constraints.time === 'low') {
        relaxedQuery = relaxedQuery.eq('energy_level', 'low');
      } else if (constraints.time === 'medium') {
        relaxedQuery = relaxedQuery.in('energy_level', ['low', 'medium']);
      }
      
      const { data: relaxedData } = await relaxedQuery.limit(1);
      if (relaxedData && relaxedData.length > 0) {
        return { ...mapDbRowToPetBreed(relaxedData[0]), isCompromise: true };
      }
      
      // Ultimate Fallback: Any Dog that fits space
      let anyQuery = supabase.from('pet_breeds').select('*').eq('category', 'Dog');
       if (constraints.space === 'apartment' || constraints.space === 'tiny') {
        anyQuery = anyQuery.in('min_space', ['small', 'medium']);
      }
      const { data: anyData } = await anyQuery.limit(1);
      if (anyData && anyData.length > 0) {
        return { ...mapDbRowToPetBreed(anyData[0]), isCompromise: true };
      }

    } catch (err) {
      console.error('[Engine] Error querying Supabase for Dogs:', err);
    }
  }

  // 2. Supabase Query for Cats (Phase 3 Step 2)
  else if (category === 'Cat') {
    try {
      let query = supabase.from('pet_breeds').select('*').eq('category', 'Cat');

      // --- Space Logic for Cats ---
      // Most cats are fine in small space.
      // But if user.space == 'tiny', filter OUT 'medium' space cats (e.g. Maine Coon, Bengal)
      if (constraints.space === 'tiny') {
        query = query.neq('min_space', 'medium');
      }
      
      // --- Time/Attention Logic for Cats ---
      // Time constraint maps to Attention/Grooming needs
      if (constraints.time === 'low') {
        // Busy owner: Filter OUT 'clingy' OR 'high-grooming'
        // In Supabase, 'tags' is a text array. We want to ensure it DOES NOT contain 'clingy' AND DOES NOT contain 'high-grooming'
        // Using PostgreSQL array operators via Supabase
        // not.cs (contains) is what we want? No, Supabase has .not('tags', 'cs', '{clingy}')
        // But we want to filter out if it has EITHER.
        // Logic: NOT (tags contains 'clingy') AND NOT (tags contains 'high-grooming')
        query = query.not('tags', 'cs', '{"clingy"}')
                     .not('tags', 'cs', '{"high-grooming"}');
      }
      // If time is medium/high, we allow all (clingy/high-grooming are fine)

      // --- Budget Logic for Cats ---
      if (constraints.budget === 'low') {
        query = query.eq('budget_tier', 'low');
      }
      // Medium budget can handle low/medium

      const { data, error } = await query.limit(1);

      if (!error && data && data.length > 0) {
        console.log('[Engine] Found exact match in DB (Cat):', data[0].breed_name);
        return mapDbRowToPetBreed(data[0]);
      }

      // Fallback: Relaxed Filter (Remove Budget)
      console.log('[Engine] No exact match for Cat, trying relaxed filter (ignoring budget)...');
      let relaxedQuery = supabase.from('pet_breeds').select('*').eq('category', 'Cat');

      // Re-apply Space
      if (constraints.space === 'tiny') {
        relaxedQuery = relaxedQuery.neq('min_space', 'medium');
      }

      // Re-apply Time
      if (constraints.time === 'low') {
        relaxedQuery = relaxedQuery.not('tags', 'cs', '{"clingy"}')
                                   .not('tags', 'cs', '{"high-grooming"}');
      }

      const { data: relaxedData } = await relaxedQuery.limit(1);
      if (relaxedData && relaxedData.length > 0) {
        return { ...mapDbRowToPetBreed(relaxedData[0]), isCompromise: true };
      }

      // Ultimate Fallback: Any Cat that fits space
      console.log('[Engine] Still no match, trying space-only filter for Cat...');
      let spaceQuery = supabase.from('pet_breeds').select('*').eq('category', 'Cat');
      if (constraints.space === 'tiny') {
        spaceQuery = spaceQuery.neq('min_space', 'medium');
      }
      const { data: spaceData } = await spaceQuery.limit(1);
      if (spaceData && spaceData.length > 0) {
        return { ...mapDbRowToPetBreed(spaceData[0]), isCompromise: true };
      }

    } catch (err) {
      console.error('[Engine] Error querying Supabase for Cats:', err);
    }
  }

  // 3. Legacy Local Logic (for other pets or if DB fails)
  // Note: We use flexible matching because Decision Tree outcomes (e.g., 'Hamster', 'Lizard') 
  // might map directly to categories in our DB or be subtypes.
  let candidates = PET_DATABASE.filter(p => 
    p.category.toLowerCase() === category.toLowerCase() || 
    p.name.toLowerCase().includes(category.toLowerCase())
  );

  // If no direct category match (e.g. 'Small Mammal' vs specific 'Hamster'), try broader logic or default
  if (candidates.length === 0) {
    console.warn(`[Engine] No direct category match for ${category}. Checking subsets...`);
  }

  // Exact Filtering (Hard Constraints)
  const exactMatches = candidates.filter(pet => {
    const spaceOk = SCORES.space[constraints.space] >= SCORES.space[pet.tags.space];
    const budgetOk = SCORES.budget[constraints.budget] >= SCORES.budget[pet.tags.budget];
    const timeOk = SCORES.time[constraints.time] >= SCORES.time[pet.tags.time];
    return spaceOk && budgetOk && timeOk;
  });

  if (exactMatches.length > 0) {
    return exactMatches[0]; // Return best fit
  }

  // Fallback / Compromise
  // If no exact match, return the "easiest" pet in that category (lowest requirements)
  candidates.sort((a, b) => {
    const scoreA = SCORES.space[a.tags.space] + SCORES.budget[a.tags.budget] + SCORES.time[a.tags.time];
    const scoreB = SCORES.space[b.tags.space] + SCORES.budget[b.tags.budget] + SCORES.time[b.tags.time];
    return scoreA - scoreB;
  });

  if (candidates.length > 0) {
    return { ...candidates[0], isCompromise: true };
  }

  // Absolute fallback if category is empty in DB (shouldn't happen with good seed data)
  return PET_DATABASE[0]; 
}

// New helper for direct breed lookup by ID
export async function getBreedById(id: string): Promise<PetBreed | null> {
  // 1. Check Local DB first (Legacy)
  const localMatch = PET_DATABASE.find(p => p.id === id);
  if (localMatch) return localMatch;

  // 2. Check Supabase
  try {
    const { data, error } = await supabase
      .from('pet_breeds')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error || !data) return null;
    return mapDbRowToPetBreed(data);
  } catch (err) {
    console.error('Error fetching breed by ID:', err);
    return null;
  }
}
