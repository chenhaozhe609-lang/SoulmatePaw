'use client';

import React, { useState, useRef } from 'react';
import { createPost } from '@/actions/create-post';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Image as ImageIcon, ShieldCheck, AlertCircle, Loader2, Edit3, TrendingUp, Camera, Stethoscope, GraduationCap, Utensils, Share2, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getPosts, getTrendingPosts, Post } from '@/lib/api/posts';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function AnimunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Partial<Post>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') as 'latest' | 'oldest' || 'latest';
  const topic = searchParams.get('topic') || undefined;

  // Fetch Data
  React.useEffect(() => {
    const fetchData = async () => {
      const [postsData, trendingData] = await Promise.all([
        getPosts(sort, topic),
        getTrendingPosts()
      ]);
      setPosts(postsData);
      setTrendingPosts(trendingData);
    };
    fetchData();

    // Subscribe to realtime changes (Simplified: Refresh on new post)
    const channel = supabase
      .channel('public:posts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, (payload) => {
        // If the new post matches current filter, prepend it (or refetch)
        // For simplicity, we'll just refetch to respect sort/filter
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sort, topic]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await createPost(formData);
      formRef.current?.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] pb-20">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        
        {/* Header (Mobile Only) */}
        <div className="lg:hidden flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight flex items-center gap-2 font-heading">
            Animunity <span className="text-sm bg-secondary text-white px-2 py-1 rounded-full font-sans font-medium">Beta</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Main Feed (Left Column) */}
          <div className="lg:col-span-3">
             
             {/* Desktop Header & Sort */}
             <div className="hidden lg:flex items-center justify-between mb-8">
                <div>
                   <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-4 transition-colors font-medium">
                      <ArrowLeft size={16} /> Back to Home
                   </Link>
                   <h1 className="text-4xl font-extrabold text-stone-800 tracking-tight flex items-center gap-3 font-heading">
                     Animunity 
                     <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-sans font-bold uppercase tracking-wider">Beta</span>
                   </h1>
                   <p className="text-stone-500 mt-2 text-lg">A safe space for pet lovers to share and support.</p>
                </div>
                <div className="flex items-center gap-4 text-stone-400 font-bold text-sm">
                   <Link 
                     href="?sort=latest" 
                     className={`${sort === 'latest' ? 'text-stone-800' : 'hover:text-stone-800'} transition-colors`}
                   >
                     Newest
                   </Link>
                   <span className="text-stone-300">|</span>
                   <Link 
                     href="?sort=oldest" 
                     className={`${sort === 'oldest' ? 'text-stone-800' : 'hover:text-stone-800'} transition-colors`}
                   >
                     Oldest
                   </Link>
                </div>
             </div>

            {/* Composer */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-50">
                 <div className="flex items-center gap-2 text-sm font-bold text-stone-400 uppercase tracking-wider">
                    <ShieldCheck size={14} className="text-green-500" /> AI Moderated Safe Space
                 </div>
              </div>
              <form ref={formRef} action={handleSubmit}>
                <textarea
                  name="content"
                  placeholder="Share your pet's moment..."
                  className="w-full text-lg border-none focus:ring-0 resize-none placeholder:text-stone-300 min-h-[100px]"
                  required
                />
                
                {/* Image URL Input (Simplified for demo) */}
                <input 
                  type="text" 
                  name="image_url" 
                  placeholder="Paste an image URL (optional)" 
                  className="w-full text-sm bg-stone-50 p-2 rounded-lg mb-4 border border-stone-100 focus:outline-none focus:border-secondary/50"
                />

                <div className="flex items-center justify-between pt-4 border-t border-stone-50">
                  <button type="button" className="text-stone-400 hover:text-secondary transition-colors p-2 rounded-full hover:bg-stone-50">
                    <ImageIcon size={20} />
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-stone-800 hover:bg-black text-white px-6 py-2 rounded-full font-bold transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Checking...
                      </>
                    ) : (
                      <>
                        Post <Send size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              {/* Error Toast */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 right-4 left-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-medium"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Feed */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-20 text-stone-400 bg-white rounded-3xl border border-dashed border-stone-200">
                  <p className="text-lg font-bold">No posts yet.</p>
                  <p className="text-sm">Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 hover:border-stone-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center text-stone-500 font-bold text-lg">
                        {post.user_name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-stone-800 text-base">{post.user_name}</h3>
                          {post.is_official && (
                            <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                              <ShieldCheck size={10} /> Official
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-400 font-medium">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <p className="text-stone-700 leading-relaxed mb-4 whitespace-pre-wrap text-[15px]">
                      {post.content}
                    </p>

                    {post.image_url && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-stone-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={post.image_url} 
                          alt="Post content" 
                          className="w-full h-auto object-cover max-h-96"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-6 text-stone-400 pt-4 border-t border-stone-50">
                      <LikeButton count={post.likes_count} />
                      <button className="flex items-center gap-2 hover:text-stone-600 transition-colors">
                        <MessageCircle size={18} />
                        <span className="text-sm font-bold">Comment</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-stone-600 transition-colors ml-auto">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="hidden lg:block lg:col-span-1 space-y-6">
             
             {/* Primary Action */}
             <button className="w-full bg-secondary text-white text-lg font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#7A9187] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                <Edit3 size={20} /> New Post
             </button>

             {/* Categories */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-bold text-stone-800 mb-4 text-sm uppercase tracking-wider">Explore Topics</h3>
                <ul className="space-y-2">
                   <CategoryItem href="?topic=Nutrition" icon={<Utensils size={18} />} label="Nutrition & Diet" color="text-orange-500" bg="bg-orange-50" active={topic === 'Nutrition'} />
                   <CategoryItem href="?topic=Health" icon={<Stethoscope size={18} />} label="Health Advice" color="text-red-500" bg="bg-red-50" active={topic === 'Health'} />
                   <CategoryItem href="?topic=Showcase" icon={<Camera size={18} />} label="Cute Photos" color="text-purple-500" bg="bg-purple-50" active={topic === 'Showcase'} />
                   <CategoryItem href="?topic=Help" icon={<GraduationCap size={18} />} label="Training Tips" color="text-blue-500" bg="bg-blue-50" active={topic === 'Help'} />
                   {topic && (
                      <li className="pt-2">
                         <Link href="/animunity" className="text-xs text-stone-400 hover:text-stone-600 font-bold flex items-center justify-center">
                            Clear Filter
                         </Link>
                      </li>
                   )}
                </ul>
             </div>

             {/* Trending */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <h3 className="font-bold text-stone-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
                   <TrendingUp size={16} /> Hot this week
                </h3>
                <ul className="space-y-4">
                   {trendingPosts.length === 0 ? (
                      <p className="text-xs text-stone-400">No trending topics yet.</p>
                   ) : (
                      trendingPosts.map((post) => (
                         <TrendingItem key={post.id} title={post.content?.slice(0, 40) + '...'} count={`${post.likes_count} likes`} />
                      ))
                   )}
                </ul>
             </div>

             {/* Footer Links */}
             <div className="text-xs text-stone-400 text-center leading-loose">
                <p>© 2024 Animunity • Guidelines • Privacy</p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Sub-components
function LikeButton({ count }: { count: number }) {
   const [liked, setLiked] = useState(false);
   const [localCount, setLocalCount] = useState(count);

   const handleLike = () => {
      if (liked) {
         setLocalCount(c => c - 1);
      } else {
         setLocalCount(c => c + 1);
      }
      setLiked(!liked);
   };

   return (
      <button 
         onClick={handleLike}
         className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'hover:text-red-500'}`}
      >
         <Heart size={18} fill={liked ? "currentColor" : "none"} className={liked ? "scale-110 transition-transform" : ""} />
         <span className="text-sm font-bold">{localCount}</span>
      </button>
   );
}

function CategoryItem({ icon, label, color, bg, href, active }: { icon: React.ReactNode, label: string, color: string, bg: string, href: string, active?: boolean }) {
   return (
      <li>
         <Link 
            href={href}
            className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors group ${active ? 'bg-stone-100 ring-1 ring-stone-200' : 'hover:bg-stone-50'}`}
         >
            <div className={`w-8 h-8 rounded-lg ${bg} ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
               {icon}
            </div>
            <span className={`font-bold text-sm group-hover:text-stone-900 ${active ? 'text-stone-900' : 'text-stone-600'}`}>{label}</span>
         </Link>
      </li>
   );
}

function TrendingItem({ title, count }: { title: string, count: string }) {
   return (
      <li className="cursor-pointer group">
         <h4 className="font-bold text-stone-700 text-sm group-hover:text-secondary transition-colors line-clamp-1">{title}</h4>
         <p className="text-xs text-stone-400 mt-1">{count}</p>
      </li>
   );
}
