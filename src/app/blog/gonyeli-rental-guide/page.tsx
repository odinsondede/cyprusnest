'use client';

import { useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';

const content: Record<string, string> = {
    tr: `# Gönyeli Kiralık Daire Rehberi — Öğrenciler ve Genç Profesyoneller İçin

## Gönyeli Nerede?

Gönyeli, Lefkoşa'nın batısında yer alan ve son yıllarda hızla büyüyen bir ilçedir. Yakın Doğu Üniversitesi (YDÜ), Uluslararası Kıbrıs Üniversitesi (UKÜ) ve Lefke Avrupa Üniversitesi'nin (LAÜ) kampüslerine yakınlığı nedeniyle özellikle öğrenci nüfusu çok yoğundur.

## Ortalama Kira Fiyatları (2026)

| Daire Tipi | Fiyat Aralığı (GBP/ay) | Not |
|------------|------------------------|-----|
| 1+0 Stüdyo | £150 - £250 | Öğrenciler için en ekonomik |
| 1+1 Daire | £200 - £350 | Tek yaşayan profesyoneller |
| 2+1 Daire | £300 - £450 | Çiftler veya oda arkadaşıyla |
| 3+1 Daire | £400 - £600 | Aileler veya grup öğrenciler |

## Bölgeler

### Merkez Gönyeli
- Market, eczane, banka hepsine yürüme mesafesi
- Kira biraz daha yüksek ama ulaşım masrafı yok
- Öğrenci dışında aileler de tercih ediyor

### YDÜ Çevresi
- Kampüse 5-10 dakika yürüme
- En yoğun öğrenci bölgesi
- Kafe, restoran, kırtasiye bol
- Kira: orta düzey

### Haspolat Yolu
- Lefkoşa merkeze ulaşım kolay
- Daha sakin, aile odaklı
- Kira: daha uygun

## Dikkat Edilmesi Gerekenler

1. **Depozit:** Genellikle 1-2 aylık kira + cari depozit (£100-300)
2. **Aidat:** Aylık £30-80 arası site aidatı olabilir
3. **Faturalar:** Elektrik, su, internet genellikle kiracıya ait
4. **Sözleşme:** Mutlaka yazılı sözleşme yapın
5. **Eşya:** "Mobilyalı" ilanlar genellikle beyaz eşya + yatak + koltuk içerir

## Ulaşım

- Lefkoşa merkeze minibüs: 10-15 dakika
- YDÜ kampüs servisi: ücretsiz
- Taksi (Lefkoşa): £5-8

## CyprusNest ile Gönyeli'de Ev Bulmak

CyprusNest'te Gönyeli ilanlarını filtreleyebilir, AI chatbot'a sorularınızı sorabilir ve WhatsApp üzerinden emlakçılarla direkt iletişime geçebilirsiniz.

[👉 Gönyeli İlanlarını Gör](/properties)`,

    en: `# Gönyeli Rental Guide — For Students and Young Professionals

## Where is Gönyeli?

Gönyeli is a rapidly growing district on the western edge of Nicosia (Lefkoşa). Its proximity to Near East University (NEU/YDÜ), Cyprus International University (CIU/UKÜ), and European University of Lefke (EUL/LAÜ) makes it a magnet for the student population.

## Average Rental Prices (2026)

| Type | Price Range (GBP/mo) | Note |
|------|---------------------|------|
| Studio | £150 - £250 | Most affordable for students |
| 1+1 Apartment | £200 - £350 | Single professionals |
| 2+1 Apartment | £300 - £450 | Couples or with roommate |
| 3+1 Apartment | £400 - £600 | Families or group of students |

## Areas

### Gönyeli Center
- Walking distance to shops, pharmacies, banks
- Slightly higher rent, but no transport costs
- Popular with families too

### Near NEU Campus
- 5-10 minute walk to campus
- Highest student density
- Plenty of cafes, restaurants, stationery
- Mid-range rent

### Haspolat Road
- Easy access to Nicosia center
- Quieter, family-oriented
- More affordable rent

## Important Tips

1. **Deposit:** Usually 1-2 months rent + utility deposit (£100-300)
2. **Maintenance fee:** Monthly £30-80 for gated communities
3. **Bills:** Electricity, water, internet typically tenant's responsibility
4. **Contract:** Always get a written rental agreement
5. **Furnished:** Usually includes white goods + bed + sofa

## Transport

- Minibus to Nicosia center: 10-15 minutes
- NEU campus shuttle: free
- Taxi to Nicosia: £5-8

## Find Your Home in Gönyeli with CyprusNest

Browse Gönyeli listings, ask our AI chatbot questions, and contact agents directly via WhatsApp.

[👉 View Gönyeli Listings](/properties)`,
};

export default function GonyeliGuidePage() {
    const [locale, setLocale] = useState<Locale>('en');
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const articleContent = content[locale] || content['en'];

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
                        <li><a href="/blog">Blog</a></li>
                    </ul>
                    <div className="navbar-right">
                        <select className="lang-selector" value={locale} onChange={(e) => setLocale(e.target.value as Locale)}>
                            {locales.map((l) => (<option key={l} value={l}>{localeFlags[l]} {localeNames[l]}</option>))}
                        </select>
                    </div>
                </div>
            </nav>

            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '780px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <a href="/blog" style={{ color: 'var(--primary-light)', fontSize: '0.9rem' }}>← {locale === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}</a>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <span style={{ padding: '4px 12px', background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>🎓 Student Guide</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-02-28</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 8 min</span>
                    </div>
                    <article className="blog-article" style={{
                        background: 'var(--bg-card)', border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)', padding: '40px',
                        lineHeight: 1.8, color: 'var(--text-secondary)',
                    }}>
                        {articleContent.split('\n').map((line, i) => {
                            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '24px' }}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', color: 'var(--primary-light)', marginTop: '20px', marginBottom: '8px' }}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('| ')) {
                                const cells = line.split('|').filter(c => c.trim());
                                if (cells.some(c => c.includes('---'))) return null;
                                const isHeader = line.includes('Fiyat') || line.includes('Price') || line.includes('Daire Tipi') || line.includes('Type');
                                return (
                                    <div key={i} style={{
                                        display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
                                        gap: '8px', padding: '8px 12px',
                                        background: isHeader ? 'rgba(14,165,233,0.1)' : 'transparent',
                                        borderBottom: '1px solid var(--border)',
                                        fontSize: '0.9rem',
                                        fontWeight: isHeader ? 600 : 400,
                                        color: isHeader ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    }}>
                                        {cells.map((cell, j) => <span key={j}>{cell.trim()}</span>)}
                                    </div>
                                );
                            }
                            if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '20px', marginBottom: '4px' }}>{line.replace('- ', '')}</li>;
                            if (line.match(/^\d+\./)) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px' }}>{line.replace(/^\d+\.\s/, '')}</li>;
                            if (line.startsWith('[')) {
                                const match = line.match(/\[(.+)\]\((.+)\)/);
                                if (match) return <a key={i} href={match[2]} className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>{match[1]}</a>;
                            }
                            if (line.trim() === '') return <br key={i} />;
                            return <p key={i} style={{ marginBottom: '8px' }}>{line}</p>;
                        })}
                    </article>
                </div>
            </main>

            <ChatbotWidget locale={locale} />
        </div>
    );
}
