"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Search Results</h1>
      {query ? (
        <p className="mt-4 text-lg">Results for: <span className="font-semibold">{query}</span></p>
      ) : (
        <p className="mt-4 text-lg">No search query provided.</p>
      )}
    </div>
  );
}
