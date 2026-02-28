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

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

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

CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_tr TEXT NOT NULL,
    title_en TEXT NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    type TEXT NOT NULL CHECK (type IN ('rent', 'sale')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented')),
    price NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'GBP',
    city TEXT NOT NULL,
    district TEXT NOT NULL DEFAULT '',
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    bedrooms INT NOT NULL DEFAULT 1,
    bathrooms INT NOT NULL DEFAULT 1,
    area_sqm INT NOT NULL DEFAULT 0,
    floor INT,
    total_floors INT,
    furnished BOOLEAN NOT NULL DEFAULT FALSE,
    features TEXT[] DEFAULT '{}',
    photos TEXT[] DEFAULT '{}',
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    cyprusnest_score INT,
    listing_quality_score INT,
    agent_trust_score INT,
    location_score INT,
    price_value_score INT,
    views_count INT NOT NULL DEFAULT 0,
    whatsapp_clicks INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_agent ON properties(agent_id);

CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

CREATE TABLE IF NOT EXISTS property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    viewer_ip TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_views_property ON property_views(property_id);

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

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "agents_select" ON agents FOR SELECT USING (true);
CREATE POLICY "agents_update" ON agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "agents_insert" ON agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "properties_select" ON properties FOR SELECT USING (true);
CREATE POLICY "properties_insert" ON properties FOR INSERT WITH CHECK (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "properties_update" ON properties FOR UPDATE USING (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "properties_delete" ON properties FOR DELETE USING (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));
CREATE POLICY "favorites_select" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete" ON favorites FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "views_insert" ON property_views FOR INSERT WITH CHECK (true);
CREATE POLICY "views_select" ON property_views FOR SELECT USING (true);
CREATE POLICY "contacts_insert" ON contact_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_select" ON contact_requests FOR SELECT USING (agent_id IN (SELECT id FROM agents WHERE user_id = auth.uid()));

INSERT INTO properties (title_tr, title_en, type, status, price, currency, city, district, bedrooms, bathrooms, area_sqm, furnished, features, cyprusnest_score, views_count) VALUES
('YDÜ Yakını 2+1 Eşyalı Daire', 'Furnished 2+1 Near NEU', 'rent', 'active', 550, 'GBP', 'Lefkoşa', 'Gönyeli', 2, 1, 85, true, ARRAY['Wi-Fi', 'Klima', 'Otopark', 'Güvenlik'], 82, 245),
('Gönyeli Merkez 1+1 Stüdyo', 'Gönyeli Center 1+1 Studio', 'rent', 'active', 450, 'GBP', 'Lefkoşa', 'Gönyeli', 1, 1, 55, true, ARRAY['Klima', 'Eşyalı', 'Asansör'], 75, 180),
('Gönyeli Site İçi 3+1 Daire', 'Gönyeli Complex 3+1 Apartment', 'rent', 'active', 700, 'GBP', 'Lefkoşa', 'Gönyeli', 3, 2, 120, true, ARRAY['Havuz', 'Spor Salonu', 'Güvenlik', 'Otopark', 'Klima'], 88, 312),
('Yenikent Satılık 2+1 Daire', 'Yenikent 2+1 For Sale', 'sale', 'active', 85000, 'GBP', 'Lefkoşa', 'Gönyeli', 2, 1, 90, false, ARRAY['Güney Cephe', 'Otopark', 'Yeni Bina'], 79, 156),
('Alsancak Deniz Manzaralı Villa', 'Alsancak Sea View Villa', 'sale', 'active', 250000, 'GBP', 'Girne', 'Alsancak', 4, 3, 220, false, ARRAY['Özel Havuz', 'Bahçe', 'Deniz Manzarası', 'BBQ', 'Otopark'], 92, 520),
('Girne Merkez 1+1 Penthouse', 'Kyrenia Center Penthouse', 'rent', 'active', 900, 'GBP', 'Girne', 'Merkez', 1, 1, 75, true, ARRAY['Teras', 'Deniz Manzarası', 'Klima', 'Eşyalı'], 85, 290),
('Long Beach Stüdyo Daire', 'Long Beach Studio Apartment', 'sale', 'active', 130000, 'GBP', 'İskele', 'Long Beach', 1, 1, 50, true, ARRAY['Denize Sıfır', 'Havuz', 'Spor Salonu', 'Eşyalı'], 90, 410),
('İskele Yeni Proje 2+1', 'Iskele New Project 2+1', 'sale', 'active', 150000, 'GBP', 'İskele', 'Boğaz', 2, 1, 85, false, ARRAY['Yeni İnşaat', 'Havuz', 'Otopark', 'Deniz Manzarası'], 86, 335),
('DAÜ Yakını 1+1 Kiralık', 'Near EMU 1+1 For Rent', 'rent', 'active', 400, 'GBP', 'Gazimağusa', 'Çanakkale', 1, 1, 60, true, ARRAY['Klima', 'Eşyalı', 'Üniversiteye Yakın'], 74, 198);
