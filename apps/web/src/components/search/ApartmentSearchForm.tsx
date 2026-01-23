'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { fr, enUS, de, es, pt } from 'date-fns/locale';

export function ApartmentSearchForm() {
    const t = useTranslations('apartments');
    const commonT = useTranslations('common');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [location, setLocation] = useState('');
    const [dates, setDates] = useState({ start: '', end: '' });
    const [guests, setGuests] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const searchParams = new URLSearchParams({
            location,
            checkIn: dates.start,
            checkOut: dates.end,
            guests: guests.toString()
        });

        router.push(`/${locale}/apartments/search?${searchParams.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-2 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-2 relative z-10">
                {/* Location Input */}
                <div className="md:col-span-4 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Ville, quartier..."
                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                        required
                    />
                    <label className="absolute -top-2 left-4 px-2 bg-white text-xs font-bold text-primary-600 opacity-0 group-focus-within:opacity-100 transition-opacity">
                        Destination
                    </label>
                </div>

                {/* Dates Inputs */}
                <div className="md:col-span-4 grid grid-cols-2 gap-2">
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <input
                            type="date"
                            value={dates.start}
                            onChange={(e) => setDates({ ...dates, start: e.target.value })}
                            className="w-full h-14 pl-10 pr-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium text-sm text-slate-900"
                            required
                        />
                    </div>
                    <div className="relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <input
                            type="date"
                            value={dates.end}
                            onChange={(e) => setDates({ ...dates, end: e.target.value })}
                            className="w-full h-14 pl-10 pr-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium text-sm text-slate-900"
                            required
                        />
                    </div>
                </div>

                {/* Guests Input */}
                <div className="md:col-span-2 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-600 transition-colors">
                        <Users className="w-5 h-5" />
                    </div>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num} pers.</option>
                        ))}
                    </select>
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-14 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Search className="w-5 h-5" />
                                <span className="hidden md:inline">{commonT('search')}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
