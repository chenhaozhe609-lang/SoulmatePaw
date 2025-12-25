'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BentoCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  href: string;
  className?: string;
  background?: ReactNode;
  cta?: string;
}

export function BentoCard({
  title,
  description,
  icon,
  href,
  className,
  background,
  cta = "Explore",
}: BentoCardProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl",
        "bg-white/60 backdrop-blur-md border border-white/50 shadow-sm hover:shadow-xl",
        "transition-all duration-300",
        className
      )}
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 opacity-50 group-hover:opacity-70 transition-opacity duration-500">
        {background}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full p-6 sm:p-8 pointer-events-none">
        <div className="flex items-start justify-between mb-4">
          {icon && (
            <div className="p-3 bg-white/80 rounded-2xl text-foreground backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground font-heading mb-2 transition-colors">
            {title}
          </h3>
          <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 max-w-[90%] font-medium">
            {description}
          </p>
          
          <div className="flex items-center gap-2 text-foreground font-bold text-sm sm:text-base group-hover:gap-3 transition-all duration-300">
            <span className="bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">{cta}</span>
            <ArrowRight size={16} className="text-primary group-hover:text-secondary transition-colors" />
          </div>
        </div>
      </div>

      {/* Clickable Link Overlay */}
      <Link href={href} className="absolute inset-0 z-20" aria-label={`Go to ${title}`} />
    </motion.div>
  );
}
