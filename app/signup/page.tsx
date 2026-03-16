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

export default function SignupPage() {
  const router = useRouter();

  useEffect(() => {
    // Function to handle the token
    const handleToken = (tokenInfo: { token: string }) => {
      const { token } = tokenInfo;

      if (token) {
        // Set the cookie
        document.cookie = `outseta_token=${token}; max-age=86400; path=/; SameSite=Lax; Secure`;

        // Redirect to the dashboard
        router.push('/dashboard');
      }
    };

    // Check if Outseta is loaded
    if (typeof window !== 'undefined' && window.Outseta) {
      window.Outseta.on('accessToken.set', handleToken);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (typeof window !== 'undefined' && window.Outseta) {
        // Outseta doesn't provide a direct 'off' method in this context,
        // but it's good practice to have a cleanup function.
      }
    };
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 shadow-sm">
        {/* This div will be replaced by the Outseta registration widget */}
        <div 
          data-o-auth="1" 
          data-widget-mode="register" 
          data-plan-uid="rQVqJlm6" 
          data-skip-plan-options="true" 
          data-mode="embed"
        ></div>
      </div>
    </main>
  );
}
