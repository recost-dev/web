import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import {
  ScanSearch, ChevronDown, ChevronRight,
  AlertTriangle, RefreshCw, Download, FileText, X,
} from 'lucide-react';
import { colors, accent, FADE } from '@/src/lib/tokens';
import { useAuth } from '@/src/lib/auth-context';
import { Navigate } from 'react-router';
import {
  useParserRuns,
  useParserRunResults,
  useCreateParserRun,
  useDeleteParserRun,
  type ParserRun,
  type ParserResult,
} from '@/src/lib/parser-hooks';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtRelative(ms: number): string {
  const diff = Date.now() - ms;
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtDuration(ms?: number | null): string {
  if (ms == null) return '—';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function fmtRepos(reposJson: string): string {
  try {
    const repos = JSON.parse(reposJson) as string[];
    if (!repos.length) return '—';
    const first = repos[0].replace('https://github.com/', '');
    return repos.length > 1 ? `${first} +${repos.length - 1}` : first;
  } catch {
    return reposJson;
  }
}

function fmtMoney(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function csvCell(v: string): string {
  return v.includes(',') || v.includes('"') || v.includes('\n')
    ? `"${v.replace(/"/g, '""')}"`
    : v;
}

function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeJsonArray(json: string | null | undefined): Record<string, unknown>[] {
  if (!json) return [];
  try { return JSON.parse(json) as Record<string, unknown>[]; }
  catch { return []; }
}

function safeJsonObj(json: string | null | undefined): Record<string, unknown> {
  if (!json) return {};
  try { return JSON.parse(json) as Record<string, unknown>; }
  catch { return {}; }
}

function strOf(v: unknown): string {
  if (v == null) return '';
  return String(v);
}

function numOf(v: unknown): number {
  return typeof v === 'number' ? v : 0;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { bg: string; border: string; color: string; label: string }> = {
  queued:  { bg: 'rgba(163,163,163,0.06)',       border: 'rgba(163,163,163,0.18)',      color: colors.textMuted,     label: 'Queued'  },
  running: { bg: 'rgba(59,130,246,0.10)',         border: 'rgba(59,130,246,0.25)',       color: '#60a5fa',            label: 'Running' },
  done:    { bg: 'rgba(34,197,94,0.08)',          border: 'rgba(34,197,94,0.20)',        color: '#22c55e',            label: 'Done'    },
  failed:  { bg: colors.errorSubtle,             border: colors.errorBorder,            color: colors.error,         label: 'Failed'  },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.done;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap"
      style={{ background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}
    >
      {meta.label}
    </span>
  );
}

// ─── CSV export ───────────────────────────────────────────────────────────────

function exportRunCsv(run: ParserRun, results: ParserResult[]): void {
  const lines: string[] = [];
  lines.push('repo,endpoint,provider,method,frequency_class,cost_model,monthly_cost');
  for (const r of results) {
    for (const ep of safeJsonArray(r.endpoints)) {
      lines.push([
        csvCell(r.repo),
        csvCell(strOf(ep.endpoint ?? ep.url ?? ep.path)),
        csvCell(strOf(ep.provider)),
        csvCell(strOf(ep.method)),
        csvCell(strOf(ep.frequencyClass ?? ep.frequency_class)),
        csvCell(strOf(ep.costModel ?? ep.cost_model)),
        strOf(ep.estimatedMonthlyCost ?? ep.estimated_monthly_cost ?? ep.monthlyCost ?? ep.monthly_cost),
      ].join(','));
    }
  }
  lines.push('');
  lines.push('repo,title,type,estimated_saving');
  for (const r of results) {
    for (const s of safeJsonArray(r.suggestions)) {
      lines.push([
        csvCell(r.repo),
        csvCell(strOf(s.title)),
        csvCell(strOf(s.type)),
        strOf(s.estimatedSaving ?? s.estimated_saving),
      ].join(','));
    }
  }
  downloadCsv(`run_${run.id}_export.csv`, lines.join('\n'));
}

function exportAllRunsCsv(runs: ParserRun[]): void {
  const lines = ['run_id,status,repos,results_found,duration_ms,triggered_by,created_at'];
  for (const r of runs) {
    lines.push([
      csvCell(r.id),
      csvCell(r.status),
      csvCell(r.repos),
      String(r.results_found),
      String(r.duration_ms ?? ''),
      csvCell(r.triggered_by ?? ''),
      String(r.created_at),
    ].join(','));
  }
  downloadCsv('parser_runs_export.csv', lines.join('\n'));
}

// ─── Expanded run detail ──────────────────────────────────────────────────────

function ExpandedRunDetail({ run }: { run: ParserRun }) {
  const { data: results = [], isLoading, isError, refetch } = useParserRunResults(run.id);
  const [endpointsOpen, setEndpointsOpen] = useState(true);
  const [suggestionsOpen, setSuggestionsOpen] = useState(true);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-8"
        style={{ borderTop: `1px solid ${colors.borderSubtle}`, background: colors.bgSubtle }}
      >
        <div className="w-4 h-4 rounded-full border-2 animate-spin"
          style={{ borderColor: colors.accentSubtle, borderTopColor: accent }} />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderTop: `1px solid ${colors.borderSubtle}`, background: colors.bgSubtle }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: colors.error }} />
        <p className="text-sm flex-1" style={{ color: colors.textMuted }}>Failed to load results.</p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md cursor-pointer"
          style={{ color: colors.error, background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}` }}
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  const allEndpoints = results.flatMap((r) =>
    safeJsonArray(r.endpoints).map((ep) => ({ ...ep, _repo: r.repo } as Record<string, unknown> & { _repo: string }))
  );
  const allSuggestions = results.flatMap((r) =>
    safeJsonArray(r.suggestions).map((s) => ({ ...s, _repo: r.repo } as Record<string, unknown> & { _repo: string }))
  );
  const totalScannedFiles = results.reduce((sum, r) => sum + (r.scanned_file_count ?? 0), 0);
  const totalMonthlyCost = results.reduce((sum, r) => {
    const s = safeJsonObj(r.summary);
    return sum + numOf(s.totalMonthlyCost ?? s.total_monthly_cost);
  }, 0);

  const summaryStats = [
    { label: 'Scanned files',    value: String(totalScannedFiles),                                      isAccent: false },
    { label: 'Total endpoints',  value: String(allEndpoints.length),                                    isAccent: false },
    { label: 'Total suggestions',value: String(allSuggestions.length),                                  isAccent: false },
    { label: 'Est. monthly cost',value: totalMonthlyCost > 0 ? fmtMoney(totalMonthlyCost) : '—',       isAccent: true  },
  ];

  const thStyle: React.CSSProperties = {
    color: colors.textMuted,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 500,
  };
  const tdStyle: React.CSSProperties = { color: colors.textSecondary, fontSize: '12px' };

  return (
    <div
      className="px-5 py-5 space-y-5"
      style={{ borderTop: `1px solid ${colors.borderSubtle}`, background: colors.bgSubtle }}
    >
      {/* Summary stat cards */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {summaryStats.map(({ label, value, isAccent }) => (
            <div
              key={label}
              className="px-4 py-3 rounded-md"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: colors.textMuted }}>{label}</p>
              <p className="text-lg font-bold font-mono tabular-nums" style={{ color: isAccent ? accent : colors.textPrimary }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Endpoints table */}
      {allEndpoints.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setEndpointsOpen((o) => !o)}
            className="flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            {endpointsOpen
              ? <ChevronDown className="w-3 h-3" style={{ color: colors.textMuted }} />
              : <ChevronRight className="w-3 h-3" style={{ color: colors.textMuted }} />
            }
            <p className="text-[11px] uppercase tracking-[0.1em] font-medium" style={{ color: colors.textMuted }}>Endpoints</p>
          </button>
          {endpointsOpen && (
            <div className="rounded-md overflow-x-auto" style={{ border: `1px solid ${colors.borderDefault}` }}>
              <div style={{ minWidth: 640 }}>
                <div
                  className="grid gap-x-4 px-4 py-2"
                  style={{
                    gridTemplateColumns: '1fr 1.5fr 80px 56px 88px 88px 88px',
                    borderBottom: `1px solid ${colors.borderSubtle}`,
                    background: colors.bgBase,
                  }}
                >
                  {['Repo', 'Endpoint', 'Provider', 'Method', 'Freq. class', 'Cost model', 'Est. / mo'].map((h) => (
                    <span key={h} style={thStyle}>{h}</span>
                  ))}
                </div>
                {allEndpoints.map((ep, i) => (
                  <div
                    key={i}
                    className="grid gap-x-4 px-4 py-2.5"
                    style={{
                      gridTemplateColumns: '1fr 1.5fr 80px 56px 88px 88px 88px',
                      borderBottom: i < allEndpoints.length - 1 ? `1px solid ${colors.borderSubtle}` : undefined,
                    }}
                  >
                    <span className="truncate font-mono text-[11px]" style={tdStyle}>{strOf(ep._repo)}</span>
                    <span className="truncate font-mono text-[11px]" style={{ color: colors.textPrimary }}>{strOf(ep.endpoint ?? ep.url ?? ep.path)}</span>
                    <span className="truncate text-[12px]" style={tdStyle}>{strOf(ep.provider)}</span>
                    <span className="truncate text-[11px] font-mono uppercase" style={{ color: accent }}>{strOf(ep.method)}</span>
                    <span className="truncate text-[12px]" style={tdStyle}>{strOf(ep.frequencyClass ?? ep.frequency_class)}</span>
                    <span className="truncate text-[12px]" style={tdStyle}>{strOf(ep.costModel ?? ep.cost_model)}</span>
                    <span className="tabular-nums text-[12px] font-mono" style={{ color: accent }}>
                      {(ep.estimatedMonthlyCost ?? ep.estimated_monthly_cost ?? ep.monthlyCost ?? ep.monthly_cost) != null
                        ? fmtMoney(numOf(ep.estimatedMonthlyCost ?? ep.estimated_monthly_cost ?? ep.monthlyCost ?? ep.monthly_cost))
                        : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Suggestions table */}
      {allSuggestions.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setSuggestionsOpen((o) => !o)}
            className="flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            {suggestionsOpen
              ? <ChevronDown className="w-3 h-3" style={{ color: colors.textMuted }} />
              : <ChevronRight className="w-3 h-3" style={{ color: colors.textMuted }} />
            }
            <p className="text-[11px] uppercase tracking-[0.1em] font-medium" style={{ color: colors.textMuted }}>Suggestions</p>
          </button>
          {suggestionsOpen && (
            <div className="rounded-md overflow-x-auto" style={{ border: `1px solid ${colors.borderDefault}` }}>
              <div style={{ minWidth: 480 }}>
                <div
                  className="grid gap-x-4 px-4 py-2"
                  style={{
                    gridTemplateColumns: '1fr 2fr 96px 104px',
                    borderBottom: `1px solid ${colors.borderSubtle}`,
                    background: colors.bgBase,
                  }}
                >
                  {['Repo', 'Title', 'Type', 'Est. saving'].map((h) => (
                    <span key={h} style={thStyle}>{h}</span>
                  ))}
                </div>
                {allSuggestions.map((s, i) => (
                  <div
                    key={i}
                    className="grid gap-x-4 px-4 py-2.5"
                    style={{
                      gridTemplateColumns: '1fr 2fr 96px 104px',
                      borderBottom: i < allSuggestions.length - 1 ? `1px solid ${colors.borderSubtle}` : undefined,
                    }}
                  >
                    <span className="truncate font-mono text-[11px]" style={tdStyle}>{strOf(s._repo)}</span>
                    <span className="truncate text-[12px]" style={{ color: colors.textPrimary }}>{strOf(s.title)}</span>
                    <span className="truncate text-[12px]" style={tdStyle}>{strOf(s.type)}</span>
                    <span className="tabular-nums text-[12px] font-mono" style={{ color: accent }}>
                      {(s.estimatedSaving ?? s.estimated_saving) != null
                        ? fmtMoney(numOf(s.estimatedSaving ?? s.estimated_saving))
                        : '—'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty results */}
      {results.length === 0 && (
        <div className="flex flex-col items-center py-8 text-center">
          <FileText className="w-5 h-5 mb-2" style={{ color: colors.textMuted }} />
          <p className="text-sm" style={{ color: colors.textMuted }}>No results yet</p>
        </div>
      )}

      {/* Export button */}
      <div className="flex justify-end">
        <button
          onClick={() => exportRunCsv(run, results)}
          disabled={results.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}`, color: colors.textSecondary }}
          onMouseEnter={(e) => { if (results.length > 0) { (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderHover; (e.currentTarget as HTMLButtonElement).style.color = colors.textPrimary; } }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderDefault; (e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary; }}
        >
          <Download className="w-3.5 h-3.5" />
          Export run to CSV
        </button>
      </div>
    </div>
  );
}

