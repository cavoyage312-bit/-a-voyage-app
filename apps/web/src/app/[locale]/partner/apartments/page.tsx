'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Plus, Home, Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';

export default function PartnerApartmentsPage({ params: { locale } }: { params: { locale: string } }) {
    const t = useTranslations('apartments'); // Ensure translates are available
    const [apartments, setApartments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchApartments = async () => {
            // For demo purposes, fetch all. In real app, filter by partner_id (auth.uid())
            const { data, error } = await supabase
                .from('apartments')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setApartments(data);
            setIsLoading(false);
        };

        fetchApartments();
    }, []);

    return (
        <div className="container-custom py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Mes Appartements</h1>
                    <p className="text-slate-600">Gérez vos annonces et réservations</p>
                </div>
                <Link
                    href={`/${locale}/partner/apartments/new`}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un logement
                </Link>
            </div>

            {isLoading ? (
                <div className="text-center py-20 text-slate-400">Chargement...</div>
            ) : apartments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apartments.map((apt) => (
                        <div key={apt.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
                            <div className="relative aspect-video bg-slate-100">
                                {apt.images && apt.images[0] ? (
                                    <Image src={apt.images[0]} alt={apt.title} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-300">
                                        <Home className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur rounded-lg text-xs font-bold shadow-sm">
                                    {apt.price_per_night}€ / nuit
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg text-slate-900 mb-1 truncate">{apt.title}</h3>
                                <p className="text-slate-500 text-sm mb-4 truncate">{apt.city}</p>

                                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                                    <button className="flex-1 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        <Edit className="w-4 h-4" />
                                        Modifier
                                    </button>
                                    <button className="flex-1 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Home className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun appartement</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        Vous n'avez pas encore publié d'annonce. Commencez à gagner de l'argent dès maintenant.
                    </p>
                    <Link
                        href={`/${locale}/partner/apartments/new`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-primary-500 hover:text-primary-600 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Créer ma première annonce
                    </Link>
                </div>
            )}
        </div>
    );
}
