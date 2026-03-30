'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Augment the Window interface
declare global {
  interface Window {
    Outseta?: {
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Fix the payload: Outseta sends a raw string, not an object
    const handleToken = (token: string) => {
      if (token) {
        // Set the cookie securely
        document.cookie = `outseta_token=${token}; max-age=86400; path=/; SameSite=Lax; Secure`;

        // Safely push to the dashboard now that the cookie is stored
        router.push('/dashboard');
      }
    };

    // 2. Fix the race condition: Wait for Outseta to finish loading from the CDN
    const checkOutsetaInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Outseta) {
        window.Outseta.on('accessToken.set', handleToken);
        clearInterval(checkOutsetaInterval); // Stop checking once attached
      }
    }, 100);

    // Cleanup the interval if the user leaves the page before Outseta loads
    return () => clearInterval(checkOutsetaInterval);
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
        <div 
          data-o-auth="1" 
          data-mode="embed" 
          data-widget-mode="login"
        ></div>
      </div>
    </main>
  );
}