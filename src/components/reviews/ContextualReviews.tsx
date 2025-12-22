'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, Tag, User } from 'lucide-react';
import { getReviewsByBreed, Review } from '@/lib/reviews';

interface ContextualReviewsProps {
  breed: string;
}

const ALL_TAGS = [
  'Apartment Living',
  'House with Yard',
  'First-time Owner',
  'Has Kids',
  'Active Lifestyle',
  'Busy Schedule',
  'High Shedding',
];

export default function ContextualReviews({ breed }: ContextualReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      setIsLoading(true);
      const data = await getReviewsByBreed(breed);
      setReviews(data);
      setFilteredReviews(data);
      setIsLoading(false);
    }
    fetchReviews();
  }, [breed]);

  useEffect(() => {
    if (!selectedTag) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => r.context_tags.includes(selectedTag)));
    }
  }, [selectedTag, reviews]);

  const toggleTag = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className="w-full bg-stone-50 rounded-[2rem] p-6 md:p-8 border border-stone-100">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-foreground font-heading mb-2 flex items-center gap-2">
          <Star className="fill-secondary text-secondary" />
          Community Reviews
        </h3>
        <p className="text-muted">See what owners like you have to say.</p>
      </div>

      {/* Filter Chips */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-sm font-bold text-stone-400 uppercase tracking-wider">
          <Filter size={14} /> Filter by your lifestyle:
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              selectedTag === null
                ? 'bg-stone-800 text-white shadow-md'
                : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400'
            }`}
          >
            All
          </button>
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedTag === tag
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white text-stone-500 border border-stone-200 hover:border-primary/50 hover:text-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="text-center py-12 text-muted bg-white rounded-2xl border border-dashed border-stone-200">
          No reviews found for this specific context yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                highlightTag={selectedTag} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ review, highlightTag }: { review: Review; highlightTag: string | null }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <User size={16} />
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-sm">{review.user_name}</h4>
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < review.rating ? "currentColor" : "none"} 
                  className={i < review.rating ? "" : "text-stone-200"}
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-xs text-stone-400">
          {new Date(review.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="text-stone-600 text-sm leading-relaxed mb-4">
        "{review.content}"
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {review.context_tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              highlightTag === tag
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-stone-50 text-stone-500 border border-stone-100'
            }`}
          >
            <Tag size={10} /> {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
