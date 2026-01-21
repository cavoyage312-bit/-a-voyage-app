'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    LayoutDashboard,
    Building2,
    Bed,
    Calendar,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
    TrendingUp,
    Users,
    Star,
    MessageSquare,
    Plus,
    Edit,
    Trash2,
    Eye,
    MoreVertical,
    Image as ImageIcon,
    Wifi,
    Car,
    Coffee,
    Check,
    X,
} from 'lucide-react';
import Image from 'next/image';

export default function HotelDashboard() {
    const params = useParams();
    const locale = params.locale as string;
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: 'Réservations ce mois', value: '156', change: '+15%', icon: Calendar },
        { label: 'Revenus du mois', value: '€28,450', change: '+12%', icon: CreditCard },
        { label: "Taux d'occupation", value: '78%', change: '+5%', icon: Users },
        { label: 'Note moyenne', value: '4.7', change: '+0.2', icon: Star },
    ];

    const rooms = [
        {
            id: 1,
            name: 'Suite Présidentielle',
            type: 'Suite',
            price: 350,
            capacity: 4,
            available: true,
            image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=300&h=200&fit=crop',
        },
        {
            id: 2,
            name: 'Chambre Deluxe Vue Mer',
            type: 'Deluxe',
            price: 180,
            capacity: 2,
            available: true,
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=300&h=200&fit=crop',
        },
        {
            id: 3,
            name: 'Chambre Standard',
            type: 'Standard',
            price: 95,
            capacity: 2,
            available: false,
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=300&h=200&fit=crop',
        },
        {
            id: 4,
            name: 'Chambre Familiale',
            type: 'Familiale',
            price: 220,
            capacity: 5,
            available: true,
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop',
        },
    ];

    const reservations = [
        { guest: 'Marie Dupont', room: 'Suite Deluxe', checkIn: '15 Jan', checkOut: '18 Jan', amount: '€540', status: 'confirmed' },
        { guest: 'Jean Koné', room: 'Standard', checkIn: '16 Jan', checkOut: '17 Jan', amount: '€95', status: 'pending' },
        { guest: 'Fatou Sow', room: 'Vue Mer', checkIn: '18 Jan', checkOut: '22 Jan', amount: '€720', status: 'confirmed' },
        { guest: 'Pierre Martin', room: 'Familiale', checkIn: '20 Jan', checkOut: '25 Jan', amount: '€1100', status: 'confirmed' },
    ];

    const reviews = [
        { guest: 'Marie D.', rating: 5, comment: 'Séjour exceptionnel, personnel aux petits soins !', date: '12 Jan 2024' },
        { guest: 'Jean K.', rating: 4, comment: 'Très bon hôtel, vue magnifique sur la mer.', date: '10 Jan 2024' },
        { guest: 'Fatou S.', rating: 5, comment: 'Je recommande vivement, parfait pour les vacances.', date: '8 Jan 2024' },
    ];

    const menuItems = [
        { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
        { id: 'rooms', label: 'Chambres', icon: Bed },
        { id: 'reservations', label: 'Réservations', icon: Calendar },
        { id: 'reviews', label: 'Avis clients', icon: MessageSquare },
        { id: 'earnings', label: 'Revenus', icon: CreditCard },
        { id: 'analytics', label: 'Statistiques', icon: BarChart3 },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-900">Hôtel Terrou-Bi</span>
                            <p className="text-xs text-slate-500">Partenaire Hôtel</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors ${activeTab === item.id
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Link href={`/${locale}`} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Déconnexion</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {menuItems.find((m) => m.id === activeTab)?.label}
                            </h1>
                            <p className="text-sm text-slate-500">Dashboard Hôtelier</p>
                        </div>
                        {activeTab === 'rooms' && (
                            <button className="btn btn-primary">
                                <Plus className="w-5 h-5" />
                                Ajouter une chambre
                            </button>
                        )}
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="card p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                                <stat.icon className="w-5 h-5 text-primary-700" />
                                            </div>
                                            <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                                                <TrendingUp className="w-4 h-4" />
                                                {stat.change}
                                            </span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Recent Reservations */}
                            <div className="card mb-6">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="font-bold text-slate-900">Réservations récentes</h2>
                                    <button onClick={() => setActiveTab('reservations')} className="text-primary-700 text-sm font-medium hover:underline">
                                        Voir tout
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {reservations.slice(0, 3).map((res, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                                                    {res.guest.split(' ').map((n) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{res.guest}</p>
                                                    <p className="text-sm text-slate-500">{res.room} • {res.checkIn} - {res.checkOut}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-900">{res.amount}</p>
                                                <span className={`badge ${res.status === 'confirmed' ? 'badge-success' : 'bg-amber-100 text-amber-700'}`}>
                                                    {res.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Reviews */}
                            <div className="card">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                    <h2 className="font-bold text-slate-900">Derniers avis</h2>
                                    <button onClick={() => setActiveTab('reviews')} className="text-primary-700 text-sm font-medium hover:underline">
                                        Voir tout
                                    </button>
                                </div>
                                <div className="divide-y divide-slate-100">
                                    {reviews.map((review, i) => (
                                        <div key={i} className="p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-medium text-slate-900">{review.guest}</span>
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: review.rating }).map((_, j) => (
                                                        <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-slate-400">{review.date}</span>
                                            </div>
                                            <p className="text-sm text-slate-600">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'rooms' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rooms.map((room) => (
                                    <div key={room.id} className="card overflow-hidden">
                                        <div className="relative h-40">
                                            <Image src={room.image} alt={room.name} fill className="object-cover" />
                                            <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${room.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {room.available ? 'Disponible' : 'Occupée'}
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{room.name}</h3>
                                                    <p className="text-sm text-slate-500">{room.type} • {room.capacity} pers.</p>
                                                </div>
                                                <p className="text-lg font-bold text-primary-700">{room.price}€<span className="text-xs text-slate-400">/nuit</span></p>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button className="flex-1 btn btn-outline btn-sm">
                                                    <Edit className="w-4 h-4" />
                                                    Modifier
                                                </button>
                                                <button className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Room Card */}
                                <button className="card border-2 border-dashed border-slate-300 flex flex-col items-center justify-center py-12 hover:border-primary-500 hover:bg-primary-50/50 transition-colors">
                                    <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                                        <Plus className="w-7 h-7 text-slate-400" />
                                    </div>
                                    <p className="font-medium text-slate-600">Ajouter une chambre</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'reservations' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Client</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Chambre</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Arrivée</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Départ</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Montant</th>
                                                <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Statut</th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {reservations.map((res, i) => (
                                                <tr key={i} className="hover:bg-slate-50">
                                                    <td className="px-4 py-3 font-medium text-slate-900">{res.guest}</td>
                                                    <td className="px-4 py-3 text-slate-600">{res.room}</td>
                                                    <td className="px-4 py-3 text-slate-600">{res.checkIn}</td>
                                                    <td className="px-4 py-3 text-slate-600">{res.checkOut}</td>
                                                    <td className="px-4 py-3 font-semibold text-slate-900">{res.amount}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`badge ${res.status === 'confirmed' ? 'badge-success' : 'bg-amber-100 text-amber-700'}`}>
                                                            {res.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex gap-1">
                                                            <button className="p-1 hover:bg-green-100 rounded text-green-600"><Check className="w-4 h-4" /></button>
                                                            <button className="p-1 hover:bg-red-100 rounded text-red-600"><X className="w-4 h-4" /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="space-y-4">
                                {reviews.map((review, i) => (
                                    <div key={i} className="card p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                                                    {review.guest.split(' ').map((n) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{review.guest}</p>
                                                    <p className="text-sm text-slate-500">{review.date}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {Array.from({ length: 5 }).map((_, j) => (
                                                    <Star key={j} className={`w-5 h-5 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-600">{review.comment}</p>
                                        <button className="mt-4 text-primary-700 text-sm font-medium hover:underline">
                                            Répondre à cet avis
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {['earnings', 'analytics', 'settings'].includes(activeTab) && (
                        <div className="card p-12 text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                {(() => {
                                    const Icon = menuItems.find((m) => m.id === activeTab)?.icon;
                                    return Icon ? <Icon className="w-8 h-8 text-slate-400" /> : null;
                                })()}
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                {menuItems.find((m) => m.id === activeTab)?.label}
                            </h2>
                            <p className="text-slate-500">Cette section est en cours de développement</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
