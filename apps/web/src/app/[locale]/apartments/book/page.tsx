'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import {
    Calendar,
    CreditCard,
    Shield,
    CheckCircle2,
    ArrowLeft,
    Home,
    MapPin,
    Users,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

function ApartmentBookingContent() {
    const t = useTranslations('booking');
    const aptT = useTranslations('apartments');
    const searchParams = useSearchParams();
    const params = useParams();
    const router = useRouter();
    const locale = params.locale as string;
    const apartmentId = searchParams.get('id');

    const [apartment, setApartment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: '',
    });

    useEffect(() => {
        const fetchApartment = async () => {
            if (!apartmentId) return;
            const supabase = createClient();
            const { data, error } = await supabase
                .from('apartments')
                .select('*')
                .eq('id', apartmentId)
                .single();

            if (data) setApartment(data);
            setLoading(false);
        };
        fetchApartment();
    }, [apartmentId]);

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingLoading(true);

        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                    type: 'apartment',
                    status: 'confirmed',
                    email: formData.email,
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    price_amount: apartment.price_per_night * 5, // Mock 5 nights
                    price_currency: 'EUR',
                    details: {
                        apartmentId: apartment.id,
                        title: apartment.title,
                        city: apartment.city,
                        address: apartment.address,
                        nights: 5
                    }
                })
            });

            if (!res.ok) throw new Error('Booking failed');
            setStep(3);
        } catch (err) {
            alert('Une erreur est survenue lors de la réservation.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Récupération des détails du logement...</p>
        </div>
    );

    if (!apartment) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
            <Home className="w-16 h-16 text-slate-300 mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Logement introuvable</h1>
            <Link href={`/${locale}/apartments/search`} className="btn btn-primary mt-4">
                Retour à la recherche
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="container-custom max-w-5xl">
                {/* Stepper */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                        <div className={`h-1 w-16 rounded transition-colors ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                        <div className={`h-1 w-16 rounded transition-colors ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Form Column */}
                    <div className="lg:col-span-7">
                        {step === 1 && (
                            <form onSubmit={handleNext} className="card p-8 space-y-6">
                                <h2 className="text-2xl font-black text-slate-900 mb-6">Informations Voyageur</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Prénom</label>
                                        <input
                                            type="text" required className="input"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Nom</label>
                                        <input
                                            type="text" required className="input"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email" required className="input"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg w-full mt-4">
                                    Continuer vers le paiement
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form onSubmit={handlePayment} className="card p-8 space-y-6">
                                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <CreditCard className="w-6 h-6 text-primary-600" />
                                    Paiement Sécurisé
                                </h2>
                                <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Numéro de carte</label>
                                        <input type="text" placeholder="XXXX XXXX XXXX XXXX" className="input" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Expiration</label>
                                            <input type="text" placeholder="MM/AA" className="input" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">CVV</label>
                                            <input type="text" placeholder="***" className="input" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <Shield className="w-4 h-4 text-green-500" />
                                    Vos données sont cryptées et sécurisées.
                                </div>
                                <button type="submit" disabled={bookingLoading} className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2">
                                    {bookingLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                                    Confirmer la réservation - {apartment.price_per_night * 5}€
                                </button>
                                <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 font-bold hover:text-slate-700 transition-colors">
                                    Retour
                                </button>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="card p-12 text-center space-y-6">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900">Réservation Confirmée !</h2>
                                <p className="text-slate-600">
                                    Votre séjour à <strong>{apartment.title}</strong> est maintenant réservé.
                                    Vous allez recevoir un email de confirmation sous peu.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                    <Link href={`/${locale}/profile/bookings`} className="btn btn-primary flex-1">
                                        Voir mes voyages
                                    </Link>
                                    <Link href={`/${locale}`} className="btn btn-outline flex-1">
                                        Retour à l'accueil
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Column */}
                    <div className="lg:col-span-5">
                        <div className="card overflow-hidden sticky top-32">
                            <div className="relative h-48">
                                <Image
                                    src={apartment.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'}
                                    alt={apartment.title} fill className="object-cover"
                                />
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">{apartment.title}</h3>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{apartment.city}, {apartment.address}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-4 border-y border-slate-100">
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <Calendar className="w-4 h-4 text-primary-600" />
                                        <span>5 nuits</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <Users className="w-4 h-4 text-primary-600" />
                                        <span>{apartment.max_guests} Voyageurs</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Prix par nuit</span>
                                        <span>{apartment.price_per_night}€</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 text-sm">
                                        <span>Frais de service</span>
                                        <span>45€</span>
                                    </div>
                                    <div className="flex justify-between font-black text-slate-900 text-xl pt-4 mt-2 border-t border-slate-100">
                                        <span>Total</span>
                                        <span>{apartment.price_per_night * 5 + 45}€</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ApartmentBookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
        }>
            <ApartmentBookingContent />
        </Suspense>
    );
}
