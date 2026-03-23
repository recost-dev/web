'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion as Motion } from 'motion/react';
import {
  AlertTriangle,
  RefreshCw,
  DollarSign,
  Layers,
  Activity,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/api-client';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ScanSummary {
  totalEndpoints: number;
  totalCallsPerDay: number;
  totalMonthlyCost: number;
  highRiskCount: number;
}

interface Scan {
  id: string;
  projectId: string;
  createdAt: string;
  summary: ScanSummary;
}

interface Endpoint {
  id: string;
  provider: string;
  method: string;
  url: string;
  callsPerDay: number;
  monthlyCost: number;
  status: string;
}

interface Suggestion {
  id: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  estimatedMonthlySavings: number;
  description: string;
  affectedEndpoints: string[];
}

interface ProviderBreakdown {
  provider: string;
  monthlyCost: number;
  callsPerDay: number;
  endpointCount: number;
}

function fmtCost(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtNum(n: number) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

const SEVERITY_STYLE = {
  high:   { bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)',  text: '#f87171' },
  medium: { bg: 'rgba(251,191,36,0.1)',   border: 'rgba(251,191,36,0.25)',   text: '#fbbf24' },
  low:    { bg: 'rgba(163,163,163,0.08)', border: 'rgba(163,163,163,0.15)',  text: '#737373' },
};

const METHOD_COLOR: Record<string, string> = {
  GET: '#d4900a', POST: '#3b82f6', PUT: '#f59e0b', PATCH: '#f59e0b', DELETE: '#f87171',
};

const PROVIDER_COLOR: Record<string, string> = {
  openai: '#d4900a', anthropic: '#3b82f6', cohere: '#f59e0b',
  google: '#a78bfa', azure: '#60a5fa', mistral: '#fb923c',
};

const STATUS_LABEL: Record<string, string> = {
  redundant: 'Redundant', cacheable: 'Cacheable', batchable: 'Batchable',
  n_plus_one_risk: 'N+1 Risk', rate_limit_risk: 'Rate Limit',
};

function providerColor(name: string) {
  return PROVIDER_COLOR[name.toLowerCase()] ?? '#737373';
}

function PanelSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'rgba(212,144,10,0.25)', borderTopColor: '#d4900a' }} />
    </div>
  );
}

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id as string;

  const { data: project, isLoading: projectLoading, isError: projectError, refetch: refetchProject } =
    useQuery<Project>({
      queryKey: ['dashboard-project', id],
      queryFn: () => apiClient.get<{ data: Project }>(`/projects/${id}`).then((r) => r.data),
      enabled: !!id,
    });

  const { data: latestScan, isLoading: scanLoading } =
    useQuery<Scan>({
      queryKey: ['dashboard-project-latest-scan', id],
      queryFn: () => apiClient.get<{ data: Scan }>(`/projects/${id}/scans/latest`).then((r) => r.data),
      enabled: !!id,
      retry: false,
    });

  const { data: endpoints = [], isLoading: endpointsLoading } =
    useQuery<Endpoint[]>({
      queryKey: ['dashboard-project-endpoints', id],
      queryFn: () => apiClient.get<{ data: Endpoint[] }>(`/projects/${id}/endpoints`).then((r) => r.data),
      enabled: !!id,
      retry: false,
    });

  const { data: suggestions = [], isLoading: suggestionsLoading } =
    useQuery<Suggestion[]>({
      queryKey: ['dashboard-project-suggestions', id],
      queryFn: () => apiClient.get<{ data: Suggestion[] }>(`/projects/${id}/suggestions`).then((r) => r.data),
      enabled: !!id,
      retry: false,
    });

  const { data: byProvider = [], isLoading: providerLoading } =
    useQuery<ProviderBreakdown[]>({
      queryKey: ['dashboard-project-cost-provider', id],
      queryFn: () => apiClient.get<{ data: ProviderBreakdown[] }>(`/projects/${id}/cost/by-provider`).then((r) => r.data),
      enabled: !!id,
      retry: false,
    });

  const summary = latestScan?.summary;
  const maxCost = Math.max(...byProvider.map((p) => p.monthlyCost), 0.01);

  if (projectLoading) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(212,144,10,0.25)', borderTopColor: '#d4900a' }} />
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-full flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-3" style={{ color: '#f87171' }} />
          <p className="text-[14px] font-semibold text-white mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            Failed to load project
          </p>
          <button
            onClick={() => refetchProject()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] cursor-pointer"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', fontFamily: "'Inter', sans-serif" }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full" style={{ background: '#0a0a0a', fontFamily: "'Inter', sans-serif" }}>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-6 py-3.5" style={{ borderBottom: '1px solid #262626', background: '#111111' }}>
        <Link href="/" className="text-sm font-bold" style={{ color: '#fafafa', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}>
          recost
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#525252' }} />
        <Link href="/dashboard/projects" className="text-sm" style={{ color: '#a3a3a3', textDecoration: 'none' }}>
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#525252' }} />
        <span className="text-sm truncate" style={{ color: '#fafafa' }}>{project.name}</span>
        {project.description && (
          <span className="hidden md:inline text-xs ml-2" style={{ color: '#525252', fontFamily: "'JetBrains Mono', monospace" }}>
            — {project.description}
          </span>
        )}
      </div>

      <div className="p-6 space-y-5">

        {/* Stat cards */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {([
            { label: 'Monthly Cost',  value: summary ? fmtCost(summary.totalMonthlyCost)   : '—', icon: DollarSign,  color: '#d4900a' },
            { label: 'Endpoints',     value: summary ? fmtNum(summary.totalEndpoints)        : '—', icon: Layers,      color: '#3b82f6' },
            { label: 'Calls / Day',   value: summary ? fmtNum(summary.totalCallsPerDay)      : '—', icon: Activity,    color: '#f59e0b' },
            { label: 'High Risk',     value: summary ? fmtNum(summary.highRiskCount)          : '—', icon: ShieldAlert, color: '#f87171' },
          ] as const).map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-lg p-5" style={{ background: '#111111', border: '1px solid #262626' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ color: '#737373', fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
                <Icon className="w-3.5 h-3.5" style={{ color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: '#fafafa', fontFamily: "'JetBrains Mono', monospace" }}>
                {scanLoading ? <span style={{ color: '#525252' }}>…</span> : value}
              </p>
            </div>
          ))}
        </Motion.div>

        {/* Cost by provider + Suggestions */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="grid gap-5 lg:grid-cols-2"
        >
          {/* Cost by provider */}
          <div className="rounded-lg p-6" style={{ background: '#111111', border: '1px solid #262626' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium" style={{ color: '#fafafa' }}>Cost by Provider</h3>
              <span className="text-xs" style={{ color: '#737373', fontFamily: "'JetBrains Mono', monospace" }}>Monthly</span>
            </div>
            {providerLoading ? (
              <PanelSpinner />
            ) : byProvider.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: '#525252' }}>No scan data yet</p>
            ) : (
              <>
                <div className="space-y-4">
                  {byProvider.map((p) => (
                    <div key={p.provider} className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: '#a3a3a3' }}>{p.provider}</span>
                        <span style={{ color: '#fafafa', fontFamily: "'JetBrains Mono', monospace" }}>{fmtCost(p.monthlyCost)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full" style={{ background: '#1a1a1a' }}>
                        <div
                          className="h-1.5 rounded-full transition-all duration-700"
                          style={{ width: `${(p.monthlyCost / maxCost) * 100}%`, background: providerColor(p.provider) }}
                        />
                      </div>
                      <span className="text-xs" style={{ color: '#525252', fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmtNum(p.callsPerDay)} calls/day · {p.endpointCount} endpoint{p.endpointCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 flex items-center justify-between" style={{ borderTop: '1px solid #262626' }}>
                  <span className="text-sm" style={{ color: '#a3a3a3' }}>Total</span>
                  <span className="font-bold" style={{ color: '#d4900a', fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmtCost(byProvider.reduce((s, p) => s + p.monthlyCost, 0))}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Suggestions */}
          <div className="rounded-lg p-6" style={{ background: '#111111', border: '1px solid #262626' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium" style={{ color: '#fafafa' }}>Suggestions</h3>
              <span className="text-xs" style={{ color: '#737373', fontFamily: "'JetBrains Mono', monospace" }}>
                {suggestions.length} total
              </span>
            </div>
            {suggestionsLoading ? (
              <PanelSpinner />
            ) : suggestions.length === 0 ? (
              <p className="text-sm text-center py-10" style={{ color: '#525252' }}>No suggestions yet</p>
            ) : (
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: '280px' }}>
                {suggestions.map((s) => {
                  const style = SEVERITY_STYLE[s.severity];
                  return (
                    <div key={s.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#0a0a0a', border: '1px solid #262626' }}>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded mt-0.5 flex-shrink-0"
                        style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text, fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {s.severity}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate" style={{ color: '#a3a3a3' }}>{s.description}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#d4900a', fontFamily: "'JetBrains Mono', monospace" }}>
                          saves {fmtCost(s.estimatedMonthlySavings)}/mo
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Motion.div>

        {/* Endpoints table */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.12 }}
          className="rounded-lg overflow-hidden"
          style={{ background: '#111111', border: '1px solid #262626' }}
        >
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid #262626' }}>
            <h3 className="text-sm font-medium" style={{ color: '#fafafa' }}>Endpoints</h3>
            <span className="text-xs" style={{ color: '#737373', fontFamily: "'JetBrains Mono', monospace" }}>
              {endpoints.length} total
            </span>
          </div>
          {endpointsLoading ? (
            <PanelSpinner />
          ) : endpoints.length === 0 ? (
            <p className="text-sm text-center py-14" style={{ color: '#525252' }}>No endpoints yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #262626' }}>
                    {['Method', 'URL', 'Provider', 'Calls / Day', 'Monthly Cost', 'Status'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium" style={{ color: '#737373', fontFamily: "'JetBrains Mono', monospace" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {endpoints.map((ep, i) => (
                    <tr key={ep.id} style={{ borderBottom: i < endpoints.length - 1 ? '1px solid rgba(38,38,38,0.6)' : 'none' }}>
                      <td className="px-6 py-3.5">
                        <span
                          className="text-[11px] px-1.5 py-0.5 rounded"
                          style={{
                            color: METHOD_COLOR[ep.method] ?? '#a3a3a3',
                            background: `${METHOD_COLOR[ep.method] ?? '#a3a3a3'}18`,
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 max-w-xs">
                        <span className="text-xs truncate block" style={{ color: '#a3a3a3', fontFamily: "'JetBrains Mono', monospace" }}>
                          {ep.url}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs" style={{ color: '#737373' }}>{ep.provider}</td>
                      <td className="px-6 py-3.5 text-xs" style={{ color: '#fafafa', fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmtNum(ep.callsPerDay)}
                      </td>
                      <td className="px-6 py-3.5 text-xs" style={{ color: '#d4900a', fontFamily: "'JetBrains Mono', monospace" }}>
                        {fmtCost(ep.monthlyCost)}
                      </td>
                      <td className="px-6 py-3.5">
                        {ep.status !== 'normal' ? (
                          <span
                            className="text-[11px] px-1.5 py-0.5 rounded"
                            style={{ color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.18)', fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {STATUS_LABEL[ep.status] ?? ep.status}
                          </span>
                        ) : (
                          <span style={{ color: '#525252', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Motion.div>

      </div>
    </div>
  );
}
