import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: {
        default: 'ÇA VOYAGE - Réservation de vols, hôtels, bus et voitures',
        template: '%s | ÇA VOYAGE',
    },
    description:
        'Plateforme de réservation multimodale. Réservez vos vols, hôtels, bus et voitures en quelques clics. Europe et Afrique.',
    keywords: [
        'voyage',
        'réservation',
        'vols',
        'hôtels',
        'bus',
        'location voiture',
        'Europe',
        'Afrique',
    ],
    authors: [{ name: 'ÇA VOYAGE' }],
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        siteName: 'ÇA VOYAGE',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
