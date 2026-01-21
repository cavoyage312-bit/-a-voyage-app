'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutDashboard, Bus, Route, Calendar, CreditCard, BarChart3, Settings, LogOut, TrendingUp, Users, Clock, MapPin, Plus, Edit, Trash2, Play, Pause } from 'lucide-react';

export default function BusDashboard() {
    const params = useParams();
    const locale = params.locale as string;
    const [activeTab, setActiveTab] = useState('overview');

    const stats = [
        { label: 'Trajets ce mois', value: '342', change: '+18%', icon: Route },
        { label: 'Revenus du mois', value: '4.2M XOF', change: '+10%', icon: CreditCard },
        { label: 'Passagers transportés', value: '8,450', change: '+22%', icon: Users },
        { label: 'Taux remplissage', value: '82%', change: '+5%', icon: Bus },
    ];

    const routes = [
        { id: 1, from: 'Abidjan', to: 'Yamoussoukro', departure: '06:00', duration: '4h30', price: 5000, seats: 50, active: true },
        { id: 2, from: 'Abidjan', to: 'Bouaké', departure: '07:00', duration: '5h00', price: 7000, seats: 50, active: true },
        { id: 3, from: 'Abidjan', to: 'San Pedro', departure: '08:00', duration: '6h00', price: 8500, seats: 45, active: false },
    ];

    const todayTrips = [
        { route: 'Abidjan → Yamoussoukro', departure: '06:00', bus: 'Bus 12', passengers: 45, status: 'departed' },
        { route: 'Abidjan → Bouaké', departure: '07:00', bus: 'Bus 08', passengers: 38, status: 'boarding' },
    ];

    const menuItems = [
        { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
        { id: 'routes', label: 'Trajets', icon: Route },
        { id: 'trips', label: 'Voyages du jour', icon: Calendar },
        { id: 'buses', label: 'Flotte de bus', icon: Bus },
        { id: 'settings', label: 'Paramètres', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <Bus className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                            <span className="font-bold text-slate-900">Sonef Transport</span>
                            <p className="text-xs text-slate-500">Partenaire Bus</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-colors ${activeTab === item.id ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}>
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
                            <p className="text-sm text-slate-500">Dashboard Transport Bus</p>
                        </div>
                        {activeTab === 'routes' && <button className="btn bg-orange-600 text-white hover:bg-orange-700"><Plus className="w-5 h-5" />Ajouter</button>}
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="card p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><stat.icon className="w-5 h-5 text-orange-600" /></div>
                                            <span className="flex items-center gap-1 text-sm font-medium text-green-600"><TrendingUp className="w-4 h-4" />{stat.change}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                        <p className="text-sm text-slate-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="card">
                                <div className="p-4 border-b border-slate-100"><h2 className="font-bold text-slate-900">Voyages du jour</h2></div>
                                <div className="divide-y divide-slate-100">
                                    {todayTrips.map((trip, i) => (
                                        <div key={i} className="p-4 flex items-center justify-between">
                                            <div><p className="font-medium text-slate-900">{trip.route}</p><p className="text-sm text-slate-500">{trip.departure} • {trip.bus}</p></div>
                                            <div className="text-right">
                                                <p className="font-semibold">{trip.passengers}/50</p>
                                                <span className={`badge ${trip.status === 'departed' ? 'badge-success' : 'bg-blue-100 text-blue-700'}`}>{trip.status === 'departed' ? 'En route' : 'Embarquement'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'routes' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="card overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Trajet</th>
                                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Départ</th>
                                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Durée</th>
                                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Prix</th>
                                            <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Statut</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {routes.map((route) => (
                                            <tr key={route.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-medium text-slate-900">{route.from} → {route.to}</td>
                                                <td className="px-4 py-3 text-slate-600">{route.departure}</td>
                                                <td className="px-4 py-3 text-slate-600">{route.duration}</td>
                                                <td className="px-4 py-3 font-semibold">{route.price.toLocaleString()} XOF</td>
                                                <td className="px-4 py-3"><span className={`badge ${route.active ? 'badge-success' : 'bg-slate-100 text-slate-500'}`}>{route.active ? 'Actif' : 'Inactif'}</span></td>
                                                <td className="px-4 py-3 flex gap-1">
                                                    <button className="p-1 hover:bg-slate-100 rounded"><Edit className="w-4 h-4 text-slate-400" /></button>
                                                    <button className="p-1 hover:bg-slate-100 rounded">{route.active ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4 text-green-500" />}</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {['trips', 'buses', 'settings'].includes(activeTab) && (
                        <div className="card p-12 text-center">
                            <Bus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{menuItems.find((m) => m.id === activeTab)?.label}</h2>
                            <p className="text-slate-500">Section en cours de développement</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
