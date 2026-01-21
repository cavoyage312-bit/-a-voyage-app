'use client';

import { useState, useRef, useEffect } from 'react';
import { Plane, MapPin, X, Loader2 } from 'lucide-react';

interface AmadeusLocation {
    iataCode: string;
    name: string;
    address: {
        cityName: string;
        countryName: string;
    };
}

interface AirportAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: 'departure' | 'arrival';
    className?: string;
}

const POPULAR_DESTINATIONS = [
    { iataCode: 'PAR', name: 'Paris (Tous aéroports)', cityName: 'Paris', country: 'France' },
    { iataCode: 'DKR', name: 'Dakar (Léopold Sédar Senghor)', cityName: 'Dakar', country: 'Sénégal' },
    { iataCode: 'DSS', name: 'Dakar (Blaise Diagne)', cityName: 'Dakar', country: 'Sénégal' },
    { iataCode: 'CMN', name: 'Casablanca (Mohammed V)', cityName: 'Casablanca', country: 'Maroc' },
    { iataCode: 'ABJ', name: 'Abidjan (Félix Houphouët-Boigny)', cityName: 'Abidjan', country: 'Côte d\'Ivoire' },
];

export function AirportAutocomplete({
    value,
    onChange,
    placeholder = 'Ville ou aéroport',
    icon = 'departure',
    className = '',
}: AirportAutocompleteProps) {
    const [query, setQuery] = useState(value);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AmadeusLocation[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync internal state if prop changes
    useEffect(() => {
        if (value !== query && !isOpen) {
            setQuery(value);
        }
    }, [value, isOpen]);

    // Search airports
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }

            // Éviter de rechercher si l'utilisateur a déjà sélectionné (format "Ville (CODE)")
            if (query.match(/ \([A-Z]{3}\)$/)) return;

            setIsLoading(true);
            try {
                const res = await fetch(`/api/locations/search?keyword=${encodeURIComponent(query)}`);
                const json = await res.json();

                // On fusionne les résultats réels avec les fallbacks si recherche "Dakar"
                let finalResults = json.data || [];

                if (finalResults.length === 0) {
                    const searchLower = query.toLowerCase();
                    const filteredPopular = POPULAR_DESTINATIONS.filter(d =>
                        d.cityName.toLowerCase().includes(searchLower) ||
                        d.iataCode.toLowerCase().includes(searchLower)
                    );

                    finalResults = filteredPopular.map(d => ({
                        iataCode: d.iataCode,
                        name: d.name,
                        address: { cityName: d.cityName, countryName: d.country }
                    }));
                }

                setResults(finalResults);
            } catch (error) {
                console.error('Failed to search locations', error);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (airport: any) => {
        const displayValue = `${airport.address.cityName} (${airport.iataCode})`;
        setQuery(displayValue);
        onChange(airport.iataCode);
        setIsOpen(false);
        setResults([]);
    };

    const handleClear = () => {
        setQuery('');
        onChange('');
        setResults([]);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="input-group">
                {icon === 'departure' ? (
                    <Plane className="input-icon rotate-45" />
                ) : (
                    <MapPin className="input-icon" />
                )}
                <input
                    type="text"
                    className="input input-with-icon pr-10"
                    placeholder={placeholder}
                    value={query}
                    autoComplete="off"
                    onChange={(e) => {
                        const val = e.target.value;
                        setQuery(val);
                        setIsOpen(true);
                        // Important: on met à jour le parent aussi pour la saisie directe (ex: taper "DKR" direct)
                        onChange(val);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {isOpen && (isLoading || results.length > 0 || (query.length < 2 && !isLoading)) && (
                <div className="absolute z-[100] top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-down min-w-[280px]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="max-h-80 overflow-y-auto">
                            {results.map((airport) => (
                                <li key={airport.iataCode}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(airport)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0"
                                    >
                                        <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Plane className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-slate-900">
                                                    {airport.address.cityName}
                                                </span>
                                                <span className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded text-primary-700 font-bold">
                                                    {airport.iataCode}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate">
                                                {airport.name}, {airport.address.countryName}
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : query.length < 2 ? (
                        <div className="p-4">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-3 px-1">Destinations populaires</p>
                            <div className="grid grid-cols-1 gap-1">
                                {POPULAR_DESTINATIONS.slice(0, 4).map(d => (
                                    <button
                                        key={d.iataCode}
                                        type="button"
                                        onClick={() => handleSelect({ iataCode: d.iataCode, name: d.name, address: { cityName: d.cityName, countryName: d.country } })}
                                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors text-left"
                                    >
                                        <span className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">{d.iataCode}</span>
                                        <span className="text-sm font-medium text-slate-700">{d.cityName}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-slate-500 text-sm">
                            Aucun résultat. Vous pouvez taper le code IATA (ex: DKR) directement.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
