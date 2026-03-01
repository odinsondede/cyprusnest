'use client';

import { useState } from 'react';
import { type Locale, locales, localeFlags, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('tr');
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent');
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  const heroTexts = {
    tr: {
      tagline: 'Kuzey Kıbrıs\'ta Emlak Aramanın Yeni Yolu',
      title: 'Hayalindeki Evi',
      titleHighlight: 'Kolayca Bul.',
      subtitle: 'Kiralık veya satılık mülkleri keşfet, AI asistanımızla anında bilgi al.',
      rent: 'Kiralık',
      sale: 'Satılık',
      searchPlaceholder: 'Lefkoşa, Girne, Gönyeli...',
      search: 'Ara',
      trust1: 'AI Asistan',
      trust2: '5 Dil Desteği',
      trust3: 'Ücretsiz Kullan',
      citiesTitle: 'Popüler Şehirler',
      citiesSubtitle: 'KKTC\'nin en çok tercih edilen bölgelerini keşfedin',
      whyTitle: 'Neden Evlek?',
      whySubtitle: 'Kuzey Kıbrıs emlak deneyiminizi kolaylaştıran özellikler',
      why1Title: 'AI Emlak Asistanı',
      why1Desc: 'Sorularınızı anında yanıtlar, size en uygun ilanları önerir.',
      why2Title: '5 Dilde Hizmet',
      why2Desc: 'Türkçe, İngilizce, Rusça, Almanca ve Arapça tam destek.',
      why3Title: 'Hukuki Rehber',
      why3Desc: 'KKTC\'de mülk alma süreci, vergiler ve yasal bilgiler.',
      why4Title: 'Akıllı Filtreler',
      why4Desc: 'Faturalar dahil, eşyalı, havuzlu — aradığınızı hemen bulun.',
      ctaTitle: 'İlanınızı Ücretsiz Yayınlayın',
      ctaSubtitle: 'Mülkünüzü binlerce potansiyel kiracı ve alıcıya ulaştırın.',
      ctaButton: 'İlan Ekle',
      ctaNote: 'Kayıt ol ve hemen ilanını paylaş — ücretsiz.',
    },
    en: {
      tagline: 'The New Way to Find Property in North Cyprus',
      title: 'Find Your Dream',
      titleHighlight: 'Home Easily.',
      subtitle: 'Discover rental or sale properties, get instant info with our AI assistant.',
      rent: 'Rent',
      sale: 'Buy',
      searchPlaceholder: 'Nicosia, Kyrenia, Gönyeli...',
      search: 'Search',
      trust1: 'AI Assistant',
      trust2: '5 Languages',
      trust3: 'Free to Use',
      citiesTitle: 'Popular Cities',
      citiesSubtitle: 'Explore the most popular areas of North Cyprus',
      whyTitle: 'Why Evlek?',
      whySubtitle: 'Features that simplify your North Cyprus property experience',
      why1Title: 'AI Property Assistant',
      why1Desc: 'Instant answers to your questions, personalized recommendations.',
      why2Title: '5 Language Support',
      why2Desc: 'Full support in Turkish, English, Russian, German and Arabic.',
      why3Title: 'Legal Guide',
      why3Desc: 'Property buying process, taxes and legal info in KKTC.',
      why4Title: 'Smart Filters',
      why4Desc: 'Bills included, furnished, pool — find exactly what you need.',
      ctaTitle: 'List Your Property for Free',
      ctaSubtitle: 'Reach thousands of potential tenants and buyers.',
      ctaButton: 'Add Listing',
      ctaNote: 'Sign up and share your listing — it\'s free.',
    },
  };

  const txt = heroTexts[locale as 'tr' | 'en'] || heroTexts.en;

  const cities = [
    { name: locale === 'tr' ? 'Lefkoşa' : 'Nicosia', emoji: '🏛️', count: locale === 'tr' ? '4 ilan' : '4 listings', color: '#1B6B93' },
    { name: locale === 'tr' ? 'Girne' : 'Kyrenia', emoji: '⛵', count: locale === 'tr' ? '2 ilan' : '2 listings', color: '#2D8B5C' },
    { name: locale === 'tr' ? 'Gazimağusa' : 'Famagusta', emoji: '🏰', count: locale === 'tr' ? '1 ilan' : '1 listing', color: '#D4940A' },
    { name: locale === 'tr' ? 'İskele' : 'Iskele', emoji: '🏖️', count: locale === 'tr' ? '2 ilan' : '2 listings', color: '#1B6B93' },
  ];

  return (
    <div dir={dir}>
      <Navbar locale={locale} onLocaleChange={setLocale} activePage="home" />

      {/* ========== HERO — Split Layout ========== */}
      <section className="hero" style={{ minHeight: 'auto', padding: '120px 0 60px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'center',
          }}>
            {/* Left — Text */}
            <div>
              <div className="hero-badge">{txt.tagline}</div>

              <h1 className="hero-title" style={{ textAlign: 'left', fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {txt.title}<br />
                <span className="highlight">{txt.titleHighlight}</span>
              </h1>

              <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0 0 28px' }}>
                {txt.subtitle}
              </p>

              {/* Type Toggle */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button
                  onClick={() => setListingType('rent')}
                  className={`btn ${listingType === 'rent' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '999px', padding: '8px 24px' }}
                >
                  🔑 {txt.rent}
                </button>
                <button
                  onClick={() => setListingType('sale')}
                  className={`btn ${listingType === 'sale' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ borderRadius: '999px', padding: '8px 24px' }}
                >
                  🏠 {txt.sale}
                </button>
              </div>

              {/* Search */}
              <form
                className="hero-search"
                style={{ margin: '0 0 24px', maxWidth: '100%' }}
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `/properties?type=${listingType}`;
                }}
              >
                <input type="text" placeholder={txt.searchPlaceholder} />
                <button type="submit">{txt.search}</button>
              </form>

              {/* Trust Signals */}
              <div style={{
                display: 'flex',
                gap: '20px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                flexWrap: 'wrap',
              }}>
                <span>🤖 {txt.trust1}</span>
                <span>🌍 {txt.trust2}</span>
                <span>✅ {txt.trust3}</span>
              </div>
            </div>

            {/* Right — Hero Image */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
              aspectRatio: '4/3',
              position: 'relative',
            }}>
              <img
                src="/hero-villa.png"
                alt="North Cyprus Mediterranean Villa"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '10px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--primary)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              }}>
                📍 {locale === 'tr' ? 'Girne, KKTC' : 'Kyrenia, KKTC'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CITIES SECTION ========== */}
      <section className="section" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h2 className="section-title">{txt.citiesTitle}</h2>
            <p className="section-subtitle">{txt.citiesSubtitle}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}>
            {cities.map((city) => (
              <a
                key={city.name}
                href={`/properties?city=${city.name}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '28px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = city.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                }}
              >
                <span style={{ fontSize: '2rem' }}>{city.emoji}</span>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{city.name}</span>
                <span style={{
                  fontSize: '0.8rem',
                  color: city.color,
                  background: `${city.color}12`,
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontWeight: 500,
                }}>{city.count}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY EVLEK SECTION ========== */}
      <section className="section" id="features" style={{ background: 'var(--bg-secondary)', paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 className="section-title">{txt.whyTitle}</h2>
            <p className="section-subtitle">{txt.whySubtitle}</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
          }}>
            {[
              { icon: '🤖', title: txt.why1Title, desc: txt.why1Desc, color: '#1B6B93' },
              { icon: '🌍', title: txt.why2Title, desc: txt.why2Desc, color: '#2D8B5C' },
              { icon: '⚖️', title: txt.why3Title, desc: txt.why3Desc, color: '#D4940A' },
              { icon: '🎯', title: txt.why4Title, desc: txt.why4Desc, color: '#1B6B93' },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  padding: '28px 20px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `${f.color}12`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  margin: '0 auto 14px',
                }}>{f.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>{txt.ctaTitle}</h2>
            <p>{txt.ctaSubtitle}</p>
            <a href="/add-property" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary-dark)', fontWeight: 700, padding: '14px 36px' }}>
              {txt.ctaButton}
            </a>
            <div className="cta-note">{txt.ctaNote}</div>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
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
                <li><a href="#">{t(locale, 'footer.about')}</a></li>
                <li><a href="#">{t(locale, 'footer.contact')}</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>{t(locale, 'footer.legal')}</h4>
              <ul>
                <li><a href="/legal">{t(locale, 'footer.privacy')}</a></li>
                <li><a href="/legal">{t(locale, 'footer.terms')}</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Evlek. {t(locale, 'footer.rights')}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className="btn btn-ghost"
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.8rem',
                    opacity: locale === l ? 1 : 0.5,
                    borderBottom: locale === l ? '2px solid var(--primary)' : 'none',
                    borderRadius: 0,
                  }}
                >
                  {localeFlags[l]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <ChatbotWidget locale={locale} />
    </div>
  );
}
