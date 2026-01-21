'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutDashboard, Car, Calendar, CreditCard, BarChart3, Settings, LogOut, TrendingUp, Users, Plus, Edit, Trash2, Fuel, Cog } from 'lucide-react';
import Image from 'next/image';

export default function CarDashboard() {
    const params = useParams();
    const locale = params.locale as string;
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: 'Locations ce mois', value: '89', change: '+12%', icon: Calendar },
        { label: 'Revenus du mois', value: '€18,750', change: '+8%', icon: CreditCard },
        { label: 'Véhicules loués', value: '12/18', change: '67%', icon: Car },
        { label: 'Clients satisfaits', value: '96%', change: '+2%', icon: Users },
    ];

    const vehicles = [
        { id: 1, name: 'Peugeot 3008', category: 'SUV', price: 55, status: 'available', image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=300&h=200&fit=crop' },
        { id: 2, name: 'Renault Clio', category: 'Citadine', price: 35, status: 'rented', image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&h=200&fit=crop' },
        { id: 3, name: 'Mercedes Classe C', category: 'Berline', price: 85, status: 'available', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=300&h=200&fit=crop' },
        { id: 4, name: 'Toyota RAV4', category: 'SUV', price: 60, status: 'maintenance', image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=300&h=200&fit=crop' },
    ];

    const rentals = [
        { client: 'Marie Dupont', vehicle: 'Peugeot 3008', start: '15 Jan', end: '20 Jan', amount: '€275', status: 'active' },
        { client: 'Jean Martin', vehicle: 'Mercedes C', start: '16 Jan', end: '18 Jan', amount: '€170', status: 'active' },
        { client: 'Fatou Diallo', vehicle: 'Renault Clio', start: '18 Jan', end: '25 Jan', amount: '€245', status: 'upcoming' },
    ];

    const menuItems = [
        { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
        { id: 'vehicles', label: 'Véhicules', icon: Car },
        { id: 'rentals', label: 'Locations', icon: Calendar },
        { id: 'earnings', label: 'Revenus', icon: CreditCard },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'available': return <span className="badge badge-success">Disponible</span>;
            case 'rented': return <span className="badge bg-blue-100 text-blue-700">Louée</span>;
            case 'maintenance': return <span className="badge bg-amber-100 text-amber-700">Maintenance</span>;
            case 'active': return <span className="badge badge-success">En cours</span>;
            case 'upcoming': return <span className="badge bg-slate-100 text-slate-600">À venir</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Car className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-900">AutoLoc Plus</span>
                            <p className="text-xs text-slate-500">Partenaire Location</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors ${activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <item.icon className="w-5 h-5" /><span className="text-sm font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-slate-100">
                    <Link href={`/${locale}`} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50">
                        <LogOut className="w-5 h-5" /><span className="text-sm font-medium">Déconnexion</span>
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-slate-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">{menuItems.find((m) => m.id === activeTab)?.label}</h1>
                            <p className="text-sm text-slate-500">Dashboard Location Voiture</p>
                        </div>
                        {activeTab === 'vehicles' && <button className="btn bg-blue-600 text-white hover:bg-blue-700"><Plus className="w-5 h-5" />Ajouter</button>}
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="card p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><stat.icon className="w-5 h-5 text-blue-600" /></div>
                                            <span className="flex items-center gap-1 text-sm font-medium text-green-600"><TrendingUp className="w-4 h-4" />{stat.change}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="card">
                                <div className="p-4 border-b border-slate-100"><h2 className="font-bold text-slate-900">Locations en cours</h2></div>
                                <div className="divide-y divide-slate-100">
                                    {rentals.map((rental, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between">
                                            <div><p className="font-medium text-slate-900">{rental.client}</p><p className="text-sm text-slate-500">{rental.vehicle} • {rental.start} - {rental.end}</p></div>
                                            <div className="text-right"><p className="font-bold text-slate-900">{rental.amount}</p>{getStatusBadge(rental.status)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'vehicles' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vehicles.map((vehicle) => (
                                    <div key={vehicle.id} className="card overflow-hidden">
                                        <div className="relative h-40">
                                            <Image src={vehicle.image} alt={vehicle.name} fill className="object-cover" />
                                            <div className="absolute top-3 right-3">{getStatusBadge(vehicle.status)}</div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div><h3 className="font-bold text-slate-900">{vehicle.name}</h3><p className="text-sm text-slate-500">{vehicle.category}</p></div>
                                                <p className="text-lg font-bold text-blue-600">{vehicle.price}€<span className="text-xs text-slate-400">/jour</span></p>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button className="flex-1 btn btn-outline btn-sm"><Edit className="w-4 h-4" />Modifier</button>
                                                <button className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="card border-2 border-dashed border-slate-300 flex flex-col items-center justify-center py-12 hover:border-blue-500 hover:bg-blue-50/50 transition-colors">
                                    <Plus className="w-10 h-10 text-slate-400 mb-2" />
                                    <p className="font-medium text-slate-600">Ajouter un véhicule</p>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {['rentals', 'earnings', 'settings'].includes(activeTab) && (
                        <div className="card p-12 text-center">
                            <Car className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{menuItems.find((m) => m.id === activeTab)?.label}</h2>
                            <p className="text-slate-500">Section en cours de développement</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
