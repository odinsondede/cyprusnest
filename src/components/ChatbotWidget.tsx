'use client';

import { useState, useRef, useEffect } from 'react';
import { type Locale } from '@/i18n/translations';

interface ChatMessage {
    role: 'bot' | 'user';
    content: string;
}

const WELCOME_MESSAGES: Record<string, string> = {
    tr: 'Merhaba! 👋 Ben Evlek AI asistanınızım. KKTC\'de mülk aramanızda size yardımcı olabilirim. Bütçenizi, bölgenizi veya arzu ettiğiniz özellikleri söyleyin!',
    en: 'Hello! 👋 I\'m Evlek AI assistant. I can help you find properties in North Cyprus. Tell me your budget, preferred area, or desired features!',
    ru: 'Привет! 👋 Я AI-помощник Evlek. Помогу найти недвижимость на Северном Кипре. Расскажите о бюджете, районе или желаемых особенностях!',
    de: 'Hallo! 👋 Ich bin der Evlek KI-Assistent. Ich helfe Ihnen bei der Immobiliensuche in Nordzypern!',
    ar: '!مرحباً! 👋 أنا مساعد إيفلك الذكي. يمكنني مساعدتك في البحث عن عقارات في شمال قبرص',
};

const PLACEHOLDER: Record<string, string> = {
    tr: 'Mesajınızı yazın...',
    en: 'Type your message...',
    ru: 'Введите сообщение...',
    de: 'Nachricht eingeben...',
    ar: '...اكتب رسالتك',
};

const OFFLINE_RESPONSES: Record<string, Record<string, string>> = {
    tr: {
        fiyat: '💰 KKTC\'de kiralık daireler 300-800£/ay, satılık daireler 50.000-200.000£ arasında değişir. Detaylı arama için İlanlar sayfamızı ziyaret edin!',
        kira: '🏠 Kiralık ilanlarımızı görmek için: evlek.app/properties?type=rent adresini ziyaret edin!',
        girne: '⛵ Girne, turistik bölge olarak yatırım getirisi yüksek. Deniz manzaralı daireler popüler. İlanlarımızı inceleyin!',
        lefkosa: '🏛️ Lefkoşa merkezi, üniversite bölgeleri (Gönyeli, Hamitköy) öğrenci kiralamaları için ideal.',
        ptp: '⚖️ PTP (Satın Alma İzni) yabancılar için gereklidir. Süre: 6-24 ay. Detaylar için Hukuki Rehber sayfamızı ziyaret edin: evlek.app/legal',
        vergi: '💰 Vergi hesaplayıcımızı kullanın: evlek.app/legal — Damga vergisi, KDV, tapu harcı dahil.',
        default: '🤔 Bu konuda size yardımcı olayım! Lütfen bütçenizi, tercih ettiğiniz bölgeyi veya mülk tipini belirtin. AI servisimiz şu an yapılandırılıyor — yakında çok daha detaylı cevaplar alacaksınız!',
    },
    en: {
        price: '💰 Rentals in KKTC range from £300-800/month, sales from £50,000-200,000. Visit our listings for detailed search!',
        rent: '🏠 See rental listings at: evlek.app/properties?type=rent',
        kyrenia: '⛵ Kyrenia offers high investment returns as a tourist area. Sea view apartments are popular!',
        nicosia: '🏛️ Central Nicosia and university areas (Gönyeli, Hamitköy) are ideal for student rentals.',
        ptp: '⚖️ PTP (Permission to Purchase) is required for foreigners. Timeline: 6-24 months. Visit our Legal Guide: evlek.app/legal',
        tax: '💰 Use our tax calculator: evlek.app/legal — Includes stamp duty, VAT, transfer tax.',
        default: '🤔 Let me help you! Please specify your budget, preferred area, or property type. Our AI service is being configured — you\'ll get much more detailed answers soon!',
    },
};

function getOfflineResponse(input: string, locale: string): string {
    const lower = input.toLowerCase();
    const responses = OFFLINE_RESPONSES[locale] || OFFLINE_RESPONSES.en;

    for (const [keyword, response] of Object.entries(responses)) {
        if (keyword !== 'default' && lower.includes(keyword)) {
            return response;
        }
    }
    return responses.default;
}

export default function ChatbotWidget({ locale }: { locale: Locale }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'bot', content: WELCOME_MESSAGES[locale] || WELCOME_MESSAGES.en },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update welcome message when locale changes
    useEffect(() => {
        setMessages([{ role: 'bot', content: WELCOME_MESSAGES[locale] || WELCOME_MESSAGES.en }]);
    }, [locale]);

    async function handleSend() {
        const text = input.trim();
        if (!text || loading) return;

        const userMessage: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Build history for the API (exclude welcome message)
            const history = messages.slice(1).map(m => ({
                role: m.role === 'bot' ? 'assistant' : 'user',
                content: m.content,
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history, locale }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
            } else {
                // Fallback to offline responses
                const fallback = getOfflineResponse(text, locale);
                setMessages(prev => [...prev, { role: 'bot', content: fallback }]);
            }
        } catch {
            // Network error: use offline responses
            const fallback = getOfflineResponse(text, locale);
            setMessages(prev => [...prev, { role: 'bot', content: fallback }]);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="chatbot-fab">
            {open && (
                <div className="chatbot-panel">
                    <div className="chatbot-header">
                        <h3 style={{ color: 'white' }}>🤖 Evlek AI</h3>
                        <button className="close-btn" onClick={() => setOpen(false)}>✕</button>
                    </div>

                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message ${msg.role === 'bot' ? 'bot' : 'user'}`}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && (
                            <div className="chat-message typing">
                                {locale === 'tr' ? '🤖 Düşünüyor...' : '🤖 Thinking...'}
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-input">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={PLACEHOLDER[locale] || PLACEHOLDER.en}
                            disabled={loading}
                        />
                        <button onClick={handleSend} disabled={loading || !input.trim()}>
                            {loading ? '⏳' : '➤'}
                        </button>
                    </div>
                </div>
            )}
            <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
                {open ? '✕' : '🤖'}
            </button>
        </div>
    );
}
