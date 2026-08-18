'use client';

import React from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4 font-inter">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Something went wrong!</h1>
        <p className="text-sm text-slate-600">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => reset()}
          className="bg-[#0A2540] hover:bg-[#07192d] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
