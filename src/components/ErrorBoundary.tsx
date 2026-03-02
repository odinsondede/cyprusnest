'use client';

import React, { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div style={{
                        padding: '60px 20px', textAlign: 'center',
                        background: 'var(--bg-darker)', borderRadius: '16px',
                        margin: '40px auto', maxWidth: '500px',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>😵</div>
                        <h2 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>
                            Bir şeyler ters gitti
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                            {this.state.error?.message || 'Beklenmedik bir hata oluştu.'}
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            style={{
                                background: 'var(--primary)', color: 'white',
                                border: 'none', padding: '10px 24px', borderRadius: '8px',
                                cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                            }}
                        >
                            🔄 Sayfayı Yenile
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}
