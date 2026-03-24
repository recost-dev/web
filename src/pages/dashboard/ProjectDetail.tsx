import { Link, useParams } from 'react-router';
import { motion as Motion } from 'motion/react';
import {
  ArrowLeft, Layers, DollarSign, Zap, AlertTriangle, RefreshCw,
  Clock, FolderKanban, ChevronDown, ChevronUp, FileCode, GitBranch,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { apiClient } from '@/src/lib/api-client';
import { colors, accent, FADE } from '@/src/lib/tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

type FrequencyClass =
  | 'single' | 'conditional' | 'cache-guarded'
  | 'bounded-loop' | 'parallel' | 'unbounded-loop' | 'polling';

type CostModel = 'per_token' | 'per_transaction' | 'per_request' | 'free';
type EndpointStatus = 'normal' | 'redundant' | 'cacheable' | 'batchable' | 'n_plus_one_risk' | 'rate_limit_risk';
type Scope = 'internal' | 'external' | 'unknown';
type SuggestionType = 'redundancy' | 'cache' | 'n_plus_one' | 'batch' | 'rate_limit';
type SeverityLevel = 'high' | 'medium' | 'low';

interface CrossFileOrigin { file: string; functionName: string; }
interface CallSite {
  file: string; line: number; library?: string; frequency?: string;
  frequencyClass?: FrequencyClass; crossFileOrigin?: CrossFileOrigin;
}
interface MethodCostModel { model: CostModel; perCallCost?: number; }

interface EndpointRecord {
  id: string; projectId: string; scanId: string;
  provider: string; method: string; url: string;
  methodSignature?: string;
  files: string[]; callSites: CallSite[];
  callsPerDay: number; monthlyCost: number;
  status: EndpointStatus; scope?: Scope;
  frequencyClass?: FrequencyClass; costModel?: MethodCostModel;
  batchCapable?: boolean; cacheCapable?: boolean;
  streaming?: boolean; isMiddleware?: boolean;
  crossFileOrigins?: CrossFileOrigin[];
}

interface Suggestion {
  id: string; projectId: string; scanId: string;
  type: SuggestionType; severity: SeverityLevel;
  affectedEndpoints: string[]; affectedFiles: string[];
  estimatedMonthlySavings: number; description: string; codeFix: string;
}

interface ScanSummary {
  totalEndpoints: number; totalCallsPerDay: number;
  totalMonthlyCost: number; highRiskCount: number;
}

interface Scan {
  id: string; project_id?: string; projectId?: string;
  created_at?: string; createdAt?: string;
  summary: ScanSummary;
}

interface Project {
  id: string; name: string; description?: string;
  createdAt: string; updatedAt: string;
}

// ─── Styling constants ────────────────────────────────────────────────────────

const METHOD_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  GET:    { bg: 'rgba(56, 189, 248, 0.08)',   border: 'rgba(56, 189, 248, 0.22)',   color: '#38bdf8' },
  POST:   { bg: colors.accentSubtle,            border: colors.accentBorder,           color: accent },
  PATCH:  { bg: 'rgba(167, 139, 250, 0.08)',  border: 'rgba(167, 139, 250, 0.22)',  color: '#a78bfa' },
  PUT:    { bg: 'rgba(167, 139, 250, 0.08)',  border: 'rgba(167, 139, 250, 0.22)',  color: '#a78bfa' },
  DELETE: { bg: colors.errorSubtle,             border: colors.errorBorder,            color: colors.error },
};
const DEFAULT_METHOD_STYLE = { bg: colors.bgHover, border: colors.borderDefault, color: colors.textSecondary };

const FREQ_META: Record<FrequencyClass, { label: string; bg: string; border: string; color: string }> = {
  'unbounded-loop': { label: 'unbounded-loop', bg: colors.errorSubtle,   border: colors.errorBorder,   color: colors.error   },
  'polling':        { label: 'polling',         bg: colors.warningSubtle, border: colors.warningBorder, color: colors.warning },
  'parallel':       { label: 'parallel',        bg: colors.warningSubtle, border: colors.warningBorder, color: colors.warning },
  'bounded-loop':   { label: 'bounded-loop',    bg: colors.accentSubtle,  border: colors.accentBorder,  color: accent         },
  'conditional':    { label: 'conditional',     bg: 'transparent',        border: colors.borderDefault, color: colors.textSecondary },
  'single':         { label: 'single',          bg: 'transparent',        border: colors.borderDefault, color: colors.textMuted     },
  'cache-guarded':  { label: 'cache-guarded',   bg: 'rgba(34,197,94,0.07)', border: 'rgba(34,197,94,0.20)', color: '#4ade80' },
};

