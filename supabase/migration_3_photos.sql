-- Update demo listings with realistic photos
-- These are served as static assets from /photos/ on Vercel

-- Listing 1: Gönyeli 2+1 Kiralık (apartment)
UPDATE properties SET photos = ARRAY['/photos/apt-interior.png', '/photos/apt-kitchen.png', '/photos/bedroom.png']
WHERE title_tr LIKE '%Gönyeli%' AND type = 'rent' AND bedrooms = 2;

-- Listing 2: Merkez StüdYo (studio) 
UPDATE properties SET photos = ARRAY['/photos/studio.png', '/photos/bathroom.png', '/photos/apt-kitchen.png']
WHERE title_tr LIKE '%Stüdyo%' OR (bedrooms = 0 AND type = 'rent');

-- Listing 3: Haspolat 2+1 (apartment)
UPDATE properties SET photos = ARRAY['/photos/apt-exterior.png', '/photos/living-room.png', '/photos/bedroom.png']
WHERE title_tr LIKE '%Haspolat%' AND type = 'rent';

-- Listing 4: Alsancak villa (sale)
UPDATE properties SET photos = ARRAY['/photos/villa.png', '/photos/living-room.png', '/photos/beach-view.png']
WHERE city = 'Girne' AND type = 'sale' AND bedrooms >= 4;

-- Listing 5: YDÜ Yakını (student area)
UPDATE properties SET photos = ARRAY['/photos/studio.png', '/photos/apt-interior.png', '/photos/bathroom.png']
WHERE title_tr LIKE '%YDÜ%' AND type = 'rent';

-- Listing 6: Long Beach (beach area)
UPDATE properties SET photos = ARRAY['/photos/beach-view.png', '/photos/living-room.png', '/photos/apt-kitchen.png']
WHERE title_tr LIKE '%Long Beach%' OR (city = 'İskele' AND type = 'rent');

-- Listing 7: Küçük Kaymaklı (rent)
UPDATE properties SET photos = ARRAY['/photos/apt-interior.png', '/photos/bedroom.png', '/photos/apt-exterior.png']
WHERE title_tr LIKE '%Kaymaklı%' AND type = 'rent';

-- Listing 8: Girne Satılık Daire
UPDATE properties SET photos = ARRAY['/photos/apt-exterior.png', '/photos/apt-kitchen.png', '/photos/living-room.png']
WHERE city = 'Girne' AND type = 'sale' AND bedrooms < 4;

-- Listing 9: Magusa 3+1 Satılık
UPDATE properties SET photos = ARRAY['/photos/living-room.png', '/photos/bedroom.png', '/photos/bathroom.png']
WHERE city = 'Gazimağusa' AND type = 'sale';

-- Fallback: Any remaining listings without photos get a generic set
UPDATE properties SET photos = ARRAY['/photos/apt-interior.png', '/photos/apt-exterior.png', '/photos/apt-kitchen.png']
WHERE photos IS NULL OR photos = '{}';
