'use client';

import { useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';

interface BlogPost {
    id: string;
    slug: string;
    title: Record<string, string>;
    excerpt: Record<string, string>;
    category: string;
    readTime: string;
    date: string;
    featured: boolean;
}

const posts: BlogPost[] = [
    {
        id: '1',
        slug: 'gonyeli-rental-guide',
        title: {
            tr: 'Gönyeli Kiralık Daire Rehberi — Öğrenciler ve Genç Profesyoneller İçin',
            en: 'Gönyeli Rental Guide — For Students and Young Professionals',
            ru: 'Гёньели — гид по аренде для студентов',
            de: 'Gönyeli Mietführer für Studenten',
            ar: 'دليل الإيجار في غونيلي — للطلاب',
        },
        excerpt: {
            tr: 'YDÜ, UKÜ ve LAÜ\'ye yakın Gönyeli\'de kiralık daire ararken bilmeniz gerekenler. Fiyatlar, bölgeler, ulaşım ve hayat maliyeti.',
            en: 'Everything you need to know about renting in Gönyeli near YDÜ, UKÜ, and LAÜ universities. Prices, areas, transport, and cost of living.',
            ru: 'Всё об аренде в Гёньели рядом с университетами.',
            de: 'Alles über die Miete in Gönyeli nahe den Universitäten.',
            ar: 'كل ما تحتاج معرفته عن الإيجار في غونيلي.',
        },
        category: '🎓 Student Guide',
        readTime: '8 min',
        date: '2026-02-28',
        featured: true,
    },
    {
        id: '2',
        slug: 'buying-property-foreigners-guide',
        title: {
            tr: 'Yabancılar İçin KKTC Emlak Rehberi (2026)',
            en: 'Complete Guide to Buying Property in North Cyprus as a Foreigner (2026)',
            ru: 'Полное руководство по покупке недвижимости на Северном Кипре (2026)',
            de: 'Kompletter Leitfaden zum Immobilienkauf in Nordzypern (2026)',
            ar: 'الدليل الشامل لشراء العقارات في شمال قبرص (2026)',
        },
        excerpt: {
            tr: 'PTP başvurusu, vergi oranları, avukat seçimi, tapu devri ve yabancı alıcıları bekleyen tüm hukuki süreçler adım adım.',
            en: 'PTP application, tax rates, lawyer selection, title deed transfer — everything foreign buyers need to know, step by step.',
            ru: 'Заявка PTP, налоги, выбор юриста, передача права собственности.',
            de: 'PTP-Antrag, Steuersätze, Anwaltsauswahl, Eigentumsübertragung.',
            ar: 'طلب PTP، معدلات الضرائب، اختيار المحامي، نقل سند الملكية.',
        },
        category: '⚖️ Legal Guide',
        readTime: '12 min',
        date: '2026-02-27',
        featured: true,
    },
    {
        id: '3',
        slug: 'north-cyprus-rental-yield',
        title: {
            tr: 'KKTC Kira Getirisi Analizi — Yatırıma Değer mi?',
            en: 'North Cyprus Rental Yield Analysis — Is It Worth Investing?',
            ru: 'Анализ доходности аренды на Северном Кипре',
            de: 'Mietrenditeanalyse Nordzypern',
            ar: 'تحليل عائد الإيجار في شمال قبرص',
        },
        excerpt: {
            tr: 'Girne, İskele, Lefkoşa ve Gazimağusa\'da ortalama kira getirisi oranları. Hangi bölge en çok kazandırıyor?',
            en: 'Average rental yield rates in Kyrenia, Iskele, Nicosia, and Famagusta. Which region offers the best returns?',
            ru: 'Средняя доходность аренды в Кирении, Искеле, Никосии и Фамагусте.',
            de: 'Durchschnittliche Mietrenditen in Kyrenia, Iskele, Nikosia und Famagusta.',
            ar: 'متوسط عائدات الإيجار في كيرينيا وإسكيلي ونيقوسيا وفاماغوستا.',
        },
        category: '📊 Market Report',
        readTime: '10 min',
        date: '2026-02-25',
        featured: false,
    },
    {
        id: '4',
        slug: 'virtual-staging-sell-faster',
        title: {
            tr: 'Mülkünüzü Daha Hızlı Satmanın 7 Yolu',
            en: '7 Ways to Sell Your Property Faster',
            ru: '7 способов продать недвижимость быстрее',
            de: '7 Wege, Ihre Immobilie schneller zu verkaufen',
            ar: '7 طرق لبيع عقارك بشكل أسرع',
        },
        excerpt: {
            tr: 'Profesyonel fotoğraf, doğru fiyat, çoklu dil, WhatsApp stratejisi ve daha fazlası. KKTC pazarında öne çıkın.',
            en: 'Professional photos, right pricing, multilingual listings, WhatsApp strategy and more. Stand out in the TRNC market.',
            ru: 'Профессиональные фото, правильная цена, многоязычные объявления.',
            de: 'Professionelle Fotos, richtige Preise, mehrsprachige Inserate.',
            ar: 'صور احترافية، تسعير صحيح، إعلانات متعددة اللغات.',
        },
        category: '📈 Marketing',
        readTime: '6 min',
        date: '2026-02-24',
        featured: false,
    },
    {
        id: '5',
        slug: 'kktc-tax-calculator-explained',
        title: {
            tr: 'KKTC Emlak Vergisi Hesaplayıcı — Ne Kadar Ödeyeceksiniz?',
            en: 'North Cyprus Property Tax Calculator — How Much Will You Pay?',
            ru: 'Калькулятор налога на недвижимость Северного Кипра',
            de: 'Nordzypern Immobiliensteuerrechner',
            ar: 'حاسبة ضريبة العقارات في شمال قبرص',
        },
        excerpt: {
            tr: 'Damga vergisi, KDV, tapu harcı ve avukat ücretleri. Vatandaşlığınıza göre tam maliyet hesaplama rehberi.',
            en: 'Stamp duty, VAT, transfer tax, and lawyer fees. Complete cost calculation guide based on your nationality.',
            ru: 'Гербовый сбор, НДС, налог на передачу, гонорар юриста.',
            de: 'Stempelsteuer, MwSt, Übertragungssteuer und Anwaltsgebühren.',
            ar: 'رسوم الطوابع وضريبة القيمة المضافة وضريبة النقل وأتعاب المحامي.',
        },
        category: '💰 Finance',
        readTime: '7 min',
        date: '2026-02-22',
        featured: false,
    },
];

export default function BlogPage() {
    const [locale, setLocale] = useState<Locale>('en');
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    return (
        <div dir={dir}>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo">
                        <span className="logo-icon">🏠</span>
                        <span className="logo-text">CyprusNest</span>
                    </a>
                    <ul className="navbar-links">
                        <li><a href="/properties">{t(locale, 'nav.rent')}</a></li>
                        <li><a href="/properties">{t(locale, 'nav.buy')}</a></li>
                        <li><a href="/legal">{t(locale, 'nav.legal')}</a></li>
                        <li><a href="/blog" style={{ color: 'var(--primary-light)' }}>Blog</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                        <button className="btn btn-primary">{t(locale, 'nav.register')}</button>
                    </div>
                </div>
            </nav>

            <main style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '12px' }}>
                            📚 {locale === 'tr' ? 'Blog & Rehberler' : 'Blog & Guides'}
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            {locale === 'tr'
                                ? 'KKTC emlak piyasası, hukuki süreçler ve AI araçları hakkında uzman rehberler.'
                                : 'Expert guides on North Cyprus real estate, legal processes, and AI tools.'}
                        </p>
                    </div>

                    {/* Featured */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                        {posts.filter(p => p.featured).map(post => (
                            <a
                                href={`/blog/${post.slug}`}
                                key={post.id}
                                style={{
                                    textDecoration: 'none', color: 'inherit',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '32px',
                                    transition: 'var(--transition)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                                    background: 'var(--gradient-primary)',
                                }} />
                                <span style={{
                                    display: 'inline-block', padding: '4px 12px',
                                    background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)',
                                    borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)',
                                    marginBottom: '16px',
                                }}>
                                    {post.category}
                                </span>
                                <h2 style={{ fontSize: '1.3rem', marginBottom: '12px', lineHeight: 1.3 }}>
                                    {post.title[locale] || post.title['en']}
                                </h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
                                    {post.excerpt[locale] || post.excerpt['en']}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>📅 {post.date}</span>
                                    <span>⏱️ {post.readTime}</span>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* All Posts */}
                    <h2 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>
                        {locale === 'tr' ? 'Tüm Makaleler' : 'All Articles'}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '64px' }}>
                        {posts.map(post => (
                            <a
                                href={`/blog/${post.slug}`}
                                key={post.id}
                                style={{
                                    textDecoration: 'none', color: 'inherit',
                                    display: 'flex', gap: '20px', alignItems: 'center',
                                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)', padding: '20px',
                                    cursor: 'pointer', transition: 'var(--transition)',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--primary-light)', marginBottom: '4px', display: 'block' }}>
                                        {post.category}
                                    </span>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '4px' }}>
                                        {post.title[locale] || post.title['en']}
                                    </h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {post.date} · {post.readTime}
                                    </p>
                                </div>
                                <span style={{ color: 'var(--primary-light)', fontSize: '1.2rem' }}>→</span>
                            </a>
                        ))}
                    </div>
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
