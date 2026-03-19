import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { Mail, Calendar, KeyRound, Copy, Check, Clock, Eye, EyeOff, RefreshCw, Plus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../theme-context';
import { apiClient } from '../../lib/apiClient';

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

function CopyButton({ value, accent }: { value: string; accent: string }) {
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

const SESSION_KEY = 'ecoapi_revealed_key';

function loadSavedKey(): CreatedKey | null {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null'); }
  catch { return null; }
}

export default function Account() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const accent = theme.btnGradient[0];
  const qc = useQueryClient();

  const [revealedKey, setRevealedKey] = useState<CreatedKey | null>(loadSavedKey);
  const [keyVisible, setKeyVisible] = useState(false);
  const [confirmRotate, setConfirmRotate] = useState(false);
  const [rotateError, setRotateError] = useState('');

  function saveKey(key: CreatedKey | null) {
    if (key) sessionStorage.setItem(SESSION_KEY, JSON.stringify(key));
    else sessionStorage.removeItem(SESSION_KEY);
    setRevealedKey(key);
  }

  const { data: keys = [], isLoading: keysLoading } = useQuery<ApiKey[]>({
    queryKey: ['dashboard-keys'],
    queryFn: () => apiClient.get<{ data: ApiKey[] }>('/auth/keys').then((r) => r.data),
  });

  const activeKey = keys[0] ?? null;

  const generateMutation = useMutation({
    mutationFn: () =>
      apiClient.post<{ data: CreatedKey }>('/auth/keys', { name: 'default' }).then((r) => r.data),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['dashboard-keys'] });
      saveKey(created);
      setKeyVisible(false);
    },
  });

  const rotateMutation = useMutation({
    mutationFn: async () => {
      const fresh = await apiClient.get<{ data: ApiKey[] }>('/auth/keys');
      for (const k of fresh.data) {
        try { await apiClient.del(`/auth/keys/${k.id}`); } catch { /* already deleted */ }
      }
      const res = await apiClient.post<{ data: CreatedKey }>('/auth/keys', { name: 'default' });
      return res.data;
    },
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['dashboard-keys'] });
      saveKey(created);
      setKeyVisible(false);
      setConfirmRotate(false);
      setRotateError('');
    },
    onError: (e: Error) => setRotateError(e.message),
  });

  if (!user) return null;

  return (
    <div
      className="min-h-full dashboard-page"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="pb-10 px-5 md:px-10" style={{ maxWidth: 'calc(100% * 6 / 7)', margin: '0 auto' }}>

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <p
            className="text-[10px] uppercase tracking-[0.15em] mb-1"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}
          >
            Settings
          </p>
          <h1
            className="text-[32px] text-white"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: 1.1 }}
          >
            Account & API Key
          </h1>
        </Motion.div>

        {/* Combined card — profile left, API key right */}
        <Motion.div
          {...FADE(0.08)}
          className="rounded-2xl overflow-hidden backdrop-blur-xl"
          style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT — Profile */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              {/* Avatar + name */}
              <div className="flex items-start gap-5 px-7 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatarUrl ?? ''}
                    alt={user.name ?? ''}
                    className="w-16 h-16 rounded-2xl"
                    style={{ outline: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ background: accent, borderColor: '#02060f' }}
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h2 className="text-[18px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
                    {user.name ?? user.email}
                  </h2>
                  <p className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 px-7 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                  <Mail className="w-3.5 h-3.5" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] mb-0.5" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>Email</p>
                  <p className="text-[13px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{user.email}</p>
                </div>
              </div>

              {/* Member since */}
              <div className="flex items-center gap-4 px-7 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="p-2 rounded-xl flex-shrink-0" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                  <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.1em] mb-0.5" style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}>Member since</p>
                  <p className="text-[13px] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>{fmtLong(user.createdAt)}</p>
                </div>
              </div>

              {/* User ID + sign out — pinned to bottom */}
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
                    className="px-4 py-2 rounded-xl text-[13px] transition-all duration-200 cursor-pointer"
                    style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}
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
                  <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: `${accent}44`, borderTopColor: accent }} />
                </div>
              ) : activeKey ? (
                <>
                  {/* Icon + label */}
                  <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="p-3 rounded-xl flex-shrink-0" style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                      <KeyRound className="w-5 h-5" style={{ color: accent }} />
                    </div>
                    <div>
                      <p className="text-[14px] text-white font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>API Key</p>
                      <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>
                        {revealedKey ? 'Your key is shown below — copy and store it safely.' : 'Key value hidden. Rotate to generate a new one.'}
                      </p>
                    </div>
                  </div>

                  {/* Key value */}
                  <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {revealedKey ? (
                      <div className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl min-w-0" style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <code className="flex-1 text-[12px] truncate" style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}>
                            {keyVisible ? revealedKey.key : `${revealedKey.key.slice(0, 12)}${'•'.repeat(24)}${revealedKey.key.slice(-4)}`}
                          </code>
                          <button
                            onClick={() => setKeyVisible(!keyVisible)}
                            className="transition-colors cursor-pointer flex-shrink-0"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)'; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; }}
                          >
                            {keyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <CopyButton value={revealedKey.key} accent={accent} />
                      </div>
                    ) : (
                      <div className="flex items-center px-4 py-2.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <code className="text-[12px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.25)' }}>
                          {activeKey.key_prefix}••••••••••••••••••••
                        </code>
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="px-6 py-4" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                      <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'JetBrains Mono', monospace" }}>Created</p>
                      <p className="text-[13px]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
                        {fmtShort(revealedKey?.created_at ?? activeKey.created_at)}
                      </p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'JetBrains Mono', monospace" }}>Last used</p>
                      <p className="flex items-center gap-1.5 text-[13px]" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif" }}>
                        <Clock className="w-3.5 h-3.5 opacity-50" />
                        {revealedKey ? 'Never' : fmtShort(activeKey.last_used_at)}
                      </p>
                    </div>
                  </div>

                  {/* Rotate — pinned to bottom */}
                  <div className="flex-1 flex items-end">
                    <div className="flex items-center gap-3 px-6 py-5 w-full">
                      <button
                        onClick={() => setConfirmRotate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer"
                        style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.12)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.06)'; }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        Rotate Key
                      </button>
                      <p className="text-[12px]" style={{ color: 'rgba(255,255,255,0.22)', fontFamily: "'Inter', sans-serif" }}>
                        Invalidates the current key immediately.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                  <div className="p-4 rounded-2xl mb-4" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
                    <KeyRound className="w-6 h-6" style={{ color: accent }} />
                  </div>
                  <p className="text-[15px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>No API key yet</p>
                  <p className="text-[13px] mb-6" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}>
                    Generate a key to start authenticating requests
                  </p>
                  <button
                    onClick={() => generateMutation.mutate()}
                    disabled={generateMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer disabled:opacity-40"
                    style={{ fontFamily: "'Inter', sans-serif", background: `${accent}18`, border: `1px solid ${accent}44`, color: accent }}
                  >
                    <Plus className="w-4 h-4" />
                    {generateMutation.isPending ? 'Generating…' : 'Generate API Key'}
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Usage hint — full width bottom strip */}
          {activeKey && revealedKey && (
            <div className="px-7 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[10px] uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}>Usage</p>
              <code className="text-[12px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.4)' }}>
                Authorization: Bearer {revealedKey.key.slice(0, 12)}••••
              </code>
            </div>
          )}
        </Motion.div>

      </div>

      {/* Rotate confirmation modal */}
      <AnimatePresence>
        {confirmRotate && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setConfirmRotate(false); setRotateError(''); } }}
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
                <div className="p-2 rounded-xl flex-shrink-0 mt-0.5" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                  <RefreshCw className="w-4 h-4" style={{ color: '#fbbf24' }} />
                </div>
                <div>
                  <h2 className="text-[15px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Rotate API key?</h2>
                  <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Inter', sans-serif" }}>
                    Your current key will be immediately invalidated. Any apps using it will stop working until updated with the new key.
                  </p>
                </div>
              </div>
              {rotateError && (
                <p className="text-[12px] mb-4" style={{ color: '#f87171', fontFamily: "'Inter', sans-serif" }}>{rotateError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => { setConfirmRotate(false); setRotateError(''); }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] transition-all cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => rotateMutation.mutate()}
                  disabled={rotateMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer disabled:opacity-40"
                  style={{ fontFamily: "'Inter', sans-serif", background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}
                >
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
