import { Link, useParams } from 'react-router';
import { motion as Motion } from 'motion/react';
import { ArrowLeft, Layers, DollarSign, Zap, AlertTriangle, RefreshCw, Clock, FolderKanban } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/api-client';
import { colors, accent, FADE } from '@/src/lib/tokens';

interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface ScanSummary {
  totalEndpoints: number;
  totalMonthlyCost: number;
  totalSuggestions: number;
  highSeverityCount: number;
}

interface Scan {
  id: string;
  project_id: string;
  created_at: string;
  summary: ScanSummary;
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtCost(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

export default function ProjectDetail() {
  const params = useParams();
  const id = params.id as string;

  const { data: project, isLoading: projectLoading, isError: projectError, refetch: refetchProject } = useQuery<Project>({
    queryKey: ['dashboard-project', id],
    queryFn: () => apiClient.get<{ data: Project }>(`/projects/${id}`).then((r) => r.data),
    enabled: !!id,
  });

  const { data: scans = [], isLoading: scansLoading, isError: scansError, refetch: refetchScans } = useQuery<Scan[]>({
    queryKey: ['dashboard-project-scans', id],
    queryFn: () => apiClient.get<{ data: Scan[] }>(`/projects/${id}/scans`).then((r) => r.data),
    enabled: !!id,
  });

  return (
    <div className="min-h-full">
      <div className="w-full px-6 md:px-10 pt-8 pb-16">

        {/* Back link */}
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
        {projectLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: colors.accentSubtle, borderTopColor: accent }} />
          </div>
        ) : projectError ? (
          <Motion.div {...FADE(0.05)}>
            <ErrorState message="Failed to load project" onRetry={() => refetchProject()} />
          </Motion.div>
        ) : project ? (
          <Motion.div {...FADE(0.05)} className="mb-10">
            <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: accent }}>Project</p>
            <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>{project.name}</h1>
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

        {/* Scans section */}
        <Motion.div {...FADE(0.1)} className="mb-5">
          <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: colors.textMuted }}>Scan history</p>
          <h2 className="text-xl font-bold" style={{ color: colors.textPrimary }}>Scans</h2>
        </Motion.div>

        {scansLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: colors.accentSubtle, borderTopColor: accent }} />
          </div>
        ) : scansError ? (
          <Motion.div {...FADE(0.12)}>
            <ErrorState message="Failed to load scans" onRetry={() => refetchScans()} />
          </Motion.div>
        ) : scans.length === 0 ? (
          <Motion.div
            {...FADE(0.12)}
            className="flex flex-col items-center justify-center py-20 text-center rounded-lg"
            style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
          >
            <Layers className="w-7 h-7 mb-4" style={{ color: colors.textMuted }} />
            <p className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>No scans yet</p>
            <p className="text-sm" style={{ color: colors.textMuted }}>Submit a scan via the API to see results here.</p>
          </Motion.div>
        ) : (
          <Motion.div {...FADE(0.12)} className="space-y-3">
            {scans.map((scan, i) => (
              <div
                key={scan.id}
                className="rounded-lg overflow-hidden"
                style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
              >
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textMuted }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                        Scan #{scans.length - i}
                      </p>
                      <p className="text-xs font-mono" style={{ color: colors.textMuted }}>{fmt(scan.created_at)}</p>
                    </div>
                  </div>
                  {scan.summary?.highSeverityCount > 0 && (
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded"
                      style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}` }}
                    >
                      <AlertTriangle className="w-3 h-3" style={{ color: colors.error }} />
                      <span className="text-xs font-mono" style={{ color: colors.error }}>
                        {scan.summary.highSeverityCount} high
                      </span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 divide-x" style={{ borderColor: colors.borderSubtle }}>
                  {[
                    { icon: Layers,      label: 'Endpoints',     value: scan.summary?.totalEndpoints ?? '—' },
                    { icon: DollarSign,  label: 'Monthly cost',  value: scan.summary?.totalMonthlyCost != null ? fmtCost(scan.summary.totalMonthlyCost) : '—' },
                    { icon: Zap,         label: 'Suggestions',   value: scan.summary?.totalSuggestions ?? '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="px-5 py-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3 h-3" style={{ color: colors.textMuted }} />
                        <p className="text-xs uppercase tracking-[0.08em]" style={{ color: colors.textMuted }}>{label}</p>
                      </div>
                      <p className="text-base font-bold font-mono" style={{ color: colors.textPrimary }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </Motion.div>
        )}
      </div>
    </div>
  );
}
