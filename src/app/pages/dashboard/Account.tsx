import { motion as Motion } from 'motion/react';
import { User, Mail, Calendar } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

function fmt(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Account() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <User className="w-5 h-5 text-green-400" />
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Account
        </h1>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/5 bg-zinc-900/50 overflow-hidden"
      >
        {/* Avatar + name hero */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 px-8 py-8 border-b border-white/5">
          <div className="relative flex-shrink-0">
            <img
              src={user.picture}
              alt={user.name}
              className="w-20 h-20 rounded-2xl ring-2 ring-white/10"
            />
            <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full border-2 border-zinc-900 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {user.name}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'Inter', sans-serif" }}
            >
              {user.email}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="divide-y divide-white/5">
          <div className="flex items-center gap-4 px-8 py-4">
            <Mail className="w-4 h-4 text-white/30 flex-shrink-0" />
            <div>
              <p className="text-xs text-white/30 mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Email
              </p>
              <p className="text-sm text-white/80" style={{ fontFamily: "'Inter', sans-serif" }}>
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-8 py-4">
            <Calendar className="w-4 h-4 text-white/30 flex-shrink-0" />
            <div>
              <p className="text-xs text-white/30 mb-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Member since
              </p>
              <p className="text-sm text-white/80" style={{ fontFamily: "'Inter', sans-serif" }}>
                {fmt(user.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </Motion.div>

      {/* Sign out */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-8"
      >
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Sign out
        </button>
      </Motion.div>
    </div>
  );
}