// ─── Column template ──────────────────────────────────────────────────────────

const COL = '72px 1fr 80px 80px 88px 96px 28px 28px';

// ─── Main page ────────────────────────────────────────────────────────────────

function AutoParserPage() {
  const [repoInput, setRepoInput] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [triggerError, setTriggerError] = useState('');

  const { data: runs = [], isLoading, isError, refetch } = useParserRuns();
  const createRun = useCreateParserRun();
  const deleteRun = useDeleteParserRun();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleRunScan(e: { preventDefault(): void }) {
    e.preventDefault();
    setTriggerError('');
    setSuccessMsg('');

    const repos = repoInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => /^https:\/\/github\.com\/.+/.test(s));

    if (!repos.length) {
      setTriggerError('Enter at least one valid https://github.com/… URL.');
      return;
    }

    createRun.mutate(
      { repos, triggered_by: 'ui' },
      {
        onSuccess: () => {
          setRepoInput('');
          setSuccessMsg('Scan queued.');
          setTimeout(() => setSuccessMsg(''), 4000);
        },
        onError: (e: Error) => {
          setTriggerError(e.message || 'Failed to start scan.');
        },
      }
    );
  }

  function toggleRow(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="min-h-full">
      <div className="w-full px-6 md:px-10 pt-8 pb-16">

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: accent }}>Tools</p>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.textPrimary }}>Auto Parser</h1>
            <span
              className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-[0.08em]"
              style={{ background: colors.accentSubtle, border: `1px solid ${colors.accentBorder}`, color: accent }}
            >
              Admin
            </span>
          </div>
          <p className="mt-1 text-sm" style={{ color: colors.textMuted }}>Scan GitHub repos for API usage patterns</p>
        </Motion.div>

        {/* Run trigger panel */}
        <Motion.div
          {...FADE(0.08)}
          className="rounded-lg overflow-hidden mb-8"
          style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
        >
          <button
            type="button"
            onClick={() => setPanelOpen((o) => !o)}
            className="w-full flex items-center gap-3 px-5 py-4 sm:px-6 sm:py-5 cursor-pointer transition-colors duration-100"
            style={{ background: 'transparent', border: 'none', borderBottom: panelOpen ? `1px solid ${colors.borderSubtle}` : undefined }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.bgHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            <ScanSearch className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
            <p className="text-sm font-semibold flex-1 text-left" style={{ color: colors.textPrimary }}>Trigger a scan</p>
            <ChevronDown
              className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200"
              style={{ color: colors.textMuted, transform: panelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          <AnimatePresence initial={false}>
            {panelOpen && (
              <Motion.div
                key="trigger-form"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <form onSubmit={handleRunScan} className="px-5 py-5 sm:px-6">
                  <textarea
                    value={repoInput}
                    onChange={(e) => { setRepoInput(e.target.value); setTriggerError(''); setSuccessMsg(''); }}
                    placeholder={"https://github.com/org/repo\nhttps://github.com/org/repo2"}
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-md text-sm font-mono placeholder-[#525252] focus:outline-none transition-all resize-none"
                    style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textPrimary }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = colors.accentBorder; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = colors.borderDefault; }}
                  />
                  <p className="text-xs mt-1.5 mb-4" style={{ color: colors.textMuted }}>one repo URL per line</p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      type="submit"
                      disabled={createRun.isPending || !repoInput.trim()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: colors.accentSubtle, border: `1px solid ${colors.accentBorder}`, color: accent }}
                      onMouseEnter={(e) => { if (!createRun.isPending) (e.currentTarget as HTMLButtonElement).style.background = colors.accentHover; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.accentSubtle; }}
                    >
                      {createRun.isPending ? 'Queuing…' : 'Run scan'}
                    </button>
                    {successMsg && (
                      <p className="text-xs font-medium" style={{ color: '#22c55e' }}>{successMsg}</p>
                    )}
                    {triggerError && (
                      <p className="text-xs" style={{ color: colors.error }}>{triggerError}</p>
                    )}
                  </div>
                </form>
              </Motion.div>
            )}
          </AnimatePresence>
        </Motion.div>

        {/* Runs table */}
        <Motion.div {...FADE(0.16)}>
          <p className="text-xs uppercase tracking-[0.12em] font-medium mb-3" style={{ color: colors.textMuted }}>Runs</p>

          {isLoading ? (
            <div className="flex items-center justify-center py-28">
              <div className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: colors.accentSubtle, borderTopColor: accent }} />
            </div>
          ) : isError ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center rounded-lg"
              style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}` }}
            >
              <AlertTriangle className="w-6 h-6 mb-3" style={{ color: colors.error }} />
              <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>Failed to load runs</p>
              <p className="text-sm mb-5" style={{ color: colors.textMuted }}>Check your connection and try again.</p>
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all cursor-pointer"
                style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, color: colors.error }}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry
              </button>
            </div>
          ) : runs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-28 text-center rounded-lg"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <ScanSearch className="w-7 h-7 mb-4" style={{ color: colors.textMuted }} />
              <p className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>No runs yet</p>
              <p className="text-sm" style={{ color: colors.textMuted }}>Trigger a scan above to get started</p>
            </div>
          ) : (
            <div
              className="rounded-lg overflow-hidden"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              {/* Table header */}
              <div
                className="hidden sm:grid gap-x-4 px-4 py-2.5"
                style={{
                  gridTemplateColumns: COL,
                  borderBottom: `1px solid ${colors.borderSubtle}`,
                  background: colors.bgSubtle,
                }}
              >
                {['Status', 'Repos', 'Results', 'Duration', 'Triggered', 'Date', '', ''].map((h, i) => (
                  <span key={i} className="text-[11px] uppercase tracking-[0.08em] font-medium" style={{ color: colors.textMuted }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {runs.map((run, idx) => {
                const isExpanded = expandedId === run.id;
                const isLast = idx === runs.length - 1;
                return (
                  <div key={run.id}>
                    <div
                      role="button"
                      tabIndex={0}
                      className="group grid gap-x-4 items-center px-4 py-3.5 cursor-pointer transition-colors duration-100"
                      style={{
                        gridTemplateColumns: COL,
                        borderBottom: !isLast || isExpanded ? `1px solid ${colors.borderSubtle}` : undefined,
                      }}
                      onClick={() => toggleRow(run.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleRow(run.id); }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = colors.bgHover; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <StatusBadge status={run.status} />
                      <span className="text-sm truncate font-mono" style={{ color: colors.textPrimary }}>
                        {fmtRepos(run.repos)}
                      </span>
                      <span className="text-sm tabular-nums font-mono" style={{ color: colors.textSecondary }}>
                        {run.results_found}
                      </span>
                      <span className="text-sm font-mono" style={{ color: colors.textSecondary }}>
                        {fmtDuration(run.duration_ms)}
                      </span>
                      <span className="text-sm truncate" style={{ color: colors.textMuted }}>
                        {run.triggered_by ?? '—'}
                      </span>
                      <span className="text-sm font-mono" style={{ color: colors.textMuted }}>
                        {fmtRelative(run.created_at)}
                      </span>
                      <div className="flex justify-end">
                        {isExpanded
                          ? <ChevronDown className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />
                          : <ChevronRight className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />
                        }
                      </div>
                      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        {confirmDeleteId === run.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={deleteRun.isPending}
                              onClick={() => {
                                if (isExpanded) setExpandedId(null);
                                deleteRun.mutate(run.id, { onSettled: () => setConfirmDeleteId(null) });
                              }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium cursor-pointer"
                              style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, color: colors.error }}
                            >
                              {deleteRun.isPending && confirmDeleteId === run.id ? '…' : 'Yes'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                              style={{ color: colors.textMuted }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(run.id)}
                            className="flex items-center justify-center w-5 h-5 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: colors.textMuted }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = colors.error; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = colors.textMuted; }}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                    {isExpanded && <ExpandedRunDetail run={run} />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Bulk export bar */}
          {runs.length > 0 && (
            <div className="flex items-center justify-end mt-3 pt-3" style={{ borderTop: `1px solid ${colors.borderSubtle}` }}>
              <button
                onClick={() => exportAllRunsCsv(runs)}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all cursor-pointer"
                style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textSecondary }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderHover; (e.currentTarget as HTMLButtonElement).style.color = colors.textPrimary; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = colors.borderDefault; (e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary; }}
              >
                <Download className="w-3.5 h-3.5" />
                Export all runs
              </button>
            </div>
          )}
        </Motion.div>
      </div>
    </div>
  );
}

export default function AutoParser() {
  const { user } = useAuth();
  const allowedEmail = import.meta.env.VITE_ALLOWED_EMAIL as string | undefined;

  if (allowedEmail && user?.email !== allowedEmail) {
    return <Navigate to="/" replace />;
  }

  return <AutoParserPage />;
}
