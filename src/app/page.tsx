'use client';

import { motion, Variants } from 'framer-motion';
import { Heart, Brain, ArrowRight, Home, Dog, Cat, Sparkles, CheckCircle, HelpCircle, ChevronDown, Users, MessageCircleHeart, BookOpen, DollarSign } from 'lucide-react';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const { setSelectedCategory, resetSession } = useQuiz();
  const router = useRouter();

  const handleStartQuiz = (category?: string) => {
    resetSession();
    if (category) {
      setSelectedCategory(category);
    }
    router.push('/match');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-main">
        {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-3">
          <div className="bg-secondary text-white p-3 rounded-2xl shadow-sm">
            <Heart size={24} fill="currentColor" className="text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight font-heading">PetMatch</span>
        </div>
        <div className="flex items-center gap-6">
          <Link 
            href="/tools/name-generator"
            className="hidden md:inline-flex items-center bg-stone-100 text-stone-600 hover:bg-stone-200 px-5 py-2 rounded-full font-bold transition-colors"
          >
            Naming
          </Link>
          <Link 
            href="/animunity"
            className="hidden md:inline-flex items-center bg-blue-50 text-blue-500 hover:bg-blue-100 px-5 py-2 rounded-full font-bold transition-colors"
          >
            Community
          </Link>
          <button 
            onClick={() => handleStartQuiz()}
            className="hidden md:inline-flex items-center bg-primary/10 text-primary hover:bg-primary/20 px-5 py-2 rounded-full font-bold transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 pt-10 pb-20 relative overflow-hidden">
        
        {/* Soft Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FDFCF8] to-[#F0F4F2] -z-10"></div>

        {/* Decorative Blob */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] -z-10"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto relative z-10"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight leading-[1.1] font-heading"
          >
            Meet the pet who <br/>
            <span className="text-primary">truly gets you.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Stop guessing. Let our AI & Psychology model find a companion tailored to your personality and lifestyle.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-8">
            {/* Main CTA */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              onClick={() => handleStartQuiz()}
              className="group inline-flex items-center justify-center gap-3 bg-secondary text-white text-xl font-bold py-6 px-16 rounded-full hover:bg-[#D9A588] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              Start Soulmate Quiz ✨
            </motion.button>

            {/* Direct Browse Pills */}
            <div className="mt-8">
              <p className="text-stone-400 text-sm font-medium mb-4 uppercase tracking-wider">Or browse directly by species:</p>
              <div className="flex flex-wrap justify-center gap-4">
                {/* Dog Pill */}
                <button
                  onClick={() => handleStartQuiz('Dog')}
                  className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-stone-200 hover:border-secondary hover:bg-white transition-all hover:scale-105 shadow-sm text-stone-700 font-bold group"
                >
                  <span className="text-xl">🐶</span>
                  Dog Breeds
                  <ArrowRight size={14} className="text-stone-400 group-hover:text-secondary -ml-1 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </button>

                {/* Cat Pill */}
                <button
                  onClick={() => handleStartQuiz('Cat')}
                  className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-stone-200 hover:border-primary hover:bg-white transition-all hover:scale-105 shadow-sm text-stone-700 font-bold group"
                >
                  <span className="text-xl">🐱</span>
                  Cat Breeds
                  <ArrowRight size={14} className="text-stone-400 group-hover:text-primary -ml-1 opacity-0 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Explore Tools Section (3 Columns) */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-7xl mx-auto px-4 py-24"
        >
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             
             {/* Card 1: Animunity */}
             <Link href="/animunity" className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                   <MessageCircleHeart size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading mb-3">Animunity</h3>
                <p className="text-muted text-sm mb-6 leading-relaxed">Join the Conversation. Share stories with a supportive community.</p>
                <div className="mt-auto text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                   Explore <ArrowRight size={16} />
                </div>
             </Link>

             {/* Card 2: Name Generator */}
             <Link href="/tools/name-generator" className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-secondary/10 rounded-full text-secondary group-hover:scale-110 transition-transform">
                   <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading mb-3">Name Generator</h3>
                <p className="text-muted text-sm mb-6 leading-relaxed">Find the Perfect Name. AI-inspired ideas for your new friend.</p>
                <div className="mt-auto text-secondary font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                   Explore <ArrowRight size={16} />
                </div>
             </Link>

             {/* Card 3: Breed Reviews */}
             <Link href="/breeds" className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-blue-50 rounded-full text-blue-500 group-hover:scale-110 transition-transform">
                   <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading mb-3">Breed Guides</h3>
                <p className="text-muted text-sm mb-6 leading-relaxed">Expert Insights. Deep dive into personality & care needs.</p>
                <div className="mt-auto text-blue-600 font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                   Explore <ArrowRight size={16} />
                </div>
             </Link>

             {/* Card 4: Cost Calculator */}
             <Link href="/tools/cost-calculator" className="group relative bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-primary/10 rounded-full text-primary group-hover:scale-110 transition-transform">
                   <DollarSign size={32} />
                </div>
                <h3 className="text-xl font-bold text-foreground font-heading mb-3">Cost Calculator</h3>
                <p className="text-muted text-sm mb-6 leading-relaxed">Plan your budget. Estimate the true cost of ownership.</p>
                <div className="mt-auto text-primary font-bold flex items-center gap-2 group-hover:gap-3 transition-all text-sm">
                   Explore <ArrowRight size={16} />
                </div>
             </Link>

           </div>
        </motion.section>

        {/* Section 1: How it Works */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 max-w-6xl mx-auto px-4 w-full"
        >
          <div className="text-center mb-16">
             <span className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-4 inline-block">Process</span>
             <h2 className="text-3xl md:text-5xl font-extrabold text-foreground font-heading">Finding your soulmate is science, not luck.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-stone-50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-blue-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-blue-500 mb-6 mx-auto">
                <Brain size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">The Psychology</h3>
              <p className="text-muted leading-relaxed">We analyze your Big 5 Personality traits to understand your emotional needs.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-stone-50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-green-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary mb-6 mx-auto">
                <Home size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">The Lifestyle</h3>
              <p className="text-muted leading-relaxed">We cross-reference your budget, space, and free time with 50+ breeds.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-stone-50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-orange-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-secondary mb-6 mx-auto">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">The Match</h3>
              <p className="text-muted leading-relaxed">Our AI algorithm finds the pet that fits your soul and your life.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Why Choose SoulmatePaw? */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 w-full bg-[#E8EFE9] py-24 px-6 rounded-[3rem]"
        >
           <div className="max-w-4xl mx-auto text-center">
             <span className="bg-white text-primary font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">Our Mission</span>
             <h2 className="text-3xl md:text-5xl font-extrabold text-foreground font-heading mb-8">More than just a cute face.</h2>
             <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light mb-10">
               We don't just recommend popular breeds. We find compatible companions. 
               Too many pets are returned because of lifestyle mismatches. 
               <br/><br/>
               <span className="font-bold text-primary">Stop rehoming pets. Start finding the one that stays.</span>
             </p>
             <div className="flex flex-col md:flex-row justify-center gap-6 text-left">
                <div className="flex items-center gap-3 bg-white/60 p-4 rounded-xl">
                  <CheckCircle className="text-primary" /> <span>Science-backed matching</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 p-4 rounded-xl">
                  <CheckCircle className="text-primary" /> <span>Focus on long-term happiness</span>
                </div>
             </div>
           </div>
        </motion.section>

        {/* Section 3: FAQ */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 max-w-4xl mx-auto px-6 w-full mb-20"
        >
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-extrabold text-foreground font-heading mb-4">Frequently Asked Questions</h2>
             <p className="text-muted">Everything you need to know about finding your pet soulmate.</p>
          </div>

          <div className="space-y-4">
             {/* FAQ Item 1 */}
             <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group">
               <details className="group p-6 cursor-pointer">
                 <summary className="flex justify-between items-center font-bold text-lg text-foreground list-none">
                   Is this personality test accurate?
                   <ChevronDown className="text-muted group-open:rotate-180 transition-transform" />
                 </summary>
                 <p className="text-muted mt-4 leading-relaxed">
                   Yes! Our quiz is based on the OCEAN (Big 5) psychological model, which is widely used in psychology to understand personality traits. We map these traits to breed characteristics for a scientifically grounded match.
                 </p>
               </details>
             </div>

             {/* FAQ Item 2 */}
             <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group">
               <details className="group p-6 cursor-pointer">
                 <summary className="flex justify-between items-center font-bold text-lg text-foreground list-none">
                   I live in a small apartment, can I get a dog?
                   <ChevronDown className="text-muted group-open:rotate-180 transition-transform" />
                 </summary>
                 <p className="text-muted mt-4 leading-relaxed">
                   Yes! We filter specifically for apartment-friendly breeds that thrive in smaller spaces. Size isn't the only factor—energy level matters too. We'll find you a low-energy or adaptable companion.
                 </p>
               </details>
             </div>

             {/* FAQ Item 3 */}
             <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group">
               <details className="group p-6 cursor-pointer">
                 <summary className="flex justify-between items-center font-bold text-lg text-foreground list-none">
                   Do you support adoption?
                   <ChevronDown className="text-muted group-open:rotate-180 transition-transform" />
                 </summary>
                 <p className="text-muted mt-4 leading-relaxed">
                   Absolutely. We encourage checking local shelters for your matched breed or similar mixes. Many purebreds and specific mixes are waiting for homes in rescues right now.
                 </p>
               </details>
             </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
