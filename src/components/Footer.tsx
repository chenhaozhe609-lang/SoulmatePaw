import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-stone-50 py-12 border-t border-stone-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4 text-center">
        <p className="text-muted text-sm font-medium">
          Made with <Heart size={16} className="inline text-secondary mx-1 fill-current" /> for pets worldwide.
        </p>
      </div>
    </footer>
  );
}
