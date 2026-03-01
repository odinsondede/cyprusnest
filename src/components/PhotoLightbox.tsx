'use client';

import { useState, useEffect, useCallback } from 'react';

interface LightboxProps {
    photos: string[];
    initialIndex?: number;
    onClose: () => void;
}

export default function PhotoLightbox({ photos, initialIndex = 0, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    const goNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % photos.length);
    }, [photos.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length);
    }, [photos.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [onClose, goNext, goPrev]);

    if (!photos.length) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 10000,
                background: 'rgba(0, 0, 0, 0.92)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'fadeInUp 0.2s ease',
            }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: '20px', right: '20px',
                    background: 'rgba(255,255,255,0.15)', border: 'none',
                    color: 'white', width: '44px', height: '44px',
                    borderRadius: '50%', fontSize: '1.3rem', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(4px)',
                    transition: 'background 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
                ✕
            </button>

            {/* Counter */}
            <div style={{
                position: 'absolute', top: '24px', left: '50%', transform: 'translateX(-50%)',
                color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: 500,
            }}>
                {currentIndex + 1} / {photos.length}
            </div>

            {/* Previous button */}
            {photos.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    style={{
                        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.12)', border: 'none',
                        color: 'white', width: '48px', height: '48px',
                        borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >
                    ‹
                </button>
            )}

            {/* Image */}
            <img
                src={photos[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                    maxWidth: '90vw', maxHeight: '85vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    boxShadow: '0 8px 48px rgba(0,0,0,0.5)',
                }}
            />

            {/* Next button */}
            {photos.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    style={{
                        position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(255,255,255,0.12)', border: 'none',
                        color: 'white', width: '48px', height: '48px',
                        borderRadius: '50%', fontSize: '1.5rem', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(4px)',
                        transition: 'background 0.2s',
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
                    onMouseOut={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                >
                    ›
                </button>
            )}

            {/* Thumbnail strip */}
            {photos.length > 1 && (
                <div style={{
                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', gap: '8px', maxWidth: '90vw', overflowX: 'auto',
                    padding: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '12px',
                    backdropFilter: 'blur(8px)',
                }}>
                    {photos.map((photo, i) => (
                        <img
                            key={i}
                            src={photo}
                            alt={`Thumb ${i + 1}`}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                            style={{
                                width: '56px', height: '42px',
                                objectFit: 'cover', borderRadius: '6px',
                                cursor: 'pointer', flexShrink: 0,
                                border: i === currentIndex ? '2px solid white' : '2px solid transparent',
                                opacity: i === currentIndex ? 1 : 0.6,
                                transition: 'all 0.2s',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
