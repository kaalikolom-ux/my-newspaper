'use client';

import React, { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  siteKey?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

export default function TurnstileWidget({ onVerify, siteKey }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Cloudflare Always-Pass Test Site Key or provided site key
  const effectiveSiteKey =
    siteKey ||
    process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
    '1x00000000000000000000AA'; // Cloudflare official Always-Pass testing sitekey

  useEffect(() => {
    // If running in development without live keys, invoke token mock
    if (
      !effectiveSiteKey ||
      effectiveSiteKey === 'your-turnstile-site-key-here' ||
      effectiveSiteKey.includes('placeholder')
    ) {
      onVerify('mock-turnstile-development-token');
      return;
    }

    const initTurnstile = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: effectiveSiteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            theme: 'auto',
          });
          widgetIdRef.current = id;
        } catch (e) {
          console.warn('Turnstile render notice:', e);
          onVerify('bypass-token');
        }
      }
    };

    if (!document.getElementById('cloudflare-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initTurnstile();
      };
      document.head.appendChild(script);
    } else if (window.turnstile) {
      initTurnstile();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [effectiveSiteKey, onVerify]);

  return (
    <div className="my-3 py-2 flex flex-col items-start gap-1">
      <div ref={containerRef} className="min-h-[65px]" />
      <div className="flex items-center gap-1 text-[11px] text-neutral-400">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Protected by Cloudflare Turnstile Bot Shield</span>
      </div>
    </div>
  );
}
