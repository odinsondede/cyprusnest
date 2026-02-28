'use client';

import { useState, useEffect } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import { getCurrentUser, signOut, onAuthChange } from '@/lib/auth';
import ChatbotWidget from '@/components/ChatbotWidget';
import AuthModal from '@/components/AuthModal';

export default function Home() {
  const [locale, setLocale] = useState<Locale>('en');
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<unknown>(null);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    getCurrentUser().then(u => setUser(u));
    const { data: { subscription } } = onAuthChange((u) => setUser(u));
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div dir={dir}>
      {/* ========== NAVBAR ========== */}
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
            <li><a href="/blog">Blog</a></li>
          </ul>

          <div className="navbar-right">
            <select
              className="lang-selector"
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
            >
              {locales.map((l) => (
                <option key={l} value={l}>
                  {localeFlags[l]} {localeNames[l]}
                </option>
              ))}
            </select>
            {user ? (
              <button className="btn btn-ghost" onClick={async () => { await signOut(); setUser(null); }}>
                🚪 {locale === 'tr' ? 'Çıkış' : 'Logout'}
              </button>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={() => setShowAuth(true)}>{t(locale, 'nav.login')}</button>
                <button className="btn btn-primary" onClick={() => setShowAuth(true)}>{t(locale, 'nav.register')}</button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">{t(locale, 'hero.badge')}</div>

          <h1 className="hero-title">
            {t(locale, 'hero.title')}<br />
            <span className="highlight">{t(locale, 'hero.titleHighlight')}</span>
          </h1>

          <p className="hero-subtitle">{t(locale, 'hero.subtitle')}</p>

          <form className="hero-search" onSubmit={(e) => { e.preventDefault(); window.location.href = '/properties'; }}>
            <input
              type="text"
              placeholder={t(locale, 'hero.searchPlaceholder')}
            />
            <button type="submit">{t(locale, 'hero.ctaSearch')}</button>
          </form>

          <div className="hero-actions">
            <a href="/properties" className="btn btn-primary btn-lg">
              🔍 {t(locale, 'hero.ctaSearch')}
            </a>
            <a href="/properties" className="btn btn-outline btn-lg">
              🤖 {t(locale, 'hero.ctaChat')}
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="stat-value">5,000+</div>
              <div className="stat-label">{t(locale, 'hero.stat1')}</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">2,400+</div>
              <div className="stat-label">{t(locale, 'hero.stat2')}</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">5</div>
              <div className="stat-label">{t(locale, 'hero.stat3')}</div>
            </div>
            <div className="hero-stat">
              <div className="stat-value">8.5%</div>
              <div className="stat-label">{t(locale, 'hero.stat4')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ROLES SECTION ========== */}
      <section className="section" id="roles">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(locale, 'roles.title')}</h2>
            <p className="section-subtitle">{t(locale, 'roles.subtitle')}</p>
          </div>

          <div className="roles-grid">
            <div className="role-card">
              <div className="role-icon">🔑</div>
              <h3>{t(locale, 'roles.tenant.title')}</h3>
              <p>{t(locale, 'roles.tenant.desc')}</p>
            </div>
            <div className="role-card">
              <div className="role-icon">🏡</div>
              <h3>{t(locale, 'roles.landlord.title')}</h3>
              <p>{t(locale, 'roles.landlord.desc')}</p>
            </div>
            <div className="role-card">
              <div className="role-icon">💼</div>
              <h3>{t(locale, 'roles.agent.title')}</h3>
              <p>{t(locale, 'roles.agent.desc')}</p>
            </div>
            <div className="role-card">
              <div className="role-icon">🏗️</div>
              <h3>{t(locale, 'roles.contractor.title')}</h3>
              <p>{t(locale, 'roles.contractor.desc')}</p>
            </div>
            <div className="role-card">
              <div className="role-icon">🛒</div>
              <h3>{t(locale, 'roles.buyer.title')}</h3>
              <p>{t(locale, 'roles.buyer.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section className="section" id="features" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t(locale, 'features.title')}</h2>
            <p className="section-subtitle">{t(locale, 'features.subtitle')}</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>{t(locale, 'features.chatbot.title')}</h3>
              <p>{t(locale, 'features.chatbot.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🖼️</div>
              <h3>{t(locale, 'features.staging.title')}</h3>
              <p>{t(locale, 'features.staging.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚖️</div>
              <h3>{t(locale, 'features.legal.title')}</h3>
              <p>{t(locale, 'features.legal.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>{t(locale, 'features.score.title')}</h3>
              <p>{t(locale, 'features.score.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>{t(locale, 'features.payment.title')}</h3>
              <p>{t(locale, 'features.payment.desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>{t(locale, 'features.intel.title')}</h3>
              <p>{t(locale, 'features.intel.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>{t(locale, 'cta.title')}</h2>
            <p>{t(locale, 'cta.subtitle')}</p>
            <button className="btn btn-lg">{t(locale, 'cta.button')}</button>
            <div className="cta-note">{t(locale, 'cta.note')}</div>
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
                <span className="logo-text">CyprusNest</span>
              </div>
              <p>{t(locale, 'footer.desc')}</p>
            </div>

            <div className="footer-col">
              <h4>{t(locale, 'footer.platform')}</h4>
              <ul>
                <li><a href="#rent">{t(locale, 'nav.rent')}</a></li>
                <li><a href="#buy">{t(locale, 'nav.buy')}</a></li>
                <li><a href="#staging">{t(locale, 'nav.staging')}</a></li>
                <li><a href="#legal">{t(locale, 'nav.legal')}</a></li>
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
                <li><a href="#">{t(locale, 'footer.privacy')}</a></li>
                <li><a href="#">{t(locale, 'footer.terms')}</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 CyprusNest. {t(locale, 'footer.rights')}</span>
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

      {/* Auth Modal */}
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} locale={locale} />

      {/* AI Chatbot */}
      <ChatbotWidget locale={locale} />
    </div>
  );
}
