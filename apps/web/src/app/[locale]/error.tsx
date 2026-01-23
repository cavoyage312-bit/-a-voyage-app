'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations('common');

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('error')}</h2>
            <p className="text-slate-600 mb-6 max-w-md">
                {error.message || 'Something went wrong!'}
            </p>
            <button
                onClick={reset}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
                {t('tryAgain')}
            </button>
        </div>
    );
}
