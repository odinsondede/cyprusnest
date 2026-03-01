export interface Property {
    id: string;
    title: Record<string, string>;
    description: Record<string, string>;
    type: 'rent' | 'sale';
    propertyType: 'apartment' | 'villa' | 'penthouse' | 'studio' | 'land';
    price: number;
    currency: 'GBP' | 'EUR' | 'TRY';
    priceLabel?: string; // "/month" for rent
    bedrooms: number;
    bathrooms: number;
    area: number; // m²
    location: {
        city: string;
        district: string;
        lat: number;
        lng: number;
    };
    features: string[];
    images: string[];
    score: number; // Evlek Score 0-100
    agent: {
        name: string;
        company: string;
        phone: string;
        verified: boolean;
    };
    isNew: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export const sampleProperties: Property[] = [
    {
        id: '1',
        title: {
            tr: 'Girne Çatalköy\'de Deniz Manzaralı 2+1 Daire',
            en: 'Sea View 2+1 Apartment in Kyrenia Catalkoy',
            ru: 'Квартира 2+1 с видом на море в Кирении Чаталкёй',
            de: '2+1 Wohnung mit Meerblick in Kyrenia Çatalköy',
            ar: 'شقة 2+1 مع إطلالة بحرية في كيرينيا جاتالكوي',
        },
        description: {
            tr: 'Denize yürüme mesafesinde, güneşli, geniş balkonlu modern daire. Havuz, spor salonu ve 7/24 güvenlik mevcut.',
            en: 'Walking distance to the sea, sunny modern apartment with spacious balcony. Pool, gym and 24/7 security available.',
            ru: 'Пешком до моря, солнечная современная квартира с просторным балконом. Бассейн, спортзал и охрана 24/7.',
            de: 'Fußläufig zum Meer, sonnige moderne Wohnung mit geräumigem Balkon. Pool, Fitnessstudio und 24/7 Sicherheit.',
            ar: 'على بعد خطوات من البحر، شقة حديثة مشمسة مع شرفة واسعة. مسبح وصالة رياضية وأمن على مدار الساعة.',
        },
        type: 'rent',
        propertyType: 'apartment',
        price: 450,
        currency: 'GBP',
        priceLabel: '/mo',
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        location: { city: 'Kyrenia', district: 'Çatalköy', lat: 35.33, lng: 33.42 },
        features: ['Sea View', 'Pool', 'Gym', 'Parking', 'Balcony', 'Furnished'],
        images: [],
        score: 87,
        agent: { name: 'Ahmet Kaya', company: 'Kaya Emlak', phone: '+90 548 xxx xx xx', verified: true },
        isNew: true,
        isFeatured: true,
        createdAt: '2026-02-25',
    },
    {
        id: '2',
        title: {
            tr: 'İskele Long Beach\'te Satılık Lüks 3+1 Penthouse',
            en: 'Luxury 3+1 Penthouse for Sale in Iskele Long Beach',
            ru: 'Роскошный пентхаус 3+1 на продажу в Искеле Лонг Бич',
            de: 'Luxus 3+1 Penthouse zum Verkauf in Iskele Long Beach',
            ar: 'بنتهاوس فاخر 3+1 للبيع في إسكيلي لونغ بيتش',
        },
        description: {
            tr: '180° deniz manzaralı çatı katı. Özel teras, jakuzi, akıllı ev sistemi. Yeni teslim, anahtar teslim.',
            en: '180° sea view rooftop. Private terrace, jacuzzi, smart home system. Newly delivered, turnkey.',
            ru: '180° вид на море. Частная терраса, джакузи, умный дом. Новая, под ключ.',
            de: '180° Meerblick. Private Terrasse, Jacuzzi, Smart Home. Neuübergabe, schlüsselfertig.',
            ar: 'إطلالة بحرية 180°. تراس خاص، جاكوزي، نظام منزل ذكي. تسليم جديد.',
        },
        type: 'sale',
        propertyType: 'penthouse',
        price: 285000,
        currency: 'GBP',
        bedrooms: 3,
        bathrooms: 2,
        area: 160,
        location: { city: 'Iskele', district: 'Long Beach', lat: 35.28, lng: 33.88 },
        features: ['Sea View', 'Penthouse', 'Jacuzzi', 'Smart Home', 'Terrace', 'Parking'],
        images: [],
        score: 94,
        agent: { name: 'Elif Demir', company: 'Northern Estates', phone: '+90 533 xxx xx xx', verified: true },
        isNew: false,
        isFeatured: true,
        createdAt: '2026-02-20',
    },
    {
        id: '3',
        title: {
            tr: 'Lefkoşa Gönyeli\'de Kiralık 1+1 Stüdyo',
            en: 'Studio Apartment for Rent in Nicosia Gönyeli',
            ru: 'Студия в аренду в Никосии Гёньели',
            de: 'Studio-Wohnung zur Miete in Nikosia Gönyeli',
            ar: 'شقة استوديو للإيجار في نيقوسيا غونيلي',
        },
        description: {
            tr: 'Üniversitelere yakın, mobilyalı, ekonomik stüdyo. Öğrenci ve genç profesyoneller için ideal.',
            en: 'Near universities, furnished, affordable studio. Ideal for students and young professionals.',
            ru: 'Рядом с университетами, меблированная, доступная студия. Идеально для студентов.',
            de: 'In der Nähe von Universitäten, möbliert, günstig. Ideal für Studenten.',
            ar: 'قريبة من الجامعات، مفروشة، اقتصادية. مثالية للطلاب.',
        },
        type: 'rent',
        propertyType: 'studio',
        price: 250,
        currency: 'GBP',
        priceLabel: '/mo',
        bedrooms: 1,
        bathrooms: 1,
        area: 45,
        location: { city: 'Nicosia', district: 'Gönyeli', lat: 35.21, lng: 33.34 },
        features: ['Furnished', 'Near University', 'Parking', 'Internet'],
        images: [],
        score: 72,
        agent: { name: 'Hasan Yılmaz', company: 'City Homes', phone: '+90 542 xxx xx xx', verified: true },
        isNew: true,
        isFeatured: false,
        createdAt: '2026-02-27',
    },
    {
        id: '4',
        title: {
            tr: 'Girne Alsancak\'ta Satılık Havuzlu Villa',
            en: 'Villa with Pool for Sale in Kyrenia Alsancak',
            ru: 'Вилла с бассейном на продажу в Кирении Алсанджак',
            de: 'Villa mit Pool zum Verkauf in Kyrenia Alsancak',
            ar: 'فيلا مع مسبح للبيع في كيرينيا الصنجق',
        },
        description: {
            tr: '4+1, müstakil, özel havuzlu villa. Geniş bahçe, BBQ alanı, çift garaj. Huzurlu site içinde.',
            en: '4+1 detached villa with private pool. Large garden, BBQ area, double garage. In a peaceful complex.',
            ru: '4+1 вилла с частным бассейном. Большой сад, BBQ, двойной гараж. В тихом комплексе.',
            de: '4+1 freistehende Villa mit privatem Pool. Großer Garten, BBQ, Doppelgarage.',
            ar: 'فيلا 4+1 مستقلة مع مسبح خاص. حديقة كبيرة، منطقة شواء، مرآب مزدوج.',
        },
        type: 'sale',
        propertyType: 'villa',
        price: 420000,
        currency: 'GBP',
        bedrooms: 4,
        bathrooms: 3,
        area: 240,
        location: { city: 'Kyrenia', district: 'Alsancak', lat: 35.33, lng: 33.37 },
        features: ['Pool', 'Garden', 'BBQ', 'Garage', 'Mountain View', 'Security'],
        images: [],
        score: 91,
        agent: { name: 'Özge Aksoy', company: 'Mediterranean Properties', phone: '+90 548 xxx xx xx', verified: true },
        isNew: false,
        isFeatured: true,
        createdAt: '2026-02-15',
    },
    {
        id: '5',
        title: {
            tr: 'Gazimağusa Merkezde Kiralık 2+1 Daire',
            en: '2+1 Apartment for Rent in Famagusta Center',
            ru: 'Квартира 2+1 в аренду в центре Фамагусты',
            de: '2+1 Wohnung zur Miete im Zentrum von Famagusta',
            ar: 'شقة 2+1 للإيجار في وسط فاماغوستا',
        },
        description: {
            tr: 'Şehir merkezinde, alışveriş ve ulaşıma yakın, yeni bina. Asansör, otopark, güvenlik.',
            en: 'City center, near shopping and transport, new building. Elevator, parking, security.',
            ru: 'Центр города, рядом магазины и транспорт, новостройка. Лифт, парковка, охрана.',
            de: 'Stadtzentrum, nahe Einkaufsmöglichkeiten, Neubau. Aufzug, Parkplatz, Sicherheit.',
            ar: 'وسط المدينة، قريب من المتاجر والمواصلات، مبنى جديد.',
        },
        type: 'rent',
        propertyType: 'apartment',
        price: 350,
        currency: 'GBP',
        priceLabel: '/mo',
        bedrooms: 2,
        bathrooms: 1,
        area: 75,
        location: { city: 'Famagusta', district: 'Center', lat: 35.12, lng: 33.94 },
        features: ['Elevator', 'Parking', 'Security', 'New Building', 'Furnished'],
        images: [],
        score: 76,
        agent: { name: 'Mert Can', company: 'East Coast Realty', phone: '+90 533 xxx xx xx', verified: false },
        isNew: false,
        isFeatured: false,
        createdAt: '2026-02-22',
    },
    {
        id: '6',
        title: {
            tr: 'İskele Bafra\'da Satılık Yatırımlık 1+1 Daire',
            en: 'Investment 1+1 Apartment for Sale in Iskele Bafra',
            ru: 'Инвестиционная квартира 1+1 на продажу в Искеле Бафра',
            de: '1+1 Investitionswohnung zum Verkauf in Iskele Bafra',
            ar: 'شقة استثمارية 1+1 للبيع في إسكيلي بافرا',
        },
        description: {
            tr: 'Yeni projede, denize 300m, yüksek kira getirisi. Havuz, SPA, restoran kompleksi. Taksit imkanı.',
            en: 'New project, 300m to sea, high rental yield. Pool, SPA, restaurant complex. Installment available.',
            ru: 'Новый проект, 300м до моря, высокий доход. Бассейн, SPA, ресторан. Рассрочка.',
            de: 'Neues Projekt, 300m zum Meer, hohe Mietrendite. Pool, SPA, Restaurant. Ratenzahlung.',
            ar: 'مشروع جديد، 300 متر من البحر، عائد إيجار مرتفع. مسبح وسبا ومطعم.',
        },
        type: 'sale',
        propertyType: 'apartment',
        price: 95000,
        currency: 'GBP',
        bedrooms: 1,
        bathrooms: 1,
        area: 55,
        location: { city: 'Iskele', district: 'Bafra', lat: 35.26, lng: 33.95 },
        features: ['Sea View', 'Pool', 'SPA', 'Restaurant', 'Investment', 'Installment'],
        images: [],
        score: 82,
        agent: { name: 'Ali Öztürk', company: 'Golden Key Properties', phone: '+90 548 xxx xx xx', verified: true },
        isNew: true,
        isFeatured: false,
        createdAt: '2026-02-26',
    },
    {
        id: '7',
        title: {
            tr: 'Gönyeli YDÜ Yakını Kiralık 2+1 Mobilyalı Daire',
            en: 'Furnished 2+1 Apartment Near YDÜ, Gönyeli',
            ru: 'Меблированная квартира 2+1 рядом с YDÜ, Гёньели',
            de: '2+1 möblierte Wohnung nahe YDÜ, Gönyeli',
            ar: 'شقة مفروشة 2+1 قرب YDÜ، غونيلي',
        },
        description: {
            tr: 'YDÜ\'ye 5 dakika, merkezi konum. Kombi, klima, internet dahil. Erkek veya kız öğrenci.',
            en: '5 min to NEU. Central location. Central heating, AC, internet included. Student-friendly.',
            ru: '5 минут до NEU. Центральное расположение. Отопление, кондиционер, интернет включены.',
            de: '5 Min. zur NEU. Zentrale Lage. Heizung, Klimaanlage, Internet inklusive.',
            ar: '5 دقائق من NEU. موقع مركزي. تدفئة، تكييف، إنترنت مشمول.',
        },
        type: 'rent',
        propertyType: 'apartment',
        price: 300,
        currency: 'GBP',
        priceLabel: '/mo',
        bedrooms: 2,
        bathrooms: 1,
        area: 70,
        location: { city: 'Nicosia', district: 'Gönyeli', lat: 35.22, lng: 33.34 },
        features: ['Furnished', 'Near University', 'Internet', 'AC', 'Central Heating', 'Parking'],
        images: [],
        score: 79,
        agent: { name: 'Serkan Avcı', company: 'Gönyeli Emlak', phone: '+90 548 xxx xx xx', verified: true },
        isNew: true,
        isFeatured: true,
        createdAt: '2026-02-28',
    },
    {
        id: '8',
        title: {
            tr: 'Gönyeli\'de Satılık Yatırımlık 1+1 Daire — Yüksek Kira Getirisi',
            en: 'Investment 1+1 Apartment for Sale in Gönyeli — High Rental Yield',
            ru: 'Инвестиционная квартира 1+1 в Гёньели — высокий доход',
            de: '1+1 Investitionswohnung in Gönyeli — hohe Mietrendite',
            ar: 'شقة استثمارية 1+1 في غونيلي — عائد إيجار مرتفع',
        },
        description: {
            tr: 'Üniversite bölgesinde, sürekli dolu, %10+ kira getirisi. Yeni bina, sıfır daire. Yatırım için ideal.',
            en: 'In university zone, always rented, 10%+ rental yield. New building, brand new. Ideal for investment.',
            ru: 'В студенческом районе, всегда сдается, доходность 10%+. Новостройка.',
            de: 'Im Universitätsviertel, immer vermietet, 10%+ Rendite. Neubau.',
            ar: 'في منطقة الجامعات، مؤجرة دائمًا، عائد 10%+. بناء جديد.',
        },
        type: 'sale',
        propertyType: 'apartment',
        price: 65000,
        currency: 'GBP',
        bedrooms: 1,
        bathrooms: 1,
        area: 50,
        location: { city: 'Nicosia', district: 'Gönyeli', lat: 35.21, lng: 33.35 },
        features: ['Investment', 'Near University', 'New Building', 'Parking', 'Elevator'],
        images: [],
        score: 85,
        agent: { name: 'Serkan Avcı', company: 'Gönyeli Emlak', phone: '+90 548 xxx xx xx', verified: true },
        isNew: false,
        isFeatured: true,
        createdAt: '2026-02-24',
    },
    {
        id: '9',
        title: {
            tr: 'Gönyeli Merkez\'de Kiralık 3+1 Aile Dairesi',
            en: 'Family 3+1 Apartment for Rent in Gönyeli Center',
            ru: 'Семейная квартира 3+1 в аренду в центре Гёньели',
            de: '3+1 Familienwohnung zur Miete in Gönyeli Zentrum',
            ar: 'شقة عائلية 3+1 للإيجار في وسط غونيلي',
        },
        description: {
            tr: 'Merkezi konumda, park ve markete yakın, geniş salon ve balkon. Aile için ideal, sakin mahalle.',
            en: 'Central location, near park and market. Large living room and balcony. Ideal for families, quiet neighborhood.',
            ru: 'Центральное расположение, рядом парк и магазин. Большая гостиная и балкон. Для семей.',
            de: 'Zentrale Lage, nahe Park und Markt. Großes Wohnzimmer und Balkon. Für Familien.',
            ar: 'موقع مركزي، قريب من الحديقة والسوق. صالة كبيرة وشرفة. مثالي للعائلات.',
        },
        type: 'rent',
        propertyType: 'apartment',
        price: 400,
        currency: 'GBP',
        priceLabel: '/mo',
        bedrooms: 3,
        bathrooms: 2,
        area: 110,
        location: { city: 'Nicosia', district: 'Gönyeli', lat: 35.22, lng: 33.33 },
        features: ['Balcony', 'Near Park', 'Parking', 'Family Friendly', 'Furnished', 'AC'],
        images: [],
        score: 80,
        agent: { name: 'Ayşe Korkmaz', company: 'Lefkoşa Homes', phone: '+90 533 xxx xx xx', verified: true },
        isNew: true,
        isFeatured: false,
        createdAt: '2026-02-28',
    },
];

export function formatPrice(price: number, currency: string, label?: string): string {
    const formatted = new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(price);
    return `${formatted}${label || ''}`;
}

export function getScoreColor(score: number): string {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
}

export function getScoreLabel(score: number): string {
    if (score >= 80) return '✅ Verified';
    if (score >= 60) return '⚠️ Good';
    return '🔴 Needs Improvement';
}
