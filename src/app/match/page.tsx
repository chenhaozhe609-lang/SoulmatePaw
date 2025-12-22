import ClientWrapper from '@/components/ClientWrapper';
import { personalityQuestions } from '@/data/questions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MatchPage() {
  const questions = personalityQuestions;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 transition-colors font-medium">
             <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Find Your Perfect Pet Match
          </h1>
          <p className="text-lg text-gray-600">
            Let's get to know you first. Answer a few quick questions!
          </p>
        </header>

        <ClientWrapper questions={questions} />
      </div>
    </main>
  );
}
