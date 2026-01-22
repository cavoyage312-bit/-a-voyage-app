import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Validate that the incoming locale is valid
    if (!locales.includes(locale as any)) {
        locale = locales[0]; // Fallback to default
    }

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
    };
});
