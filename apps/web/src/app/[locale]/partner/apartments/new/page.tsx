'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function NewApartmentPage({ params: { locale } }: { params: { locale: string } }) {
    const t = useTranslations('apartments'); // Ensure translates are available
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        city: '',
        address: '',
        price_per_night: '',
        max_guests: 2,
        images: [''] // Start with one empty slot
    });

    const amenitiesList = [
        'Wifi', 'Cuisine', 'Lave-linge', 'Climatisation', 'Télévision',
        'Espace de travail', 'Piscine', 'Parking gratuit'
    ];
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

    const handleAmenityToggle = (amenity: string) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(prev => prev.filter(a => a !== amenity));
        } else {
            setSelectedAmenities(prev => [...prev, amenity]);
        }
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const addImageSlot = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageSlot = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Filter out empty image strings
            const validImages = formData.images.filter(url => url.trim() !== '');

            const { error } = await supabase.from('apartments').insert({
                title: formData.title,
                description: formData.description,
                city: formData.city,
                address: formData.address,
                price_per_night: parseFloat(formData.price_per_night),
                max_guests: formData.max_guests,
                amenities: selectedAmenities,
                images: validImages.length > 0 ? validImages : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'], // Fallback image
                is_published: true,
                // In a real app, we would add partner_id: auth.uid()
            });

            if (error) throw error;

            router.push(`/${locale}/partner/apartments`);
            router.refresh();
        } catch (error) {
            console.error('Error creating apartment:', error);
            alert('Une erreur est survenue lors de la création de l\'annonce.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-custom py-12 pb-32">
            <Link
                href={`/${locale}/partner/apartments`}
                className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Retour au tableau de bord
            </Link>

            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Ajouter un logement</h1>
                    <p className="text-slate-600">Remplissez les informations ci-dessous pour publier votre annonce.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="p-8 space-y-8">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Informations principales</h3>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Titre de l'annonce</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ex: Loft lumineux au cœur de Paris"
                                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Ville</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="Ex: Paris"
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Adresse complète</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Ex: 12 Rue de Rivoli, 75001"
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Décrivez votre logement, l'ambiance, le quartier..."
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium resize-none"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Détails & Prix</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Prix par nuit (€)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.price_per_night}
                                        onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Voyageurs max.</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="20"
                                        value={formData.max_guests}
                                        onChange={(e) => setFormData({ ...formData, max_guests: parseInt(e.target.value) })}
                                        className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Équipements</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {amenitiesList.map((amenity) => (
                                        <button
                                            key={amenity}
                                            type="button"
                                            onClick={() => handleAmenityToggle(amenity)}
                                            className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all ${selectedAmenities.includes(amenity)
                                                    ? 'bg-primary-50 border-primary-500 text-primary-700'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {amenity}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Photos (URLs)</h3>
                            <p className="text-xs text-slate-500 mb-4">Pour une démo rapide, collez des liens d'images (ex: Unsplash).</p>

                            {formData.images.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => handleImageChange(index, e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium text-sm"
                                    />
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageSlot(index)}
                                            className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addImageSlot}
                                className="text-sm font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                            >
                                <Plus className="w-4 h-4" />
                                Ajouter une autre image
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
                        <Link
                            href={`/${locale}/partner/apartments`}
                            className="px-6 py-3 font-bold text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            Annuler
                        </Link>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>Publication...</>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Publier l'annonce
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
