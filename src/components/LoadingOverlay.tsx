'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

const MESSAGES = [
  "Reading your aura... ✨",
  "Scanning 50+ breeds... 🐶",
  "Calculating compatibility... 🧮",
  "Finalizing match... 💖"
];

export default function LoadingOverlay() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-8"
      >
        <motion.div 
           animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
           transition={{ duration: 1.5, repeat: Infinity }}
           className="absolute inset-0 rounded-full bg-primary/20"
        />
        <PawPrint size={48} className="text-primary z-10" />
      </motion.div>
      
      <div className="h-8 overflow-hidden">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-xl font-bold text-foreground font-heading text-center"
        >
          {MESSAGES[msgIndex]}
        </motion.p>
      </div>
    </div>
  );
}
