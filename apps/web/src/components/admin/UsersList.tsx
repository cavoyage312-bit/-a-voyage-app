'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Search, MoreVertical, Shield, User, Mail, Phone, Calendar, Plus, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

export function UsersList() {
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [newUserData, setNewUserData] = useState({
        full_name: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('username', { ascending: true });

        if (data) setUsers(data);
        setLoading(false);
    }

    async function handleCreateUser(e: React.FormEvent) {
        e.preventDefault();
        setCreateLoading(true);

        try {
            const res = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUserData)
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                console.error('API non-JSON response:', text);
                alert(`Erreur Serveur (Status ${res.status}). Le serveur n'a pas renvoyé de JSON.`);
                return;
            }

            const data = await res.json();

            if (data.success) {
                setIsCreateModalOpen(false);
                setNewUserData({ full_name: '', email: '', password: '', role: 'user' });
                fetchUsers();
            } else {
                alert(`Erreur: ${data.error || 'Inconnue'}`);
            }
        } catch (err) {
            console.error('Frontend creation catch error:', err);
            alert("Une erreur de réseau ou de connexion est survenue.");
        } finally {
            setCreateLoading(false);
        }
    }

    const filteredUsers = users.filter(u =>
        (u.full_name || u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-slate-900">Utilisateurs</h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="btn btn-primary btn-sm flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nouvel Utilisateur
                    </button>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="input pl-10 h-10 min-w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card shadow-sm border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Dernière Mise à Jour</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 italic-text-none">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/50" />
                                    </tr>
                                ))
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                                                {user.full_name?.[0] || user.username?.[0] || 'U'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{user.full_name || 'Sans nom'}</span>
                                                <span className="text-xs text-slate-500">@{user.username || 'user'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                            user.role === 'partner' ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'
                                            }`}>
                                            {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                            {user.role === 'partner' && <Shield className="w-3 h-3" />}
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-slate-600 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {user.email || 'Email non fourni'}
                                            </span>
                                            {user.phone && (
                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> {user.phone}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {user.updated_at ? format(new Date(user.updated_at), 'dd/MM/yyyy', { locale: fr }) : 'Jamais'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de création */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900">Créer un utilisateur</h3>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nom Complet</label>
                                    <input
                                        type="text"
                                        required
                                        className="input"
                                        placeholder="Jean Dupont"
                                        value={newUserData.full_name}
                                        onChange={(e) => setNewUserData({ ...newUserData, full_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="input"
                                        placeholder="jean@gmail.com"
                                        value={newUserData.email}
                                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Mot de passe</label>
                                    <input
                                        type="password"
                                        required
                                        className="input"
                                        placeholder="••••••••"
                                        value={newUserData.password}
                                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Rôle</label>
                                    <select
                                        className="input"
                                        value={newUserData.role}
                                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                                    >
                                        <option value="user">Utilisateur / Client</option>
                                        <option value="partner">Partenaire</option>
                                        <option value="admin">Administrateur</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="btn btn-outline flex-1"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createLoading}
                                        className="btn btn-primary flex-1"
                                    >
                                        {createLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer l'utilisateur"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
