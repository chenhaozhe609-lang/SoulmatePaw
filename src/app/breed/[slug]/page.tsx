import { supabase } from '@/lib/supabaseClient';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // Revalidate every hour

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to convert breed name to slug
const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

// Helper to fetch breed data
async function getBreed(slug: string) {
  // Try to reconstruct the name
  const nameQuery = slug.replace(/-/g, ' ');
  
  // First try case-insensitive match
  const { data, error } = await supabase
    .from('pet_breeds')
    .select('*')
    .ilike('breed_name', nameQuery)
    .single();

  if (data) return data;

  // Fallback: Fetch all and find match (less efficient but safer for small datasets)
  const { data: allBreeds } = await supabase
    .from('pet_breeds')
    .select('*');
    
  if (allBreeds) {
    return allBreeds.find(b => toSlug(b.breed_name) === slug);
  }

  return null;
}

export async function generateStaticParams() {
  const { data: breeds } = await supabase
    .from('pet_breeds')
    .select('breed_name');

  if (!breeds) return [];

  return breeds.map((breed) => ({
    slug: toSlug(breed.breed_name),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const breed = await getBreed(slug);
  
  if (!breed) {
    return {
      title: 'Breed Not Found | SoulmatePaw',
    };
  }

  return {
    title: `${breed.breed_name} Personality & Care Guide | SoulmatePaw`,
    description: `Learn everything about the ${breed.breed_name}. ${breed.description.slice(0, 150)}...`,
  };
}

export default async function BreedPage({ params }: Props) {
  const { slug } = await params;
  const breed = await getBreed(slug);

  if (!breed) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/breeds" className="text-primary hover:underline mb-8 inline-block">
          &larr; Back to all breeds
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            {breed.image_url ? (
               <Image
                src={breed.image_url}
                alt={breed.breed_name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-stone-200 flex items-center justify-center text-stone-400">
                No Image Available
              </div>
            )}
             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading">
                  {breed.breed_name}
                </h1>
                <p className="text-white/90 text-lg mt-2">{breed.category}</p>
             </div>
          </div>

          <div className="p-6 sm:p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                 <h2 className="text-2xl font-bold text-foreground font-heading">At a Glance</h2>
                 <div className="space-y-4">
                    <TraitRow label="Energy Level" value={breed.energy_level} />
                    <TraitRow label="Minimum Space" value={breed.min_space} />
                    <TraitRow label="Budget Tier" value={breed.budget_tier} />
                 </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-foreground font-heading mb-4">About</h2>
                <div className="text-muted text-lg leading-relaxed space-y-4">
                  <p>
                    The <strong>{breed.breed_name}</strong> is a <strong>{breed.min_space === 'small' ? 'compact' : breed.min_space === 'medium' ? 'medium' : 'large'}</strong> sized <strong>{breed.category}</strong> known for its <strong>{breed.energy_level}</strong> energy levels.
                  </p>
                  <p>
                    <strong>Living Environment:</strong> This breed thrives best in <strong>{breed.min_space === 'small' ? 'apartments and small homes' : breed.min_space === 'medium' ? 'homes with some yard space' : 'spacious homes with large yards'}</strong>.
                  </p>
                  <p>
                    <strong>Personality:</strong> Often described as {breed.tags && breed.tags.length > 0 ? (
                      breed.tags.map((tag: string, index: number) => (
                        <span key={tag}>
                          <strong>{tag}</strong>{index < breed.tags.length - 1 ? ', ' : '.'}
                        </span>
                      ))
                    ) : 'a wonderful companion.'}
                  </p>
                  <p className="mt-4">
                    {breed.description}
                  </p>
                </div>
                {breed.tags && breed.tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {breed.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-stone-100">
               <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8 text-center border border-primary/10 shadow-sm">
                  <h3 className="text-2xl font-bold text-foreground mb-3 font-heading">Ready to welcome a {breed.breed_name}?</h3>
                  <p className="text-muted mb-8 max-w-lg mx-auto">Get everything you need to make your new best friend feel right at home.</p>
                  
                  <a 
                    href={`https://www.amazon.com/s?k=${breed.breed_name.replace(/\s+/g, '+')}+pet+supplies&tag=soulmatepaw-20`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#FF9900] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e68a00] transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                  >
                    <span>Shop {breed.breed_name} Essentials</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                  </a>
                  <p className="text-xs text-muted mt-4 opacity-70">As an Amazon Associate we earn from qualifying purchases.</p>
               </div>
            </div>

            {breed.affiliate_link && (
               <div className="mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-100">
                  <h3 className="text-lg font-bold text-foreground mb-2">Adoption & Breeder Resources</h3>
                  <p className="text-muted mb-4 text-sm">Find reputable sources for your new companion.</p>
                  <a 
                    href={breed.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-bold hover:underline"
                  >
                    View Source Information &rarr;
                  </a>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TraitRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
      <span className="text-muted font-medium">{label}</span>
      <span className="text-foreground font-bold capitalize">{value}</span>
    </div>
  );
}
