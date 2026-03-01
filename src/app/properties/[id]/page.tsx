import type { Metadata } from 'next';
import { getPropertyById } from '@/lib/properties';
import PropertyDetailClient from './PropertyDetailClient';

// Dynamic OG metadata — fetched server-side for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
        return {
            title: 'İlan Bulunamadı | Evlek',
            description: 'Bu ilan artık mevcut değil.',
        };
    }

    const title = property.title_tr || property.title_en || 'İlan Detayı';
    const desc = property.description_tr || property.description_en || `${property.city} ${property.district} — ${property.bedrooms} yatak, ${property.area_sqm}m²`;
    const price = property.currency === 'GBP' ? `£${property.price.toLocaleString()}` : `₺${property.price.toLocaleString()}`;
    const typeLabel = property.type === 'rent' ? 'Kiralık' : 'Satılık';
    const ogTitle = `${typeLabel} — ${title} | ${price}`;
    const ogDesc = `${desc.slice(0, 155)}...`;
    const ogImage = property.photos?.[0] || 'https://evlek.app/og-default.png';

    return {
        title: ogTitle,
        description: ogDesc,
        openGraph: {
            title: ogTitle,
            description: ogDesc,
            url: `https://evlek.app/properties/${id}`,
            siteName: 'Evlek',
            images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
            type: 'article',
            locale: 'tr_TR',
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: ogDesc,
            images: [ogImage],
        },
    };
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <PropertyDetailClient id={id} />;
}
