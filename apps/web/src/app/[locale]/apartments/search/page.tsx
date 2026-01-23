'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApartmentSearchForm } from '@/components/search/ApartmentSearchForm';
import { ApartmentCard } from '@/components/apartments/ApartmentCard';
import { Loader2 } from 'lucide-react';

export default function ApartmentSearchPage({ params: { locale } }: { params: { locale: string } }) {
    const t = useTranslations('apartments');
    const commonT = useTranslations('common');
    const searchParams = useSearchParams();

    const [apartments, setApartments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const location = searchParams.get('location') || '';

    useEffect(() => {
        const fetchApartments = async () => {
            setIsLoading(true);
            try {
                const query = new URLSearchParams(searchParams.toString());
                const res = await fetch(`/api/apartments/search?${query.toString()}`);
                const data = await res.json();
                setApartments(data.data || []);
            } catch (error) {
                console.error('Failed to fetch apartments', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApartments();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            {/* Search Header */}
            <div className="container-custom mb-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 mb-4">{t('title')}</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>
                <ApartmentSearchForm />
            </div>

            {/* Results Grid */}
            <div className="container-custom">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary-500" />
                        <p className="font-medium animate-pulse">{commonT('loading')}</p>
                    </div>
                ) : apartments.length > 0 ? (
                    <div>
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-800">
                                {apartments.length} {t('results')} {location && `à ${location}`}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {apartments.map((apt) => (
                                <ApartmentCard key={apt.id} apartment={apt} locale={locale} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">
                        <div className="text-6xl mb-6">🏡</div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{t('noResults')}</h3>
                        <p className="text-slate-500 max-w-md mx-auto">
                            Essayez de changer vos critères ou votre destination.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
