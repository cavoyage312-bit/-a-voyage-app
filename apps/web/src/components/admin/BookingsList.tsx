'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import {
    Search,
    Filter,
    MoreVertical,
    Plane,
    Building2,
    Bus,
    Car,
    ArrowUpDown,
    Download,
    Edit3,
    Trash2,
    X,
    Save,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingsListProps {
    type: 'flight' | 'hotel' | 'bus' | 'car' | 'transit' | 'all';
    title: string;
}

export function BookingsList({ type, title }: BookingsListProps) {
    const supabase = createClient();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [editingBooking, setEditingBooking] = useState<any | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [type]);

    async function fetchBookings() {
        setLoading(true);
        let query = supabase.from('bookings').select('*');
        if (type !== 'all') {
            query = query.eq('type', type);
        }
        const { data } = await query.order('created_at', { ascending: false });
        if (data) setBookings(data);
        setLoading(false);
    }

    async function handleUpdateStatus(id: string, status: string) {
        const { error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id);

        if (!error) {
            setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
            if (editingBooking?.id === id) setEditingBooking({ ...editingBooking, status });
        }
    }

    async function handleSaveEdit() {
        if (!editingBooking) return;
        setIsSaving(true);

        const { error } = await supabase
            .from('bookings')
            .update({
                price_amount: editingBooking.price_amount,
                status: editingBooking.status,
                first_name: editingBooking.first_name,
                last_name: editingBooking.last_name,
                details: editingBooking.details // Maintenant on sauvegarde aussi les modifications de date/détails
            })
            .eq('id', editingBooking.id);

        if (!error) {
            setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b));
            setEditingBooking(null);
        } else {
            alert("Erreur lors de la sauvegarde : " + error.message);
        }
        setIsSaving(false);
    }

    const filteredBookings = bookings.filter(b =>
        (b.first_name + ' ' + b.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.reference_code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getTypeIcon = (t: string) => {
        switch (t) {
            case 'flight': return <Plane className="w-4 h-4" />;
            case 'hotel': return <Building2 className="w-4 h-4" />;
            case 'bus': return <Bus className="w-4 h-4" />;
            case 'car': return <Car className="w-4 h-4" />;
            default: return <Plane className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="input pl-10 h-10 min-w-[250px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Réf / Date</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Service</th>
                                <th className="px-6 py-4">Montant</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic-text-none">
                            {loading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse"><td colSpan={6} className="px-6 py-8 bg-slate-50/30" /></tr>)
                            ) : filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-sm font-bold text-slate-900">{booking.reference_code || booking.id.slice(0, 8).toUpperCase()}</span>
                                            <span className="text-[10px] text-slate-500">{format(new Date(booking.created_at), 'dd/MM/yy HH:mm')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{booking.first_name} {booking.last_name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(booking.type)}
                                            <span className="text-sm capitalize">{booking.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{formatPrice(booking.price_amount)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {booking.status === 'confirmed' ? 'Confirmé' : booking.status === 'cancelled' ? 'Annulé' : 'Attente'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditingBooking(booking)}
                                                className="p-2 hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                                    className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                                                    title="Annuler"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingBooking && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setEditingBooking(null)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900">Modifier Réservation</h3>
                                <button onClick={() => setEditingBooking(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                                        <input
                                            type="text"
                                            className="input h-10 italic-text-none"
                                            value={editingBooking.first_name}
                                            onChange={(e) => setEditingBooking({ ...editingBooking, first_name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                                        <input
                                            type="text"
                                            className="input h-10 italic-text-none"
                                            value={editingBooking.last_name}
                                            onChange={(e) => setEditingBooking({ ...editingBooking, last_name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Prix (€)</label>
                                        <input
                                            type="number"
                                            className="input h-10 italic-text-none"
                                            value={editingBooking.price_amount}
                                            onChange={(e) => setEditingBooking({ ...editingBooking, price_amount: parseFloat(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Statut</label>
                                        <select
                                            className="input h-10 appearance-none bg-white italic-text-none"
                                            value={editingBooking.status}
                                            onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="confirmed">Confirmé</option>
                                            <option value="cancelled">Annulé</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Modifier la Date</label>
                                    <input
                                        type="date"
                                        className="input h-10 italic-text-none"
                                        defaultValue={editingBooking.details?.date}
                                        onChange={(e) => setEditingBooking({
                                            ...editingBooking,
                                            details: { ...editingBooking.details, date: e.target.value }
                                        })}
                                    />
                                    <p className="text-[10px] text-slate-400">Actuelle : {editingBooking.details?.date || 'Non définie'}</p>
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl flex gap-3 shadow-inner">
                                    <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Les changements sont appliqués instantanément sur le site et le client recevra ses nouvelles informations de voyage.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
                                <button
                                    onClick={() => setEditingBooking(null)}
                                    className="flex-1 btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                                >
                                    Fermer
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                    className="flex-1 btn btn-primary gap-2"
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Appliquer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function RefreshCw(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path><path d="M8 16H3v5"></path></svg>;
}
