import { supabase, type Property } from './supabase';

export async function getProperties(filters?: {
    type?: 'rent' | 'sale';
    city?: string;
    search?: string;
    sortBy?: 'newest' | 'price-low' | 'price-high' | 'score';
}) {
    let query = supabase
        .from('properties')
        .select('*')
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

    const { data, error } = await query;
    if (error) {
        console.error('Error fetching properties:', error);
        return [];
    }
    return data as Property[];
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
    await supabase.rpc('increment_views', { prop_id: propertyId }).catch(() => {
        // Fallback: direct update
        supabase
            .from('properties')
            .update({ views_count: supabase.rpc ? undefined : 0 })
            .eq('id', propertyId);
    });
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
