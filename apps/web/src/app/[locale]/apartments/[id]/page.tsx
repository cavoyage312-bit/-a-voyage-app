import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPin, Star, Users, Home, Check, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase';

// Mock function to get apartment details (Now using DB fetch)
async function getApartment(id: string) {
    const supabase = createSupabaseServerClient(cookies());

    try {
        const { data, error } = await supabase
            .from('apartments')
            .select(`
                *,
                partners:partner_id (
                    company_name,
                    contact_name,
                    details
                )
            `)
            .eq('id', id)
            .single();

        if (error || !data) return null;

        // Map DB structure to frontend expectations if needed
        return {
            ...data,
            rating: 4.8, // Default rating if not in DB
            review_count: 12,
            host: {
                name: data.partners?.company_name || 'Hôte Local',
                joined: '2023',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
            }
        };
    } catch (e) {
        return null;
    }
}

export default async function ApartmentDetailsPage({ params: { locale, id } }: { params: { locale: string, id: string } }) {
    const t = useTranslations('apartments'); // Ensure you have translations or use 'common'
    const commonT = useTranslations('common');

    // In a real app, this would be a DB call
    const apartment = await getApartment(id);

    if (!apartment) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Hero Gallery */}
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <Image
                    src={apartment.images[0]}
                    alt={apartment.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 z-10">
                    <Link
                        href={`/${locale}/apartments/search`}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all font-bold text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {commonT('back')}
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12 text-white container-custom">
                    <h1 className="text-3xl md:text-5xl font-black mb-2 shadow-sm">{apartment.title}</h1>
                    <div className="flex items-center gap-4 text-sm md:text-lg font-medium">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-5 h-5 text-primary-400" />
                            <span>{apartment.address}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                            <span>{apartment.rating} ({apartment.review_count} {commonT('reviews')})</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-8">
                    {/* Host Info */}
                    <div className="flex items-center justify-between py-6 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <Image
                                src={apartment.host.avatar}
                                alt={apartment.host.name}
                                width={56}
                                height={56}
                                className="rounded-full border-2 border-slate-100"
                            />
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Hébergé par {apartment.host.name}</h3>
                                <p className="text-slate-500 text-sm">Membre depuis {apartment.host.joined}</p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="py-8 border-b border-slate-100">
                        <div className="flex gap-6 text-sm font-medium text-slate-700">
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                                <Users className="w-5 h-5 text-primary-600" />
                                <span>{apartment.max_guests} voyageurs</span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                                <Home className="w-5 h-5 text-primary-600" />
                                <span>Logement entier</span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="py-8 border-b border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">À propos de ce logement</h2>
                        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {apartment.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="py-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Ce que propose ce logement</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.isArray(apartment.amenities) ? (
                                apartment.amenities.map((item: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-700">
                                        <Check className="w-5 h-5 text-primary-600" />
                                        <span>{item}</span>
                                    </div>
                                ))
                            ) : (
                                Object.entries(apartment.amenities || {}).map(([key, value], idx) => (
                                    value && (
                                        <div key={idx} className="flex items-center gap-3 text-slate-700">
                                            <Check className="w-5 h-5 text-primary-600" />
                                            <span className="capitalize">{key}</span>
                                        </div>
                                    )
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-primary-700">{apartment.price_per_night}€</span>
                                <span className="text-slate-500 text-sm font-medium">/ nuit</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-bold text-slate-700">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span>{apartment.rating}</span>
                            </div>
                        </div>

                        {/* Date Picker Placeholder */}
                        <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden">
                            <div className="grid grid-cols-2 border-b border-slate-200">
                                <div className="p-3 border-r border-slate-200">
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Arrivée</label>
                                    <input type="date" className="w-full text-sm font-bold outline-none cursor-pointer text-slate-900" />
                                </div>
                                <div className="p-3">
                                    <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Départ</label>
                                    <input type="date" className="w-full text-sm font-bold outline-none cursor-pointer text-slate-900" />
                                </div>
                            </div>
                            <div className="p-3">
                                <label className="block text-[10px] font-black uppercase text-slate-400 mb-1 tracking-wider">Voyageurs</label>
                                <select className="w-full text-sm font-bold outline-none cursor-pointer bg-white text-slate-900">
                                    {Array.from({ length: apartment.max_guests || 1 }).map((_, i) => (
                                        <option key={i}>{i + 1} voyageur{i > 0 ? 's' : ''}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Link
                            href={`/${locale}/apartments/book?id=${apartment.id}`}
                            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Calendar className="w-5 h-5" />
                            Réserver maintenant
                        </Link>

                        <div className="mt-4 text-center">
                            <p className="text-xs text-slate-400">Aucun montant ne sera débité pour le moment</p>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-slate-100">
                            <div className="flex justify-between text-slate-600">
                                <span className="underline">{apartment.price_per_night}€ x 5 nuits</span>
                                <span>{(apartment.price_per_night * 5).toFixed(0)}€</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span className="underline">Frais de ménage</span>
                                <span>45€</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span className="underline">Frais de service</span>
                                <span>65€</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900 text-lg pt-4 border-t border-slate-100 mt-2">
                                <span>Total</span>
                                <span>{(apartment.price_per_night * 5 + 45 + 65).toFixed(0)}€</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
