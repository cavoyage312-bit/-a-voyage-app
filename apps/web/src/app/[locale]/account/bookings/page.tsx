'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Plane, Hotel, Car, Train, Calendar, Clock, MapPin, QrCode, Download, ExternalLink, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function BookingsPage() {
    const params = useParams();
    const locale = params.locale as string;
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [dbBookings, setDbBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Données mockées (Fallback)
    const mockBookings = [
        {
            id: 'BJK-8901',
            type: 'flight',
            status: 'confirmed',
            date: '2024-04-12',
            title: 'Vol Paris - Dakar (Exemple)',
            details: 'Air France • AF718',
            departure: '10:00 CDG',
            arrival: '14:45 DSS',
            price: '450.00 €'
        },
        {
            id: 'TKT-9988',
            type: 'transit',
            status: 'active',
            date: 'Aujourd\'hui',
            title: 'Ticket Métro Paris (Exemple)',
            details: 'Zone 1-2 • Valable 1h',
            code: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TicketValide',
            price: '2.10 €'
        }
    ];

    useEffect(() => {
        async function fetchBookings() {
            const supabase = createClient();
            try {
                // On récupère toutes les réservations, triées par date
                const { data, error } = await supabase
                    .from('bookings')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                // Transformation des données DB pour l'affichage
                const transformed = (data || []).map(b => {
                    const details = b.details || {};
                    let title = 'Réservation';
                    let desc = '';

                    // Adapter l'affichage selon le type
                    if (b.type === 'flight') {
                        title = `Vol ${details.origin || ''} - ${details.destination || ''}`;
                        desc = `${details.company || 'Compagnie'} • ${b.status}`;
                    } else if (b.type === 'transit') {
                        title = 'Ticket Transport';
                        desc = 'Ticket unitaire';
                    }

                    return {
                        id: b.id.substring(0, 8),
                        type: b.type,
                        status: b.status,
                        date: new Date(b.created_at).toLocaleDateString(),
                        title: title,
                        details: desc,
                        price: `${b.price_amount} ${b.price_currency}`,
                        // Champs spécifiques Flights
                        departure: details.origin,
                        arrival: details.destination
                    };
                });

                setDbBookings(transformed);
            } catch (e) {
                console.error('Erreur fetch bookings:', e);
                // On laisse vide, les mocks s'afficheront s'il n'y a rien
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, []);

    // Combiner Mock + DB (pour la démo, on montre les mock si DB vide, ou les deux)
    const displayBookings = [...dbBookings, ...mockBookings];

    const downloadTicket = (booking: any) => {
        const content = `
==========================================
        ÇA VOYAGE - E-BILLET OFFICIEL
==========================================
RÉFÉRENCE : ${booking.id}
STATUT    : ${booking.status.toUpperCase()}
DATE      : ${booking.date}
TYPE      : ${booking.type.toUpperCase()}
------------------------------------------
ARTICLES  : ${booking.title}
DÉTAILS   : ${booking.details}
PRIX      : ${booking.price}
------------------------------------------
Merci d'avoir choisi ÇA VOYAGE. 
Ce document sert de preuve de réservation.
==========================================
    `;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ETicket_${booking.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-custom max-w-5xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display text-slate-900">Mes Voyages</h1>
                        <p className="text-slate-500">Gérez vos réservations et tickets</p>
                    </div>
                    <div className="bg-white p-1 rounded-xl border border-slate-200 inline-flex">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'upcoming' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            À venir ({displayBookings.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'past' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Passés (0)
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary-500 mb-2" />
                        <p className="text-slate-400">Chargement de vos voyages...</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {displayBookings.map((booking, index) => (
                            <motion.div
                                key={`${booking.id}-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row">
                                    {/* Status Bar / Type Icon */}
                                    <div className={`w-full md:w-24 p-4 flex items-center justify-center md:flex-col gap-2 ${booking.type === 'flight' ? 'bg-blue-50 text-blue-600' :
                                        booking.type === 'hotel' ? 'bg-emerald-50 text-emerald-600' :
                                            booking.type === 'transit' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100'
                                        }`}>
                                        {booking.type === 'flight' && <Plane className="w-8 h-8" />}
                                        {booking.type === 'hotel' && <Hotel className="w-8 h-8" />}
                                        {booking.type === 'transit' && <Train className="w-8 h-8" />}
                                        <span className="text-xs font-bold uppercase tracking-wider">{booking.type}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-slate-900">{booking.title}</h3>
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                                                    {booking.status === 'confirmed' ? 'Confirmé' : 'Actif'}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 flex items-center gap-2 mb-4">
                                                {booking.type === 'flight' ? (
                                                    <>
                                                        <span>{booking.departure}</span>
                                                        <span className="text-slate-300">➜</span>
                                                        <span>{booking.arrival}</span>
                                                        <span className="text-slate-300">•</span>
                                                    </>
                                                ) : null}
                                                {booking.details}
                                            </p>

                                            <div className="flex flex-wrap gap-4 md:gap-8 border-t border-slate-100 pt-4">
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase">Prix</p>
                                                    <p className="font-bold text-slate-900">{booking.price}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-400 uppercase">Date</p>
                                                    <p className="font-semibold text-slate-900">{booking.date}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-3 min-w-[140px]">
                                            {booking.type === 'transit' ? (
                                                <button className="btn btn-primary flex items-center justify-center gap-2">
                                                    <QrCode className="w-4 h-4" />
                                                    Voir Ticket
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => downloadTicket(booking)}
                                                        className="btn btn-outline btn-sm flex items-center justify-center gap-2"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        E-Billet
                                                    </button>
                                                    <button className="text-primary-600 text-sm font-medium hover:underline flex items-center justify-center gap-1">
                                                        Modifier <ExternalLink className="w-3 h-3" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
