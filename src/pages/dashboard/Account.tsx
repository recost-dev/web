import { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { Mail, Calendar, KeyRound, Copy, Check, Clock, RefreshCw, Plus, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/src/lib/auth-context';
import { apiClient } from '@/src/lib/api-client';
import { colors, accent, FADE } from '@/src/lib/tokens';

const DEV = import.meta.env.VITE_DEV_AUTH === 'true';

const MOCK_KEY: ApiKey = {
  id: 'mock-key-1',
  name: 'production',
  key_prefix: 'rc-',
  last_used_at: '2026-03-19T08:00:00Z',
  created_at: '2026-01-15T10:00:00Z',
};

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
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all cursor-pointer"
      style={{
        background: copied ? colors.accentSubtle : colors.bgSubtle,
        border: `1px solid ${copied ? colors.accentBorder : colors.borderDefault}`,
        color: copied ? accent : colors.textMuted,
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
          <p className="text-xs uppercase tracking-[0.12em] mb-2" style={{ color: accent }}>Settings</p>
          <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Account & API Key</h1>
        </Motion.div>

        {/* Combined card */}
        <Motion.div
          {...FADE(0.08)}
          className="rounded-lg overflow-hidden"
          style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* LEFT — Profile */}
            <div className="flex flex-col border-b lg:border-b-0 lg:border-r" style={{ borderColor: colors.borderSubtle }}>

              {/* Avatar + name */}
              <div className="flex items-start gap-5 px-7 py-7" style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                <div className="relative flex-shrink-0">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name ?? ''}
                      className="w-14 h-14 rounded-md"
                      loading="lazy"
                      decoding="async"
                      style={{ outline: `1px solid ${colors.borderDefault}` }}
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-md flex items-center justify-center text-lg font-bold"
                      style={{ background: colors.accentSubtle, color: accent }}
                    >
                      {(user.name ?? user.email)[0].toUpperCase()}
                    </div>
                  )}
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{ background: accent, borderColor: colors.bgBase }}
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: colors.textPrimary }}>{user.name ?? user.email}</h2>
                  <p className="text-xs mt-1 font-mono" style={{ color: colors.textMuted }}>{user.email}</p>
                </div>
              </div>

              {/* Email row */}
              <div className="flex items-center gap-4 px-7 py-4" style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textMuted }} />
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] mb-0.5" style={{ color: colors.textMuted }}>Email</p>
                  <p className="text-sm" style={{ color: colors.textPrimary }}>{user.email}</p>
                </div>
              </div>

              {/* Member since row */}
              <div className="flex items-center gap-4 px-7 py-4" style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" style={{ color: colors.textMuted }} />
                <div>
                  <p className="text-xs uppercase tracking-[0.1em] mb-0.5" style={{ color: colors.textMuted }}>Member since</p>
                  <p className="text-sm" style={{ color: colors.textPrimary }}>{fmtLong(user.createdAt)}</p>
                </div>
              </div>

              {/* User ID + sign out */}
              <div className="flex-1 flex flex-col justify-end">
                <div className="px-7 py-4" style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                  <div className="flex items-center justify-between w-full">
                    <p className="text-xs uppercase tracking-[0.1em]" style={{ color: colors.textMuted }}>User ID</p>
                    <code className="text-xs font-mono" style={{ color: colors.textMuted }}>{user.id}</code>
                  </div>
                </div>
                <div className="px-7 py-4">
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-md text-sm transition-all duration-200 cursor-pointer"
                    style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, color: colors.error }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.14)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.errorSubtle; }}
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
                  <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: colors.accentSubtle, borderTopColor: accent }} />
                </div>
              ) : keysError ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-6">
                  <AlertTriangle className="w-5 h-5 mb-3" style={{ color: colors.error }} />
                  <p className="text-sm font-semibold mb-1" style={{ color: colors.textPrimary }}>Failed to load key</p>
                  <p className="text-xs mb-4" style={{ color: colors.textMuted }}>Check your connection and try again.</p>
                  <button
                    onClick={() => refetchKeys()}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm cursor-pointer"
                    style={{ background: colors.errorSubtle, border: `1px solid ${colors.errorBorder}`, color: colors.error }}
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retry
                  </button>
                </div>
              ) : activeKey ? (
                <>
                  {/* Key header */}
                  <div className="flex items-center gap-4 px-6 py-5" style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                    <KeyRound className="w-4 h-4 flex-shrink-0" style={{ color: accent }} />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: colors.textPrimary }}>{activeKey.name || 'API Key'}</p>
                      <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>Key hidden. Rotate to generate a new one.</p>
                    </div>
                  </div>

                  {/* Masked key */}
                  <div className="px-6 py-4" style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
                    <div className="flex items-center px-4 py-2.5 rounded-md" style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderSubtle}` }}>
                      <code className="text-xs font-mono flex-1">
                        <span style={{ color: accent }}>{activeKey.key_prefix}</span>
                        <span style={{ color: colors.textMuted }}>••••••••••••••••••••</span>
                      </code>
                    </div>
                  </div>

                  {/* Created / last used */}
                  <div className="grid grid-cols-2 divide-x" style={{ borderBottom: `1px solid ${colors.borderSubtle}`, borderColor: colors.borderSubtle }}>
                    <div className="px-6 py-4">
                      <p className="text-xs uppercase tracking-[0.1em] mb-1" style={{ color: colors.textMuted }}>Created</p>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>{fmtShort(activeKey.created_at)}</p>
                    </div>
                    <div className="px-6 py-4">
                      <p className="text-xs uppercase tracking-[0.1em] mb-1" style={{ color: colors.textMuted }}>Last used</p>
                      <p className="flex items-center gap-1.5 text-sm" style={{ color: colors.textSecondary }}>
                        <Clock className="w-3.5 h-3.5" style={{ color: colors.textMuted }} />
                        {fmtShort(activeKey.last_used_at)}
                      </p>
                    </div>
                  </div>

                  {/* Rotate action */}
                  <div className="flex-1 flex items-end">
                    <div className="flex items-center gap-3 px-6 py-5 w-full">
                      <button
                        onClick={() => setConfirmRotate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer"
                        style={{ background: colors.warningSubtle, border: `1px solid ${colors.warningBorder}`, color: colors.warning }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(251,191,36,0.12)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.warningSubtle; }}
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Rotate Key
                      </button>
                      <p className="text-xs" style={{ color: colors.textMuted }}>Invalidates the current key immediately.</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
                  <KeyRound className="w-7 h-7 mb-4" style={{ color: colors.textMuted }} />
                  <p className="text-[15px] font-semibold mb-1" style={{ color: colors.textPrimary }}>No API key yet</p>
                  <p className="text-sm mb-6" style={{ color: colors.textMuted }}>Generate a key to start authenticating requests</p>
                  <button
                    onClick={() => { setShowGenerate(true); setGenerateError(''); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer"
                    style={{ background: colors.accentSubtle, border: `1px solid ${colors.accentBorder}`, color: accent }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.accentHover; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = colors.accentSubtle; }}
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
          <Motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          >
            <Motion.div
              role="dialog" aria-modal="true" aria-labelledby="reveal-dialog-title"
              initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-lg p-6 shadow-2xl"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <div className="flex items-start gap-3 mb-5">
                <KeyRound className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <div>
                  <h2 id="reveal-dialog-title" className="text-[15px] font-bold mb-1" style={{ color: colors.textPrimary }}>Your API Key</h2>
                  <p className="text-sm font-mono" style={{ color: colors.textMuted }}>{revealedKey.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 px-4 py-2.5 rounded-md min-w-0" style={{ background: colors.bgSubtle, border: `1px solid ${colors.accentBorder}` }}>
                  <code className="block text-xs truncate font-mono" style={{ color: accent }}>{revealedKey.key}</code>
                </div>
                <CopyButton value={revealedKey.key} />
              </div>
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-md mb-5" style={{ background: colors.warningSubtle, border: `1px solid ${colors.warningBorder}` }}>
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} />
                <p className="text-xs leading-relaxed" style={{ color: colors.warning }}>
                  This key will <strong>not be shown again</strong>. Copy it now and store it somewhere safe.
                </p>
              </div>
              <button
                onClick={dismissReveal}
                className="w-full px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer"
                style={{ background: colors.accentSubtle, border: `1px solid ${colors.accentBorder}`, color: accent }}
              >
                I've saved my key
              </button>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Generate key modal */}
      <AnimatePresence>
        {showGenerate && (
          <Motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setShowGenerate(false); setKeyName(''); setGenerateError(''); } }}
          >
            <Motion.div
              role="dialog" aria-modal="true" aria-labelledby="generate-dialog-title"
              initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-lg p-6 shadow-2xl"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <div className="flex items-start gap-3 mb-5">
                <KeyRound className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: accent }} />
                <div>
                  <h2 id="generate-dialog-title" className="text-[15px] font-bold mb-1" style={{ color: colors.textPrimary }}>Generate API Key</h2>
                  <p className="text-sm" style={{ color: colors.textMuted }}>Give your key a name so you can identify it later.</p>
                </div>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); if (keyName.trim()) generateMutation.mutate(keyName.trim()); }}>
                <input
                  autoFocus
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value.slice(0, 64))}
                  placeholder="e.g. production"
                  className="w-full px-4 py-2.5 rounded-md text-sm placeholder-[#525252] focus:outline-none transition-all mb-1"
                  style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textPrimary }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = colors.accentBorder; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = colors.borderDefault; }}
                />
                {generateError && <p className="text-xs mb-3" style={{ color: colors.error }}>{generateError}</p>}
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => { setShowGenerate(false); setKeyName(''); setGenerateError(''); }}
                    className="flex-1 px-4 py-2.5 rounded-md text-sm transition-all cursor-pointer"
                    style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textMuted }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!keyName.trim() || generateMutation.isPending}
                    className="flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: colors.accentSubtle, border: `1px solid ${colors.accentBorder}`, color: accent }}
                  >
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
          <Motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
            onClick={(e) => { if (e.target === e.currentTarget) { setConfirmRotate(false); setRotateError(''); } }}
          >
            <Motion.div
              role="dialog" aria-modal="true" aria-labelledby="rotate-dialog-title"
              initial={{ opacity: 0, scale: 0.97, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }} transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-sm rounded-lg p-6 shadow-2xl"
              style={{ background: colors.bgBase, border: `1px solid ${colors.borderDefault}` }}
            >
              <div className="flex items-start gap-3 mb-5">
                <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} />
                <div>
                  <h2 id="rotate-dialog-title" className="text-[15px] font-bold mb-1" style={{ color: colors.textPrimary }}>Rotate API key?</h2>
                  <p className="text-sm" style={{ color: colors.textMuted }}>Your current key will be immediately invalidated.</p>
                </div>
              </div>
              {rotateError && <p className="text-xs mb-4" style={{ color: colors.error }}>{rotateError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => { setConfirmRotate(false); setRotateError(''); }}
                  className="flex-1 px-4 py-2.5 rounded-md text-sm transition-all cursor-pointer"
                  style={{ background: colors.bgSubtle, border: `1px solid ${colors.borderDefault}`, color: colors.textMuted }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => rotateMutation.mutate()}
                  disabled={rotateMutation.isPending}
                  className="flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all cursor-pointer disabled:opacity-40"
                  style={{ background: colors.warningSubtle, border: `1px solid ${colors.warningBorder}`, color: colors.warning }}
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
