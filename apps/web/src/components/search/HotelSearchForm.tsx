'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Building2, Calendar, Users, Search, ChevronDown, Minus, Plus } from 'lucide-react';

import { AirportAutocomplete } from './AirportAutocomplete';

export function HotelSearchForm() {
    const t = useTranslations('hotels');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [destination, setDestination] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [rooms, setRooms] = useState(1);
    const [guests, setGuests] = useState(2);
    const [showGuests, setShowGuests] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchParams = new URLSearchParams({
            destination,
            checkIn,
            checkOut,
            rooms: rooms.toString(),
            guests: guests.toString(),
        });
        router.push(`/${locale}/hotels/search?${searchParams.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
            {/* Destination - Full width */}
            <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                    {t('destination')}
                </label>
                <AirportAutocomplete
                    value={destination}
                    onChange={setDestination}
                    placeholder={t('destinationPlaceholder')}
                    icon="arrival"
                />
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('checkIn')}
                    </label>
                    <div className="input-group">
                        <Calendar className="input-icon" />
                        <input
                            type="date"
                            className="input input-with-icon text-sm"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('checkOut')}
                    </label>
                    <div className="input-group">
                        <Calendar className="input-icon" />
                        <input
                            type="date"
                            className="input input-with-icon text-sm"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Rooms & Guests */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Rooms */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('rooms')}
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                            <Minus className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="flex-1 text-center font-semibold text-slate-900">{rooms}</span>
                        <button
                            type="button"
                            onClick={() => setRooms(Math.min(5, rooms + 1))}
                            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                            <Plus className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                </div>

                {/* Guests */}
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('guests')}
                    </label>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-2 border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setGuests(Math.max(1, guests - 1))}
                            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                            <Minus className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="flex-1 text-center font-semibold text-slate-900">{guests}</span>
                        <button
                            type="button"
                            onClick={() => setGuests(Math.min(10, guests + 1))}
                            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                            <Plus className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search Button */}
            <button type="submit" className="btn btn-primary btn-lg w-full">
                <Search className="w-5 h-5" />
                <span>{t('searchHotels')}</span>
            </button>
        </form>
    );
}
