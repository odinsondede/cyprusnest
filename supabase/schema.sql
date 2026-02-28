-- CyprusNest Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- ======================
-- 1. USERS (extends Supabase auth.users)
-- ======================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'buyer' CHECK (role IN ('buyer', 'agent', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    preferred_locale TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ======================
-- 2. AGENTS
-- ======================
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    email TEXT NOT NULL,
    photo_url TEXT,
    bio_tr TEXT,
    bio_en TEXT,
    package TEXT NOT NULL DEFAULT 'free' CHECK (package IN ('free', 'pro', 'premium')),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    response_time_hours REAL,
    total_listings INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ======================
-- 3. PROPERTIES
-- ======================
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Basic info
    title_tr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    type TEXT NOT NULL CHECK (type IN ('rent', 'sale')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented')),
    -- Price
    price NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GBP',
    -- Location
    city TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT '',
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    -- Details
    bedrooms INT NOT NULL DEFAULT 1,
    bathrooms INT NOT NULL DEFAULT 1,
    area_sqm INT NOT NULL DEFAULT 0,
    floor INT,
    total_floors INT,
    furnished BOOLEAN NOT NULL DEFAULT FALSE,
    features TEXT[] DEFAULT '{}',
    -- Photos (Cloudinary URLs)
    photos TEXT[] DEFAULT '{}',
    -- Agent
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    -- Score
    cyprusnest_score INT,
    listing_quality_score INT,
    agent_trust_score INT,
    location_score INT,
    price_value_score INT,
    -- Stats
    views_count INT NOT NULL DEFAULT 0,
    whatsapp_clicks INT NOT NULL DEFAULT 0,
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);

-- ======================
-- 4. FAVORITES
-- ======================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- ======================
-- 5. PROPERTY VIEWS (analytics)
-- ======================
CREATE TABLE IF NOT EXISTS property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    viewer_ip TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_views_property ON property_views(property_id);

-- ======================
-- 6. CONTACT REQUESTS (leads)
-- ======================
CREATE TABLE IF NOT EXISTS contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    requester_name TEXT NOT NULL,
    requester_phone TEXT NOT NULL,
    requester_email TEXT,
    message TEXT,
    source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'phone')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ======================
-- 7. ROW LEVEL SECURITY (RLS)
-- ======================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, edit own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Agents: everyone can read, owner can edit
CREATE POLICY "Agents are viewable by everyone" ON agents FOR SELECT USING (true);
CREATE POLICY "Agents can update own record" ON agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can create agent profile" ON agents FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Properties: everyone can read active, agents can CRUD own
CREATE POLICY "Active properties are viewable" ON properties FOR SELECT USING (status = 'active' OR agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "Agents can insert properties" ON properties FOR INSERT WITH CHECK (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "Agents can update own properties" ON properties FOR UPDATE USING (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "Agents can delete own properties" ON properties FOR DELETE USING (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));

-- Favorites: users can CRUD own
CREATE POLICY "Users can read own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Views: anyone can insert, admins can read
CREATE POLICY "Anyone can record views" ON property_views FOR INSERT WITH CHECK (true);
CREATE POLICY "View data is readable" ON property_views FOR SELECT USING (true);

-- Contact requests: anyone can create
CREATE POLICY "Anyone can create contact request" ON contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Agents can read their requests" ON contact_requests FOR SELECT USING (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
