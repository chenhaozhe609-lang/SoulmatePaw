'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '@/context/QuizContext';
import { ShoppingBag, ThumbsUp, ThumbsDown, RotateCcw, Share2, Zap, Home, DollarSign, Sparkles } from 'lucide-react';
import { findBestMatch, PetBreed, getBreedById } from '@/lib/recommendationEngine';
import { useRouter, useSearchParams } from 'next/navigation';
import LoadingOverlay from './LoadingOverlay';

const MOCK_PRODUCTS = [
  { name: 'Cozy Calming Bed', price: '$45', image: '🛏️' },
  { name: 'Interactive Treat Toy', price: '$22', image: '🎾' },
];

export default function ResultCard() {
  const { selectedCategory, physicalConstraints, submitFeedback, resetSession, personalityScores } = useQuiz();
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [matchedBreed, setMatchedBreed] = useState<PetBreed | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const breedId = searchParams.get('breed_id');
  const isSaved = useRef(false);

  useEffect(() => {
    async function init() {
      // 1. If we have a breed_id in URL, use it (Shareable Link mode)
      if (breedId) {
        setLoading(true);
        try {
          const breed = await getBreedById(breedId);
          if (breed) {
            setMatchedBreed(breed);
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error('Error fetching breed by ID:', e);
        }
      }

      // 2. Fallback: If no breed_id, check Context (User Flow mode)
      if (selectedCategory && physicalConstraints) {
        setLoading(true);
        // Simulate async delay for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        try {
          const match = await findBestMatch(selectedCategory, physicalConstraints);
          setMatchedBreed(match);
          
          // Update URL to include breed_id for sharing
          router.replace(`/result?breed_id=${match.id}`, { scroll: false });
          
          // Save to Database via API
          if (!isSaved.current) {
            isSaved.current = true;
            try {
              await fetch('/api/save-journey', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  personalityScores,
                  constraints: physicalConstraints,
                  decisionPath: selectedCategory,
                  recommendedResult: match,
                }),
              });
            } catch (error) {
              console.error('Error saving journey:', error);
            }
          }
        } catch (error) {
          console.error('Error finding match:', error);
        } finally {
          setLoading(false);
        }
      } else if (!breedId) {
        // If neither URL param nor Context is present, go home
        router.push('/');
      } else {
        setLoading(false);
      }
    }
    
    init();
  }, [breedId, selectedCategory, physicalConstraints, personalityScores, router]);

  if (!matchedBreed && !loading) return null;

  if (loading || !matchedBreed) {
    return <LoadingOverlay />;
  }


  const bestMatch = matchedBreed;

  // Generate Dynamic "Why" Text
  const whyItFits = bestMatch.whyItFits || 
    `Since you live in an ${physicalConstraints?.space} and have ${physicalConstraints?.time} time, the ${bestMatch.name} is your ideal match!`;

  const handleFeedback = (score: number) => {
    setFeedbackScore(score);
    submitFeedback(score);
  };

  const handleStartOver = () => {
    resetSession();
    router.push('/');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 relative">
      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-heading mb-2">
          It's a Match! 🎉
        </h1>
        <p className="text-xl text-muted font-light">
          Say hello to your new soulmate.
        </p>
      </motion.div>

      {/* Main Soulmate Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Area */}
          <div className="bg-stone-50 p-8 flex items-center justify-center relative overflow-hidden group min-h-[320px]">
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Placeholder for Pet Image */}
            <div className="flex flex-col items-center justify-center text-stone-300">
               {bestMatch.imageUrl ? (
                 <img src={bestMatch.imageUrl} alt={bestMatch.name} className="w-64 h-64 object-cover rounded-full shadow-lg" />
               ) : (
                 <>
                   <div className="w-40 h-40 rounded-full border-4 border-dashed border-stone-200 flex items-center justify-center mb-4">
                     <span className="text-4xl">🐾</span>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">Image Coming Soon</p>
                 </>
               )}
            </div>
          </div>

          {/* Right: Details Area */}
          <div className="p-8 md:p-12 flex flex-col justify-center text-left">
             <div className="mb-6">
                {bestMatch.isCompromise && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 font-bold px-4 py-1 rounded-full text-xs mb-3">
                    Best Compromise
                  </span>
                )}
                <span className="inline-block bg-primary/10 text-primary font-bold px-4 py-1 rounded-full text-sm mb-3 ml-2">
                  {bestMatch.category}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-foreground font-heading leading-tight mb-2">
                  {bestMatch.name}
                </h2>
                <p className="text-xl text-secondary font-medium italic">
                  "{bestMatch.description}"
                </p>
             </div>

             {/* The "Why" Section */}
             <div className="bg-stone-50 rounded-2xl p-6 mb-8 border border-stone-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                  <p className="text-muted leading-relaxed">
                    {whyItFits}
                  </p>
                </div>
             </div>

             {/* Compatibility Icons */}
             <div className="flex gap-6 mb-8">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                   <Home size={20} />
                 </div>
                 <span className="text-xs font-bold text-muted uppercase tracking-wider">{bestMatch.tags.space}</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center">
                   <Zap size={20} />
                 </div>
                 <span className="text-xs font-bold text-muted uppercase tracking-wider">{bestMatch.tags.time} Time</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                   <DollarSign size={20} />
                 </div>
                 <span className="text-xs font-bold text-muted uppercase tracking-wider">{bestMatch.tags.budget} Cost</span>
               </div>
             </div>

             <div className="flex gap-4">
               <motion.button 
                 whileTap={{ scale: 0.95 }}
                 whileHover={{ scale: 1.05 }}
                 transition={{ type: "spring", stiffness: 500, damping: 15 }}
                 className="flex-1 bg-secondary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#D9A588] transition-colors flex items-center justify-center gap-2"
               >
                 <Share2 size={20} /> Share My Match
               </motion.button>
             </div>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-primary/5 p-4 text-center border-t border-primary/10">
          <p className="text-sm text-primary font-medium">
            ℹ️ Breed database is in beta. More furry friends coming soon!
          </p>
        </div>
      </motion.div>

      {/* Shop Essentials Section (Amazon Affiliate) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="bg-gradient-to-br from-[#FFF8F0] to-[#FFF4E6] p-10 rounded-[2.5rem] border border-orange-100 shadow-xl max-w-4xl mx-auto relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200/20 rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-200/20 rounded-full blur-2xl -z-10"></div>

          <h3 className="text-3xl font-bold text-foreground font-heading mb-2">
            Prepare for your {bestMatch.name}
          </h3>
          <p className="text-muted mb-8 max-w-xl mx-auto">
            We've curated a list of essentials specifically for this breed. Get everything you need to welcome your new friend home.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
             {/* Icons */}
             <div className="flex gap-4 text-3xl opacity-80 mb-4 md:mb-0">
               <span title="Bed">🛏️</span>
               <span title="Food">🦴</span>
               <span title="Toys">🎾</span>
             </div>

             {/* Amazon CTA Button */}
             <motion.a 
               href={`https://www.amazon.com/s?k=${encodeURIComponent(bestMatch.name + " starter kit")}&tag=soulmatepaw01-20`}
               target="_blank"
               rel="noopener noreferrer"
               whileTap={{ scale: 0.95 }}
               whileHover={{ scale: 1.05 }}
               transition={{ type: "spring", stiffness: 500, damping: 15 }}
               className="inline-flex items-center gap-3 bg-[#FF9900] text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-[#E68A00] transition-all"
             >
               Shop {bestMatch.name} Essentials 🛍️
             </motion.a>
          </div>
        </div>
      </motion.div>

      {/* Footer Actions */}
      <div className="mt-16 text-center pb-10">
        <motion.button 
          onClick={handleStartOver}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-muted hover:text-foreground font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <RotateCcw size={16} /> Start Over
        </motion.button>

        {/* Feedback Section */}
        <div className="mt-8 pt-8 border-t border-stone-200 max-w-md mx-auto">
          <p className="text-sm text-muted mb-4">Was this match accurate?</p>
          {feedbackScore === null ? (
            <div className="flex justify-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.2, rotate: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFeedback(1)} 
                className="p-3 rounded-full bg-white shadow-sm border border-stone-200 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                <ThumbsDown size={20} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.2, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleFeedback(5)} 
                className="p-3 rounded-full bg-white shadow-sm border border-stone-200 hover:border-green-300 hover:text-green-500 transition-colors"
              >
                <ThumbsUp size={20} />
              </motion.button>
            </div>
          ) : (
            <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">Thanks for your feedback!</span>
          )}
        </div>
      </div>
    </div>
  );
}
