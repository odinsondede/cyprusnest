'use client';

import { useState } from 'react';
import { type Locale, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';

const content: Record<string, string> = {
    tr: `# Yabancılar İçin KKTC Emlak Rehberi — Güncel 2025-2026

## KKTC'de Yabancı Mülk Alabilir mi?

Evet! Yabancı uyruklu kişiler Kuzey Kıbrıs'ta mülk satın alabilir. Ancak 2025 yılında yürürlüğe giren yeni düzenlemelerle kurallar sıkılaştırılmıştır.

## Yabancı Alıcı Limitleri (2025 Düzenlemesi)

| Vatandaşlık | Daire Limiti | Villa Limiti | Arsa |
|-------------|-------------|-------------|------|
| TC Vatandaşı | 6 daire | 3 villa | Sınırsız |
| Yabancı Uyruklu | Max 3 daire | Max 2 villa | Max 1 dönüm (1.338 m²) |
| Şirket (KKTC tescilli) | Daha yüksek | Daha yüksek | Min €10M yatırım ile 80.280 m² |

> ⚠️ Trustee (vekalet) düzenlemeleri artık YASADIŞI. Mevcut olanlar feshedilmek zorunda.

## Adım Adım Satın Alma Süreci

### 1. Mülk Seçimi
- İlanları inceleyin (CyprusNest, 101evler)
- WhatsApp ile emlakçıyla iletişim kurun
- Mülkü mutlaka yerinde görün
- Tapu türünü sorun (Eşdeğer Koçan en güvenli)

### 2. Avukat Tutma (ZORUNLU)
- Bağımsız bir KKTC avukatı tutun
- Avukat tapu temizliğini kontrol eder
- İpotek, haciz, borç kontrolü yapılır
- Maliyet: £1.500 - £3.000
- En az 3 avukattan teklif alın

### 3. Satış Sözleşmesi
- Fiyat, ödeme planı, teslim tarihi belirlenir
- Peşinat: genellikle %10-30
- Sözleşme 21 gün içinde Tapu Dairesi'ne kaydedilmelidir
- Gecikirse ceza uygulanır

### 4. PTP Başvurusu (Satın Alma İzni)
- Bakanlar Kurulu'na (İçişleri Bakanlığı) başvuru
- Avukatınız online başvuru yapar
- Bekleme süresi: **6-24 ay** (milliyete ve evrak durumuna göre)
- PTP beklerken mülke taşınabilirsiniz
- PTP başvuru ücreti: ~£250

### Gerekli Belgeler
- Pasaport fotokopisi
- Tapu fotokopisi
- Kayıtlı satış sözleşmesi
- Vaziyet planı
- Vatandaşı olduğu ülkeden sabıka kaydı (ikamet değil!)
- İçişleri Bakanlığı'na dilekçe

### 5. Tapu Devri
- PTP onayı Resmi Gazete'de yayımlandıktan sonra
- **75 iş günü içinde** tüm vergi ve harçlar ödenmeli
- Ödeme gecikirirse PTP iptal olur!
- Tapu devri için 6 ay süre

## Vergiler — Yabancılar İçin

| Kalem | Oran | Not |
|-------|------|-----|
| Damga Vergisi | %0.6 | Sözleşme imzasında (21 gün) |
| KDV | %5 | Sadece yeni inşaat |
| Tapu Harcı | %9 | %6 kayıt + %3 izin sonrası |
| Avukat | %1-2 | Min £1.500 |
| Toplam ek maliyet | ~%15-17 | Mülk fiyatının üzerine |

## Tapu Türleri

- ✅ **Türk Tapusu (Eşdeğer Koçan):** En güvenli, 1974 sonrası Türk devleti tarafından verilen
- ⚠️ **Tahsis Tapusu:** Devlet arazisi üzerinde, dönüştürülebilir ama kontrol edin
- ❌ **Rum Koçanı (Eski Eşdeğer):** Riskli — AB Mahkemesi kararları soruna yol açabilir
- 📋 **Kat İrtifakı:** Bitmiş bina tapusu, güvenli

## Alım Yasakları

Yabancılar şunları ALAMAZ:
- Tarım arazisi
- Orman arazisi
- Askeri bölge yakını mülkler
- Kamu güvenliği açısından hassas bölgeler

## Bölge bazında toplam yabancı mülk oranı da sınırlandırılmıştır:
- İlçe bazında: max %7
- Ülke genelinde: max %3
- Proje bazında: max %80 yabancıya satılabilir

## En Çok Yatırım Yapılan Bölgeler

1. **İskele / Long Beach** — En yüksek kira getirisi, yeni projeler
2. **Girne / Alsancak** — Premium yaşam, turistik
3. **Gönyeli / Lefkoşa** — Öğrenci kiralama, uygun fiyat
4. **Gazimağusa** — DAÜ yakını, büyüyen bölge
5. **Esentepe** — Lüks villalar, golf tesisleri
6. **Lapta** — Doğa, deniz, sessiz yaşam

> ⚠️ Bu bilgiler 2025 Mayıs düzenlemesine dayanmaktadır. Yasal süreçler değişebilir. Mutlaka KKTC avukatına danışın.

[👉 Yatırımlık İlanları Gör](/properties)
[⚖️ Vergi Hesaplayıcıya Git](/legal)`,

    en: `# Complete Guide to Buying Property in North Cyprus as a Foreigner (2025-2026)

## Can Foreigners Buy Property in North Cyprus?

Yes! Foreign nationals can purchase property in the TRNC. However, regulations tightened significantly in 2025 with new laws on ownership limits and purchase procedures.

## Foreign Buyer Property Limits (2025 Regulation)

| Citizenship | Apartment Limit | Villa Limit | Land |
|------------|----------------|-------------|------|
| Turkish Citizen | 6 apartments | 3 villas | Unlimited |
| Foreign National | Max 3 apartments | Max 2 villas | Max 1 donum (1,338 m²) |
| Company (TRNC registered) | Higher limits | Higher limits | Up to 80,280 m² with €10M+ investment |

> ⚠️ Trustee arrangements are now ILLEGAL. Existing ones must be dissolved.

## Step-by-Step Purchase Process

### 1. Property Selection
- Browse listings (CyprusNest, 101evler)
- Contact agents via WhatsApp
- Always visit the property in person
- Ask about title deed type (Turkish Title is safest)

### 2. Hire a Lawyer (ESSENTIAL)
- Engage an independent TRNC lawyer
- Lawyer verifies title deed authenticity
- Checks for mortgages, liens, debts
- Cost: £1,500 - £3,000
- Get quotes from at least 3 lawyers

### 3. Sales Contract
- Price, payment plan, delivery date agreed
- Deposit: typically 10-30%
- Contract must be registered at Land Registry within 21 days
- Late registration incurs penalties

### 4. PTP Application (Permission to Purchase)
- Application to Council of Ministers (Ministry of Interior)
- Your lawyer handles the online application
- Waiting period: **6-24 months** (varies by nationality and paperwork)
- You can move into the property while waiting
- PTP application fee: ~£250

### Required Documents
- Passport copy
- Title deed copy
- Registered sales contract
- Site plan
- Police clearance from country of CITIZENSHIP (not residence!)
- Formal letter to Ministry of Interior

### 5. Title Deed Transfer
- After PTP approval is published in the Official Gazette
- **All taxes must be paid within 75 working days**
- Late payment = PTP cancellation!
- 6 months to complete transfer

## Taxes — For Foreign Buyers

| Item | Rate | Note |
|------|------|------|
| Stamp Duty | 0.6% | At contract signing (21 days) |
| VAT | 5% | New build only |
| Transfer Tax | 9% | 6% at registration + 3% after permit |
| Lawyer | 1-2% | Min £1,500 |
| Total extra cost | ~15-17% | On top of property price |

## Title Deed Types

- ✅ **Turkish Title (Eşdeğer Koçan):** Most secure, issued by Turkish state post-1974
- ⚠️ **Allocation Title (Tahsis):** Government land, can be converted but verify
- ❌ **Greek Cypriot Title:** Risky — EU court rulings may cause problems
- 📋 **Condominium Title (Kat İrtifakı):** Completed building title, safe

## Purchase Restrictions

Foreigners CANNOT buy:
- Agricultural land
- Forest land
- Properties near military zones
- Areas deemed important for public security/order

## Regional ownership caps:
- Per district: max 7% foreign ownership
- Nationwide: max 3% foreign ownership
- Per project: max 80% of units can be sold to foreigners

## Top Investment Areas

1. **Iskele / Long Beach** — Highest yields, new projects
2. **Kyrenia / Alsancak** — Premium living, touristic
3. **Gönyeli / Nicosia** — Student rental, affordable
4. **Famagusta** — Near EMU, growing area
5. **Esentepe** — Luxury villas, golf courses
6. **Lapta** — Nature, sea, quiet living

> ⚠️ This information is based on the May 2025 regulation. Legal processes may change. Always consult a TRNC lawyer.

[👉 View Investment Properties](/properties)
[⚖️ Go to Tax Calculator](/legal)`,
};

export default function ForeignersGuidePage() {
    const [locale, setLocale] = useState<Locale>('en');
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const articleContent = content[locale] || content['en'];

    return (
        <div dir={dir}>
            <Navbar locale={locale} onLocaleChange={setLocale} activePage="blog" />

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
