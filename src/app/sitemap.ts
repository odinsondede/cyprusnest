import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://evlek.app';

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/properties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/add-property`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        // Legal
        { url: `${baseUrl}/legal`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        { url: `${baseUrl}/legal/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/legal/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
        // Blog
        { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/blog/buying-property-foreigners-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/gonyeli-rental-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/kktc-tax-calculator-explained`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/north-cyprus-rental-yield`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/blog/virtual-staging-sell-faster`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ];

    // Dynamic property pages from Supabase
    let propertyPages: MetadataRoute.Sitemap = [];
    try {
        const { data } = await supabase
            .from('properties')
            .select('id, updated_at')
            .eq('status', 'active');

        if (data) {
            propertyPages = data.map((p) => ({
                url: `${baseUrl}/properties/${p.id}`,
                lastModified: new Date(p.updated_at || Date.now()),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));
        }
    } catch {
        // If Supabase fails, skip dynamic pages
    }

    return [...staticPages, ...propertyPages];
}
