import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PropertyType = 'rent' | 'sale';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented';

export interface Property {
    id: string;
    title_tr: string;
    title_en: string;
    description_tr: string;
    description_en: string;
    type: PropertyType;
    status: PropertyStatus;
    price: number;
    currency: string;
    city: string;
    district: string;
    address: string;
    lat: number | null;
    lng: number | null;
    bedrooms: number;
    bathrooms: number;
    area_sqm: number;
    floor: number | null;
    total_floors: number | null;
    furnished: boolean;
    features: string[];
    photos: string[];
    agent_id: string | null;
    cyprusnest_score: number | null;
    views_count: number;
    // KKTC rental-specific fields
    deposit_amount: number;
    contract_type: 'monthly' | 'sixmonth' | 'yearly' | 'flexible';
    title_deed_type: 'turkish' | 'equivalent' | 'allocation' | 'foreign' | 'unknown';
    bills_included: boolean;
    available_now: boolean;
    available_date: string | null;
    monthly_fees: number;
    nearby_landmarks: string[];
    parking: boolean;
    pool: boolean;
    sea_view: boolean;
    created_at: string;
    updated_at: string;
}

export interface Agent {
    id: string;
    user_id: string;
    company_name: string;
    phone: string;
    whatsapp: string;
    email: string;
    photo_url: string | null;
    bio_tr: string | null;
    bio_en: string | null;
    package: 'free' | 'pro' | 'premium';
    verified: boolean;
    response_time_hours: number | null;
    total_listings: number;
    created_at: string;
}

export interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    role: 'buyer' | 'agent' | 'admin';
    phone: string | null;
    avatar_url: string | null;
    preferred_locale: string;
    created_at: string;
}

export interface Favorite {
    id: string;
    user_id: string;
    property_id: string;
    created_at: string;
}
