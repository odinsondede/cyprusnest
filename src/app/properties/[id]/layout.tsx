import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const { data: property } = await supabase
        .from('properties')
        .select('title_en, title_tr, description_en, description_tr, price, currency, city, district, type, bedrooms, area_sqm, photos')
        .eq('id', id)
        .single();

    if (!property) {
        return { title: 'Property Not Found' };
    }

    const title = property.title_en || property.title_tr;
    const desc = property.description_en || property.description_tr || '';
    const isRent = property.type === 'rent';
    const priceText = `£${property.price.toLocaleString()}${isRent ? '/mo' : ''}`;
    const fullTitle = `${title} — ${priceText} | ${property.district}, ${property.city}`;
    const fullDesc = `${property.bedrooms} bed, ${property.area_sqm}m² ${isRent ? 'rental' : 'for sale'} in ${property.district}, ${property.city}. ${desc.slice(0, 120)}`;
    const photo = property.photos?.[0] || '/og-image.png';

    return {
        title: fullTitle,
        description: fullDesc,
        openGraph: {
            title: fullTitle,
            description: fullDesc,
            type: 'article',
            images: [{ url: photo, width: 1200, height: 630, alt: title }],
            locale: 'en_US',
            alternateLocale: ['tr_TR'],
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description: fullDesc,
            images: [photo],
        },
    };
}

export default function PropertyLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
