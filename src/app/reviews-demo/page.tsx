import ContextualReviews from '@/components/reviews/ContextualReviews';

export default function ReviewsDemoPage() {
  return (
    <div className="min-h-screen bg-stone-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Contextual Reviews Demo</h1>
          <p className="text-stone-500">
            Previewing reviews for: <strong>Golden Retriever</strong>
          </p>
        </div>
        
        <ContextualReviews breed="Golden Retriever" />
      </div>
    </div>
  );
}
