// Approximate rates — updated manually or via API later
const RATES: Record<string, number> = {
    GBP: 1,
    EUR: 1.17,
    USD: 1.27,
    TRY: 41.5,
};

export function convertPrice(amount: number, from: string, to: string): number {
    const inGBP = amount / (RATES[from] || 1);
    return Math.round(inGBP * (RATES[to] || 1));
}

export function formatCurrency(amount: number, currency: string): string {
    const symbols: Record<string, string> = { GBP: '£', EUR: '€', USD: '$', TRY: '₺' };
    const symbol = symbols[currency] || currency;

    if (amount >= 1000000) return `${symbol}${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${symbol}${amount.toLocaleString()}`;
    return `${symbol}${amount}`;
}

export const currencies = ['GBP', 'EUR', 'USD', 'TRY'] as const;
export type Currency = typeof currencies[number];
