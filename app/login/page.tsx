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

export default function UnifiedAuthPage() {
  const router = useRouter();

  useEffect(() => {
    // 1. Single listener that handles successful auth from EITHER widget
    const handleToken = (token: string) => {
      if (token) {
        document.cookie = `outseta_token=${token}; max-age=86400; path=/; SameSite=Lax; Secure`;
        router.push('/dashboard');
      }
    };

    // 2. Wait for Outseta to load, then attach the listener
    const checkOutsetaInterval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Outseta) {
        window.Outseta.on('accessToken.set', handleToken);
        clearInterval(checkOutsetaInterval); 
      }
    }, 100);

    return () => clearInterval(checkOutsetaInterval);
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to ThinkBiz</h1>
        <p className="mt-2 text-sm text-muted-foreground">Log in to your dashboard or join the network.</p>
      </div>

      {/* Main Container: Stacks vertically on mobile, side-by-side on medium screens and up */}
      <div className="flex w-full max-w-5xl flex-col gap-8 md:flex-row">
        
        {/* Left Column: Sign Up */}
        <div className="flex-1 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-center text-xl font-semibold text-foreground">Create an Account</h2>
          <div 
            data-o-auth="1"
            data-widget-mode="register"
            data-plan-uid="rQVqJlm6"
            data-plan-payment-term="month"
            data-skip-plan-options="true"
            data-mode="embed"
          ></div>
        </div>

        {/* Visual Divider (Only visible on desktop) */}
        <div className="hidden flex-col items-center justify-center md:flex">
          <div className="h-full w-px bg-border"></div>
        </div>

        {/* Right Column: Log In */}
        <div className="flex-1 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-6 text-center text-xl font-semibold text-foreground">Log In</h2>
          <div 
            data-o-auth="1"
            data-mode="embed"
            data-widget-mode="login"
          ></div>
        </div>

      </div>
    </main>
  );
}