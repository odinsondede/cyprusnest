'use client';

import { useState, useEffect } from 'react';
import { type Locale, locales, localeFlags, t } from '@/i18n/translations';
import { supabase, type Property } from '@/lib/supabase';
import { convertPrice, formatCurrency, type Currency } from '@/lib/currency';
import ChatbotWidget from '@/components/ChatbotWidget';
import CookieConsent from '@/components/CookieConsent';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('tr');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [cityCounts, setCityCounts] = useState<Record<string, number>>({});
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const isTR = locale === 'tr' || locale === 'ar' || locale === 'ru' || locale === 'de';

  useEffect(() => {
    supabase
      .from('properties')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setFeaturedProperties(data as Property[]);
      });

    supabase
      .from('properties')
      .select('city')
      .eq('status', 'active')
      .then(({ data }) => {
        if (data) {
          const counts: Record<string, number> = {};
          data.forEach((p: { city: string }) => {
            counts[p.city] = (counts[p.city] || 0) + 1;
          });
          setCityCounts(counts);
        }
      });
  }, []);

  const txt = {
    tr: {
      tagline: 'Kuzey Kıbrıs\'ta Emlak Aramanın Yeni Yolu',
      title: 'Hayalindeki Evi', titleHighlight: 'Kolayca Bul.',
      subtitle: 'Kiralık veya satılık mülkleri keşfet, AI asistanımızla anında bilgi al.',
      rent: 'Kiralık', sale: 'Satılık',
      searchPlaceholder: 'Lefkoşa, Girne, Gönyeli...',
      search: 'Ara',
      trust: 'AI destekli · 5 dil · Ücretsiz',
      featuredTitle: 'Öne Çıkan İlanlar', featuredSub: 'Son eklenen mülkler', viewAll: 'Tüm İlanlar →',
      citiesTitle: 'Popüler Bölgeler', citiesSub: 'KKTC\'nin en çok aranan şehirleri',
      blogTitle: 'Bilgi Merkezi', blogSub: 'KKTC emlak hakkında rehberler', readMore: 'Oku →', allBlog: 'Tüm Yazılar →',
      whyTitle: 'Neden Evlek?', whySub: 'Emlak aramanızı kolaylaştıran özellikler',
      w1t: 'AI Emlak Asistanı', w1d: 'Sorularınızı anında yanıtlar, size en uygun ilanları önerir.',
      w2t: '5 Dilde Hizmet', w2d: 'Türkçe, İngilizce, Rusça, Almanca ve Arapça tam destek.',
      w3t: 'Hukuki Rehber', w3d: 'KKTC\'de mülk alma süreci, vergiler ve yasal bilgiler.',
      w4t: 'Akıllı Filtreler', w4d: 'Faturalar dahil, eşyalı, havuzlu — aradığınızı hemen bulun.',
      ctaTitle: 'İlanınızı Ücretsiz Yayınlayın',
      ctaSub: 'Mülkünüzü binlerce potansiyel kiracı ve alıcıya ulaştırın.',
      ctaBtn: 'İlan Ekle', ctaNote: 'Kayıt ol ve hemen ilanını paylaş — ücretsiz.',
    },
    en: {
      tagline: 'The New Way to Find Property in North Cyprus',
      title: 'Find Your Dream', titleHighlight: 'Home Easily.',
      subtitle: 'Discover rental or sale properties, get instant info with our AI assistant.',
      rent: 'Rent', sale: 'Buy',
      searchPlaceholder: 'Nicosia, Kyrenia, Gönyeli...',
      search: 'Search',
      trust: 'AI-powered · 5 languages · Free',
      featuredTitle: 'Featured Listings', featuredSub: 'Latest properties', viewAll: 'View All →',
      citiesTitle: 'Popular Areas', citiesSub: 'Most searched cities in North Cyprus',
      blogTitle: 'Knowledge Hub', blogSub: 'Guides for North Cyprus real estate', readMore: 'Read →', allBlog: 'All Articles →',
      whyTitle: 'Why Evlek?', whySub: 'Features that simplify your property search',
      w1t: 'AI Property Assistant', w1d: 'Instant answers, personalized recommendations.',
      w2t: '5 Language Support', w2d: 'Full support in Turkish, English, Russian, German and Arabic.',
      w3t: 'Legal Guide', w3d: 'Property buying process, taxes and legal info.',
      w4t: 'Smart Filters', w4d: 'Bills included, furnished, pool — find exactly what you need.',
      ctaTitle: 'List Your Property for Free',
      ctaSub: 'Reach thousands of potential tenants and buyers.',
      ctaBtn: 'Add Listing', ctaNote: 'Sign up and share your listing — it\'s free.',
    },
  }[locale as 'tr' | 'en'] || {
    tagline: 'The New Way to Find Property in North Cyprus',
    title: 'Find Your Dream', titleHighlight: 'Home Easily.',
    subtitle: 'Discover rental or sale properties, get instant info with our AI assistant.',
    rent: 'Rent', sale: 'Buy', searchPlaceholder: 'Nicosia, Kyrenia...', search: 'Search',
    trust: 'AI-powered · 5 languages · Free',
    featuredTitle: 'Featured Listings', featuredSub: 'Latest properties', viewAll: 'View All →',
    citiesTitle: 'Popular Areas', citiesSub: 'Most searched cities', blogTitle: 'Knowledge Hub',
    blogSub: 'Guides for real estate', readMore: 'Read →', allBlog: 'All Articles →',
    whyTitle: 'Why Evlek?', whySub: 'Features that simplify your search',
    w1t: 'AI Assistant', w1d: 'Instant answers.', w2t: '5 Languages', w2d: 'Full multilingual support.',
    w3t: 'Legal Guide', w3d: 'Taxes and legal info.', w4t: 'Smart Filters', w4d: 'Find what you need.',
    ctaTitle: 'List for Free', ctaSub: 'Reach buyers and tenants.',
    ctaBtn: 'Add Listing', ctaNote: 'Free to use.',
  };

  // Only show cities that have listings
  const allCities = [
    { name: isTR ? 'Lefkoşa' : 'Nicosia', key: 'Lefkoşa', emoji: '🏛️', color: '#1B6B93' },
    { name: isTR ? 'Girne' : 'Kyrenia', key: 'Girne', emoji: '⛵', color: '#2D8B5C' },
    { name: isTR ? 'Gazimağusa' : 'Famagusta', key: 'Gazimağusa', emoji: '🏰', color: '#D4940A' },
    { name: isTR ? 'İskele' : 'Iskele', key: 'İskele', emoji: '🏖️', color: '#1B6B93' },
    { name: isTR ? 'Güzelyurt' : 'Guzelyurt', key: 'Güzelyurt', emoji: '🍊', color: '#2D8B5C' },
    { name: isTR ? 'Lefke' : 'Lefke', key: 'Lefke', emoji: '🌿', color: '#D4940A' },
  ];
  const activeCities = allCities.filter(c => (cityCounts[c.key] || 0) > 0);
  // If no cities have listings yet, show top 4 as placeholder
  const displayCities = activeCities.length > 0 ? activeCities : allCities.slice(0, 4);

  const blogPosts = [
    { slug: 'buying-property-foreigners-guide', tr: 'Yabancılara Mülk Satın Alma Rehberi', en: 'Buying Property as a Foreigner', emoji: '🏠' },
    { slug: 'north-cyprus-rental-yield', tr: 'KKTC Kira Getirisi Analizi', en: 'North Cyprus Rental Yield', emoji: '📊' },
    { slug: 'kktc-tax-calculator-explained', tr: 'KKTC Vergi Hesaplama Rehberi', en: 'Tax Calculator Guide', emoji: '🧮' },
  ];

  return (
    <div dir={dir}>
      <Navbar locale={locale} onLocaleChange={setLocale} activePage="home" />

      {/* ═══════ HERO ═══════ */}
      <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 60px' }}>
        <div className="container">
          <div className="hero-split">
            <div>
              <div className="hero-badge">{txt.tagline}</div>
              <h1 className="hero-title" style={{ textAlign: 'left', fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                {txt.title}<br />
                <span className="highlight">{txt.titleHighlight}</span>
              </h1>
              <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0 0 28px' }}>
                {txt.subtitle}
              </p>
              <div className="hero-type-toggle">
                <button onClick={() => setListingType('rent')}
                  className={`btn ${listingType === 'rent' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '999px', padding: '8px 24px' }}>
                  🔑 {txt.rent}
                </button>
                <button onClick={() => setListingType('sale')}
                  className={`btn ${listingType === 'sale' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '999px', padding: '8px 24px' }}>
                  🏠 {txt.sale}
                </button>
              </div>
              <form className="hero-search" style={{ margin: '0 0 20px', maxWidth: '100%' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                  const search = input?.value?.trim() || '';
                  const params = new URLSearchParams();
                  params.set('type', listingType);
                  if (search) params.set('search', search);
                  window.location.href = `/properties?${params.toString()}`;
                }}>
                <input type="text" name="search" placeholder={txt.searchPlaceholder} />
                <button type="submit">{txt.search}</button>
              </form>

              {/* Minimal trust line */}
              <p style={{
                fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500,
                letterSpacing: '0.03em',
              }}>
                {txt.trust}
              </p>
            </div>

            <div className="hero-image-wrapper">
              <img src="/hero-villa.png" alt="North Cyprus Mediterranean Villa" />
              <div className="hero-image-badge">
                📍 {isTR ? 'Girne, KKTC' : 'Kyrenia, KKTC'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURED LISTINGS ═══════ */}
      {featuredProperties.length > 0 && (
        <section className="section" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <h2 className="section-title" style={{ marginBottom: '2px' }}>{txt.featuredTitle}</h2>
                <p className="section-subtitle" style={{ margin: 0 }}>{txt.featuredSub}</p>
              </div>
              <a href="/properties" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                {txt.viewAll}
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {featuredProperties.map((p) => (
                <FeaturedCard key={p.id} property={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CITIES ═══════ */}
      <section className="section" style={{ paddingTop: '56px', paddingBottom: '56px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '28px' }}>
            <h2 className="section-title">{txt.citiesTitle}</h2>
            <p className="section-subtitle">{txt.citiesSub}</p>
          </div>
          <div className="cities-grid">
            {displayCities.map((city) => {
              const count = cityCounts[city.key] || 0;
              return (
                <a key={city.name} href={`/properties?city=${city.key}`} className="city-card">
                  <span style={{ fontSize: '2rem' }}>{city.emoji}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{city.name}</span>
                  {count > 0 && (
                    <span style={{
                      fontSize: '0.78rem', color: city.color,
                      background: `${city.color}12`, padding: '3px 10px',
                      borderRadius: '999px', fontWeight: 500,
                    }}>
                      {count} {isTR ? 'ilan' : (count === 1 ? 'listing' : 'listings')}
                    </span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ BLOG ═══════ */}
      <section className="section" style={{ paddingTop: '56px', paddingBottom: '56px' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '2px' }}>{txt.blogTitle}</h2>
              <p className="section-subtitle" style={{ margin: 0 }}>{txt.blogSub}</p>
            </div>
            <a href="/blog" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              {txt.allBlog}
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {blogPosts.map((post) => (
              <a key={post.slug} href={`/blog/${post.slug}`}
                style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '24px',
                  transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '12px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
              >
                <span style={{ fontSize: '2rem' }}>{post.emoji}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                  {isTR ? post.tr : post.en}
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                  {txt.readMore}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY EVLEK ═══════ */}
      <section className="section" id="features" style={{ paddingTop: '56px', paddingBottom: '56px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '36px' }}>
            <h2 className="section-title">{txt.whyTitle}</h2>
            <p className="section-subtitle">{txt.whySub}</p>
          </div>
          <div className="why-grid">
            {[
              { icon: '🤖', title: txt.w1t, desc: txt.w1d, color: '#1B6B93' },
              { icon: '🌍', title: txt.w2t, desc: txt.w2d, color: '#2D8B5C' },
              { icon: '⚖️', title: txt.w3t, desc: txt.w3d, color: '#D4940A' },
              { icon: '🎯', title: txt.w4t, desc: txt.w4d, color: '#1B6B93' },
            ].map((f) => (
              <div key={f.title} className="why-card">
                <div style={{
                  width: '48px', height: '48px', background: `${f.color}12`,
                  borderRadius: '12px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 14px',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>{txt.ctaTitle}</h2>
            <p>{txt.ctaSub}</p>
            <a href="/add-property" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 700, padding: '14px 36px' }}>
              {txt.ctaBtn}
            </a>
            <div className="cta-note">{txt.ctaNote}</div>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo" style={{ marginBottom: '4px' }}>
                <span className="logo-icon">🏠</span>
                <span className="logo-text">Evlek</span>
              </div>
              <p>{t(locale, 'footer.desc')}</p>
            </div>
            <div className="footer-col">
              <h4>{t(locale, 'footer.platform')}</h4>
              <ul>
                <li><a href="/properties?type=rent">{txt.rent}</a></li>
                <li><a href="/properties?type=sale">{txt.sale}</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/legal">{t(locale, 'nav.legal')}</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t(locale, 'footer.company')}</h4>
              <ul>
                <li><a href="/about">{t(locale, 'footer.about')}</a></li>
                <li><a href="/contact">{t(locale, 'footer.contact')}</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>{t(locale, 'footer.legal')}</h4>
              <ul>
                <li><a href="/legal/privacy">{t(locale, 'footer.privacy')}</a></li>
                <li><a href="/legal/terms">{t(locale, 'footer.terms')}</a></li>
                <li><a href="/legal">{isTR ? 'Hukuki Rehber' : 'Legal Guide'}</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Evlek. {t(locale, 'footer.rights')}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {locales.map((l) => (
                <button key={l} onClick={() => setLocale(l)} className="btn btn-ghost"
                  style={{ padding: '4px 8px', fontSize: '0.8rem', opacity: locale === l ? 1 : 0.5, borderBottom: locale === l ? '2px solid var(--primary)' : 'none', borderRadius: 0 }}>
                  {localeFlags[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <ChatbotWidget locale={locale} />
      <CookieConsent locale={locale} />
    </div>
  );
}

/* ═══════ FEATURED CARD ═══════ */
function FeaturedCard({ property, locale }: { property: Property; locale: Locale }) {
  const isTR = locale === 'tr';
  const title = isTR ? property.title_tr : property.title_en;
  const isRent = property.type === 'rent';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = property as any;
  const roomConfig = p.room_config || `${property.bedrooms}+1`;
  const ptIcons: Record<string, string> = {
    apartment: '🏢', villa: '🏡', detached: '🏠', penthouse: '🌆', studio: '🔲',
    duplex: '🏘️', shop: '🏪', office: '🏛️', warehouse: '🏭',
  };
  const icon = ptIcons[p.property_type] || '🏠';
  const photo = property.photos?.[0];
  const displayPrice = convertPrice(property.price, property.currency as Currency, 'GBP');
  const formatted = formatCurrency(displayPrice, 'GBP');

  return (
    <a href={`/properties/${property.id}`} style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      transition: 'all 0.25s ease', display: 'block',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ height: '200px', background: 'var(--bg-darker)', position: 'relative', overflow: 'hidden' }}>
        {photo ? (
          <img src={photo} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'var(--text-muted)' }}>
            {icon}
          </div>
        )}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          background: isRent ? 'rgba(27,107,147,0.9)' : 'rgba(45,139,92,0.9)',
          color: 'white', padding: '4px 12px', borderRadius: '999px',
          fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(8px)',
        }}>
          {isRent ? (isTR ? '🔑 Kiralık' : '🔑 Rent') : (isTR ? '🏠 Satılık' : '🏠 Sale')}
        </div>
      </div>
      <div style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '8px' }}>
          {title}
        </h3>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>
          {formatted}{isRent ? (isTR ? '/ay' : '/mo') : ''}
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>📍 {property.city}{p.district ? `, ${p.district}` : ''}</span>
          <span>{icon} {roomConfig}</span>
          {property.area_sqm && <span>📐 {property.area_sqm}m²</span>}
        </div>
      </div>
    </a>
  );
}
