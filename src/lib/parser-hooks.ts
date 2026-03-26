import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api-client';

export interface ParserRun {
  id: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  repos: string;                   // JSON-encoded string[]
  results_found: number;
  duration_ms?: number | null;
  triggered_by?: string | null;
  created_at: number;              // epoch ms
}

export interface ParserResult {
  id: string;
  run_id: string;
  repo: string;
  target?: string | null;
  scanned_file_count?: number | null;
  endpoints?: string | null;       // JSON
  suggestions?: string | null;     // JSON
  summary?: string | null;         // JSON
  collected_at: number;
}

export function useParserRuns(limit = 50, offset = 0) {
  return useQuery<ParserRun[]>({
    queryKey: ['dashboard-parser-runs', limit, offset],
    queryFn: () =>
      apiClient
        .get<{ data: ParserRun[] | null }>(`/parser/runs?limit=${limit}&offset=${offset}`)
        .then((r) => r.data ?? []),
  });
}

export function useParserRunResults(runId: string | null) {
  return useQuery<ParserResult[]>({
    queryKey: ['dashboard-parser-run-results', runId],
    queryFn: () =>
      apiClient
        .get<{ data: ParserResult[] | null }>(`/parser/runs/${runId!}/results`)
        .then((r) => r.data ?? []),
    enabled: runId !== null,
  });
}

export function useCreateParserRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { repos: string[]; triggered_by: 'ui' }) =>
      apiClient
        .post<{ data: unknown }>('/parser/runs', body)
        .then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-parser-runs'] });
    },
  });
}

export function useDeleteParserRun() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (runId: string) => apiClient.del(`/parser/runs/${runId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-parser-runs'] });
    },
  });
}
