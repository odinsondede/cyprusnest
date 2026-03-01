import { supabase } from './supabase';

export async function getFavorites(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

    if (error) return [];
    return (data || []).map((f: { property_id: string }) => f.property_id);
}

export async function toggleFavorite(userId: string, propertyId: string): Promise<boolean> {
    // Check if exists
    const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('property_id', propertyId)
        .single();

    if (data) {
        // Remove
        await supabase.from('favorites').delete().eq('id', data.id);
        return false;
    } else {
        // Add
        await supabase.from('favorites').insert({ user_id: userId, property_id: propertyId });
        return true;
    }
}
