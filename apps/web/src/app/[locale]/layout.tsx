import { NextIntlClientProvider } from 'next-intl';
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PartnerBanner } from '@/components/layout/PartnerBanner';
import { locales } from '@/routing';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: 'Ça Voyage',
    description: 'Voyagez ensemble, simplement.',
    icons: {
        icon: '/logo.png',
        apple: '/logo.png',
    },
};

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params: { locale },
}: {
    children: React.ReactNode;
    params: { locale: string };
}) {
    if (!locales.includes(locale as any)) {
        notFound();
    }

    unstable_setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale}>
            <body className="min-h-screen flex flex-col">
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
