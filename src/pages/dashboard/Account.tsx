import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { Mail, Calendar, KeyRound, Copy, Check, Clock, RefreshCw, Plus, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/lib/auth-context';
import { apiClient } from '@/src/lib/api-client';
import { galaxySunsetTheme } from '@/src/lib/themes';

const accent = galaxySunsetTheme.btnGradient[0];

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
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer"
      style={{
        fontFamily: "'Inter', sans-serif",
        background: copied ? `${accent}14` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${copied ? accent + '40' : 'rgba(255,255,255,0.1)'}`,
        color: copied ? accent : 'rgba(255,255,255,0.45)',
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
    <div className="min-h-full dashboard-page" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="pb-10 px-5 md:px-10" style={{ maxWidth: 'calc(100% * 6 / 7)', margin: '0 auto' }}>

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.15em] mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>Settings</p>
          <h1 className="text-[32px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: 1.1 }}>Account & API Key</h1>
        </Motion.div>

        {/* Combined card */}
        <Motion.div
          {...FADE(0.08)}
          className="rounded-2xl overflow-hidden backdrop-blur-xl"
          style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT — Profile */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-start gap-5 px-7 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="relative flex-shrink-0">
                  <img src={user.avatarUrl ?? ''} alt={user.name ?? ''} className="w-16 h-16 rounded-2xl" style={{ outline: '1px solid rgba(255,255,255,0.1)' }} />
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ background: accent, borderColor: '#02060f' }}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h2 className="text-[18px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>{user.name ?? user.email}</h2>
                  <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-7 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                  <Mail className="w-3.5 h-3.5" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] mb-0.5" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>Email</p>
                  <p className="text-[13px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-7 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] mb-0.5" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>Member since</p>
                  <p className="text-[13px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{fmtLong(user.createdAt)}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-end">
                <div className="px-7 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-[10px] uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>User ID</p>
                    <code className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}>{user.id}</code>
                  </div>
                </div>
                <div className="px-7 py-4">
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl text-[13px] transition-all duration-200 cursor-pointer hover:bg-red-500/15"
                    style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
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
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accent}44`, borderTopColor: accent }} />
                </div>
              ) : keysError ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-6">
                  <AlertTriangle className="w-5 h-5 mb-3" style={{ color: '#f87171' }} />
                  <p className="text-[13px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Failed to load key</p>
                  <p className="text-[12px] mb-4" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}>Check your connection and try again.</p>
                  <button onClick={() => refetchKeys()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] cursor-pointer" style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                    <RefreshCw className="w-3.5 h-3.5" /> Retry
                  </button>
                </div>
              ) : activeKey ? (
                <>
                  <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                      <KeyRound className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-[14px] text-white font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>{activeKey.name || 'API Key'}</p>
                      <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>Key value hidden. Rotate to generate a new one.</p>
                    </div>
                  </div>
                  <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center px-4 py-2.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <code className="text-[12px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.25)' }}>
                        {activeKey.key_prefix}••••••••••••••••••••
                      </code>
                    </div>
                  </div>
                  <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="px-6 py-4" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'JetBrains Mono', monospace" }}>Created</p>
                      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>{fmtShort(activeKey.created_at)}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'JetBrains Mono', monospace" }}>Last used</p>
                      <p className="flex items-center gap-1.5 text-[13px]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                        {fmtShort(activeKey.last_used_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-end">
                    <div className="flex items-center gap-3 px-6 py-5 w-full">
                      <button
                        onClick={() => setConfirmRotate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer hover:bg-yellow-500/15"
                        style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Rotate Key
                      </button>
                      <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'Inter', sans-serif" }}>Invalidates the current key immediately.</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="p-4 rounded-2xl mb-4" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                    <KeyRound className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <p className="text-[15px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>No API key yet</p>
                  <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}>Generate a key to start authenticating requests</p>
                  <button
                    onClick={() => { setShowGenerate(true); setGenerateError(''); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif", background: `${accent}18`, border: `1px solid ${accent}44`, color: accent }}
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
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)' }}>
            <Motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.18 }} className="w-full max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-xl" style={{ background: 'rgba(10,10,15,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-xl flex-shrink-0 mt-0.5" style={{ background: `${accent}12`, border: `1px solid ${accent}28` }}>
                  <KeyRound className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div>
                  <h2 className="text-[15px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Your API Key</h2>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Inter', sans-serif" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{revealedKey.name}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 px-4 py-2.5 rounded-xl min-w-0" style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${accent}30` }}>
                  <code className="block text-[12px] truncate" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>{revealedKey.key}</code>
                </div>
                <CopyButton value={revealedKey.key} />
              </div>
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl mb-5" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
                <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(251,191,36,0.85)', fontFamily: "'Inter', sans-serif" }}>
                  This key will <strong>not be shown again</strong>. Copy it now and store it somewhere safe.
                </p>
              </div>
              <button onClick={dismissReveal} className="w-full px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer" style={{ fontFamily: "'Inter', sans-serif", background: `${accent}18`, border: `1px solid ${accent}44`, color: accent }}>
                I&apos;ve saved my key
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Generate key modal */}
      <AnimatePresence>
        {showGenerate && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={(e) => { if (e.target === e.currentTarget) { setShowGenerate(false); setKeyName(''); setGenerateError(''); } }}>
            <Motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.18 }} className="w-full max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-xl" style={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-xl flex-shrink-0 mt-0.5" style={{ background: `${accent}12`, border: `1px solid ${accent}28` }}>
                  <KeyRound className="w-4 h-4" style={{ color: accent }} />
                </div>
                <div>
                  <h2 className="text-[15px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Generate API Key</h2>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Inter', sans-serif" }}>Give your key a name so you can identify it later.</p>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (keyName.trim()) generateMutation.mutate(keyName.trim()); }}>
                <input
                  autoFocus
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value.slice(0, 64))}
                  placeholder="e.g. production"
                  className="w-full px-4 py-2.5 rounded-xl text-[13px] text-white placeholder-white/20 focus:outline-none transition-all mb-1"
                  style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.1)` }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = accent + '60'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                {generateError && <p className="text-[12px] mb-3" style={{ color: '#f87171', fontFamily: "'Inter', sans-serif" }}>{generateError}</p>}
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => { setShowGenerate(false); setKeyName(''); setGenerateError(''); }} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer" style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>Cancel</button>
                  <button type="submit" disabled={!keyName.trim() || generateMutation.isPending} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed" style={{ fontFamily: "'Inter', sans-serif", background: `${accent}18`, border: `1px solid ${accent}44`, color: accent }}>
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
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }} onClick={(e) => { if (e.target === e.currentTarget) { setConfirmRotate(false); setRotateError(''); } }}>
            <Motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.18 }} className="w-full max-w-sm rounded-2xl p-6 shadow-2xl backdrop-blur-xl" style={{ background: 'rgba(10,10,15,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-start gap-3 mb-5">
                <div className="p-2 rounded-xl flex-shrink-0 mt-0.5" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <RefreshCw className="w-4 h-4" style={{ color: '#fbbf24' }} />
                </div>
                <div>
                  <h2 className="text-[15px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Rotate API key?</h2>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Inter', sans-serif" }}>Your current key will be immediately invalidated.</p>
                </div>
              </div>
              {rotateError && <p className="text-[12px] mb-4" style={{ color: '#f87171', fontFamily: "'Inter', sans-serif" }}>{rotateError}</p>}
              <div className="flex gap-3">
                <button onClick={() => { setConfirmRotate(false); setRotateError(''); }} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer" style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}>Cancel</button>
                <button onClick={() => rotateMutation.mutate()} disabled={rotateMutation.isPending} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer disabled:opacity-40" style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
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
