'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import {
    Users,
    CreditCard,
    Calendar,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Plane,
    Building2,
    Bus
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function AdminOverview() {
    const supabase = createClient();
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalPartners: 0,
        recentBookings: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    async function fetchStats() {
        setLoading(true);

        // 1. Total Bookings
        const { count: bookingsCount } = await supabase.from('bookings').select('*', { count: 'exact', head: true });

        // 2. Total Revenue (Sum of price_amount)
        const { data: revenueData } = await supabase.from('bookings').select('price_amount');
        const revenue = revenueData?.reduce((acc, curr) => acc + (Number(curr.price_amount) || 0), 0) || 0;

        // 3. Total Users
        const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        // 4. Total Partners
        const { count: partnersCount } = await supabase.from('partners').select('*', { count: 'exact', head: true });

        // 5. Recent Bookings
        const { data: recent } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        setStats({
            totalBookings: bookingsCount || 0,
            totalRevenue: revenue,
            totalUsers: usersCount || 0,
            totalPartners: partnersCount || 0,
            recentBookings: recent || []
        });

        setLoading(false);
    }

    const cards = [
        { label: 'Réservations totales', value: stats.totalBookings, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Revenu total', value: formatPrice(stats.totalRevenue), icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Utilisateurs', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Partenaires', value: stats.totalPartners, icon: Building2, color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    if (loading) {
        return <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
            </div>
            <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>;
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className="card p-6 border-none shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Links */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Table */}
                <div className="lg:col-span-2 card border-none shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 text-lg">Réservations Récentes</h3>
                        <button className="text-sm text-primary-600 font-semibold hover:underline">Voir tout</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Type</th>
                                    <th className="px-6 py-4">Montant</th>
                                    <th className="px-6 py-4">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats.recentBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs uppercase">
                                                    {booking.first_name?.[0] || 'U'}
                                                </div>
                                                <span className="font-medium text-slate-900">{booking.first_name} {booking.last_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                                                {booking.type === 'flight' && <Plane className="w-3 h-3" />}
                                                {booking.type === 'hotel' && <Building2 className="w-3 h-3" />}
                                                {booking.type === 'transit' && <Bus className="w-3 h-3" />}
                                                <span className="capitalize">{booking.type}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            {formatPrice(booking.price_amount)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column: Mini Dashboard */}
                <div className="space-y-6">
                    <div className="card p-6 bg-slate-900 text-white border-none shadow-xl">
                        <h4 className="font-bold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" /> Progression
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-400">Objectif Mensuel</span>
                                    <span className="text-green-400 font-bold">75%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[75%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
