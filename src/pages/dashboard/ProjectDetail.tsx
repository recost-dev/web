import { Link, useParams } from 'react-router';
import { motion as Motion } from 'motion/react';
import { ArrowLeft, FolderKanban, Layers, DollarSign, Zap, AlertTriangle, RefreshCw, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/src/lib/api-client';

const accent = '#34d399';

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

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
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl" style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)' }}>
      <AlertTriangle className="w-6 h-6 mb-3" style={{ color: '#f87171' }} />
      <p className="text-sm font-semibold text-[#fafafa] mb-1">{message}</p>
      <p className="text-sm text-[#737373] mb-5">Check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all cursor-pointer"
        style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
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
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-36 pb-24">

        {/* Back link */}
        <Motion.div {...FADE(0)} className="mb-8">
          <Link
            to="/dashboard/projects"
            className="inline-flex items-center gap-2 text-sm transition-colors text-[#525252] hover:text-[#a3a3a3]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Projects
          </Link>
        </Motion.div>

        {/* Project header */}
        {projectLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: `${accent}33`, borderTopColor: accent }} />
          </div>
        ) : projectError ? (
          <Motion.div {...FADE(0.05)}>
            <ErrorState message="Failed to load project" onRetry={() => refetchProject()} />
          </Motion.div>
        ) : project ? (
          <Motion.div {...FADE(0.05)} className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase tracking-[0.15em] text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Project</span>
            </div>
            <h1 className="text-3xl font-bold text-[#fafafa]">{project.name}</h1>
            {project.description && (
              <p className="mt-2 text-sm text-[#737373]">{project.description}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <Clock className="w-3 h-3 text-[#525252]" />
              <span className="text-xs text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                Created {fmt(project.createdAt)}
              </span>
            </div>
          </Motion.div>
        ) : null}

        {/* Scans section */}
        <Motion.div {...FADE(0.1)} className="mb-5">
          <p className="text-xs uppercase tracking-[0.15em] mb-2 text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Scans</p>
          <h2 className="text-xl font-bold text-[#fafafa]">Scan History</h2>
        </Motion.div>

        {scansLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: `${accent}33`, borderTopColor: accent }} />
          </div>
        ) : scansError ? (
          <Motion.div {...FADE(0.12)}>
            <ErrorState message="Failed to load scans" onRetry={() => refetchScans()} />
          </Motion.div>
        ) : scans.length === 0 ? (
          <Motion.div
            {...FADE(0.12)}
            className="flex flex-col items-center justify-center py-20 text-center rounded-xl"
            style={{ background: '#111111', border: '1px solid #262626' }}
          >
            <div className="p-4 rounded-xl mb-4" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
              <Layers className="w-6 h-6" style={{ color: accent }} />
            </div>
            <p className="text-[15px] font-semibold text-[#fafafa] mb-1">No scans yet</p>
            <p className="text-sm text-[#737373]">Submit a scan via the API to see results here.</p>
          </Motion.div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan, i) => (
              <Motion.div
                key={scan.id}
                {...FADE(i * 0.05)}
                className="rounded-xl overflow-hidden"
                style={{ background: '#111111', border: '1px solid #262626' }}
              >
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #1e1e1e' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                      <Layers className="w-3.5 h-3.5" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#fafafa]">Scan</p>
                      <p className="text-xs text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{fmt(scan.created_at)}</p>
                    </div>
                  </div>
                  {scan.summary?.highSeverityCount > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                      <AlertTriangle className="w-3 h-3" style={{ color: '#f87171' }} />
                      <span className="text-xs text-[#f87171]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{scan.summary.highSeverityCount} high</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 divide-x divide-[#1e1e1e]">
                  {[
                    { icon: FolderKanban, label: 'Endpoints', value: scan.summary?.totalEndpoints ?? '—' },
                    { icon: DollarSign, label: 'Monthly cost', value: scan.summary?.totalMonthlyCost != null ? fmtCost(scan.summary.totalMonthlyCost) : '—' },
                    { icon: Zap, label: 'Suggestions', value: scan.summary?.totalSuggestions ?? '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="px-5 py-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3 h-3 text-[#525252]" />
                        <p className="text-xs uppercase tracking-[0.1em] text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{label}</p>
                      </div>
                      <p className="text-base font-bold text-[#fafafa]">{value}</p>
                    </div>
                  ))}
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
