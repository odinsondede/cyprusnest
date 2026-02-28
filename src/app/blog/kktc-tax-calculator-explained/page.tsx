'use client';

import { useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';

const content: Record<string, string> = {
    tr: `# KKTC Emlak Vergisi Hesaplayıcı — Ne Kadar Ödeyeceksiniz? (2026)

## Neden Vergi Hesabı Önemli?

KKTC'de mülk satın alırken sadece mülk fiyatı ödemezsiniz. Üstüne eklenen vergiler ve masraflar toplam maliyetin %12-14'ünü oluşturabilir. Bu rehberde tüm kalemleri detaylıca açıklıyoruz.

## Vergi Kalemleri

### 1. Damga Vergisi — %0.5
- Satış sözleşmesi imzalandığında ödenir
- Hesaplama: Mülk fiyatı × 0.005
- Örnek: £100.000 × 0.005 = **£500**

### 2. KDV (Katma Değer Vergisi) — %5
- Sadece yeni binalar için geçerli
- İkinci el mülklerde KDV yoktur
- Hesaplama: Mülk fiyatı × 0.05
- Örnek: £100.000 × 0.05 = **£5.000**

### 3. Tapu Harcı — %3 veya %6
- İlk mülkünüzse: **%3**
- İkinci veya daha fazla mülk: **%6**
- Hesaplama: Mülk fiyatı × 0.03 (ilk) veya 0.06
- Örnek (ilk mülk): £100.000 × 0.03 = **£3.000**

### 4. Avukat Ücreti — %1-2 (min £1.500)
- Tapu kontrolü, sözleşme hazırlama, PTP başvurusu
- Genellikle mülk fiyatının %1-2'si
- Minimum: £1.500

### 5. Diğer Masraflar
- Tercüman ücreti: £100-300 (yabancılar için)
- Noter masrafı: £50-150
- Banka transferi: £20-50
- Tapu çıkarma: £50-100

## Toplam Maliyet Örneği

| Kalem | İlk Mülk (£100K) | İkinci Mülk (£100K) |
|-------|-------------------|---------------------|
| Damga Vergisi | £500 | £500 |
| KDV (yeni bina) | £5.000 | £5.000 |
| Tapu Harcı | £3.000 | £6.000 |
| Avukat | £1.500 | £1.500 |
| Diğer | £300 | £300 |
| **TOPLAM** | **£10.300** | **£13.300** |

## Yıllık Vergiler

Mülk sahibi olduktan sonra ödenen vergiler:
- Emlak vergisi: yılda £50-200 (bölgeye göre)
- Belediye aidatı: yılda £100-300
- Kira geliri vergisi: %10 (kiralıyorsanız)

## Vergi Tasarrufu İpuçları

1. İlk mülkünüzü alın — tapu harcı yarı yarıya düşer
2. İkinci el mülk tercih edin — KDV ödemezsiniz
3. Avukat fiyatlarını karşılaştırın — en azından 3 teklif alın
4. Sözleşmede gerçek fiyatı yazın — vergi kaçırma KKTC'de suçtur

[⚖️ Vergi Hesaplayıcıyı Kullan](/legal)`,

    en: `# North Cyprus Property Tax Calculator — How Much Will You Pay? (2026)

## Why Tax Calculation Matters

When buying property in North Cyprus, you don't just pay the property price. Additional taxes and costs can add up to 12-14% of the total. This guide explains every line item in detail.

## Tax Items

### 1. Stamp Duty — 0.5%
- Paid when the sales contract is signed
- Calculation: Property price × 0.005
- Example: £100,000 × 0.005 = **£500**

### 2. VAT (Value Added Tax) — 5%
- Only applies to new-build properties
- No VAT on resale/second-hand properties
- Calculation: Property price × 0.05
- Example: £100,000 × 0.05 = **£5,000**

### 3. Transfer Tax — 3% or 6%
- First property: **3%**
- Second or more properties: **6%**
- Calculation: Property price × 0.03 (first) or 0.06
- Example (first property): £100,000 × 0.03 = **£3,000**

### 4. Lawyer Fees — 1-2% (min £1,500)
- Title deed verification, contract preparation, PTP application
- Usually 1-2% of the property price
- Minimum: £1,500

### 5. Other Costs
- Translator fee: £100-300 (for foreigners)
- Notary fee: £50-150
- Bank transfer: £20-50
- Title deed issuance: £50-100

## Total Cost Example

| Item | First Property (£100K) | Second Property (£100K) |
|------|----------------------|------------------------|
| Stamp Duty | £500 | £500 |
| VAT (new build) | £5,000 | £5,000 |
| Transfer Tax | £3,000 | £6,000 |
| Lawyer | £1,500 | £1,500 |
| Other | £300 | £300 |
| **TOTAL** | **£10,300** | **£13,300** |

## Annual Taxes

Taxes paid after owning the property:
- Property tax: £50-200/year (varies by region)
- Municipal fee: £100-300/year
- Rental income tax: 10% (if renting out)

## Tax Saving Tips

1. Buy your first property — transfer tax is halved
2. Choose resale properties — no VAT
3. Compare lawyer fees — get at least 3 quotes
4. Declare the real price in the contract — tax evasion is a crime in TRNC

[⚖️ Use Our Tax Calculator](/legal)`,
};

export default function TaxCalculatorPage() {
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
                        <span style={{ padding: '4px 12px', background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>💰 Finance</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-02-22</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 7 min</span>
                    </div>
                    <article style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                        {articleContent.split('\n').map((line: string, i: number) => {
                            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '24px' }}>{line.replace('# ', '')}</h1>;
                            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginTop: '32px', marginBottom: '12px' }}>{line.replace('## ', '')}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: '1.1rem', color: 'var(--primary-light)', marginTop: '20px', marginBottom: '8px' }}>{line.replace('### ', '')}</h3>;
                            if (line.startsWith('| ')) {
                                const cells = line.split('|').filter((c: string) => c.trim());
                                if (cells.some((c: string) => c.includes('---'))) return null;
                                const isHeader = line.includes('Kalem') || line.includes('Item');
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
