import { supabase } from './supabase';

const BUCKET = 'property-photos';

export async function uploadPropertyPhoto(file: File, propertyId?: string): Promise<string | null> {
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `${propertyId || 'temp'}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
        });

    if (error) {
        console.error('Upload error:', error);
        return null;
    }

    const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

export async function deletePropertyPhoto(url: string): Promise<boolean> {
    // Extract path from URL
    const match = url.match(/property-photos\/(.+)$/);
    if (!match) return false;

    const { error } = await supabase.storage
        .from(BUCKET)
        .remove([match[1]]);

    return !error;
}
