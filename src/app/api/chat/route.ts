import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `Sen Evlek AI asistanısın. Kuzey Kıbrıs Türk Cumhuriyeti'nde (KKTC) emlak konusunda uzman bir yardımcısın.

Görevlerin:
- KKTC'de kiralık ve satılık mülkler hakkında bilgi vermek
- Bölgeler hakkında tavsiye vermek (Girne, Lefkoşa, Gazimağusa, İskele, Güzelyurt)
- Fiyat aralıkları hakkında genel bilgi vermek
- Hukuki süreçler (PTP, tapu, vergiler) hakkında genel bilgi vermek
- Kullanıcıyı doğru sayfalara yönlendirmek

Kuralların:
- Kısa ve öz cevaplar ver (max 3-4 cümle)
- Hukuki konularda "mutlaka bir avukata danışın" uyarısı ekle
- Fiyatlar hakkında kesin bilgi verme, "yaklaşık" veya "ortalama" kullan
- Evlek platformunun özelliklerinden bahset (ücretsiz ilan, AI asistan, 5 dil desteği)
- Kullanıcının diline göre cevap ver (Türkçe soruyorsa Türkçe, İngilizce soruyorsa İngilizce)
- Samimi ve profesyonel ol`;

interface ChatMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

// Try Gemini first, then Groq as fallback
async function tryGemini(contents: ChatMessage[]): Promise<string | null> {
    if (!GEMINI_API_KEY) return null;

    try {
        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents,
                generationConfig: { maxOutputTokens: 300, temperature: 0.7, topP: 0.9 },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
                ],
            }),
        });

        if (!response.ok) {
            console.warn('Gemini failed, trying Groq fallback...');
            return null;
        }

        const data = await response.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
    } catch {
        console.warn('Gemini error, trying Groq fallback...');
        return null;
    }
}

async function tryGroq(message: string, history: { role: string; content: string }[], locale: string): Promise<string | null> {
    if (!GROQ_API_KEY) return null;

    try {
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT + `\n\nKullanıcının dili: ${locale}` },
            ...history.slice(-6).map(m => ({
                role: m.role === 'user' ? 'user' as const : 'assistant' as const,
                content: m.content,
            })),
            { role: 'user' as const, content: message },
        ];

        const response = await fetch(GROQ_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages,
                max_tokens: 300,
                temperature: 0.7,
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
        return NextResponse.json(
            { error: 'AI servisi henüz yapılandırılmamış.' },
            { status: 503 }
        );
    }

    try {
        const { message, history = [], locale = 'tr' } = await request.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Geçersiz mesaj.' },
                { status: 400 }
            );
        }

        // Build Gemini conversation format
        const contents: ChatMessage[] = [
            { role: 'user', parts: [{ text: SYSTEM_PROMPT + `\n\nKullanıcının dili: ${locale}` }] },
            {
                role: 'model',
                parts: [{
                    text: locale === 'tr'
                        ? 'Anladım! KKTC emlak konusunda size yardımcı olmaya hazırım.'
                        : 'Understood! I\'m ready to help you with North Cyprus real estate.'
                }],
            },
            ...history.slice(-6).map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' as const : 'model' as const,
                parts: [{ text: msg.content }],
            })),
            { role: 'user', parts: [{ text: message }] },
        ];

        // Try Gemini first
        let reply = await tryGemini(contents);

        // If Gemini fails, try Groq
        if (!reply) {
            reply = await tryGroq(message, history, locale);
        }

        // If both fail
        if (!reply) {
            return NextResponse.json(
                { error: locale === 'tr' ? 'AI yanıt veremedi. Lütfen tekrar deneyin.' : 'AI could not respond. Please try again.' },
                { status: 502 }
            );
        }

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Bir hata oluştu.' },
            { status: 500 }
        );
    }
}
