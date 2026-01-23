import { notFound } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { MapPin, Star, Users, Home, Check, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock function to get apartment details (Simulating DB fetch)
async function getApartment(id: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo Data
    return {
        id,
        title: 'Superbe Loft Lumineux - Paris 11ème',
        description: `Profitez d'un séjour inoubliable dans ce loft spacieux et moderne situé au cœur de Paris. 
        Idéal pour les familles ou les groupes d'amis, cet appartement offre tout le confort nécessaire pour un séjour parfait.
        
        L'appartement dispose de 2 chambres, d'un grand salon lumineux, d'une cuisine entièrement équipée et d'une salle de bain moderne.
        Vous serez à proximité immédiate des meilleurs restaurants, cafés et boutiques du quartier.`,
        city: 'Paris',
        address: '12 Rue de la Roquette, 75011 Paris',
        price_per_night: 150,
        currency: 'EUR',
        rating: 4.85,
        review_count: 42,
        max_guests: 4,
        images: [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80'
        ],
        amenities: [
            'Wifi Haut Débit',
            'Cuisine Équipée',
            'Lave-linge',
            'Climatisation',
            'Espace de travail',
            'TV HD avec Netflix',
            'Machine Nespresso',
            'Draps et serviettes fournis'
        ],
        host: {
            name: 'Guillaume S.',
            joined: '2022',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
    };
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
                            {apartment.amenities.map((item: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 text-slate-700">
                                    <Check className="w-5 h-5 text-primary-600" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Booking Sidebar */}
                <div className="lg:col-span-4">
                    <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-primary-700">{apartment.price_per_night}€</span>
                                <span className="text-slate-500">/ nuit</span>
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
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Arrivée</label>
                                    <input type="date" className="w-full text-sm font-bold outline-none cursor-pointer" />
                                </div>
                                <div className="p-3">
                                    <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Départ</label>
                                    <input type="date" className="w-full text-sm font-bold outline-none cursor-pointer" />
                                </div>
                            </div>
                            <div className="p-3">
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Voyageurs</label>
                                <select className="w-full text-sm font-bold outline-none cursor-pointer bg-white">
                                    <option>1 voyageur</option>
                                    <option>2 voyageurs</option>
                                    <option>3 voyageurs</option>
                                    <option>4 voyageurs</option>
                                </select>
                            </div>
                        </div>

                        <button className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 transition-all active:scale-95">
                            {commonT('book')}
                        </button>

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
