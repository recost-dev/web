'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion as Motion } from 'motion/react';
import {
  ArrowLeft,
  FolderKanban,
  Layers,
  DollarSign,
  Zap,
  AlertTriangle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/app/lib/api-client';
import { galaxySunsetTheme } from '@/app/lib/themes';

const accent = galaxySunsetTheme.btnGradient[0];

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
    <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl" style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)' }}>
      <AlertTriangle className="w-6 h-6 mb-3" style={{ color: '#f87171' }} />
      <p className="text-[14px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>{message}</p>
      <p className="text-[13px] mb-5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}>Check your connection and try again.</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] transition-all cursor-pointer"
        style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  );
}

export default function ProjectDetail() {
  const params = useParams();
  const id = params?.id as string;

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
    <div className="min-h-full flex flex-col items-center px-6 md:px-10 pb-10 dashboard-page" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-2xl">

        {/* Back link */}
        <Motion.div {...FADE(0)} className="mb-6">
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center gap-2 text-[13px] transition-colors hover:text-white/70"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Projects
          </Link>
        </Motion.div>

        {/* Project header */}
        {projectLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accent}44`, borderTopColor: accent }} />
          </div>
        ) : projectError ? (
          <Motion.div {...FADE(0.05)}>
            <ErrorState message="Failed to load project" onRetry={() => refetchProject()} />
          </Motion.div>
        ) : project ? (
          <Motion.div {...FADE(0.05)} className="mb-8">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-[0.15em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>Project</span>
            </div>
            <h1 className="text-[28px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: 1.1 }}>{project.name}</h1>
            {project.description && (
              <p className="mt-1 text-[13px]" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Inter', sans-serif" }}>{project.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.2)' }} />
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>
                Created {fmt(project.createdAt)}
              </span>
            </div>
          </Motion.div>
        ) : null}

        {/* Scans section */}
        <Motion.div {...FADE(0.1)}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.15em]" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>Scans</span>
          </div>
          <h2 className="text-[18px] text-white mb-4" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Scan History</h2>
        </Motion.div>

        {scansLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accent}44`, borderTopColor: accent }} />
          </div>
        ) : scansError ? (
          <Motion.div {...FADE(0.12)}>
            <ErrorState message="Failed to load scans" onRetry={() => refetchScans()} />
          </Motion.div>
        ) : scans.length === 0 ? (
          <Motion.div
            {...FADE(0.12)}
            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="p-4 rounded-2xl mb-4" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
              <Layers className="w-6 h-6" style={{ color: accent }} />
            </div>
            <p className="text-[15px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>No scans yet</p>
            <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}>Submit a scan via the API to see results here.</p>
          </Motion.div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan, i) => (
              <Motion.div
                key={scan.id}
                {...FADE(i * 0.05)}
                className="rounded-2xl backdrop-blur-xl"
                style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                      <Layers className="w-3.5 h-3.5" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-[13px] text-white font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>Scan</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)', fontFamily: "'JetBrains Mono', monospace" }}>{fmt(scan.created_at)}</p>
                    </div>
                  </div>
                  {scan.summary?.highSeverityCount > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                      <AlertTriangle className="w-3 h-3" style={{ color: '#f87171' }} />
                      <span className="text-[11px]" style={{ color: '#f87171', fontFamily: "'JetBrains Mono', monospace" }}>{scan.summary.highSeverityCount} high</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 divide-x" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                  {[
                    { icon: FolderKanban, label: 'Endpoints', value: scan.summary?.totalEndpoints ?? '—' },
                    { icon: DollarSign, label: 'Monthly cost', value: scan.summary?.totalMonthlyCost != null ? fmtCost(scan.summary.totalMonthlyCost) : '—' },
                    { icon: Zap, label: 'Suggestions', value: scan.summary?.totalSuggestions ?? '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="px-5 py-4">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.3)' }} />
                        <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'JetBrains Mono', monospace" }}>{label}</p>
                      </div>
                      <p className="text-[15px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{value}</p>
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
