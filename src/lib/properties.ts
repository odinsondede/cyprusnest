import { supabase, type Property } from './supabase';

export const PAGE_SIZE = 12;

export async function getProperties(filters?: {
    type?: 'rent' | 'sale';
    city?: string;
    search?: string;
    property_type?: string;
    price_min?: number;
    price_max?: number;
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'score';
    limit?: number;
    offset?: number;
}): Promise<{ data: Property[]; count: number; hasMore: boolean }> {
    const limit = filters?.limit ?? PAGE_SIZE;
    const offset = filters?.offset ?? 0;

    let query = supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

    if (filters?.type) {
        query = query.eq('type', filters.type);
    }
    if (filters?.city) {
        query = query.eq('city', filters.city);
    }
    if (filters?.search) {
        query = query.or(`title_tr.ilike.%${filters.search}%,title_en.ilike.%${filters.search}%,district.ilike.%${filters.search}%,city.ilike.%${filters.search}%`);
    }
    if (filters?.property_type) {
        query = query.eq('property_type', filters.property_type);
    }
    if (filters?.price_min) {
        query = query.gte('price', filters.price_min);
    }
    if (filters?.price_max) {
        query = query.lte('price', filters.price_max);
    }

    switch (filters?.sortBy) {
        case 'price-low':
            query = query.order('price', { ascending: true });
            break;
        case 'price-high':
            query = query.order('price', { ascending: false });
            break;
        case 'score':
            query = query.order('cyprusnest_score', { ascending: false });
            break;
        default:
            query = query.order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) {
        console.error('Error fetching properties:', error);
        return { data: [], count: 0, hasMore: false };
    }
    const total = count ?? 0;
    return {
        data: data as Property[],
        count: total,
        hasMore: offset + limit < total,
    };
}

export async function getPropertyById(id: string) {
    const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching property:', error);
        return null;
    }
    return data as Property;
}

export async function getCities(): Promise<string[]> {
    const { data, error } = await supabase
        .from('properties')
        .select('city')
        .eq('status', 'active');

    if (error) return [];
    const cities = [...new Set((data || []).map((p: { city: string }) => p.city))];
    return cities;
}

export async function incrementViews(propertyId: string) {
    try {
        // Use Supabase's built-in way to increment
        const { data } = await supabase
            .from('properties')
            .select('views_count')
            .eq('id', propertyId)
            .single();

        if (data) {
            await supabase
                .from('properties')
                .update({ views_count: (data.views_count || 0) + 1 })
                .eq('id', propertyId);
        }
    } catch {
        // silently fail
    }
}

export function formatPrice(price: number, currency: string = 'GBP'): string {
    if (price >= 1000) {
        return `£${price.toLocaleString()}`;
    }
    return `£${price}/mo`;
}

export function getScoreColor(score: number): string {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
}