const STATUS_META: Partial<Record<EndpointStatus, { label: string; bg: string; border: string; color: string }>> = {
  'rate_limit_risk': { label: 'rate limit',  bg: colors.errorSubtle,   border: colors.errorBorder,   color: colors.error },
  'n_plus_one_risk': { label: 'N+1 risk',    bg: colors.errorSubtle,   border: colors.errorBorder,   color: colors.error },
  'cacheable':       { label: 'cacheable',   bg: 'rgba(34,197,94,0.07)', border: 'rgba(34,197,94,0.20)', color: '#4ade80' },
  'batchable':       { label: 'batchable',   bg: colors.accentSubtle,  border: colors.accentBorder,  color: accent },
  'redundant':       { label: 'redundant',   bg: colors.warningSubtle, border: colors.warningBorder, color: colors.warning },
};

const COST_MODEL_META: Record<CostModel, { label: string; color: string }> = {
  per_token:       { label: 'token',  color: accent },
  per_transaction: { label: 'txn',    color: accent },
  per_request:     { label: 'req',    color: colors.textMuted },
  free:            { label: 'free',   color: '#4ade80' },
};

const SUGGESTION_TYPE_LABELS: Record<SuggestionType, string> = {
  n_plus_one: 'N+1',
  rate_limit: 'rate limit',
  cache:      'cache',
  batch:      'batch',
  redundancy: 'redundant',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(dateStr?: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtCost(n: number) {
  if (n === 0) return '$0';
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtNum(n: number) {
  return n.toLocaleString('en-US');
}

function shortFile(f: string) {
  const parts = f.split('/');
  return parts.length > 2 ? `…/${parts.slice(-2).join('/')}` : f;
}

// ─── Micro-components ────────────────────────────────────────────────────────

function Badge({ bg, border, color, children }: {
  bg: string; border: string; color: string; children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono leading-none rounded"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {children}
    </span>
  );
}

function Chip({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono leading-none rounded"
      style={{ background: 'transparent', border: `1px solid ${color}`, color, opacity: 0.85 }}
    >
      {children}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="w-5 h-5 rounded-full border-2 animate-spin"
        style={{ borderColor: colors.accentSubtle, borderTopColor: accent }}
      />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 text-center rounded-lg"
      style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}` }}
    >
      <AlertTriangle className="w-6 h-6 mb-3" style={{ color: colors.error }} />
      <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>{message}</p>
      <p className="text-sm mb-5" style={{ color: colors.textMuted }}>Check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all cursor-pointer"
        style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, color: colors.error }}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  );
}

// ─── Endpoint row ─────────────────────────────────────────────────────────────

function EndpointRow({ ep }: { ep: EndpointRecord }) {
  const methodStyle = METHOD_STYLES[ep.method] ?? DEFAULT_METHOD_STYLE;
  const statusMeta = ep.status !== 'normal' ? STATUS_META[ep.status] : undefined;
  const freqMeta = ep.frequencyClass ? FREQ_META[ep.frequencyClass] : undefined;
  const costModelMeta = ep.costModel ? COST_MODEL_META[ep.costModel.model] : undefined;

  const hasCost = ep.monthlyCost > 0;

  const chips: { label: string; color: string }[] = [
    ...(ep.isMiddleware  ? [{ label: 'middleware', color: colors.warning }]     : []),
    ...(ep.streaming     ? [{ label: 'streaming',  color: '#38bdf8' }]          : []),
    ...(ep.batchCapable  ? [{ label: 'batchable',  color: accent }]             : []),
    ...(ep.cacheCapable  ? [{ label: 'cacheable',  color: '#4ade80' }]          : []),
  ];

  const crossOriginCount = ep.crossFileOrigins?.length ?? 0;

  return (
    <div
      className="px-3 py-3 sm:px-5 sm:py-3.5 transition-colors"
      style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}
    >
      {/* Top row */}
      <div className="flex items-start gap-2 sm:gap-3 min-w-0">
        {/* Method badge */}
        <span
          className="flex-shrink-0 inline-flex items-center justify-center w-[46px] px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider rounded"
          style={{ background: methodStyle.bg, border: `1px solid ${methodStyle.border}`, color: methodStyle.color }}
        >
          {ep.method}
        </span>

        {/* URL + metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {/* Provider */}
            <span className="text-xs font-medium" style={{ color: colors.textMuted }}>{ep.provider}</span>
            {/* Scope (only show external) */}
            {ep.scope === 'external' && (
              <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>ext</span>
            )}
            {/* URL */}
            <span
              className="text-xs font-mono truncate max-w-[280px] sm:max-w-none"
              style={{ color: colors.textPrimary }}
              title={ep.url}
            >
              {ep.url.replace(/^https?:\/\/[^/]+/, '')}
            </span>
          </div>

          {/* Method signature */}
          {ep.methodSignature && (
            <p className="text-[11px] font-mono mt-0.5" style={{ color: colors.textMuted }}>
              {ep.methodSignature}
            </p>
          )}

          {/* Files row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
            {ep.files.slice(0, 2).map((f) => (
              <span key={f} className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                {shortFile(f)}
              </span>
            ))}
            {ep.files.length > 2 && (
              <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                +{ep.files.length - 2} more
              </span>
            )}
            {crossOriginCount > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-mono" style={{ color: colors.textMuted }}>
                <GitBranch className="w-2.5 h-2.5" />
                {crossOriginCount} origin{crossOriginCount > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Right side: badges + cost */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1.5 ml-auto pl-2">
          {/* Cost */}
          <span
            className="text-sm font-mono font-semibold tabular-nums"
            style={{ color: hasCost ? accent : colors.textMuted }}
          >
            {fmtCost(ep.monthlyCost)}<span className="text-[10px] font-normal">/mo</span>
          </span>
          <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
            {fmtNum(ep.callsPerDay)}/day
          </span>
        </div>
      </div>

      {/* Badge row */}
      {(freqMeta || statusMeta || costModelMeta || chips.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-[58px] sm:ml-[62px]">
          {freqMeta && (
            <Badge bg={freqMeta.bg} border={freqMeta.border} color={freqMeta.color}>
              {freqMeta.label}
            </Badge>
          )}
          {statusMeta && (
            <Badge bg={statusMeta.bg} border={statusMeta.border} color={statusMeta.color}>
              {statusMeta.label}
            </Badge>
          )}
          {costModelMeta && (
            <Chip color={costModelMeta.color}>{costModelMeta.label}</Chip>
          )}
          {chips.map((c) => (
            <Chip key={c.label} color={c.color}>{c.label}</Chip>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Suggestion row ───────────────────────────────────────────────────────────

function SuggestionRow({ suggestion }: { suggestion: Suggestion }) {
  const [expanded, setExpanded] = useState(false);

  const severityStyle = suggestion.severity === 'high'
    ? { color: colors.error,   bg: colors.errorSubtle,   border: colors.errorBorder }
    : suggestion.severity === 'medium'
    ? { color: colors.warning, bg: colors.warningSubtle, border: colors.warningBorder }
    : { color: colors.textMuted, bg: 'transparent',      border: colors.borderDefault };

  const hasSavings = suggestion.estimatedMonthlySavings > 0;

  return (
    <div style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
      <button
        className="w-full text-left px-3 py-3 sm:px-5 sm:py-3.5 transition-colors cursor-pointer"
        style={{ background: 'transparent' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = colors.bgHover; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Severity dot */}
          <span
            className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-sm"
            style={{ background: severityStyle.color }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: severityStyle.bg, border: `1px solid ${severityStyle.border}`, color: severityStyle.color }}
              >
                {suggestion.severity}
              </span>
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                style={{ background: colors.bgHover, border: `1px solid ${colors.borderDefault}`, color: colors.textSecondary }}
              >
                {SUGGESTION_TYPE_LABELS[suggestion.type]}
              </span>
              <p className="text-xs sm:text-sm" style={{ color: colors.textPrimary }}>
                {suggestion.description}
              </p>
            </div>

            {/* Affected files */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
              {suggestion.affectedFiles.slice(0, 2).map((f) => (
                <span key={f} className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                  {shortFile(f)}
                </span>
              ))}
              {suggestion.affectedFiles.length > 2 && (
                <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                  +{suggestion.affectedFiles.length - 2} more
                </span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex flex-col items-end gap-1 ml-2">
            {hasSavings && (
              <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: accent }}>
                −{fmtCost(suggestion.estimatedMonthlySavings)}<span className="text-[10px] font-normal">/mo</span>
              </span>
            )}
            {expanded
              ? <ChevronUp className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />
              : <ChevronDown className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />}
          </div>
        </div>
      </button>

      {/* Expanded: code fix */}
      {expanded && suggestion.codeFix && (
        <div
          className="mx-3 mb-3 sm:mx-5 sm:mb-4 rounded overflow-hidden"
          style={{ border: `1px solid ${colors.borderDefault}` }}
        >
          <div
            className="flex items-center gap-1.5 px-3 py-1.5"
            style={{ background: colors.bgHover, borderBottom: `1px solid ${colors.borderDefault}` }}
          >
            <FileCode className="w-3 h-3" style={{ color: colors.textMuted }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: colors.textMuted }}>suggested fix</span>
          </div>
          <pre
            className="px-3 py-3 text-[11px] font-mono leading-relaxed overflow-x-auto"
            style={{ background: colors.bgSubtle, color: colors.textSecondary, margin: 0 }}
          >
            {suggestion.codeFix}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProjectDetail() {
  const params = useParams();
  const id = params.id as string;
  const [historyOpen, setHistoryOpen] = useState(false);

  const { data: project, isLoading: projectLoading, isError: projectError, refetch: refetchProject } =
    useQuery<Project>({
      queryKey: ['dashboard-project', id],
      queryFn: () => apiClient.get<{ data: Project }>(`/projects/${id}`).then((r) => r.data),
      enabled: !!id,
    });

  // Latest scan (for summary stats + scan ID)
  const { data: latestScan, isLoading: latestScanLoading } = useQuery<Scan | null>({
    queryKey: ['dashboard-project-latest-scan', id],
    queryFn: () =>
      apiClient
        .get<{ data: Scan }>(`/projects/${id}/scans/latest`)
        .then((r) => r.data)
        .catch(() => null),
    enabled: !!id,
  });

  // Endpoints for the latest scan
  const { data: endpoints = [], isLoading: endpointsLoading, isError: endpointsError, refetch: refetchEndpoints } =
    useQuery<EndpointRecord[]>({
      queryKey: ['dashboard-project-endpoints', id, latestScan?.id],
      queryFn: () =>
        apiClient
          .get<{ data: EndpointRecord[] }>(
            `/projects/${id}/endpoints?scanId=${latestScan!.id}&limit=100`
          )
          .then((r) => r.data),
      enabled: !!id && !!latestScan?.id,
    });

  // Suggestions for the latest scan
  const { data: suggestions = [], isLoading: suggestionsLoading, isError: suggestionsError, refetch: refetchSuggestions } =
    useQuery<Suggestion[]>({
      queryKey: ['dashboard-project-suggestions', id, latestScan?.id],
      queryFn: () =>
        apiClient
          .get<{ data: Suggestion[] }>(
            `/projects/${id}/suggestions?scanId=${latestScan!.id}&limit=50`
          )
          .then((r) => r.data),
      enabled: !!id && !!latestScan?.id,
    });

  // Scan history
  const { data: scans = [], isLoading: scansLoading, isError: scansError, refetch: refetchScans } =
    useQuery<Scan[]>({
      queryKey: ['dashboard-project-scans', id],
      queryFn: () =>
        apiClient
          .get<{ data: Scan[] }>(`/projects/${id}/scans`)
          .then((r) => r.data),
      enabled: !!id && historyOpen,
    });

  const isLoading = projectLoading || latestScanLoading;
  const summary = latestScan?.summary;
  const totalSavings = suggestions.reduce((s, sg) => s + sg.estimatedMonthlySavings, 0);
  const highCount = suggestions.filter((sg) => sg.severity === 'high').length;

  // Sort endpoints: by monthlyCost desc, then callsPerDay desc
  const sortedEndpoints = [...endpoints].sort((a, b) =>
    b.monthlyCost !== a.monthlyCost ? b.monthlyCost - a.monthlyCost : b.callsPerDay - a.callsPerDay
  );

  return (
    <div className="min-h-full">
      <div className="w-full px-6 md:px-10 pt-8 pb-16">

        {/* Back */}
        <Motion.div {...FADE(0)} className="mb-8">
          <Link
            to="/dashboard/projects"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: colors.textMuted, textDecoration: 'none' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.textSecondary; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = colors.textMuted; }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Projects
          </Link>
        </Motion.div>

        {/* Project header */}
        {isLoading ? (
          <Spinner />
        ) : projectError ? (
          <Motion.div {...FADE(0.05)}>
            <ErrorState message="Failed to load project" onRetry={() => refetchProject()} />
          </Motion.div>
        ) : project ? (
          <Motion.div {...FADE(0.05)} className="mb-8">
            <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: accent }}>Project</p>
            <h1 className="text-2xl sm:text-3xl font-bold break-words" style={{ color: colors.textPrimary }}>
              {project.name}
            </h1>
            {project.description && (
              <p className="mt-2 text-sm" style={{ color: colors.textMuted }}>{project.description}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <Clock className="w-3 h-3" style={{ color: colors.textMuted }} />
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
                Created {fmt(project.createdAt)}
              </span>
            </div>
          </Motion.div>
        ) : null}

        {/* Latest scan summary bar */}
        {summary && (
          <Motion.div
            {...FADE(0.08)}
            className="grid grid-cols-2 sm:grid-cols-4 rounded-lg overflow-hidden mb-8"
            style={{ border: `1px solid ${colors.borderDefault}`, background: colors.bgBase }}
          >
            {[
              {
                icon: Layers,
                label: 'Endpoints',
                value: summary.totalEndpoints,
                display: String(summary.totalEndpoints),
                color: colors.textPrimary,
                iconColor: colors.textMuted,
              },
              {
                icon: DollarSign,
                label: 'Monthly cost',
                value: summary.totalMonthlyCost,
                display: fmtCost(summary.totalMonthlyCost),
                color: summary.totalMonthlyCost > 0 ? accent : colors.textPrimary,
                iconColor: summary.totalMonthlyCost > 0 ? accent : colors.textMuted,
              },
              {
                icon: Zap,
                label: 'Calls / day',
                value: summary.totalCallsPerDay,
                display: fmtNum(summary.totalCallsPerDay),
                color: colors.textPrimary,
                iconColor: colors.textMuted,
              },
              {
                icon: AlertTriangle,
                label: 'High risk',
                value: summary.highRiskCount,
                display: String(summary.highRiskCount),
                color: summary.highRiskCount > 0 ? colors.error : colors.textPrimary,
                iconColor: summary.highRiskCount > 0 ? colors.error : colors.textMuted,
              },
            ].map(({ icon: Icon, label, display, color, iconColor }, i) => (
              <div
                key={label}
                className="px-4 py-3 sm:px-5 sm:py-4"
                style={{ borderRight: i < 3 ? `1px solid ${colors.borderSubtle}` : undefined }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3 h-3" style={{ color: iconColor }} />
                  <p className="text-[10px] uppercase tracking-[0.08em]" style={{ color: colors.textMuted }}>{label}</p>
                </div>
                <p className="text-base sm:text-lg font-bold font-mono tabular-nums" style={{ color }}>{display}</p>
              </div>
            ))}
          </Motion.div>
        )}

        {/* Endpoints section */}
        <Motion.div {...FADE(0.12)} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] mb-1" style={{ color: colors.textMuted }}>
                {latestScan?.created_at || latestScan?.createdAt
                  ? `Latest scan · ${fmt(latestScan.created_at ?? latestScan.createdAt)}`
                  : 'Latest scan'}
              </p>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Endpoints
                {endpoints.length > 0 && (
                  <span className="ml-2 text-sm font-mono font-normal" style={{ color: colors.textMuted }}>
                    {endpoints.length}
                  </span>
                )}
              </h2>
            </div>
          </div>

          {endpointsLoading ? (
            <Spinner />
          ) : endpointsError ? (
            <ErrorState message="Failed to load endpoints" onRetry={() => refetchEndpoints()} />
          ) : sortedEndpoints.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center rounded-lg"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <Layers className="w-6 h-6 mb-3" style={{ color: colors.textMuted }} />
              <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>No endpoints</p>
              <p className="text-xs" style={{ color: colors.textMuted }}>
                {latestScan ? 'No endpoints found in this scan.' : 'Submit a scan via the API or extension to see results.'}
              </p>
            </div>
          ) : (
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: `1px solid ${colors.borderDefault}`, background: colors.bgBase }}
            >
              {sortedEndpoints.map((ep) => (
                <EndpointRow key={ep.id} ep={ep} />
              ))}
            </div>
          )}
        </Motion.div>

        {/* Suggestions section */}
        <Motion.div {...FADE(0.16)} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] mb-1" style={{ color: colors.textMuted }}>
                Optimization opportunities
              </p>
              <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Suggestions
                {suggestions.length > 0 && (
                  <span className="ml-2 text-sm font-mono font-normal" style={{ color: colors.textMuted }}>
                    {suggestions.length}
                  </span>
                )}
              </h2>
            </div>
            {totalSavings > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs" style={{ color: colors.textMuted }}>potential savings</span>
                <span className="text-base font-mono font-bold tabular-nums" style={{ color: accent }}>
                  −{fmtCost(totalSavings)}<span className="text-xs font-normal">/mo</span>
                </span>
              </div>
            )}
          </div>

          {suggestionsLoading ? (
            <Spinner />
          ) : suggestionsError ? (
            <ErrorState message="Failed to load suggestions" onRetry={() => refetchSuggestions()} />
          ) : suggestions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-14 text-center rounded-lg"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <Zap className="w-6 h-6 mb-3" style={{ color: colors.textMuted }} />
              <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>No suggestions</p>
              <p className="text-xs" style={{ color: colors.textMuted }}>Looks clean — no optimization opportunities detected.</p>
            </div>
          ) : (
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: `1px solid ${colors.borderDefault}`, background: colors.bgBase }}
            >
              {/* Header */}
              {highCount > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-2 sm:px-5"
                  style={{ background: colors.errorSubtle, borderBottom: `1px solid ${colors.errorBorder}` }}
                >
                  <AlertTriangle className="w-3.5 h-3.5" style={{ color: colors.error }} />
                  <span className="text-xs font-mono" style={{ color: colors.error }}>
                    {highCount} high-severity issue{highCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {suggestions
                .slice()
                .sort((a, b) => {
                  const order = { high: 0, medium: 1, low: 2 };
                  return order[a.severity] - order[b.severity];
                })
                .map((sg) => (
                  <SuggestionRow key={sg.id} suggestion={sg} />
                ))}
            </div>
          )}
        </Motion.div>

        {/* Scan history (toggle) */}
        <Motion.div {...FADE(0.2)}>
          <button
            className="flex items-center gap-2 mb-4 cursor-pointer"
            style={{ background: 'none', border: 'none', padding: 0 }}
            onClick={() => setHistoryOpen((v) => !v)}
          >
            <p className="text-xs uppercase tracking-[0.12em]" style={{ color: colors.textMuted }}>Scan history</p>
            {historyOpen
              ? <ChevronUp className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />
              : <ChevronDown className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />}
          </button>

          {historyOpen && (
            scansLoading ? (
              <Spinner />
            ) : scansError ? (
              <ErrorState message="Failed to load scan history" onRetry={() => refetchScans()} />
            ) : scans.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-14 rounded-lg"
                style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
              >
                <p className="text-sm" style={{ color: colors.textMuted }}>No scans yet.</p>
              </div>
            ) : (
              <div
                className="rounded-lg overflow-hidden"
                style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
              >
                {scans.map((scan, i) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between px-3 py-3 sm:px-5"
                    style={{ borderBottom: i < scans.length - 1 ? `1px solid ${colors.borderSubtle}` : undefined }}
                  >
                    <div className="flex items-center gap-3">
                      <FolderKanban className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textMuted }} />
                      <div>
                        <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                          Scan #{scans.length - i}
                        </p>
                        <p className="text-xs font-mono" style={{ color: colors.textMuted }}>
                          {fmt(scan.created_at ?? scan.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono tabular-nums" style={{ color: colors.textSecondary }}>
                        {scan.summary?.totalEndpoints ?? 0} endpoints
                      </span>
                      <span className="text-sm font-mono font-semibold tabular-nums" style={{ color: scan.summary?.totalMonthlyCost > 0 ? accent : colors.textMuted }}>
                        {fmtCost(scan.summary?.totalMonthlyCost ?? 0)}
                      </span>
                      {scan.summary?.highRiskCount > 0 && (
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded"
                          style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}` }}
                        >
                          <AlertTriangle className="w-3 h-3" style={{ color: colors.error }} />
                          <span className="text-[10px] font-mono" style={{ color: colors.error }}>
                            {scan.summary.highRiskCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </Motion.div>

      </div>
    </div>
  );
}
