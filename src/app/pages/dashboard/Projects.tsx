import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { FolderKanban, Plus, Trash2, Calendar, Clock, X, AlertTriangle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

const MAX_PROJECTS = 20;

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
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');

  const { data: projects = [], isLoading } = useQuery<Project[]>({
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
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <FolderKanban className="w-5 h-5 text-green-400" />
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Projects
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>
            {projects.length} / {MAX_PROJECTS} projects used
          </p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setCreateError(''); }}
          disabled={atLimit}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            atLimit
              ? 'bg-white/5 text-white/20 cursor-not-allowed'
              : 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 cursor-pointer'
          }`}
          style={{ fontFamily: "'Inter', sans-serif" }}
          title={atLimit ? `Maximum ${MAX_PROJECTS} projects allowed` : 'Create project'}
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Limit banner */}
      {atLimit && (
        <Motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5"
        >
          <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-sm text-yellow-300/70" style={{ fontFamily: "'Inter', sans-serif" }}>
            You've reached the {MAX_PROJECTS}-project limit. Delete a project to create a new one.
          </p>
        </Motion.div>
      )}

      {/* Projects list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <FolderKanban className="w-10 h-10 text-white/10 mb-4" />
          <p className="text-base text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>
            No projects yet
          </p>
          <p className="text-sm text-white/20 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            Create your first project to start scanning APIs
          </p>
        </Motion.div>
      ) : (
        <div className="space-y-3">
          {projects.map((p, i) => (
            <Motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-6 px-6 py-5 rounded-2xl border border-white/5 bg-zinc-900/50 hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-200"
            >
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/15 flex-shrink-0">
                <FolderKanban className="w-4 h-4 text-green-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {p.name}
                </p>
                <div className="flex items-center gap-4 mt-1">
                  {p.description && (
                    <span className="text-xs text-white/30 truncate max-w-[240px]" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {p.description}
                    </span>
                  )}
                  {p.latestScanId && (
                    <span className="flex items-center gap-1 text-xs text-white/30">
                      <Clock className="w-3 h-3" />
                      Last scanned {fmt(p.updatedAt)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="flex items-center gap-1.5 text-xs text-white/20" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Calendar className="w-3 h-3" />
                  {fmt(p.createdAt)}
                </span>
                <button
                  onClick={() => setDeleteId(p.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Motion.div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <AnimatePresence>
        {showCreate && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false); }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                  New Project
                </h2>
                <button
                  onClick={() => setShowCreate(false)}
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-medium text-white/50 mb-2"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Project name
                  </label>
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="my-api-project"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-green-500/40 focus:bg-white/8 transition-all"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  {createError && (
                    <p className="text-xs text-red-400 mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {createError}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreate(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newName.trim() || createMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-sm font-medium text-green-400 hover:bg-green-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif" }}
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
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleteId(null); }}
          >
            <Motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 flex-shrink-0 mt-0.5">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Delete project?
                  </h2>
                  <p className="text-sm text-white/40 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    This will permanently delete the project and all its scans. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(deleteId)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-40 transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
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
