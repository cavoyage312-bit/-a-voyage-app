import { redirect } from '@/routing';

export default function ApartmentsIndexPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    redirect({ href: '/apartments/search', locale });
}
