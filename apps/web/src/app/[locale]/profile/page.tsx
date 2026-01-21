'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Plane,
    Building2,
    Bus,
    Car,
    Calendar,
    CreditCard,
    Settings,
    Bell,
    LogOut,
    ChevronRight,
    Edit2,
} from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
    const params = useParams();
    const locale = params.locale as string;
    const [activeTab, setActiveTab] = useState('bookings');

    // Mock user data
    const user = {
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    };

    // Mock bookings
    const bookings = [
        {
            id: 'CV-2024-ABC123',
            type: 'flight',
            title: 'Paris → Dakar',
            date: '15 Mars 2024',
            status: 'confirmed',
            price: '500 €',
        },
        {
            id: 'CV-HTL-DEF456',
            type: 'hotel',
            title: 'Hôtel Terrou-Bi, Dakar',
            date: '15-18 Mars 2024',
            status: 'confirmed',
            price: '540 €',
        },
        {
            id: 'CV-BUS-GHI789',
            type: 'bus',
            title: 'Abidjan → Yamoussoukro',
            date: '20 Mars 2024',
            status: 'upcoming',
            price: '5 000 XOF',
        },
    ];

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'flight':
                return <Plane className="w-5 h-5" />;
            case 'hotel':
                return <Building2 className="w-5 h-5" />;
            case 'bus':
                return <Bus className="w-5 h-5" />;
            case 'car':
                return <Car className="w-5 h-5" />;
            default:
                return <Plane className="w-5 h-5" />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed':
                return <span className="badge badge-success">Confirmé</span>;
            case 'upcoming':
                return <span className="badge badge-primary">À venir</span>;
            case 'completed':
                return <span className="badge bg-slate-100 text-slate-600">Terminé</span>;
            case 'cancelled':
                return <span className="badge bg-red-100 text-red-600">Annulé</span>;
            default:
                return null;
        }
    };

    const menuItems = [
        { id: 'bookings', label: 'Mes réservations', icon: Calendar },
        { id: 'settings', label: 'Paramètres', icon: Settings },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'payment', label: 'Moyens de paiement', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="header-gradient py-8 sm:py-12">
                <div className="container-custom">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-4 border-white/20">
                                <Image
                                    src={user.avatar}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                                <Edit2 className="w-4 h-4 text-primary-700" />
                            </button>
                        </div>
                        <div className="text-center sm:text-left text-white">
                            <h1 className="text-xl sm:text-2xl font-bold">
                                {user.firstName} {user.lastName}
                            </h1>
                            <p className="text-white/80 text-sm">{user.email}</p>
                            <p className="text-white/60 text-sm">{user.phone}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-custom py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Menu */}
                    <div className="lg:col-span-1">
                        <div className="card p-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${activeTab === item.id
                                            ? 'bg-primary-50 text-primary-700'
                                            : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium text-sm">{item.label}</span>
                                </button>
                            ))}
                            <hr className="my-2" />
                            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors">
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium text-sm">Déconnexion</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeTab === 'bookings' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-4">
                                    Mes réservations
                                </h2>

                                {bookings.length === 0 ? (
                                    <div className="card p-8 text-center">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Calendar className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-500 mb-4">
                                            Vous n'avez pas encore de réservation
                                        </p>
                                        <Link href={`/${locale}/flights`} className="btn btn-primary">
                                            Réserver maintenant
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.map((booking) => (
                                            <div key={booking.id} className="card card-hover p-4 sm:p-6">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-700 flex-shrink-0">
                                                        {getTypeIcon(booking.type)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                            <div>
                                                                <h3 className="font-semibold text-slate-900">
                                                                    {booking.title}
                                                                </h3>
                                                                <p className="text-sm text-slate-500">
                                                                    {booking.date} • Réf: {booking.id}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                {getStatusBadge(booking.status)}
                                                                <span className="font-bold text-primary-700">
                                                                    {booking.price}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-slate-300 hidden sm:block" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-4">
                                    Paramètres du compte
                                </h2>
                                <div className="card p-4 sm:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                defaultValue={user.firstName}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                className="input"
                                                defaultValue={user.lastName}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                className="input"
                                                defaultValue={user.email}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                className="input"
                                                defaultValue={user.phone}
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <button className="btn btn-primary">
                                            Enregistrer les modifications
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'notifications' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-4">
                                    Préférences de notification
                                </h2>
                                <div className="card p-4 sm:p-6 space-y-4">
                                    {[
                                        { label: 'Confirmations de réservation', enabled: true },
                                        { label: 'Rappels de voyage', enabled: true },
                                        { label: 'Offres et promotions', enabled: false },
                                        { label: 'Newsletter', enabled: false },
                                    ].map((pref, i) => (
                                        <div key={i} className="flex items-center justify-between py-2">
                                            <span className="text-slate-700">{pref.label}</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    defaultChecked={pref.enabled}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary-600 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'payment' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-xl font-bold text-slate-900 mb-4">
                                    Moyens de paiement
                                </h2>
                                <div className="card p-4 sm:p-6">
                                    <p className="text-slate-500 mb-4">
                                        Aucun moyen de paiement enregistré
                                    </p>
                                    <button className="btn btn-outline">
                                        <CreditCard className="w-5 h-5" />
                                        Ajouter une carte
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
