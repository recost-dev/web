import { useCallback, useRef } from 'react';

export function useGoogleAuth(onSuccess: (token: string) => void, onError?: (msg: string) => void) {
  const clientRef = useRef<google.accounts.oauth2.CodeClient | null>(null);

  const login = useCallback(() => {
    if (!clientRef.current) {
      clientRef.current = google.accounts.oauth2.initCodeClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: 'openid email profile',
        ux_mode: 'popup',
        callback: async (response) => {
          if (response.error) {
            onError?.(response.error);
            return;
          }
          try {
            const apiBase = import.meta.env.VITE_API_URL ?? 'https://api.recost.dev';
            const res = await fetch(`${apiBase}/auth/google/code`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: response.code }),
            });
            if (!res.ok) throw new Error('Auth failed');
            const data = await res.json() as { data: { token: string } };
            onSuccess(data.data.token);
          } catch {
            onError?.('Sign in failed. Please try again.');
          }
        },
      });
    }
    clientRef.current.requestCode();
  }, [onSuccess, onError]);

  return { login };
}
