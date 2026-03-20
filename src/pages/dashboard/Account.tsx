import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { Mail, Calendar, KeyRound, Copy, Check, Clock, RefreshCw, Plus, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/lib/auth-context';
import { apiClient } from '@/src/lib/api-client';

const accent = '#34d399';
const DEV = import.meta.env.VITE_DEV_AUTH === 'true';

const MOCK_KEY: ApiKey = {
  id: 'mock-key-1',
  name: 'production',
  key_prefix: 'rk_live_',
  last_used_at: '2026-03-19T08:00:00Z',
  created_at: '2026-01-15T10:00:00Z',
};

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

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

function fmtShort(dateStr?: string | null) {
  if (!dateStr) return 'Never';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtLong(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer"
      style={{
        background: copied ? `${accent}14` : '#0d0d0d',
        border: `1px solid ${copied ? accent + '40' : '#262626'}`,
        color: copied ? accent : '#737373',
      }}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export default function Account() {
  const { user, logout } = useAuth();
  const qc = useQueryClient();

  const [revealedKey, setRevealedKey] = useState<CreatedKey | null>(null);
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [rotateError, setRotateError] = useState('');
  const [showGenerate, setShowGenerate] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [generateError, setGenerateError] = useState('');

  function openReveal(key: CreatedKey) {
    setRevealedKey(key);
    setShowRevealModal(true);
  }

  function dismissReveal() {
    setShowRevealModal(false);
    setRevealedKey(null);
  }

  const { data: keys = [], isLoading: keysLoading, isError: keysError, refetch: refetchKeys } = useQuery<ApiKey[]>({
    queryKey: ['dashboard-keys'],
    queryFn: () => apiClient.get<{ data: ApiKey[] }>('/auth/keys').then((r) => r.data),
    initialData: DEV ? [MOCK_KEY] : undefined,
    enabled: !DEV,
  });

  const activeKey = keys[0] ?? null;

  const generateMutation = useMutation({
    mutationFn: (name: string) =>
      apiClient.post<{ data: CreatedKey }>('/auth/keys', { name }).then((r) => r.data),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['dashboard-keys'] });
      setShowGenerate(false);
      setKeyName('');
      setGenerateError('');
      openReveal(created);
    },
    onError: (e: Error) => setGenerateError(e.message),
  });

  const rotateMutation = useMutation({
    mutationFn: async () => {
      const fresh = await apiClient.get<{ data: ApiKey[] }>('/auth/keys');
      const existingName = fresh.data[0]?.name ?? 'default';
      for (const k of fresh.data) {
        try { await apiClient.del(`/auth/keys/${k.id}`); } catch { /* already deleted */ }
      }
      const res = await apiClient.post<{ data: CreatedKey }>('/auth/keys', { name: existingName });
      return res.data;
    },
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['dashboard-keys'] });
      setConfirmRotate(false);
      setRotateError('');
      openReveal(created);
    },
    onError: (e: Error) => setRotateError(e.message),
  });

  if (!user) return null;

  return (
    <div className="min-h-full">
      <div className="w-full px-6 md:px-10 pt-8 pb-16">

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: accent, fontFamily: "'Geist Mono Variable', monospace" }}>Settings</p>
          <h1 className="text-3xl font-bold text-[#fafafa]">Account & API Key</h1>
        </Motion.div>

        {/* Combined card */}
        <Motion.div
          {...FADE(0.08)}
          className="rounded-xl overflow-hidden"
          style={{ background: '#111111', border: '1px solid #262626' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT — Profile */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r border-[#1e1e1e]">
              <div className="flex items-start gap-5 px-7 py-7 border-b border-[#1e1e1e]">
                <div className="relative flex-shrink-0">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name ?? ''} className="w-14 h-14 rounded-xl" style={{ outline: '1px solid #262626' }} />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: `${accent}20`, color: accent }}>
                      {(user.name ?? user.email)[0].toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ background: accent, borderColor: '#111111' }}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#fafafa]">{user.name ?? user.email}</h2>
                  <p className="text-xs mt-1 text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-7 py-4 border-b border-[#1e1e1e]">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                  <Mail className="w-3.5 h-3.5" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] mb-0.5 text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Email</p>
                  <p className="text-sm text-[#fafafa]">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-7 py-4 border-b border-[#1e1e1e]">
                <div className="p-2 rounded-lg flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] mb-0.5 text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Member since</p>
                  <p className="text-sm text-[#fafafa]">{fmtLong(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <div className="px-7 py-4 border-b border-[#1e1e1e]">
                  <div className="flex items-center justify-between w-full">
                    <p className="text-xs uppercase tracking-[0.1em] text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>User ID</p>
                    <code className="text-xs text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{user.id}</code>
                  </div>
                </div>
                <div className="px-7 py-4">
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg text-sm transition-all duration-200 cursor-pointer"
                    style={{ background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.12)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.06)'; }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT — API Key */}
            <div className="flex flex-col">
              {keysLoading ? (
                <div className="flex-1 flex items-center justify-center py-16">
                  <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: `${accent}33`, borderTopColor: accent }} />
                </div>
              ) : keysError ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-6">
                  <AlertTriangle className="w-5 h-5 mb-3" style={{ color: '#f87171' }} />
                  <p className="text-sm font-semibold text-[#fafafa] mb-1">Failed to load key</p>
                  <p className="text-xs mb-4 text-[#737373]">Check your connection and try again.</p>
                  <button onClick={() => refetchKeys()} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm cursor-pointer" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                    <RefreshCw className="w-3.5 h-3.5" /> Retry
                  </button>
                </div>
              ) : activeKey ? (
                <>
                  <div className="flex items-center gap-4 px-6 py-5 border-b border-[#1e1e1e]">
                    <div className="p-2.5 rounded-lg flex-shrink-0" style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                      <KeyRound className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#fafafa]">{activeKey.name || 'API Key'}</p>
                      <p className="text-xs mt-0.5 text-[#737373]">Key value hidden. Rotate to generate a new one.</p>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-b border-[#1e1e1e]">
                    <div className="flex items-center px-4 py-2.5 rounded-lg" style={{ background: '#0d0d0d', border: '1px solid #1e1e1e' }}>
                      <code className="text-xs text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
                        {activeKey.key_prefix}••••••••••••••••••••
                      </code>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 divide-x divide-[#1e1e1e] border-b border-[#1e1e1e]">
                    <div className="px-6 py-4">
                      <p className="text-xs uppercase tracking-[0.1em] mb-1 text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Created</p>
                      <p className="text-sm text-[#a3a3a3]">{fmtShort(activeKey.created_at)}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-xs uppercase tracking-[0.1em] mb-1 text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Last used</p>
                      <p className="flex items-center gap-1.5 text-sm text-[#a3a3a3]">
                        <Clock className="w-3.5 h-3.5 text-[#525252]" />
                        {fmtShort(activeKey.last_used_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-end">
                    <div className="flex items-center gap-3 px-6 py-5 w-full">
                      <button
                        onClick={() => setConfirmRotate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                        style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.12)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.06)'; }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Rotate Key
                      </button>
                      <p className="text-xs text-[#525252]">Invalidates the current key immediately.</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="p-4 rounded-xl mb-4" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                    <KeyRound className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <p className="text-[15px] font-semibold text-[#fafafa] mb-1">No API key yet</p>
                  <p className="text-sm text-[#737373] mb-6">Generate a key to start authenticating requests</p>
                  <button
                    onClick={() => { setShowGenerate(true); setGenerateError(''); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
                    style={{ background: `${accent}14`, border: `1px solid ${accent}30`, color: accent }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}20`; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}14`; }}
                  >
                    <Plus className="w-4 h-4" /> Generate API Key
                  </button>
                </div>
              )}
            </div>
          </div>
        </Motion.div>
      </div>

      {/* One-time key reveal modal */}
      <AnimatePresence>
        {showRevealModal && revealedKey && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
            <Motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.18 }} className="w-full max-w-sm rounded-xl p-6 shadow-2xl" style={{ background: '#111111', border: '1px solid #262626' }}>
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${accent}12`, border: `1px solid ${accent}28` }}>
                  <KeyRound className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#fafafa] mb-1">Your API Key</h2>
                  <p className="text-sm text-[#737373]">
                    <span style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{revealedKey.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 px-4 py-2.5 rounded-lg min-w-0" style={{ background: '#0d0d0d', border: `1px solid ${accent}30` }}>
                  <code className="block text-xs truncate" style={{ fontFamily: "'Geist Mono Variable', monospace", color: accent }}>{revealedKey.key}</code>
                </div>
                <CopyButton value={revealedKey.key} />
              </div>
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg mb-5" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(251,191,36,0.85)' }}>
                  This key will <strong>not be shown again</strong>. Copy it now and store it somewhere safe.
                </p>
              </div>
              <button onClick={dismissReveal} className="w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer" style={{ background: `${accent}14`, border: `1px solid ${accent}30`, color: accent }}>
                I've saved my key
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Generate key modal */}
      <AnimatePresence>
        {showGenerate && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={(e) => { if (e.target === e.currentTarget) { setShowGenerate(false); setKeyName(''); setGenerateError(''); } }}>
            <Motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.18 }} className="w-full max-w-sm rounded-xl p-6 shadow-2xl" style={{ background: '#111111', border: '1px solid #262626' }}>
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${accent}12`, border: `1px solid ${accent}28` }}>
                  <KeyRound className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#fafafa] mb-1">Generate API Key</h2>
                  <p className="text-sm text-[#737373]">Give your key a name so you can identify it later.</p>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (keyName.trim()) generateMutation.mutate(keyName.trim()); }}>
                <input
                  autoFocus
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value.slice(0, 64))}
                  placeholder="e.g. production"
                  className="w-full px-4 py-2.5 rounded-lg text-sm text-[#fafafa] placeholder-[#525252] focus:outline-none transition-all mb-1"
                  style={{ background: '#0d0d0d', border: '1px solid #262626' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = `${accent}50`; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = '#262626'; }}
                />
                {generateError && <p className="text-xs mb-3 text-[#f87171]">{generateError}</p>}
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => { setShowGenerate(false); setKeyName(''); setGenerateError(''); }} className="flex-1 px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer text-[#737373]" style={{ background: '#0d0d0d', border: '1px solid #262626' }}>Cancel</button>
                  <button type="submit" disabled={!keyName.trim() || generateMutation.isPending} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" style={{ background: `${accent}14`, border: `1px solid ${accent}30`, color: accent }}>
                    {generateMutation.isPending ? 'Generating…' : 'Generate'}
                  </button>
                </div>
              </form>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Rotate confirmation modal */}
      <AnimatePresence>
        {confirmRotate && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={(e) => { if (e.target === e.currentTarget) { setConfirmRotate(false); setRotateError(''); } }}>
            <Motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.18 }} className="w-full max-w-sm rounded-xl p-6 shadow-2xl" style={{ background: '#111111', border: '1px solid #262626' }}>
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-lg flex-shrink-0 mt-0.5" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <RefreshCw className="w-4 h-4" style={{ color: '#fbbf24' }} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-[#fafafa] mb-1">Rotate API key?</h2>
                  <p className="text-sm text-[#737373]">Your current key will be immediately invalidated.</p>
                </div>
              </div>
              {rotateError && <p className="text-xs mb-4 text-[#f87171]">{rotateError}</p>}
              <div className="flex gap-3">
                <button onClick={() => { setConfirmRotate(false); setRotateError(''); }} className="flex-1 px-4 py-2.5 rounded-lg text-sm transition-all cursor-pointer text-[#737373]" style={{ background: '#0d0d0d', border: '1px solid #262626' }}>Cancel</button>
                <button onClick={() => rotateMutation.mutate()} disabled={rotateMutation.isPending} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-40" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
                  {rotateMutation.isPending ? 'Rotating…' : 'Rotate Key'}
                </button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
