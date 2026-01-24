'use client';

import { MapPin, Star, Users, Home, Euro } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface Apartment {
    id: string;
    title: string;
    description: string;
    city: string;
    price_per_night: number;
    currency: string;
    images: string[];
    rating?: number;
    max_guests: number;
    amenities: any;
    partners?: {
        company_name: string;
    };
}

export function ApartmentCard({ apartment, locale }: { apartment: Apartment; locale: string }) {
    const t = useTranslations('apartments');
    const commonT = useTranslations('common');

    return (
        <Link
            href={`/${locale}/apartments/${apartment.id}`}
            className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100"
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={apartment.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                    alt={apartment.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge Partenaire */}
                {apartment.partners?.company_name && (
                    <div className="absolute top-3 left-3 bg-primary-600 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-lg">
                        Partenaire Local
                    </div>
                )}

                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{apartment.rating || '4.8'}</span>
                </div>
            </div>

            <div className="p-4">
                <div className="flex flex-col gap-1 mb-3">
                    <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-1 leading-tight">
                        {apartment.title}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
                        <MapPin className="w-3 h-3 text-primary-500" />
                        <span>{apartment.city} • {apartment.partners?.company_name || 'Hébergeur Privé'}</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 px-3 py-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{apartment.max_guests} Guests</span>
                    </div>
                    <div className="w-px h-3 bg-slate-200" />
                    <div className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5" />
                        <span>Entire Home</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500">{commonT('from')}</span>
                        <div className="flex items-baseline gap-1">
                            <span className="font-black text-xl text-primary-700">
                                {apartment.price_per_night}€
                            </span>
                            <span className="text-xs text-slate-400">{commonT('perNight')}</span>
                        </div>
                    </div>

                    <span className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-bold text-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                        {t('details')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
