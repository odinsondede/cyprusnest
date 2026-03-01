'use client';

import { useState } from 'react';
import { type Locale, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';

const content: Record<string, string> = {
    tr: `# KKTC Emlak Vergisi Rehberi — Milliyete Göre Vergiler (2026)

## Neden Bu Rehber Önemli?

KKTC'de mülk alırken ödeyeceğiniz vergiler **milliyetinize göre değişir.** Aşağıdaki bilgiler 2025 yılında yürürlüğe giren güncel düzenlemelere dayanmaktadır.

## 1. Damga Vergisi (Pul Harcı)

Satış sözleşmesi imzalandığında, 21 gün içinde Vergi Dairesi'ne kaydedilmesi gerekir.

| Durum | Oran |
|-------|------|
| KKTC vatandaşı — ilk mülk | %0.5 |
| Yabancı / yatırımcı / 2. mülk | %0.6 |

21 gün içinde kayıt yaptırılmazsa gecikme cezası uygulanır.

## 2. KDV (Katma Değer Vergisi) — %5

| Durum | KDV |
|-------|-----|
| Yeni inşaat (sıfır daire) | %5 |
| İkinci el — bireysel satıcı | YOK |

## 3. Tapu Devir Harcı — MİLLİYETE GÖRE DEĞİŞİR

### TC Vatandaşları

| Kaçıncı Mülk | Tapu Harcı | Ödeme |
|--------------|-----------|-------|
| 1. mülk | %6 | %3 kayıt + %3 izin sonrası |
| 2. mülk | %8 | %2 kayıt + %6 izin sonrası |
| 3. ve sonrası | %9 | %3 kayıt + %6 izin sonrası |

### Yabancı Uyruklu Vatandaşlar

| Durum | Tapu Harcı |
|-------|-----------|
| Tüm mülkler | %9 |
| Ödeme | %6 kayıt + %3 izin sonrası 75 gün içinde |

> ⚠️ Mayıs 2025 düzenlemesiyle yabancılar için oran %12'den %9'a düşürülmüştür.

## 4. Avukat Ücreti — %1-2 (min £1.500)

- Tapu kontrolü, sözleşme hazırlama
- PTP (Satın Alma İzni) başvurusu
- Genellikle mülk fiyatının %1-2'si
- Minimum: £1.500

## 5. Diğer Masraflar

| Kalem | Tutar |
|-------|-------|
| Tercüman | £100-300 |
| Noter | £50-150 |
| Banka transferi | £20-50 |
| Tapu çıkarma | £50-100 |
| PTP başvuru ücreti | ~£250 (asgari ücretin yarısı) |

## Toplam Maliyet Karşılaştırması — £150.000 Mülk İçin

| Kalem | TC 1. Mülk | TC 2. Mülk | Yabancı |
|-------|-----------|-----------|---------|
| Damga | £750 | £900 | £900 |
| KDV (yeni) | £7.500 | £7.500 | £7.500 |
| Tapu Harcı | £9.000 | £12.000 | £13.500 |
| Avukat | £1.500 | £1.500 | £2.000 |
| Diğer | £300 | £300 | £600 |
| **TOPLAM** | **£19.050** | **£22.200** | **£24.500** |

## Yıllık Vergiler (Mülk Sahibi Olduktan Sonra)

| Vergi | Tutar |
|-------|-------|
| Emlak vergisi | £50-200/yıl |
| Belediye aidatı | £100-300/yıl |
| Kira gelir vergisi | %10 (kiralıyorsanız) |

## Vergi Tasarrufu İpuçları

1. **İlk mülkünüzü alın** — TC vatandaşları tapu harcında %33 tasarruf eder
2. **İkinci el tercih edin** — KDV ödemezsiniz (£7.500 tasarruf)
3. **3 avukattan teklif alın** — ücretler ciddi farklılık gösterebilir
4. **Sözleşmeyi 21 gün içinde kaydedin** — gecikme cezasından kaçının
5. **PTP sonrası 75 gün kuralı** — vergiler zamanında ödenmezse izin iptal olur!

> ⚠️ Bu bilgiler 2025 Mayıs düzenlemesine dayanmaktadır. Oranlar ve kurallar değişebilir. Kesin bilgi için KKTC avukatına danışın.

[⚖️ Vergi Hesaplayıcıyı Kullan](/legal)`,

    en: `# North Cyprus Property Tax Guide — Taxes by Nationality (2026)

## Why This Guide Matters

When buying property in North Cyprus, the taxes you pay **vary by your nationality.** The information below is based on the regulations effective from 2025.

## 1. Stamp Duty

Payable when the sales contract is signed, must be registered with Tax Office within 21 days.

| Situation | Rate |
|-----------|------|
| TRNC citizen — first property | 0.5% |
| Foreign / investor / 2nd property | 0.6% |

Late registration incurs penalty fees.

## 2. VAT (Value Added Tax) — 5%

| Situation | VAT |
|-----------|-----|
| New build (off-plan/new) | 5% |
| Resale — individual seller | NONE |

## 3. Transfer Tax — VARIES BY NATIONALITY

### Turkish Citizens

| Property Number | Transfer Tax | Payment |
|----------------|-------------|---------|
| 1st property | 6% | 3% at registration + 3% after permit |
| 2nd property | 8% | 2% at registration + 6% after permit |
| 3rd and beyond | 9% | 3% at registration + 6% after permit |

### Foreign Nationals

| Situation | Transfer Tax |
|-----------|-------------|
| All properties | 9% |
| Payment | 6% at registration + 3% within 75 days after permit |

> ⚠️ As of May 2025, the foreign buyer rate was reduced from 12% to 9%.

## 4. Lawyer Fees — 1-2% (min £1,500)

- Title deed verification, contract preparation
- PTP (Permission to Purchase) application
- Usually 1-2% of property price
- Minimum: £1,500

## 5. Other Costs

| Item | Amount |
|------|--------|
| Translator | £100-300 |
| Notary | £50-150 |
| Bank transfer | £20-50 |
| Title deed issuance | £50-100 |
| PTP application fee | ~£250 (half of minimum wage) |

## Total Cost Comparison — For a £150,000 Property

| Item | TC 1st Property | TC 2nd Property | Foreign |
|------|----------------|----------------|---------|
| Stamp Duty | £750 | £900 | £900 |
| VAT (new build) | £7,500 | £7,500 | £7,500 |
| Transfer Tax | £9,000 | £12,000 | £13,500 |
| Lawyer | £1,500 | £1,500 | £2,000 |
| Other | £300 | £300 | £600 |
| **TOTAL** | **£19,050** | **£22,200** | **£24,500** |

## Annual Taxes (After Ownership)

| Tax | Amount |
|-----|--------|
| Property tax | £50-200/year |
| Municipal fee | £100-300/year |
| Rental income tax | 10% (if renting out) |

## Tax Saving Tips

1. **Buy your first property** — TC citizens save 33% on transfer tax
2. **Choose resale** — No VAT (save £7,500)
3. **Get 3 lawyer quotes** — fees vary significantly
4. **Register contract within 21 days** — avoid late penalties
5. **75-day rule after PTP** — taxes must be paid on time or permit is cancelled!

> ⚠️ This information is based on the May 2025 regulation update. Rates and rules may change. Consult a TRNC lawyer for exact figures.

[⚖️ Use Our Tax Calculator](/legal)`,
};

export default function TaxCalculatorPage() {
    const [locale, setLocale] = useState<Locale>('tr');
    const articleContent = content[locale] || content['en'];

    return (
        <div>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="blog" />
            <main style={{ paddingTop: '100px', paddingBottom: '64px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '780px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <a href="/blog" style={{ color: 'var(--primary-light)', fontSize: '0.9rem' }}>← {locale === 'tr' ? 'Blog\'a Dön' : 'Back to Blog'}</a>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                        <span style={{ padding: '4px 12px', background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>💰 Finance</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-03-01</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 10 min</span>
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
                                const isHeader = line.includes('Kalem') || line.includes('Item') || line.includes('Durum') || line.includes('Situation') || line.includes('Kaçıncı') || line.includes('Property Number') || line.includes('Vergi') || line.includes('Tax');
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
