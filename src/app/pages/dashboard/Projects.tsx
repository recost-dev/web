import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { FolderKanban, Plus, Trash2, Clock, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { apiClient } from '../../lib/apiClient';
import { useTheme } from '../../theme-context';

const MAX_PROJECTS = 20;

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
}

function fmt(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Projects() {
  const theme = useTheme();
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
    <div
      className="min-h-full flex flex-col items-center px-6 md:px-10 pb-10 dashboard-page"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-2xl">

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.btnGradient[0] }}
                >
                  Projects
                </span>
              </div>
              <h1
                className="text-[32px] text-white"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: 1.1 }}
              >
                Your Projects
              </h1>
              <p
                className="mt-1 text-[13px]"
                style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'JetBrains Mono', monospace" }}
              >
                {projects.length} / {MAX_PROJECTS} used
              </p>
            </div>

            <button
              onClick={() => { setShowCreate(true); setCreateError(''); }}
              disabled={atLimit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: atLimit ? 'rgba(255,255,255,0.04)' : `${theme.btnGradient[0]}18`,
                border: `1px solid ${atLimit ? 'rgba(255,255,255,0.08)' : theme.btnGradient[0] + '44'}`,
                color: atLimit ? 'rgba(255,255,255,0.2)' : theme.btnGradient[0],
              }}
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
              className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl"
              style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#fbbf24' }} />
              <p className="text-[13px]" style={{ color: 'rgba(251,191,36,0.8)', fontFamily: "'Inter', sans-serif" }}>
                You've reached the {MAX_PROJECTS}-project limit. Delete a project to create a new one.
              </p>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Projects list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-28">
            <div
              className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${theme.btnGradient[0]}44`, borderTopColor: theme.btnGradient[0] }}
            />
          </div>
        ) : isError ? (
          <Motion.div
            {...FADE(0.1)}
            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
            style={{ background: 'rgba(248,113,113,0.04)', border: '1px solid rgba(248,113,113,0.15)' }}
          >
            <AlertTriangle className="w-6 h-6 mb-3" style={{ color: '#f87171' }} />
            <p className="text-[14px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
              Failed to load projects
            </p>
            <p className="text-[13px] mb-5" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}>
              Check your connection and try again.
            </p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] transition-all cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </Motion.div>
        ) : projects.length === 0 ? (
          <Motion.div
            {...FADE(0.1)}
            className="flex flex-col items-center justify-center py-28 text-center rounded-2xl"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="p-4 rounded-2xl mb-4"
              style={{ background: `${theme.btnGradient[0]}12`, border: `1px solid ${theme.btnGradient[0]}25` }}
            >
              <FolderKanban className="w-6 h-6" style={{ color: theme.btnGradient[0] }} />
            </div>
            <p
              className="text-[15px] text-white mb-1"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
            >
              No projects yet
            </p>
            <p
              className="text-[13px]"
              style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}
            >
              Create your first project to start scanning APIs
            </p>
          </Motion.div>
        ) : (
          <div className="space-y-3">
            {projects.map((p, i) => (
              <Motion.div
                key={p.id}
                {...FADE(i * 0.06)}
                className="group flex items-center gap-5 px-6 py-5 rounded-2xl backdrop-blur-xl transition-all duration-200 cursor-pointer"
                style={{
                  background: 'rgba(0,0,0,0.45)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onClick={() => navigate(`/dashboard/projects/${p.id}`)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.6)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,0,0,0.45)';
                }}
              >
                {/* Icon */}
                <div
                  className="p-2.5 rounded-xl flex-shrink-0"
                  style={{
                    background: `${theme.btnGradient[0]}14`,
                    border: `1px solid ${theme.btnGradient[0]}28`,
                  }}
                >
                  <FolderKanban className="w-4 h-4" style={{ color: theme.btnGradient[0] }} />
                </div>

                {/* Name + meta */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[14px] text-white font-semibold truncate"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {p.name}
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    {p.description && (
                      <span
                        className="text-[11px] truncate max-w-[200px]"
                        style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}
                      >
                        {p.description}
                      </span>
                    )}
                    {p.latestScanId && (
                      <span
                        className="flex items-center gap-1 text-[11px]"
                        style={{ color: 'rgba(255,255,255,0.28)', fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <Clock className="w-3 h-3" />
                        scanned {fmt(p.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Created date + delete */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span
                    className="text-[11px]"
                    style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {fmt(p.createdAt)}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all duration-150 cursor-pointer"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = '#f87171';
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.25)';
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    }}
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
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
              style={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.15em] mb-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: theme.btnGradient[0] }}
                  >
                    New
                  </p>
                  <h2
                    className="text-[16px] text-white"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                  >
                    Create Project
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-1.5 rounded-lg transition-all cursor-pointer"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label
                    className="block text-[11px] uppercase tracking-[0.1em] mb-2"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.35)' }}
                  >
                    Project name
                  </label>
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="my-api-project"
                    className="w-full px-4 py-2.5 rounded-xl text-[13px] text-white placeholder-white/20 focus:outline-none transition-all"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = theme.btnGradient[0] + '60'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                  {createError && (
                    <p
                      className="text-[12px] mt-2"
                      style={{ color: '#f87171', fontFamily: "'Inter', sans-serif" }}
                    >
                      {createError}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim() || createMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      background: `${theme.btnGradient[0]}18`,
                      border: `1px solid ${theme.btnGradient[0]}44`,
                      color: theme.btnGradient[0],
                    }}
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
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-xl"
              style={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-start gap-3 mb-5">
                <div
                  className="p-2 rounded-xl flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)' }}
                >
                  <Trash2 className="w-4 h-4" style={{ color: '#f87171' }} />
                </div>
                <div>
                  <h2
                    className="text-[15px] text-white mb-1"
                    style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
                  >
                    Delete project?
                  </h2>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Inter', sans-serif" }}
                  >
                    This permanently deletes the project and all its scans. Cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer disabled:opacity-40"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.25)',
                    color: '#f87171',
                  }}
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
