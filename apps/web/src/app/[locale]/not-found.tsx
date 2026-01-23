import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h2 className="text-4xl font-black mb-4">404</h2>
            <p className="text-xl text-slate-600 mb-8">Page Not Found</p>
            <Link
                href="/"
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
                Go Home
            </Link>
        </div>
    );
}
