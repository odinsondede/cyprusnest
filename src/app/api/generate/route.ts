import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GenerateRequest {
    action: 'describe' | 'translate';
    locale?: string;
    propertyType?: string;
    roomConfig?: string;
    city?: string;
    district?: string;
    area?: number;
    features?: string[];
    type?: 'rent' | 'sale';
    price?: number;
    currency?: string;
    text?: string;
    targetLang?: string;
}

function buildPrompt(body: GenerateRequest): string | null {
    if (body.action === 'describe') {
        const lang = body.locale === 'tr' ? 'Türkçe' : 'English';
        return `${lang} dilinde bir emlak ilanı açıklaması yaz. Profesyonel, çekici ve bilgilendirici olsun. 3-4 paragraf, toplam 150-200 kelime.

Mülk bilgileri:
- Tip: ${body.type === 'rent' ? 'Kiralık' : 'Satılık'}
- Mülk türü: ${body.propertyType || 'Daire'}
- Oda: ${body.roomConfig || '2+1'}
- Şehir: ${body.city || 'Lefkoşa'}
- Bölge: ${body.district || ''}
- Alan: ${body.area || 100}m²
- Fiyat: ${body.price || 0} ${body.currency || 'GBP'}
- Özellikler: ${(body.features || []).join(', ') || 'Belirtilmemiş'}

Kurallar:
- Bölgenin avantajlarından bahset
- Mülkün öne çıkan özelliklerini vurgula
- "İletişime geçin" gibi bir çağrı ile bitir
- Sadece açıklama metnini döndür, başlık veya etiket ekleme`;
    } else if (body.action === 'translate') {
        if (!body.text) return null;
        const target = body.targetLang === 'tr' ? 'Türkçe' : 'English';
        return `Aşağıdaki emlak ilanı açıklamasını ${target} diline çevir. Profesyonel ve doğal bir dil kullan. Sadece çeviriyi döndür, başka bir şey ekleme.

Metin:
${body.text}`;
    }
    return null;
}

async function tryGemini(prompt: string): Promise<string | null> {
    if (!GEMINI_API_KEY) return null;
    try {
        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 500, temperature: 0.8, topP: 0.9 },
            }),
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch {
        return null;
    }
}

async function tryGroq(prompt: string): Promise<string | null> {
    if (!GROQ_API_KEY) return null;
    try {
        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 500,
                temperature: 0.8,
            }),
        });
        if (!response.ok) return null;
        const data = await response.json();
        return data?.choices?.[0]?.message?.content || null;
    } catch {
        return null;
    }
}

export async function POST(request: NextRequest) {
    if (!GEMINI_API_KEY && !GROQ_API_KEY) {
        return NextResponse.json({ error: 'AI servisi henüz yapılandırılmamış.' }, { status: 503 });
    }

    try {
        const body: GenerateRequest = await request.json();

        const prompt = buildPrompt(body);
        if (!prompt) {
            return NextResponse.json(
                { error: body.action === 'translate' ? 'Çevrilecek metin gerekli.' : 'Geçersiz işlem.' },
                { status: 400 }
            );
        }

        // Try Gemini first, then Groq
        let result = await tryGemini(prompt);
        if (!result) result = await tryGroq(prompt);

        if (!result) {
            return NextResponse.json({ error: 'AI yanıt veremedi.' }, { status: 502 });
        }

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Generate API error:', error);
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
