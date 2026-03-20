import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { FolderKanban, Plus, Trash2, Clock, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { apiClient } from '@/src/lib/api-client';

const accent = '#34d399';
const MAX_PROJECTS = 20;
const DEV = import.meta.env.VITE_DEV_AUTH === 'true';

const MOCK_PROJECTS: Project[] = [
  { id: 'mock-1', name: 'my-backend-api', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-03-10T14:30:00Z', latestScanId: 'scan-1', endpointCount: 24 },
  { id: 'mock-2', name: 'payment-service', createdAt: '2026-02-01T09:00:00Z', updatedAt: '2026-03-18T11:00:00Z', latestScanId: 'scan-2', endpointCount: 7 },
  { id: 'mock-3', name: 'analytics-worker', createdAt: '2026-03-01T12:00:00Z', updatedAt: '2026-03-01T12:00:00Z' },
];

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
  latestScanId?: string;
  endpointCount?: number;
}

function fmt(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Projects() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');

  const { data: projects = [], isLoading, isError, refetch } = useQuery<Project[]>({
    queryKey: ['dashboard-projects'],
    queryFn: () =>
      apiClient.get<{ data: Project[]; pagination: unknown }>('/projects').then((r) => r.data),
    initialData: DEV ? MOCK_PROJECTS : undefined,
    enabled: !DEV,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      apiClient.post<{ data: Project }>('/projects', { name }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-projects'] });
      setShowCreate(false);
      setNewName('');
      setCreateError('');
    },
    onError: (e: Error) => setCreateError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.del(`/projects/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-projects'] });
      setDeleteId(null);
    },
  });

  const atLimit = projects.length >= MAX_PROJECTS;

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    createMutation.mutate(newName.trim());
  }

  return (
    <div className="min-h-full">
      <div className="max-w-5xl mx-auto px-6 md:px-10 pt-36 pb-24">

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: accent, fontFamily: "'Geist Mono Variable', monospace" }}>
                Projects
              </p>
              <h1 className="text-3xl font-bold text-[#fafafa]">Your Projects</h1>
              <p className="mt-1 text-sm" style={{ color: '#525252', fontFamily: "'Geist Mono Variable', monospace" }}>
                {projects.length} / {MAX_PROJECTS} used
              </p>
            </div>
            <button
              onClick={() => { setShowCreate(true); setCreateError(''); }}
              disabled={atLimit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: `${accent}14`,
                border: `1px solid ${accent}30`,
                color: accent,
              }}
              onMouseEnter={(e) => { if (!atLimit) (e.currentTarget as HTMLButtonElement).style.background = `${accent}20`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}14`; }}
            >
              <Plus className="w-3.5 h-3.5" />
              New Project
            </button>
          </div>
        </Motion.div>

        {/* Limit banner */}
        <AnimatePresence>
          {atLimit && (
            <Motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 px-4 py-3 mb-6 rounded-lg"
              style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
              <p className="text-sm" style={{ color: 'rgba(251,191,36,0.8)' }}>
                You've reached the {MAX_PROJECTS}-project limit. Delete a project to create a new one.
              </p>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Projects list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-28">
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: `${accent}33`, borderTopColor: accent }} />
          </div>
        ) : isError ? (
          <Motion.div
            {...FADE(0.1)}
            className="flex flex-col items-center justify-center py-20 text-center rounded-xl"
            style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)' }}
          >
            <AlertTriangle className="w-6 h-6 mb-3" style={{ color: '#f87171' }} />
            <p className="text-sm font-semibold text-[#fafafa] mb-1">Failed to load projects</p>
            <p className="text-sm mb-5 text-[#737373]">Check your connection and try again.</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all cursor-pointer"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </Motion.div>
        ) : projects.length === 0 ? (
          <Motion.div
            {...FADE(0.1)}
            className="flex flex-col items-center justify-center py-28 text-center rounded-xl"
            style={{ background: '#111111', border: '1px solid #262626' }}
          >
            <div className="p-4 rounded-xl mb-4" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
              <FolderKanban className="w-6 h-6" style={{ color: accent }} />
            </div>
            <p className="text-[15px] font-semibold text-[#fafafa] mb-1">No projects yet</p>
            <p className="text-sm text-[#737373]">Create your first project to start scanning APIs</p>
          </Motion.div>
        ) : (
          <div className="space-y-2">
            {projects.map((p, i) => (
              <Motion.div
                key={p.id}
                {...FADE(i * 0.06)}
                className="group flex items-center gap-5 px-5 py-4 rounded-xl transition-all duration-200 cursor-pointer"
                style={{ background: '#111111', border: '1px solid #262626' }}
                onClick={() => navigate(`/dashboard/projects/${p.id}`)}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2a2a2a'; (e.currentTarget as HTMLDivElement).style.background = '#161616'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = '#262626'; (e.currentTarget as HTMLDivElement).style.background = '#111111'; }}
              >
                <div className="p-2.5 rounded-lg flex-shrink-0" style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                  <FolderKanban className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#fafafa] truncate">{p.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {p.latestScanId ? (
                      <>
                        <span className="flex items-center gap-1 text-xs text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                          <Clock className="w-3 h-3" />
                          scanned {fmt(p.updatedAt)}
                        </span>
                        <span className="text-xs text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                          {p.endpointCount != null ? `${p.endpointCount} endpoint${p.endpointCount === 1 ? '' : 's'}` : '—'}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-md text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace", background: '#0d0d0d', border: '1px solid #1e1e1e' }}>
                        No scans yet
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{fmt(p.createdAt)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md transition-all duration-150 cursor-pointer"
                    style={{ color: '#525252' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.08)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#525252'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-xl p-6 shadow-2xl"
              style={{ background: '#111111', border: '1px solid #262626' }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] mb-1" style={{ color: accent, fontFamily: "'Geist Mono Variable', monospace" }}>New</p>
                  <h2 className="text-base font-bold text-[#fafafa]">Create Project</h2>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-1.5 rounded-md transition-all cursor-pointer"
                  style={{ color: '#525252' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; (e.currentTarget as HTMLButtonElement).style.color = '#a3a3a3'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#525252'; }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color: '#525252', fontFamily: "'Geist Mono Variable', monospace" }}>
                    Project name
                  </label>
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="my-api-project"
                    className="w-full px-4 py-2.5 rounded-lg text-sm text-[#fafafa] placeholder-[#525252] focus:outline-none transition-all"
                    style={{ background: '#0d0d0d', border: '1px solid #262626' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = `${accent}50`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = '#262626'; }}
                  />
                  {createError && <p className="text-xs mt-2 text-[#f87171]">{createError}</p>}
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer text-[#737373]"
                    style={{ background: '#0d0d0d', border: '1px solid #262626' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim() || createMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: `${accent}14`, border: `1px solid ${accent}30`, color: accent }}
                  >
                    {createMutation.isPending ? 'Creating…' : 'Create'}
                  </button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-xl p-6 shadow-2xl"
              style={{ background: '#111111', border: '1px solid #262626' }}
            >
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-lg flex-shrink-0 mt-0.5" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                  <Trash2 className="w-4 h-4" style={{ color: '#f87171' }} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#fafafa] mb-1">Delete project?</h2>
                  <p className="text-sm leading-relaxed text-[#737373]">
                    This permanently deletes the project and all its scans. Cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer text-[#737373]"
                  style={{ background: '#0d0d0d', border: '1px solid #262626' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-40"
                  style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
                >
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
