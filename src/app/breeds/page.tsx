import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Pet Breeds | SoulmatePaw',
  description: 'Browse our comprehensive guide of dog and cat breeds to find your perfect match.',
};

export const revalidate = 3600; // Revalidate every hour

// Helper to convert breed name to slug
const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

export default async function BreedsPage() {
  const { data: breeds, error } = await supabase
    .from('pet_breeds')
    .select('id, breed_name, category, image_url')
    .order('breed_name');

  if (error) {
    console.error('Error fetching breeds:', error);
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-red-500">Failed to load breeds. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-heading mb-4">
            Explore Pet Breeds
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Discover the personality, care needs, and unique traits of our furry friends.
          </p>
          <p className="text-sm text-stone-400 mt-4 italic">
            * Detailed breed guides for other pet categories (Birds, Reptiles, Small Pets) are on the way!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {breeds?.map((breed) => (
            <Link 
              key={breed.id} 
              href={`/breed/${toSlug(breed.breed_name)}`}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden border border-stone-100"
            >
              <div className="relative h-48 w-full bg-stone-100">
                {breed.image_url ? (
                  <Image
                    src={breed.image_url}
                    alt={breed.breed_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-400">
                    <span className="text-4xl">🐾</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                  {breed.category}
                </div>
              </div>
              
              <div className="p-5">
                <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {breed.breed_name}
                </h2>
                <div className="mt-2 flex items-center text-sm text-muted font-medium">
                  <span>View Guide</span>
                  <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
