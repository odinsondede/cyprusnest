'use client';

import { useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';

const content: Record<string, string> = {
    tr: `# KKTC Kira Getirisi Analizi — Yatırıma Değer mi? (2026)

## Neden KKTC?

Kuzey Kıbrıs, Akdeniz'in en yüksek kira getirisi sunan bölgelerinden biridir. Yıllık %6-10 arası brüt kira getirisi, İngiltere (%3-4), Almanya (%2-3) ve Türkiye (%4-6) ile karşılaştırıldığında ciddi bir avantaj sunmaktadır.

## Bölgelere Göre Güncel Fiyatlar ve Kira Getirisi (2025-2026)

| Bölge | Ort. Satış (£) | Ort. Kira (£/ay) | Brüt Getiri |
|-------|---------------|-------------------|-------------|
| İskele / Long Beach | 120.000-250.000 | 700-1.200 | %6-7 |
| Girne / Alsancak | 150.000-280.000 | 800-1.500 | %5-7 |
| Gönyeli / Lefkoşa | 70.000-120.000 | 500-650 | %6.5-8 |
| Gazimağusa | 85.000-160.000 | 450-700 | %5-7 |
| Lefke | 50.000-80.000 | 250-400 | %5-6 |
| Esentepe | 100.000-200.000 | 600-1.000 | %6-7 |
| Lapta | 130.000-250.000 | 700-1.200 | %5.5-6.5 |

> ⚠️ Fiyatlar 101evler.com, kairoscyprus.com ve yerel emlakçı verilerine dayanmaktadır. Mülk durumu, konum, kat ve proje kalitesine göre önemli farklılıklar olabilir.

## Dünya ile Karşılaştırma

| Ülke | Ortalama Brüt Getiri |
|------|---------------------|
| 🇨🇾 KKTC | %6-10 |
| 🇬🇧 İngiltere | %3-4 |
| 🇩🇪 Almanya | %2-3 |
| 🇷🇺 Rusya | %4-5 |
| 🇹🇷 Türkiye | %4-6 |
| 🇪🇸 İspanya | %4-5 |
| 🇵🇹 Portekiz | %4-6 |

## En Kârlı Stratejiler

### 1. Öğrenci Kiralama (Gönyeli / Gazimağusa)
- YDÜ, UKÜ, DAÜ yakını
- 2+1 daire 2 öğrenci = kişi başı £250-300 = toplam £500-600/ay
- Eylül-Haziran tam doluluk
- Yaz aylarında kısa dönem kiralama ek gelir
- **Avantaj:** Sürekli talep, düşük boşluk oranı

### 2. Kısa Dönem Turizm (İskele / Girne)
- Denize yakın stüdyo veya 1+1
- Yaz: £80-150/gece (doluluk %60-70)
- Kış: £40-70/gece (doluluk %20-30)
- Yıllık ort: £700-1.100/ay
- **Avantaj:** Yüksek gelir potansiyeli
- **Risk:** Mevsimsellik, bakım yoğun

### 3. Uzun Dönem Aile (Girne / Alsancak)
- 3+1 villa veya geniş daire
- Expat aileler 12 ay kira öder
- Düşük devir, sabit gelir
- £800-1.500/ay
- **Avantaj:** Pasif gelir, düşük yönetim

### 4. Plan Dışı (Off-Plan) Yatırım
- Teslim öncesi %30-60 daha uygun
- 2-3 yıl sonra teslimde değer artışı
- Taksitli ödeme imkanı
- **Risk:** İnşaat gecikmesi, müteahhit güvenilirliği

## Büyük Müteahhitler (Güvenilir Firmalar)

| Firma | Bölge | Öne Çıkan Proje |
|-------|-------|-----------------|
| NorthernLAND | İskele | Grand Sapphire Resort |
| Döveç | İskele | Querencia / Bellagio |
| Afık Group | İskele | Caesar Resort |
| Dem's | İskele | Venice Long Beach |
| Eden Projects | Geçitkale/Güzelyurt | Sosyal konut projeleri |

## Net Getiri Hesabı

Brüt kira gelirinden düşülecek giderler:
- Emlak vergisi: £50-200/yıl
- Belediye aidatı: £100-300/yıl
- Site bakım: £300-960/yıl (£25-80/ay)
- Sigorta: £100-300/yıl
- Bakım/tamir: yıllık kiranın %5-10'u
- Kira gelir vergisi: %10

**Örnek:** £120.000'a alınan İskele stüdyo, aylık £700 kira
- Brüt yıllık: £8.400 (Brüt getiri: %7)
- Giderler: ~£2.000/yıl
- Net yıllık: ~£6.400 (**Net getiri: %5.3**)

## Risk Faktörleri

1. **Politik belirsizlik** — Kıbrıs çözüm müzakereleri mülk değerini olumlu veya olumsuz etkileyebilir
2. **Kur riski** — GBP/TRY dalgalanmaları operasyonel masrafları etkiler
3. **Tapu riski** — Eski Rum malı tapular sorunlu olabilir. Avukatla kontrol şart
4. **İnşaat kalitesi** — Her müteahhit aynı kalitede değil
5. **Boşluk süresi** — Kiracı değişimlerinde 1-2 ay boş kalabilir
6. **Yasal değişiklikler** — 2025'te yabancı alım kuralları değişti, gelecekte de değişebilir

[👉 Yatırımlık İlanları Gör](/properties)`,

    en: `# North Cyprus Rental Yield Analysis — Is It Worth Investing? (2026)

## Why North Cyprus?

Northern Cyprus offers some of the highest rental yields in the Mediterranean. With gross yields of 6-10% annually, it significantly outperforms the UK (3-4%), Germany (2-3%), and Turkey (4-6%).

## Current Prices & Rental Yields by Region (2025-2026)

| Region | Avg. Sale (£) | Avg. Rent (£/mo) | Gross Yield |
|--------|--------------|-------------------|-------------|
| Iskele / Long Beach | 120,000-250,000 | 700-1,200 | 6-7% |
| Kyrenia / Alsancak | 150,000-280,000 | 800-1,500 | 5-7% |
| Gönyeli / Nicosia | 70,000-120,000 | 500-650 | 6.5-8% |
| Famagusta | 85,000-160,000 | 450-700 | 5-7% |
| Lefke | 50,000-80,000 | 250-400 | 5-6% |
| Esentepe | 100,000-200,000 | 600-1,000 | 6-7% |
| Lapta | 130,000-250,000 | 700-1,200 | 5.5-6.5% |

> ⚠️ Prices are based on 101evler.com, kairoscyprus.com and local agent data. Significant variations exist based on condition, location, floor, and project quality.

## Global Comparison

| Country | Average Gross Yield |
|---------|---------------------|
| 🇨🇾 TRNC | 6-10% |
| 🇬🇧 United Kingdom | 3-4% |
| 🇩🇪 Germany | 2-3% |
| 🇷🇺 Russia | 4-5% |
| 🇹🇷 Turkey | 4-6% |
| 🇪🇸 Spain | 4-5% |
| 🇵🇹 Portugal | 4-6% |

## Most Profitable Strategies

### 1. Student Rental (Gönyeli / Famagusta)
- Near NEU, CIU, EMU campuses
- 2+1 apartment for 2 students = £250-300 each = £500-600/mo total
- Full occupancy September-June
- Summer short-term rentals for extra income
- **Advantage:** Constant demand, low vacancy

### 2. Short-Term Tourism (Iskele / Kyrenia)
- Beachfront studio or 1+1
- Summer: £80-150/night (60-70% occupancy)
- Winter: £40-70/night (20-30% occupancy)
- Annual avg: £700-1,100/mo
- **Advantage:** High income potential
- **Risk:** Seasonality, maintenance-heavy

### 3. Long-Term Family (Kyrenia / Alsancak)
- 3+1 villa or spacious apartment
- Expat families pay 12-month rent
- Low turnover, stable income
- £800-1,500/mo
- **Advantage:** Passive income, low management

### 4. Off-Plan Investment
- 30-60% cheaper before completion
- Value appreciation on delivery (2-3 years)
- Installment payment options
- **Risk:** Construction delays, developer reliability

## Major Developers (Trusted Companies)

| Company | Region | Featured Project |
|---------|--------|-----------------|
| NorthernLAND | Iskele | Grand Sapphire Resort |
| Döveç | Iskele | Querencia / Bellagio |
| Afık Group | Iskele | Caesar Resort |
| Dem's | Iskele | Venice Long Beach |
| Eden Projects | Geçitkale/Güzelyurt | Social housing |

## Net Yield Calculation

Deductions from gross rental income:
- Property tax: £50-200/year
- Municipal fee: £100-300/year
- Maintenance: £300-960/year (£25-80/mo)
- Insurance: £100-300/year
- Repairs: 5-10% of annual rent
- Rental income tax: 10%

**Example:** Iskele studio bought for £120,000, renting for £700/mo
- Gross annual: £8,400 (Gross yield: 7%)
- Expenses: ~£2,000/year
- Net annual: ~£6,400 (**Net yield: 5.3%**)

## Risk Factors

1. **Political uncertainty** — Cyprus reunification talks may affect values positively or negatively
2. **Currency risk** — GBP/TRY fluctuations affect operational costs
3. **Title deed risk** — Former Greek Cypriot property titles may be problematic. Lawyer check essential
4. **Construction quality** — Not all developers deliver equal quality
5. **Vacancy periods** — 1-2 months empty during tenant changes
6. **Regulatory changes** — Foreign purchase rules changed in 2025, may change again

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
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-03-01</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 12 min</span>
                    </div>
                    <article style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        {articleContent.split('\n').map((line: string, i: number) => {
                            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '24px' }}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', color: 'var(--primary-light)', marginTop: '20px', marginBottom: '8px' }}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('> ')) return <blockquote key={i} style={{ padding: '12px 16px', background: 'rgba(255,200,50,0.05)', border: '1px solid rgba(255,200,50,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-muted)', margin: '12px 0' }}>{line.replace('> ', '')}</blockquote>;
                            if (line.startsWith('| ')) {
                                const cells = line.split('|').filter((c: string) => c.trim());
                                if (cells.some((c: string) => c.includes('---'))) return null;
                                const isHeader = line.includes('Bölge') || line.includes('Region') || line.includes('Ülke') || line.includes('Country') || line.includes('Firma') || line.includes('Company');
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
