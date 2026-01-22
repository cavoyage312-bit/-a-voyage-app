'use client';

import { useState } from 'react';
import { Plane, Building2, Bus, Car } from 'lucide-react';
import { FlightSearchForm } from './FlightSearchForm';
import { HotelSearchForm } from './HotelSearchForm';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type TabType = 'flights' | 'hotels' | 'buses' | 'cars';

const tabs: { id: TabType; label: string; icon: React.ElementType; emoji: string }[] = [
    { id: 'flights', label: 'Vols', icon: Plane, emoji: '✈️' },
    { id: 'hotels', label: 'Hôtels', icon: Building2, emoji: '🏨' },
    { id: 'buses', label: 'Bus & Trains', icon: Bus, emoji: '🚌' },
    { id: 'cars', label: 'Voyage en Groupe', icon: Car, emoji: '👥' },
];

export function SearchTabs() {
    const [activeTab, setActiveTab] = useState<TabType>('flights');
    const params = useParams();
    const locale = params.locale as string;

    return (
        <div className="search-box">
            {/* Tabs - Style comme les mockups */}
            <div className="flex border-b border-slate-200 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'flex-1 flex flex-col items-center gap-1 py-4 px-2 font-medium transition-all duration-200 border-b-2 -mb-px',
                            activeTab === tab.id
                                ? 'text-primary-700 border-primary-700'
                                : 'text-slate-500 border-transparent hover:text-slate-700'
                        )}
                    >
                        <span className="text-xl">{tab.emoji}</span>
                        <span className="text-sm hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Search Forms */}
            <div className="animate-fade-in">
                {activeTab === 'flights' && <FlightSearchForm />}
                {activeTab === 'hotels' && <HotelSearchForm />}
                {activeTab === 'buses' && (
                    <div className="text-center py-8">
                        <Bus className="w-16 h-16 mx-auto mb-4 text-primary-200" />
                        <p className="text-slate-600 mb-4">
                            Recherchez vos trajets en bus à travers l'Afrique et l'Europe
                        </p>
                        <Link href={`/${locale}/buses`} className="btn btn-primary">
                            Rechercher un bus
                        </Link>
                    </div>
                )}
                {activeTab === 'cars' && (
                    <div className="text-center py-8">
                        <Car className="w-16 h-16 mx-auto mb-4 text-primary-200" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Voyages en Groupe & Business</h3>
                        <p className="text-slate-600 mb-4 px-4">
                            Organisez vos déplacements professionnels, séminaires ou événements familiaux.
                            De 10 à 300+ personnes, nous gérons tout.
                        </p>
                        <Link href={`/${locale}/groups`} className="btn btn-primary px-8">
                            Découvrir nos solutions groupes
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
