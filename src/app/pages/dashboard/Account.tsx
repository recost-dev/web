import { motion as Motion } from 'motion/react';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../theme-context';

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

function fmt(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Account() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const accent = theme.btnGradient[0];

  if (!user) return null;

  return (
    <div
      className="min-h-full flex flex-col items-center px-8 pb-10"
      style={{ paddingTop: '140px', fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-2xl">

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] uppercase tracking-[0.15em]"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: accent }}
            >
              Account
            </span>
          </div>
          <h1
            className="text-[32px] text-white"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: 1.1 }}
          >
            Your Account
          </h1>
        </Motion.div>

        {/* Profile card */}
        <Motion.div
          {...FADE(0.08)}
          className="rounded-2xl overflow-hidden backdrop-blur-xl"
          style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Avatar + name hero */}
          <div
            className="flex flex-col sm:flex-row items-center sm:items-start gap-5 px-8 py-8"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user.avatarUrl ?? ''}
                alt={user.name ?? ''}
                className="w-20 h-20 rounded-2xl"
                style={{ outline: '1px solid rgba(255,255,255,0.1)' }}
              />
              <div
                className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                style={{ background: accent, borderColor: '#02060f' }}
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2
                className="text-[20px] text-white"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}
              >
                {user.name ?? user.email}
              </h2>
              <p
                className="text-[13px] mt-1"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono', monospace" }}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Details */}
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-4 px-8 py-5">
              <div
                className="p-2 rounded-xl flex-shrink-0"
                style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: accent }} />
              </div>
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.1em] mb-0.5"
                  style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Email
                </p>
                <p
                  className="text-[14px] text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 px-8 py-5">
              <div
                className="p-2 rounded-xl flex-shrink-0"
                style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}
              >
                <Calendar className="w-3.5 h-3.5" style={{ color: accent }} />
              </div>
              <div>
                <p
                  className="text-[10px] uppercase tracking-[0.1em] mb-0.5"
                  style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  Member since
                </p>
                <p
                  className="text-[14px] text-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {fmt(user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </Motion.div>

        {/* User ID */}
        <Motion.div
          {...FADE(0.14)}
          className="mt-3 px-6 py-4 rounded-2xl backdrop-blur-xl"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[10px] uppercase tracking-[0.1em]"
              style={{ color: 'rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              User ID
            </p>
            <code
              className="text-[11px]"
              style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              {user.id}
            </code>
          </div>
        </Motion.div>

        {/* Sign out */}
        <Motion.div {...FADE(0.2)} className="mt-8">
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl text-[13px] transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: 'rgba(248,113,113,0.06)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: '#f87171',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.12)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.06)'; }}
          >
            Sign out
          </button>
        </Motion.div>
      </div>
    </div>
  );
}
