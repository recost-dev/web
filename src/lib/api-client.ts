const BASE = import.meta.env.VITE_API_URL ?? 'https://api.recost.dev';
const DEV = import.meta.env.VITE_DEV_AUTH === 'true';

let isRedirectingToLogin = false;

function getToken(): string | null {
  return localStorage.getItem('recost_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    if (!isRedirectingToLogin) {
      isRedirectingToLogin = true;
      localStorage.removeItem('recost_token');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as T;
}

// ---------------------------------------------------------------------------
// Mock handler — only active when VITE_DEV_AUTH=true
// ---------------------------------------------------------------------------

async function mockRequest<T>(path: string): Promise<T> {
  const {
    MOCK_PROJECTS, MOCK_LATEST_SCAN, MOCK_ENDPOINTS,
    MOCK_SUGGESTIONS, MOCK_COST_BY_PROVIDER, MOCK_COST_BY_FILE, MOCK_SCANS, MOCK_KEYS,
  } = await import('@/app/lib/mock-data');

  await new Promise((r) => setTimeout(r, 100));

  const paginated = <D>(data: D[]) => ({
    data,
    pagination: { page: 1, limit: 50, total: data.length, totalPages: 1, hasNext: false, hasPrev: false },
  });

  if (path === '/auth/keys') return paginated(MOCK_KEYS) as T;
  if (path === '/projects' || path.startsWith('/projects?')) return paginated(MOCK_PROJECTS) as T;

  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch) {
    const proj = MOCK_PROJECTS.find((p) => p.id === projectMatch[1]) ?? MOCK_PROJECTS[0];
    return { data: proj } as T;
  }

  if (path.match(/^\/projects\/[^/]+\/scans\/latest$/)) return { data: MOCK_LATEST_SCAN } as T;
  if (path.match(/^\/projects\/[^/]+\/scans(\/|\?|$)/)) return paginated(MOCK_SCANS) as T;
  if (path.match(/^\/projects\/[^/]+\/endpoints/)) return paginated(MOCK_ENDPOINTS) as T;
  if (path.match(/^\/projects\/[^/]+\/suggestions/)) return paginated(MOCK_SUGGESTIONS) as T;
  if (path.match(/^\/projects\/[^/]+\/cost\/by-provider/)) return paginated(MOCK_COST_BY_PROVIDER) as T;
  if (path.match(/^\/projects\/[^/]+\/cost\/by-file/)) return paginated(MOCK_COST_BY_FILE) as T;
  if (path.match(/^\/projects\/[^/]+\/cost$/)) {
    return { data: { totalMonthlyCost: 247.85, totalCallsPerDay: 4820, endpointCount: 12 } } as T;
  }

  console.warn(`[mock] unhandled GET ${path}`);
  return { data: null } as T;
}

export const apiClient = {
  get: <T>(path: string) => DEV ? mockRequest<T>(path) : request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    DEV ? mockRequest<T>(path) : request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  del: (path: string) =>
    DEV ? mockRequest<void>(path) : request<void>(path, { method: 'DELETE' }),
};
