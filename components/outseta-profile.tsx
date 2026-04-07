'use client';

import { useEffect } from 'react';

interface OutsetaProfileProps {
  accessToken?: string;
}

export function OutsetaProfile({ accessToken }: OutsetaProfileProps) {
  useEffect(() => {
    if (!accessToken) return;

    const setToken = () => {
      if (typeof window !== 'undefined' && (window as any).Outseta) {
        (window as any).Outseta.setAccessToken(accessToken);
      }
    };

    setToken();
    const timeoutId = setTimeout(setToken, 500);

    return () => clearTimeout(timeoutId);
  }, [accessToken]);

  return <div data-o-profile="1" data-mode="embed"></div>;
}
