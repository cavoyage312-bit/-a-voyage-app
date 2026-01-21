'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    LayoutDashboard,
    Plane,
    Building2,
    Bus,
    Car,
    Users,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
    TrendingUp,
    TrendingDown,
    Calendar,
    Search,
    Bell,
    ChevronRight,
    MoreVertical,
    Briefcase,
} from 'lucide-react';
import Image from 'next/image';
import { AdminSettings } from '@/components/admin/AdminSettings';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { BookingsList } from '@/components/admin/BookingsList';
import { UsersList } from '@/components/admin/UsersList';
import { PartnersList } from '@/components/admin/PartnersList';
import { PaymentsList } from '@/components/admin/PaymentsList';

export default function AdminDashboard() {
    const params = useParams();
    const locale = params.locale as string;
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        {
            label: 'Réservations ce mois',
            value: '2,847',
            change: '+12.5%',
            trend: 'up',
            icon: Calendar,
        },
        {
            label: 'Revenus du mois',
            value: '€127,450',
            change: '+8.2%',
            trend: 'up',
            icon: CreditCard,
        },
        {
            label: 'Nouveaux utilisateurs',
            value: '1,234',
            change: '+18.7%',
            trend: 'up',
            icon: Users,
        },
        {
            label: 'Taux de conversion',
            value: '3.2%',
            change: '-0.4%',
            trend: 'down',
            icon: BarChart3,
        },
    ];

    const recentBookings = [
        {
            id: 'CV-2024-001',
            type: 'flight',
            customer: 'Marie Dupont',
            route: 'Paris → Dakar',
            date: '15 Jan 2024',
            amount: '€450',
            status: 'confirmed',
        },
        {
            id: 'CV-2024-002',
            type: 'hotel',
            customer: 'Jean Koné',
            route: 'Hôtel Terrou-Bi, Dakar',
            date: '15-18 Jan 2024',
            amount: '€540',
            status: 'confirmed',
        },
        {
            id: 'CV-2024-003',
            type: 'bus',
            customer: 'Fatou Sow',
            route: 'Abidjan → Yamoussoukro',
            date: '20 Jan 2024',
            amount: '5000 XOF',
            status: 'pending',
        },
        {
            id: 'CV-2024-004',
            type: 'flight',
            customer: 'Pierre Martin',
            route: 'Casablanca → Paris',
            date: '22 Jan 2024',
            amount: '€280',
            status: 'confirmed',
        },
    ];

    const menuItems = [
        { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
        { id: 'flights', label: 'Vols', icon: Plane },
        { id: 'hotels', label: 'Hôtels', icon: Building2 },
        { id: 'buses', label: 'Bus', icon: Bus },
        { id: 'cars', label: 'Voitures', icon: Car },
        { id: 'users', label: 'Utilisateurs', icon: Users },
        { id: 'partners', label: 'Partenaires', icon: Briefcase },
        { id: 'payments', label: 'Paiements', icon: CreditCard },
        { id: 'analytics', label: 'Analytique', icon: BarChart3 },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'flight':
                return <Plane className="w-4 h-4" />;
            case 'hotel':
                return <Building2 className="w-4 h-4" />;
            case 'bus':
                return <Bus className="w-4 h-4" />;
            case 'car':
                return <Car className="w-4 h-4" />;
            default:
                return <Plane className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800">
                    <Link href={`/${locale}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <span className="font-bold">ÇA VOYAGE</span>
                            <p className="text-xs text-slate-400">Admin Dashboard</p>
                        </div>
                    </Link>
                </div>

                {/* Menu */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors ${activeTab === item.id
                                ? 'bg-primary-600 text-white'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-800">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {menuItems.find((m) => m.id === activeTab)?.label}
                            </h1>
                            <p className="text-sm text-slate-500">
                                Bienvenue, Admin
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="hidden sm:block relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 hover:bg-slate-100 rounded-xl">
                                <Bell className="w-5 h-5 text-slate-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </button>

                            {/* Profile */}
                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                <span className="font-bold text-primary-700">AD</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'overview' && <AdminOverview />}
                        {activeTab === 'settings' && <AdminSettings />}

                        {/* Bookings Lists */}
                        {activeTab === 'flights' && <BookingsList type="flight" title="Réservations de Vols" />}
                        {activeTab === 'hotels' && <BookingsList type="hotel" title="Réservations d'Hôtels" />}
                        {activeTab === 'buses' && <BookingsList type="transit" title="Réservations de Bus" />}
                        {activeTab === 'cars' && <BookingsList type="car" title="Locations de Voitures" />}

                        {/* Management Lists */}
                        {activeTab === 'users' && <UsersList />}
                        {activeTab === 'partners' && <PartnersList />}
                        {activeTab === 'payments' && <PaymentsList />}

                        {activeTab === 'analytics' && (
                            <div className="card p-12 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <BarChart3 className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-2">Analytique</h2>
                                <p className="text-slate-500">Les graphiques de performance seront disponibles dès que vous aurez plus de données.</p>
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
