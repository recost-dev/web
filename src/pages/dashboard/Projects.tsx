import { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { FolderKanban, Plus, Trash2, Clock, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { apiClient } from '@/src/lib/api-client';
import { colors, accent, FADE } from '@/src/lib/tokens';

const MAX_PROJECTS = 20;

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
  const [deleteError, setDeleteError] = useState('');

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
      setDeleteError('');
    },
    onError: (e: Error) => setDeleteError(e.message),
  });

  const atLimit = projects.length >= MAX_PROJECTS;
  const projectToDelete = projects.find(p => p.id === deleteId);
  const NAME_LIMIT = 64;

  useEffect(() => {
    if (!showCreate) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowCreate(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [showCreate]);

  useEffect(() => {
    if (!deleteId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDeleteId(null); setDeleteError(''); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [deleteId]);

  function handleCreate(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!newName.trim()) return;
    createMutation.mutate(newName.trim());
  }

  return (
    <div className="min-h-full">
      <div className="w-full px-6 md:px-10 pt-8 pb-16">

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: accent }}>
                Projects
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.textPrimary }}>Your Projects</h1>
              <p className="mt-1 text-sm" style={{ color: colors.textMuted }}>
                {projects.length} / {MAX_PROJECTS} used
              </p>
            </div>
            <button
              onClick={() => { setShowCreate(true); setCreateError(''); }}
              disabled={atLimit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: colors.accentSubtle,
                border: `1px solid ${colors.accentBorder}`,
                color: accent,
              }}
              onMouseEnter={(e) => { if (!atLimit) (e.currentTarget as HTMLButtonElement).style.background = colors.accentHover; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.accentSubtle; }}
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
              className="flex items-center gap-3 px-4 py-3 mb-6 rounded-md"
              style={{ background: colors.warningSubtle, border: `1px solid ${colors.warningBorder}` }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: colors.warning }} />
              <p className="text-sm" style={{ color: colors.warning }}>
                You've reached the {MAX_PROJECTS}-project limit. Delete a project to create a new one.
              </p>
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Projects list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-28">
            <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: colors.accentSubtle, borderTopColor: accent }} />
          </div>
        ) : isError ? (
          <Motion.div
            {...FADE(0.1)}
            className="flex flex-col items-center justify-center py-20 text-center rounded-lg"
            style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}` }}
          >
            <AlertTriangle className="w-6 h-6 mb-3" style={{ color: colors.error }} />
            <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>Failed to load projects</p>
            <p className="text-sm mb-5" style={{ color: colors.textMuted }}>Check your connection and try again.</p>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all cursor-pointer"
              style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, color: colors.error }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </Motion.div>
        ) : projects.length === 0 ? (
          <Motion.div
            {...FADE(0.1)}
            className="flex flex-col items-center justify-center py-28 text-center rounded-lg"
            style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
          >
            <FolderKanban className="w-7 h-7 mb-4" style={{ color: colors.textMuted }} />
            <p className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>No projects yet</p>
            <p className="text-sm" style={{ color: colors.textMuted }}>Create your first project to start scanning APIs</p>
          </Motion.div>
        ) : (
          <Motion.div {...FADE(0.08)} className="space-y-2">
            {projects.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                className="group flex items-center gap-3 sm:gap-5 px-4 py-3.5 sm:px-5 sm:py-4 rounded-lg transition-all duration-150 cursor-pointer"
                style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
                onClick={() => navigate(`/dashboard/projects/${p.id}`)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/dashboard/projects/${p.id}`); }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = colors.borderHover; (e.currentTarget as HTMLDivElement).style.background = colors.bgHover; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = colors.borderDefault; (e.currentTarget as HTMLDivElement).style.background = colors.bgBase; }}
              >
                <FolderKanban className="w-4 h-4 flex-shrink-0" style={{ color: p.latestScanId ? accent : colors.textMuted }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: colors.textPrimary }}>{p.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    {p.latestScanId ? (
                      <>
                        <span className="flex items-center gap-1 text-xs font-mono" style={{ color: colors.textMuted }}>
                          <Clock className="w-3 h-3" />
                          {fmt(p.updatedAt)}
                        </span>
                        {p.endpointCount != null && (
                          <span className="text-xs" style={{ color: colors.textMuted }}>
                            {p.endpointCount} endpoint{p.endpointCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </>
                    ) : (
                      <span
                        className="text-xs px-2 py-0.5 rounded"
                        style={{ color: colors.textMuted, background: colors.bgSubtle, border: `1px solid ${colors.borderSubtle}` }}
                      >
                        No scans yet
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className="text-xs font-mono hidden sm:block" style={{ color: colors.textMuted }}>{fmt(p.createdAt)}</span>
                  <button
                    aria-label={`Delete ${p.name}`}
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                    className="opacity-30 group-hover:opacity-100 focus-visible:opacity-100 flex items-center justify-center min-h-[44px] min-w-[44px] rounded-md transition-all duration-150 cursor-pointer"
                    style={{ color: colors.textMuted }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = colors.error; (e.currentTarget as HTMLButtonElement).style.background = colors.errorSubtle; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = colors.textMuted; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </Motion.div>
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
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <Motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-dialog-title"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-lg p-6 shadow-2xl"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.12em] mb-1" style={{ color: accent }}>New</p>
                  <h2 id="create-dialog-title" className="text-base font-bold" style={{ color: colors.textPrimary }}>Create Project</h2>
                </div>
                <button
                  aria-label="Close"
                  onClick={() => setShowCreate(false)}
                  className="p-1.5 rounded-md transition-all cursor-pointer"
                  style={{ color: colors.textMuted }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.bgHover; (e.currentTarget as HTMLButtonElement).style.color = colors.textSecondary; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = colors.textMuted; }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label htmlFor="project-name" className="block text-xs uppercase tracking-[0.1em] mb-2" style={{ color: colors.textMuted }}>
                    Project name
                  </label>
                  <input
                    id="project-name"
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value.slice(0, NAME_LIMIT))}
                    placeholder="my-api-project"
                    maxLength={NAME_LIMIT}
                    className="w-full px-4 py-2.5 rounded-md text-sm placeholder-[#525252] focus:outline-none transition-all"
                    style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textPrimary }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = colors.accentBorder; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = colors.borderDefault; }}
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    {createError
                      ? <p className="text-xs" style={{ color: colors.error }}>{createError}</p>
                      : <span />
                    }
                    <p className="text-xs tabular-nums" style={{ color: newName.length >= NAME_LIMIT ? colors.error : colors.textMuted }}>
                      {newName.length}/{NAME_LIMIT}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-2.5 rounded-md text-sm transition-all cursor-pointer"
                    style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textMuted }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim() || createMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: colors.accentSubtle, border: `1px solid ${colors.accentBorder}`, color: accent }}
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
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setDeleteId(null); setDeleteError(''); } }}
          >
            <Motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-lg p-6 shadow-2xl"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <div className="flex items-start gap-3 mb-5">
                <Trash2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.error }} />
                <div className="min-w-0">
                  <h2 id="delete-dialog-title" className="text-[15px] font-bold mb-1" style={{ color: colors.textPrimary }}>
                    Delete &ldquo;<span className="truncate">{projectToDelete?.name ?? 'this project'}</span>&rdquo;?
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textMuted }}>
                    This permanently deletes the project and all its scans. Cannot be undone.
                  </p>
                </div>
              </div>
              {deleteError && (
                <p className="text-xs mb-4 px-3 py-2 rounded-md" style={{ color: colors.error, background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}` }}>
                  {deleteError}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeleteId(null); setDeleteError(''); }}
                  className="flex-1 px-4 py-2.5 rounded-md text-sm transition-all cursor-pointer"
                  style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textMuted }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId!)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer disabled:opacity-40"
                  style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, color: colors.error }}
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
