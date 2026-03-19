import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { KeyRound, Plus, Trash2, Copy, Check, Clock, X, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/apiClient';

const MAX_KEYS = 10;

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at?: string | null;
  created_at: string;
}

interface CreatedKey {
  id: string;
  key: string;
  name: string;
  key_prefix: string;
  created_at: string;
}

function fmt(dateStr?: string) {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/80 hover:bg-white/5 transition-all cursor-pointer"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function Keys() {
  const qc = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [createError, setCreateError] = useState('');
  const [newKey, setNewKey] = useState<CreatedKey | null>(null);
  const [keyVisible, setKeyVisible] = useState(false);

  const { data: keys = [], isLoading } = useQuery<ApiKey[]>({
    queryKey: ['dashboard-keys'],
    queryFn: () => apiClient.get<{ data: ApiKey[] }>('/auth/keys').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) =>
      apiClient.post<{ data: CreatedKey }>('/auth/keys', { name }).then((r) => r.data),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['dashboard-keys'] });
      setShowCreate(false);
      setNewName('');
      setCreateError('');
      setNewKey(created);
      setKeyVisible(false);
    },
    onError: (e: Error) => setCreateError(e.message),
  });

  const revokeMutation = useMutation({
    mutationFn: (id: string) => apiClient.del(`/auth/keys/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard-keys'] });
      setRevokeId(null);
    },
  });

  const atLimit = keys.length >= MAX_KEYS;

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
            <KeyRound className="w-5 h-5 text-green-400" />
            <h1
              className="text-2xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              API Keys
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}>
            {keys.length} / {MAX_KEYS} keys used
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
          title={atLimit ? `Maximum ${MAX_KEYS} keys allowed` : 'Create key'}
        >
          <Plus className="w-4 h-4" />
          Create Key
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
            You've reached the {MAX_KEYS}-key limit. Revoke a key to create a new one.
          </p>
        </Motion.div>
      )}

      {/* Newly created key banner — shown once */}
      <AnimatePresence>
        {newKey && (
          <Motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-5 rounded-2xl border border-green-500/25 bg-green-500/5"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <p className="text-sm font-semibold text-green-300" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Key created — copy it now
                </p>
                <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                  This key will not be shown again.
                </p>
              </div>
              <button
                onClick={() => setNewKey(null)}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all cursor-pointer flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-black/30">
                <code
                  className="flex-1 text-xs text-green-300 font-mono truncate"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {keyVisible ? newKey.key : `${newKey.key.slice(0, 12)}${'•'.repeat(24)}${newKey.key.slice(-4)}`}
                </code>
                <button
                  onClick={() => setKeyVisible(!keyVisible)}
                  className="text-white/30 hover:text-white/60 transition-colors cursor-pointer flex-shrink-0"
                >
                  {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <CopyButton value={newKey.key} />
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Keys list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
        </div>
      ) : keys.length === 0 ? (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <KeyRound className="w-10 h-10 text-white/10 mb-4" />
          <p className="text-base text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>
            No API keys yet
          </p>
          <p className="text-sm text-white/20 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
            Create a key to start using the EcoApi
          </p>
        </Motion.div>
      ) : (
        <div className="space-y-3">
          {keys.map((k, i) => (
            <Motion.div
              key={k.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-6 px-6 py-5 rounded-2xl border border-white/5 bg-zinc-900/50 hover:border-white/10 hover:bg-zinc-900/80 transition-all duration-200"
            >
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/15 flex-shrink-0">
                <KeyRound className="w-4 h-4 text-green-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {k.name}
                </p>
                <code
                  className="text-xs text-white/30 mt-0.5 block"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {k.key_prefix}••••••••
                </code>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-xs text-white/20" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Last used
                  </p>
                  <p className="flex items-center gap-1 text-xs text-white/30 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {fmt(k.last_used_at ?? undefined)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/20" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Created
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{fmt(k.created_at)}</p>
                </div>
                <button
                  onClick={() => setRevokeId(k.id)}
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
                  Create API Key
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
                    Key name
                  </label>
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="production, staging, local…"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-green-500/40 transition-all"
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

      {/* Revoke confirmation */}
      <AnimatePresence>
        {revokeId && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setRevokeId(null); }}
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
                  <KeyRound className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Revoke API key?
                  </h2>
                  <p className="text-sm text-white/40 mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Any application using this key will immediately lose access. This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setRevokeId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => revokeMutation.mutate(revokeId)}
                  disabled={revokeMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-40 transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {revokeMutation.isPending ? 'Revoking…' : 'Revoke'}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
