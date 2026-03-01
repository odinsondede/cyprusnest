'use client';

import { useState } from 'react';
import { type Locale, t } from '@/i18n/translations';
import ChatbotWidget from '@/components/ChatbotWidget';
import Navbar from '@/components/Navbar';

const content: Record<string, string> = {
    tr: `# Gönyeli Kiralık Daire Rehberi — Öğrenciler ve Genç Profesyoneller İçin (2026)

## Gönyeli Nerede?

Gönyeli, Lefkoşa'nın batısında yer alan KKTC'nin en hızlı büyüyen ilçelerinden biridir. Yakın Doğu Üniversitesi (YDÜ), Uluslararası Kıbrıs Üniversitesi (UKÜ) ve Lefke Avrupa Üniversitesi Lefkoşa Kampüsü'ne yakınlığıyla öğrenci nüfusunun yoğun olduğu bir bölgedir.

## 2025-2026 Güncel Kira Fiyatları (Aylık)

| Daire Tipi | Eşyasız | Eşyalı |
|-----------|---------|--------|
| 1+0 Stüdyo | £250-350 | £300-450 |
| 1+1 | £350-500 | £400-650 |
| 2+1 | £450-550 | £500-600 |
| 3+1 | £550-700 | £650-800 |

> ⚠️ Fiyatlar 101evler.com ve yerel emlakçı verilerine dayanmaktadır. Sezon, kat, eşya durumu ve lokasyona göre değişiklik gösterebilir.

## Popüler Bölgeler

### YDÜ Çevresi (En Popüler)
- Üniversiteye yürüme mesafesi
- Öğrenci yoğun, canlı mahalle
- Fiyatlar biraz daha yüksek (talep fazla)
- 1+1 eşyalı: £450-650/ay

### Gönyeli Merkez
- Marketlere, bankalara, cafelere yakın
- Aile ve profesyonellere uygun
- 2+1 eşyalı: £500-600/ay

### Yenikent / Alayköy Yönü
- Daha uygun fiyatlar
- Yeni siteler ve rezidanslar
- 2+1 eşyalı: £400-500/ay

## Kiralama Süreci

1. **İlan Bul** — 101evler.com, Evlek, Facebook grupları
2. **Evi Gör** — fotoğrafa güvenme, mutlaka git bak
3. **Depozito** — genellikle 1-2 aylık kira
4. **Sözleşme** — minimum 6 ay, genelde 1 yıl
5. **Aidat** — site içi ise £30-80/ay

## Aylık Yaşam Maliyeti (Tek Kişi)

| Kalem | Tutar |
|-------|-------|
| Kira (1+1 eşyalı) | £400-650 |
| Elektrik + Su | £50-120 |
| İnternet | £15-25 |
| Market | £150-250 |
| Ulaşım | £30-80 |
| **TOPLAM** | **£645-1.125** |

## Ulaşım

- Lefkoşa merkezine: 10-15 dk (araçla)
- YDÜ'ye: 5-10 dk (yaya)
- Ercan Havalimanı'na: 25-30 dk
- Girne'ye: 35-40 dk
- Minibüs hattı mevcut (Gönyeli-Lefkoşa)

## Öğrenciler İçin İpuçları

1. **Eylül'den önce ara** — Eylül-Ekim en yoğun dönem, fiyatlar artar
2. **Arkadaşınla paylaş** — 2+1 daire 2 kişi = kişi başı £250-300
3. **Yıllık sözleşme yap** — aylık kiralama %20-30 daha pahalı
4. **Zemin katı tercih etme** — nem ve böcek sorunu olabilir
5. **Klimayı kontrol et** — KKTC yazları çok sıcak, klima şart

## Dikkat Edilecekler

- Sözleşme İngilizce ise tercüme ettirin
- Taşınmadan önce evin fotoğraflarını çekin (hasar tespiti)
- Elektrik/su aboneliğini kendi adınıza geçirin
- Depozito iadesi için sözleşme şartlarını okuyun

[👉 Gönyeli İlanlarını Gör](/properties)`,

    en: `# Gönyeli Rental Guide — For Students and Young Professionals (2026)

## Where is Gönyeli?

Gönyeli is one of the fastest-growing districts in the TRNC, located west of Nicosia. It is popular among students due to its proximity to Near East University (NEU), Cyprus International University (CIU), and European University of Lefke Nicosia Campus.

## Current Rental Prices 2025-2026 (Monthly)

| Apartment Type | Unfurnished | Furnished |
|---------------|-------------|-----------|
| Studio | £250-350 | £300-450 |
| 1+1 | £350-500 | £400-650 |
| 2+1 | £450-550 | £500-600 |
| 3+1 | £550-700 | £650-800 |

> ⚠️ Prices are based on 101evler.com and local agent data. May vary by season, floor, furnishing, and location.

## Popular Areas

### NEU Surroundings (Most Popular)
- Walking distance to university
- Student-heavy, lively neighborhood
- Slightly higher prices (high demand)
- 1+1 furnished: £450-650/mo

### Gönyeli Center
- Close to shops, banks, cafes
- Suitable for families and professionals
- 2+1 furnished: £500-600/mo

### Yenikent / Alayköy Direction
- More affordable prices
- New complexes and residences
- 2+1 furnished: £400-500/mo

## Rental Process

1. **Find a listing** — 101evler.com, Evlek, Facebook groups
2. **Visit the property** — don't trust photos alone
3. **Deposit** — usually 1-2 months rent
4. **Contract** — minimum 6 months, usually 1 year
5. **Maintenance fee** — if in a complex: £30-80/mo

## Monthly Cost of Living (Single Person)

| Item | Amount |
|------|--------|
| Rent (1+1 furnished) | £400-650 |
| Electricity + Water | £50-120 |
| Internet | £15-25 |
| Groceries | £150-250 |
| Transport | £30-80 |
| **TOTAL** | **£645-1,125** |

## Transport

- Nicosia center: 10-15 min (by car)
- NEU: 5-10 min (walking)
- Ercan Airport: 25-30 min
- Kyrenia: 35-40 min
- Minibus line available (Gönyeli-Nicosia)

## Tips for Students

1. **Search before September** — Sep-Oct is peak season, prices rise
2. **Share with a friend** — 2+1 apartment shared = £250-300/person
3. **Sign a yearly contract** — monthly rentals are 20-30% more expensive
4. **Avoid ground floor** — humidity and pest issues possible
5. **Check the AC** — TRNC summers are very hot, AC is essential

## Things to Watch Out For

- If the contract is in Turkish, get it translated
- Take photos of the property before moving in (damage proof)
- Transfer electricity/water bills to your name
- Read the contract terms for deposit refund conditions

[👉 View Gönyeli Listings](/properties)`,
};

export default function GonyeliRentalGuidePage() {
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
                        <span style={{ padding: '4px 12px', background: 'var(--primary-glow)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', color: 'var(--primary-light)' }}>📍 Student Guide</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📅 2026-03-01</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>⏱️ 8 min</span>
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
                                const isHeader = line.includes('Daire') || line.includes('Apartment') || line.includes('Kalem') || line.includes('Item');
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
