-- ============================================
-- Faz 2.5: KKTC Kiralık Pazar Odağı
-- Supabase SQL Editor'de çalıştırın
-- ============================================

-- Yeni sütunlar: Depozito, Sözleşme, Tapu, Faturalar
ALTER TABLE properties ADD COLUMN IF NOT EXISTS deposit_amount INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS contract_type TEXT DEFAULT 'yearly' CHECK (contract_type IN ('monthly', 'sixmonth', 'yearly', 'flexible'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS title_deed_type TEXT DEFAULT 'turkish' CHECK (title_deed_type IN ('turkish', 'equivalent', 'allocation', 'foreign', 'unknown'));
ALTER TABLE properties ADD COLUMN IF NOT EXISTS bills_included BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_now BOOLEAN DEFAULT true;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS available_date DATE;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS monthly_fees INTEGER DEFAULT 0;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS nearby_landmarks TEXT[] DEFAULT '{}';
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floor_number INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_floors INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS pool BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sea_view BOOLEAN DEFAULT false;

-- Demo ilanları güncelle (kira ilanları için)
UPDATE properties SET
  deposit_amount = 1,
  contract_type = 'yearly',
  bills_included = false,
  available_now = true,
  monthly_fees = 50,
  parking = true,
  nearby_landmarks = ARRAY['YDÜ 5dk', 'Market 2dk']
WHERE title_tr LIKE '%Gönyeli%' AND type = 'rent';

UPDATE properties SET
  deposit_amount = 2,
  contract_type = 'yearly',
  bills_included = false,
  available_now = true,
  monthly_fees = 75,
  nearby_landmarks = ARRAY['Girne Harbour 3dk']
WHERE title_tr LIKE '%Girne%' AND type = 'rent';

UPDATE properties SET
  deposit_amount = 1,
  contract_type = 'monthly',
  bills_included = true,
  available_now = true,
  monthly_fees = 0,
  nearby_landmarks = ARRAY['Long Beach 1dk', 'Casino 5dk']
WHERE title_tr LIKE '%Long Beach%';

UPDATE properties SET
  deposit_amount = 1,
  contract_type = 'monthly',
  bills_included = false,
  available_now = true,
  monthly_fees = 40,
  nearby_landmarks = ARRAY['DAÜ 10dk', 'Çarşı 3dk']
WHERE title_tr LIKE '%Yakınları%';

-- Satılık ilanlar için tapu türü
UPDATE properties SET title_deed_type = 'turkish' WHERE type = 'sale' AND city = 'Lefkoşa';
UPDATE properties SET title_deed_type = 'equivalent' WHERE type = 'sale' AND city = 'İskele';
UPDATE properties SET title_deed_type = 'turkish' WHERE type = 'sale' AND city = 'Girne';
