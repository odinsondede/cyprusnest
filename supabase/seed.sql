-- CyprusNest Demo Properties Seed Data
-- Run this in Supabase SQL Editor after schema.sql

INSERT INTO properties (title_tr, title_en, type, status, price, currency, city, district, bedrooms, bathrooms, area_sqm, furnished, features, cyprusnest_score, views_count) VALUES
-- Gönyeli properties
('YDÜ Yakını 2+1 Eşyalı Daire', 'Furnished 2+1 Near NEU', 'rent', 'active', 550, 'GBP', 'Lefkoşa', 'Gönyeli', 2, 1, 85, true, ARRAY['Wi-Fi', 'Klima', 'Otopark', 'Güvenlik'], 82, 245),
('Gönyeli Merkez 1+1 Stüdyo', 'Gönyeli Center 1+1 Studio', 'rent', 'active', 450, 'GBP', 'Lefkoşa', 'Gönyeli', 1, 1, 55, true, ARRAY['Klima', 'Eşyalı', 'Asansör'], 75, 180),
('Gönyeli Site İçi 3+1 Daire', 'Gönyeli Complex 3+1 Apartment', 'rent', 'active', 700, 'GBP', 'Lefkoşa', 'Gönyeli', 3, 2, 120, true, ARRAY['Havuz', 'Spor Salonu', 'Güvenlik', 'Otopark', 'Klima'], 88, 312),
('Yenikent Satılık 2+1 Daire', 'Yenikent 2+1 For Sale', 'sale', 'active', 85000, 'GBP', 'Lefkoşa', 'Gönyeli', 2, 1, 90, false, ARRAY['Güney Cephe', 'Otopark', 'Yeni Bina'], 79, 156),

-- Girne properties
('Alsancak Deniz Manzaralı Villa', 'Alsancak Sea View Villa', 'sale', 'active', 250000, 'GBP', 'Girne', 'Alsancak', 4, 3, 220, false, ARRAY['Özel Havuz', 'Bahçe', 'Deniz Manzarası', 'BBQ', 'Otopark'], 92, 520),
('Girne Merkez 1+1 Penthouse', 'Kyrenia Center Penthouse', 'rent', 'active', 900, 'GBP', 'Girne', 'Merkez', 1, 1, 75, true, ARRAY['Teras', 'Deniz Manzarası', 'Klima', 'Eşyalı'], 85, 290),

-- İskele properties
('Long Beach Stüdyo Daire', 'Long Beach Studio Apartment', 'sale', 'active', 130000, 'GBP', 'İskele', 'Long Beach', 1, 1, 50, true, ARRAY['Denize Sıfır', 'Havuz', 'Spor Salonu', 'Eşyalı'], 90, 410),
('İskele Yeni Proje 2+1', 'Iskele New Project 2+1', 'sale', 'active', 150000, 'GBP', 'İskele', 'Boğaz', 2, 1, 85, false, ARRAY['Yeni İnşaat', 'Havuz', 'Otopark', 'Deniz Manzarası'], 86, 335),

-- Gazimağusa
('DAÜ Yakını 1+1 Kiralık', 'Near EMU 1+1 For Rent', 'rent', 'active', 400, 'GBP', 'Gazimağusa', 'Çanakkale', 1, 1, 60, true, ARRAY['Klima', 'Eşyalı', 'Üniversiteye Yakın'], 74, 198);
