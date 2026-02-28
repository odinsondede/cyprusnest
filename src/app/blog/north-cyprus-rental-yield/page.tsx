'use client';

import { useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';

const content: Record<string, string> = {
    tr: `# KKTC Kira Getirisi Analizi — Yatırıma Değer mi? (2026)

## Neden KKTC?

Kuzey Kıbrıs, Akdeniz'in en yüksek kira getirisi sunan bölgelerinden biridir. Düşük mülk fiyatları, artan öğrenci nüfusu ve turizm talebi kira gelirlerini sürekli yukarı taşımaktadır.

## Bölgelere Göre Kira Getirisi

| Bölge | Ort. Satış (£) | Ort. Kira (£/ay) | Brüt Getiri |
|-------|---------------|-------------------|-------------|
| İskele / Long Beach | 85.000 | 650 | %9.2 |
| Girne / Alsancak | 120.000 | 750 | %7.5 |
| Gönyeli / Lefkoşa | 55.000 | 350 | %7.6 |
| Gazimağusa | 50.000 | 300 | %7.2 |
| Lefke | 40.000 | 200 | %6.0 |

## Dünya ile Karşılaştırma

| Ülke | Ortalama Getiri |
|------|----------------|
| 🇨🇾 KKTC | %6-10 |
| 🇬🇧 İngiltere | %3-4 |
| 🇩🇪 Almanya | %2-3 |
| 🇷🇺 Rusya | %4-5 |
| 🇹🇷 Türkiye | %4-6 |

## En Kârlı Strateji

### Öğrenci Kiralama (Gönyeli)
- YDÜ, UKÜ yakını
- 2+1 daire = 2 öğrenci × £175 = £350/ay
- Yaz aylarında Airbnb = ek gelir

### Kısa Dönem Turizm (İskele)
- Denize sıfır stüdyo
- Yaz: £80-120/gece (doluluk %70)
- Kış: £40-60/gece (doluluk %30)
- Yıllık ortalama: £700-900/ay

### Uzun Dönem Aile (Girne)
- 3+1 villa
- Expat aileler 12 ay kira öder
- Düşük devir, sabit gelir

## Risk Faktörleri

1. **Politik belirsizlik** — Çözüm müzakereleri mülk değerini etkileyebilir
2. **Kur riski** — GBP/TRY dalgalanmaları
3. **Bakım maliyetleri** — Klima, boyama, tadilat
4. **Boşluk süresi** — Kiracı değişimlerinde 1-2 ay boş kalabilir
5. **Tapu riski** — Tapu türünü mutlaka avukatla kontrol edin

[👉 Yatırımlık İlanları Gör](/properties)`,

    en: `# North Cyprus Rental Yield Analysis — Is It Worth Investing? (2026)

## Why North Cyprus?

Northern Cyprus offers some of the highest rental yields in the Mediterranean. Low property prices, growing student population, and tourism demand continuously push rental income upward.

## Rental Yield by Region

| Region | Avg. Sale (£) | Avg. Rent (£/mo) | Gross Yield |
|--------|--------------|-------------------|-------------|
| Iskele / Long Beach | 85,000 | 650 | 9.2% |
| Kyrenia / Alsancak | 120,000 | 750 | 7.5% |
| Gönyeli / Nicosia | 55,000 | 350 | 7.6% |
| Famagusta | 50,000 | 300 | 7.2% |
| Lefke | 40,000 | 200 | 6.0% |

## Global Comparison

| Country | Average Yield |
|---------|--------------|
| 🇨🇾 TRNC | 6-10% |
| 🇬🇧 United Kingdom | 3-4% |
| 🇩🇪 Germany | 2-3% |
| 🇷🇺 Russia | 4-5% |
| 🇹🇷 Turkey | 4-6% |

## Most Profitable Strategies

### Student Rental (Gönyeli)
- Near NEU, CIU campuses
- 2+1 apartment = 2 students × £175 = £350/mo
- Summer: Airbnb = extra income

### Short-Term Tourism (Iskele)
- Beachfront studio
- Summer: £80-120/night (70% occupancy)
- Winter: £40-60/night (30% occupancy)
- Annual average: £700-900/mo

### Long-Term Family (Kyrenia)
- 3+1 villa
- Expat families pay 12-month rent
- Low turnover, stable income

## Risk Factors

1. **Political uncertainty** — Reunification talks may affect values
2. **Currency risk** — GBP/TRY fluctuations
3. **Maintenance costs** — AC, painting, renovation
4. **Vacancy periods** — 1-2 months empty during tenant changes
5. **Title deed risk** — Always verify deed type with a lawyer

[👉 View Investment Properties](/properties)`,
};

export default function RentalYieldPage() {
    const [locale, setLocale] = useState<Locale>('en');
    const articleContent = content[locale] || content['en'];

    return (
        <div>
            <nav className="navbar">
                <div className="container">
                    <a href="/" className="navbar-logo"><span className="logo-icon">🏠</span><span className="logo-text">CyprusNest</span></a>
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
                        <span style={{ padding: '4px 12px', background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>📊 Market Report</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-02-25</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 10 min</span>
                    </div>
                    <article style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        {articleContent.split('\n').map((line: string, i: number) => {
                            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '24px' }}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', color: 'var(--primary-light)', marginTop: '20px', marginBottom: '8px' }}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('| ')) {
                                const cells = line.split('|').filter((c: string) => c.trim());
                                if (cells.some((c: string) => c.includes('---'))) return null;
                                const isHeader = i < 5 || line.includes('Bölge') || line.includes('Region') || line.includes('Ülke') || line.includes('Country');
                                return (<div key={i} style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: '8px', padding: '8px 12px', background: isHeader ? 'rgba(14,165,233,0.1)' : 'transparent', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', fontWeight: isHeader ? 600 : 400, color: isHeader ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{cells.map((cell: string, j: number) => <span key={j}>{cell.trim()}</span>)}</div>);
                            }
                            if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '20px', marginBottom: '4px' }}>{line.replace('- ', '')}</li>;
                            if (line.match(/^\d+\./)) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px' }}>{line.replace(/^\d+\.\s/, '')}</li>;
                            if (line.startsWith('[')) { const m = line.match(/\[(.+)\]\((.+)\)/); if (m) return <a key={i} href={m[2]} className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex' }}>{m[1]}</a>; }
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
