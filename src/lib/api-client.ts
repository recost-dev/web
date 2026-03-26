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
    MOCK_PROJECTS, MOCK_KEYS,
    MOCK_ENDPOINTS_MAP, MOCK_SUGGESTIONS_MAP, MOCK_COST_BY_PROVIDER_MAP,
    MOCK_COST_BY_FILE_MAP, MOCK_SCANS_MAP, MOCK_LATEST_SCAN_MAP, MOCK_COST_SUMMARY_MAP,
    MOCK_PARSER_RUNS, MOCK_PARSER_RESULTS_MAP,
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

  const subMatch = path.match(/^\/projects\/([^/]+)\/(.+)$/);
  if (subMatch) {
    const pid = subMatch[1];
    const sub = subMatch[2];

    const endpoints = MOCK_ENDPOINTS_MAP[pid] ?? MOCK_ENDPOINTS_MAP[MOCK_PROJECTS[0].id];
    const suggestions = MOCK_SUGGESTIONS_MAP[pid] ?? MOCK_SUGGESTIONS_MAP[MOCK_PROJECTS[0].id];
    const scans = MOCK_SCANS_MAP[pid] ?? MOCK_SCANS_MAP[MOCK_PROJECTS[0].id];
    const latestScan = MOCK_LATEST_SCAN_MAP[pid] ?? MOCK_LATEST_SCAN_MAP[MOCK_PROJECTS[0].id];
    const costByProvider = MOCK_COST_BY_PROVIDER_MAP[pid] ?? MOCK_COST_BY_PROVIDER_MAP[MOCK_PROJECTS[0].id];
    const costByFile = MOCK_COST_BY_FILE_MAP[pid] ?? MOCK_COST_BY_FILE_MAP[MOCK_PROJECTS[0].id];
    const costSummary = MOCK_COST_SUMMARY_MAP[pid] ?? MOCK_COST_SUMMARY_MAP[MOCK_PROJECTS[0].id];

    if (sub === 'scans/latest') return { data: latestScan } as T;
    if (sub.match(/^scans(\?|$)/)) return paginated(scans) as T;
    if (sub.match(/^endpoints/)) return paginated(endpoints) as T;
    if (sub.match(/^suggestions/)) return paginated(suggestions) as T;
    if (sub.match(/^cost\/by-provider/)) return paginated(costByProvider) as T;
    if (sub.match(/^cost\/by-file/)) return paginated(costByFile) as T;
    if (sub === 'cost') return { data: costSummary } as T;
  }

  // Parser runs
  if (path.match(/^\/parser\/runs(\?|$)/)) return { data: MOCK_PARSER_RUNS } as T;
  const parserResultsMatch = path.match(/^\/parser\/runs\/([^/]+)\/results$/);
  if (parserResultsMatch) {
    const rid = parserResultsMatch[1];
    return { data: MOCK_PARSER_RESULTS_MAP[rid] ?? [] } as T;
  }
  if (path === '/parser/runs') return { data: { runId: 'run_mock_new', status: 'queued', createdAt: Date.now() } } as T;

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
