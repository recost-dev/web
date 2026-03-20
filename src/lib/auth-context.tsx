import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  logout: () => {},
  isLoading: true,
});

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (typeof payload.exp !== 'number') return true;
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

const DEV_USER: User = {
  id: 'dev-user',
  email: 'dev@localhost',
  name: 'Dev User',
  avatarUrl: null,
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  if (import.meta.env.VITE_DEV_AUTH === 'true') {
    return (
      <AuthContext.Provider value={{ isAuthenticated: true, user: DEV_USER, token: 'dev-token', logout: () => {}, isLoading: false }}>
        {children}
      </AuthContext.Provider>
    );
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');
    let activeToken: string | null;

    if (urlToken) {
      localStorage.setItem('ecoapi_token', urlToken);
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, '', url.toString());
      activeToken = urlToken;
    } else {
      activeToken = localStorage.getItem('ecoapi_token');
    }

    if (!activeToken) {
      setIsLoading(false);
      return;
    }

    if (isTokenExpired(activeToken)) {
      localStorage.removeItem('ecoapi_token');
      setIsLoading(false);
      return;
    }

    setToken(activeToken);

    const apiBase = import.meta.env.VITE_API_URL ?? 'https://api.recost.dev';
    fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${activeToken}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('ecoapi_token');
          setToken(null);
          return null;
        }
        return r.json() as Promise<{ data: User }>;
      })
      .then((res) => {
        if (res) setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('ecoapi_token');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function logout() {
    localStorage.removeItem('ecoapi_token');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!token && !!user, user, token, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
