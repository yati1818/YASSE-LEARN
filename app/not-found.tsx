import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center text-slate-100 space-y-4">
      <h2 className="text-4xl font-extrabold text-cyan-400">404 - Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-sm">
        The educational page or lecture video you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/dashboard"
        className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors"
      >
        Return to YASSE Learn Dashboard
      </Link>
    </div>
  );
}
