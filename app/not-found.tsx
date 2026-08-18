import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-4 font-inter">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
        <span className="text-4xl font-extrabold text-[#0A2540]">404</span>
        <h1 className="text-xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block bg-[#0A2540] hover:bg-[#07192d] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
