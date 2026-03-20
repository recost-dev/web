const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.ecoapi.dev';
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

let isRedirectingToLogin = false;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ecoapi_token');
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
      localStorage.removeItem('ecoapi_token');
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
// Mock handler — only active when NEXT_PUBLIC_USE_MOCK=true
// ---------------------------------------------------------------------------

async function mockRequest<T>(path: string, method: string): Promise<T> {
  const {
    MOCK_USER, MOCK_KEYS, MOCK_PROJECTS, MOCK_LATEST_SCAN,
    MOCK_ENDPOINTS, MOCK_SUGGESTIONS, MOCK_COST_BY_PROVIDER,
    MOCK_COST_BY_FILE, MOCK_SCANS,
  } = await import('./mock-data');

  await new Promise((r) => setTimeout(r, 120)); // simulate latency

  const paginated = <D>(data: D[]) => ({
    data,
    pagination: { page: 1, limit: 50, total: data.length, totalPages: 1, hasNext: false, hasPrev: false },
  });

  // Auth
  if (path === '/auth/me')   return { data: MOCK_USER } as T;
  if (path === '/auth/keys') return paginated(MOCK_KEYS) as T;

  // Projects list
  if (path === '/projects' || path.startsWith('/projects?')) {
    return paginated(MOCK_PROJECTS) as T;
  }

  // Project detail  /projects/:id
  const projectMatch = path.match(/^\/projects\/([^/]+)$/);
  if (projectMatch && method === 'GET') {
    const proj = MOCK_PROJECTS.find((p) => p.id === projectMatch[1]) ?? MOCK_PROJECTS[0];
    return { data: proj } as T;
  }

  // Scans list  /projects/:id/scans
  const scansListMatch = path.match(/^\/projects\/([^/]+)\/scans$/);
  if (scansListMatch) return paginated(MOCK_SCANS) as T;

  // Latest scan  /projects/:id/scans/latest
  const latestScanMatch = path.match(/^\/projects\/([^/]+)\/scans\/latest$/);
  if (latestScanMatch) return { data: MOCK_LATEST_SCAN } as T;

  // Endpoints  /projects/:id/endpoints
  const endpointsMatch = path.match(/^\/projects\/([^/]+)\/endpoints(\?.*)?$/);
  if (endpointsMatch) return paginated(MOCK_ENDPOINTS) as T;

  // Suggestions  /projects/:id/suggestions
  const suggestionsMatch = path.match(/^\/projects\/([^/]+)\/suggestions(\?.*)?$/);
  if (suggestionsMatch) return paginated(MOCK_SUGGESTIONS) as T;

  // Cost by provider  /projects/:id/cost/by-provider
  const costProviderMatch = path.match(/^\/projects\/([^/]+)\/cost\/by-provider(\?.*)?$/);
  if (costProviderMatch) return paginated(MOCK_COST_BY_PROVIDER) as T;

  // Cost by file  /projects/:id/cost/by-file
  const costFileMatch = path.match(/^\/projects\/([^/]+)\/cost\/by-file(\?.*)?$/);
  if (costFileMatch) return paginated(MOCK_COST_BY_FILE) as T;

  // Cost summary  /projects/:id/cost
  const costSummaryMatch = path.match(/^\/projects\/([^/]+)\/cost$/);
  if (costSummaryMatch) {
    return { data: { totalMonthlyCost: 247.85, totalCallsPerDay: 4820, endpointCount: 12 } } as T;
  }

  console.warn(`[mock] unhandled ${method} ${path}`);
  return { data: null } as T;
}

export const apiClient = {
  get: <T>(path: string) => USE_MOCK ? mockRequest<T>(path, 'GET') : request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    USE_MOCK
      ? mockRequest<T>(path, 'POST')
      : request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  del: (path: string) =>
    USE_MOCK ? mockRequest<void>(path, 'DELETE') : request<void>(path, { method: 'DELETE' }),
};
