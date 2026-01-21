'use client';

import { HotelSearchForm } from '@/components/search/HotelSearchForm';
import { useTranslations } from 'next-intl';

export default function HotelsPage() {
    const t = useTranslations('hotels');

    return (
        <div className="min-h-screen bg-gradient-hero">
            <div className="container-custom py-12 md:py-20">
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-3">
                        🏨 {t('title')}
                    </h1>
                    <p className="text-slate-600">
                        Trouvez l'hébergement idéal pour votre séjour
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <div className="search-box">
                        <HotelSearchForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
