'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plane, ArrowLeftRight, Calendar, Users, ChevronDown, Search } from 'lucide-react';

import { AirportAutocomplete } from './AirportAutocomplete';

export function FlightSearchForm() {
    const t = useTranslations('flights');
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    const [tripType, setTripType] = useState<'roundTrip' | 'oneWay'>('roundTrip');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [travelClass, setTravelClass] = useState('economy');
    const [checkedBags, setCheckedBags] = useState(0);
    const [handBags, setHandBags] = useState(1);
    const [showPassengers, setShowPassengers] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const searchParams = new URLSearchParams({
            from,
            to,
            departure: departureDate,
            ...(tripType === 'roundTrip' && returnDate && { return: returnDate }),
            passengers: passengers.toString(),
            class: travelClass,
            checkedBags: checkedBags.toString(),
            handBags: handBags.toString(),
        });
        router.push(`/${locale}/flights/search?${searchParams.toString()}`);
    };

    const swapLocations = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    return (
        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
            {/* Trip Type - Responsive ... (inchangé) */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={() => setTripType('roundTrip')}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tripType === 'roundTrip'
                        ? 'bg-primary-700 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    {t('roundTrip')}
                </button>
                <button
                    type="button"
                    onClick={() => setTripType('oneWay')}
                    className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${tripType === 'oneWay'
                        ? 'bg-primary-700 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    {t('oneWay')}
                </button>
            </div>

            {/* Locations - Avec AirportAutocomplete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative">
                <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('from')}
                    </label>
                    <AirportAutocomplete
                        value={from}
                        onChange={setFrom}
                        placeholder={t('fromPlaceholder')}
                        icon="departure"
                    />
                </div>

                {/* Swap button - Positioned differently on mobile */}
                <button
                    type="button"
                    onClick={swapLocations}
                    className="absolute left-1/2 top-[52px] sm:top-[42px] -translate-x-1/2 z-10 
                     w-10 h-10 bg-white border-2 border-primary-200 rounded-full 
                     flex items-center justify-center shadow-md
                     hover:border-primary-400 hover:bg-primary-50 transition-all
                     hidden sm:flex"
                >
                    <ArrowLeftRight className="w-4 h-4 text-primary-700" />
                </button>

                <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('to')}
                    </label>
                    <AirportAutocomplete
                        value={to}
                        onChange={setTo}
                        placeholder={t('toPlaceholder')}
                        icon="arrival"
                    />
                </div>
            </div>

            {/* Dates - 2 columns on mobile for dates */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="col-span-1">
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('departure')}
                    </label>
                    <div className="input-group">
                        <Calendar className="input-icon" />
                        <input
                            type="date"
                            className="input input-with-icon text-sm"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {tripType === 'roundTrip' && (
                    <div className="col-span-1">
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                            {t('return')}
                        </label>
                        <div className="input-group">
                            <Calendar className="input-icon" />
                            <input
                                type="date"
                                className="input input-with-icon text-sm"
                                value={returnDate}
                                onChange={(e) => setReturnDate(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Passengers - Full width on mobile when one-way */}
                <div className={tripType === 'oneWay' ? 'col-span-2 sm:col-span-1' : 'col-span-2 sm:col-span-1'}>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('passengers')}
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowPassengers(!showPassengers)}
                            className="input text-left flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                                <span className="text-sm">{passengers} {t('passenger')}{passengers > 1 ? 's' : ''}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showPassengers ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Passengers dropdown */}
                        {showPassengers && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-20 animate-slide-down">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">{t('adults')}</span>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                                            >
                                                -
                                            </button>
                                            <span className="w-6 text-center font-semibold">{passengers}</span>
                                            <button
                                                type="button"
                                                className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                onClick={() => setPassengers(Math.min(9, passengers + 1))}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{t('handBags')}</p>
                                                <p className="text-[10px] text-slate-400">Cabine (max 10kg)</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    onClick={() => setHandBags(Math.max(0, handBags - 1))}
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center font-semibold">{handBags}</span>
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    onClick={() => setHandBags(Math.min(passengers, handBags + 1))}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{t('checkedBags')}</p>
                                                <p className="text-[10px] text-slate-400">Soute (max 23kg)</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    onClick={() => setCheckedBags(Math.max(0, checkedBags - 1))}
                                                >
                                                    -
                                                </button>
                                                <span className="w-6 text-center font-semibold">{checkedBags}</span>
                                                <button
                                                    type="button"
                                                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                                                    onClick={() => setCheckedBags(Math.min(passengers * 2, checkedBags + 1))}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowPassengers(false)}
                                    className="w-full btn btn-primary btn-sm mt-4"
                                >
                                    Confirmer
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Class selector */}
                <div className={tripType === 'oneWay' ? 'col-span-2 sm:col-span-1' : 'col-span-2 sm:col-span-1'}>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                        {t('class')}
                    </label>
                    <select
                        className="input text-sm"
                        value={travelClass}
                        onChange={(e) => setTravelClass(e.target.value)}
                    >
                        <option value="economy">{t('economy')}</option>
                        <option value="business">{t('business')}</option>
                        <option value="first">{t('first')}</option>
                    </select>
                </div>
            </div>

            {/* Search Button */}
            <button type="submit" className="btn btn-primary btn-lg w-full">
                <Search className="w-5 h-5" />
                <span>{t('searchFlights')}</span>
            </button>
        </form>
    );
}
