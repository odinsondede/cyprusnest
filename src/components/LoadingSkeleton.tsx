'use client';

export function PropertyCardSkeleton() {
    return (
        <div style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            animation: 'pulse 1.5s ease-in-out infinite',
        }}>
            {/* Image placeholder */}
            <div style={{ height: '200px', background: 'var(--bg-darker)' }} />
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Title */}
                <div style={{ height: '18px', width: '75%', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                {/* Price */}
                <div style={{ height: '22px', width: '40%', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                {/* Location */}
                <div style={{ height: '14px', width: '55%', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                {/* Features row */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ height: '14px', width: '50px', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                    <div style={{ height: '14px', width: '50px', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                    <div style={{ height: '14px', width: '50px', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                </div>
            </div>
        </div>
    );
}

export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
            <div className="property-grid">
                {Array.from({ length: count }, (_, i) => (
                    <PropertyCardSkeleton key={i} />
                ))}
            </div>
        </>
    );
}

export function DetailPageSkeleton() {
    return (
        <>
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
            <div style={{ padding: '100px 20px 40px', maxWidth: '1100px', margin: '0 auto', animation: 'pulse 1.5s ease-in-out infinite' }}>
                {/* Image */}
                <div style={{ height: '400px', background: 'var(--bg-darker)', borderRadius: 'var(--radius-lg)', marginBottom: '24px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ height: '28px', width: '70%', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                        <div style={{ height: '20px', width: '30%', background: 'var(--bg-darker)', borderRadius: '4px' }} />
                        <div style={{ height: '100px', width: '100%', background: 'var(--bg-darker)', borderRadius: '8px' }} />
                    </div>
                    <div style={{ height: '200px', background: 'var(--bg-darker)', borderRadius: '8px' }} />
                </div>
            </div>
        </>
    );
}
