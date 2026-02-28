'use client';

import { useState } from 'react';
import { type Locale, localeNames, localeFlags, locales, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';

const content: Record<string, string> = {
    tr: `# Yabancılar İçin KKTC Emlak Rehberi (2026)

## KKTC'de Yabancı Mülk Alabilir mi?

Evet! Yabancı uyruklu kişiler Kuzey Kıbrıs'ta mülk satın alabilir. Ancak bazı özel kurallar ve süreçler vardır.

## Adım Adım Satın Alma Süreci

### 1. Mülk Seçimi
- CyprusNest üzerinden ilanları inceleyin
- AI chatbot'a sorularınızı sorun
- WhatsApp ile emlakçıyla iletişime geçin
- Mülkü yerinde görün (veya AI virtual staging ile uzaktan inceleyin)

### 2. Avukat Tutma (ZORUNLU)
- Bağımsız bir KKTC avukatı tutun
- Avukat tapu temizliğini kontrol eder
- İpotek, haciz, borç kontrolü yapılır
- Maliyet: £1.500 - £3.000

### 3. Satış Sözleşmesi
- Fiyat, ödeme planı, teslim tarihi belirlenir
- Peşinat: genellikle %10-30
- Sözleşme noter onaylı olmalı

### 4. PTP Başvurusu (Satın Alma İzni)
- Bakanlar Kurulu'na başvuru yapılır
- Avukatınız bu süreci yönetir
- Bekleme süresi: 6-12 ay
- Onay oranı: çok yüksek (%95+)
- PTP beklerken mülke taşınabilirsiniz

### 5. Tapu Devri
- PTP onaylandıktan sonra
- Tapu Dairesi'nde resmi devir
- Vergiler bu aşamada ödenir

## Vergiler ve Maliyetler

| Kalem | Oran | Açıklama |
|-------|------|----------|
| Damga Vergisi | %0.5 | Sözleşme imzasında |
| KDV | %5 | Yeni binalar için |
| Tapu Harcı | %6 | İlk mülk %3, ikinci %6 |
| Avukat | %1-2 | Min £1.500 |
| Toplam ek maliyet | ~%12-14 | Mülk fiyatının üzerine |

## Hangi Tapu Türü Güvenli?

- ✅ **Türk Tapusu (Eşdeğer Koçan):** En güvenli
- ⚠️ **Tahsis Tapusu:** Devlet tahsisi, kontrol et
- ❌ **Rum Koçanı:** Riskli, avukatsız ALMA

## En Çok Yatırım Yapılan Bölgeler

1. **İskele / Long Beach** — En yüksek kira getirisi
2. **Girne / Alsancak** — Premium yaşam
3. **Gönyeli / Lefkoşa** — Öğrenci kiralama
4. **Gazimağusa** — Uygun fiyat, EMU yakını

## Kira Getirisi

KKTC'de ortalama brüt kira getirisi: **%6-10/yıl**

Bu oran İngiltere (%3-4), Almanya (%2-3) ve Rusya'ya (%4-5) göre çok yüksek.

[👉 Yatırımlık İlanları Gör](/properties)
[⚖️ Vergi Hesaplayıcıya Git](/legal)`,

    en: `# Complete Guide to Buying Property in North Cyprus as a Foreigner (2026)

## Can Foreigners Buy Property in North Cyprus?

Yes! Foreign nationals can purchase property in Northern Cyprus (TRNC). However, there are specific rules and processes to follow.

## Step-by-Step Purchase Process

### 1. Property Selection
- Browse listings on CyprusNest
- Ask our AI chatbot any questions
- Contact agents directly via WhatsApp
- View properties in person (or remotely with AI virtual staging)

### 2. Hire a Lawyer (ESSENTIAL)
- Engage an independent TRNC lawyer
- Lawyer verifies title deed authenticity
- Checks for mortgages, liens, outstanding debts
- Cost: £1,500 - £3,000

### 3. Sales Contract
- Price, payment plan, delivery date agreed
- Deposit: typically 10-30%
- Contract must be notarized

### 4. PTP Application (Permission to Purchase)
- Application to the Council of Ministers
- Your lawyer manages this process
- Waiting period: 6-12 months
- Approval rate: very high (95%+)
- You can move into the property while waiting for PTP

### 5. Title Deed Transfer
- After PTP approval
- Official transfer at Land Registry Office
- Taxes paid at this stage

## Taxes and Costs

| Item | Rate | Description |
|------|------|-------------|
| Stamp Duty | 0.5% | At contract signing |
| VAT | 5% | New build properties only |
| Transfer Tax | 6% | First property 3%, second 6% |
| Lawyer | 1-2% | Minimum £1,500 |
| Total extra cost | ~12-14% | On top of property price |

## Which Title Deed Type is Safe?

- ✅ **Turkish Title (Eşdeğer Koçan):** Most secure
- ⚠️ **Allocation Title (Tahsis):** Government allocated, verify carefully
- ❌ **Greek Cypriot Title:** Risky, never buy without legal advice

## Top Investment Areas

1. **Iskele / Long Beach** — Highest rental yield
2. **Kyrenia / Alsancak** — Premium living
3. **Gönyeli / Nicosia** — Student rental market
4. **Famagusta** — Affordable, near EMU

## Rental Yield

Average gross rental yield in TRNC: **6-10% per year**

This compares favorably to the UK (3-4%), Germany (2-3%), and Russia (4-5%).

[👉 View Investment Properties](/properties)
[⚖️ Go to Tax Calculator](/legal)`,
};

export default function ForeignersGuidePage() {
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
                        <span style={{ padding: '4px 12px', background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>⚖️ Legal Guide</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-02-27</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 12 min</span>
                    </div>
                    <article style={{
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
                                const isHeader = cells.length > 0 && (line.includes('Kalem') || line.includes('Item') || line.includes('Oran') || line.includes('Rate'));
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
                            if (line.match(/^\d+\./)) return <li key={i} style={{ marginLeft: '20px', marginBottom: '6px', fontWeight: 600, color: 'var(--text-primary)' }}>{line.replace(/^\d+\.\s/, '')}</li>;
                            if (line.startsWith('[')) {
                                const match = line.match(/\[(.+)\]\((.+)\)/);
                                if (match) return <a key={i} href={match[2]} className="btn btn-primary" style={{ marginTop: '16px', marginRight: '12px', display: 'inline-flex' }}>{match[1]}</a>;
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
