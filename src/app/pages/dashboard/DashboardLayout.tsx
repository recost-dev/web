import { NavLink, Outlet, Navigate } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { ThemeProvider } from '../../theme-context';
import { galaxySunsetTheme } from '../../themes';
import { Leaf, Sparkles, FolderKanban, KeyRound, User, LogOut } from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: Sparkles, label: 'Get Started', end: true },
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/keys', icon: KeyRound, label: 'API Keys' },
  { to: '/dashboard/account', icon: User, label: 'Account' },
];

const accent = galaxySunsetTheme.btnGradient[0];

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#02060f' }}>
      <div className="w-5 h-5 rounded-full border-2 border-green-500/20 border-t-green-500 animate-spin" />
    </div>
  );
}

function DashboardShell() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#02060f', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col w-72 flex-shrink-0 backdrop-blur-xl"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.5)' }}
      >
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 px-6 py-5 transition-opacity duration-150 hover:opacity-75"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}
        >
          <div className="p-2 rounded-xl" style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}>
            <Leaf className="w-5 h-5" style={{ color: accent }} />
          </div>
          <span className="text-[17px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
            EcoApi
          </span>
        </NavLink>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} style={{ textDecoration: 'none' }}>
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] transition-all duration-150 cursor-pointer"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: isActive ? 600 : 400,
                    background: isActive ? `${accent}14` : 'transparent',
                    border: isActive ? `1px solid ${accent}30` : '1px solid transparent',
                    color: isActive ? accent : 'rgba(255,255,255,0.4)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)';
                      (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.75)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                      (e.currentTarget as HTMLDivElement).style.color = 'rgba(255,255,255,0.4)';
                    }
                  }}
                >
                  <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  <span>{label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user && (
            <div className="flex items-center gap-3.5 px-4 py-3 mb-1">
              <img
                src={user.avatarUrl ?? ''}
                alt={user.name ?? ''}
                className="w-8 h-8 rounded-full flex-shrink-0"
                style={{ outline: '1px solid rgba(255,255,255,0.1)' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] text-white truncate" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                  {user.name}
                </p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.28)', fontFamily: "'JetBrains Mono', monospace" }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-[14px] transition-all duration-150 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.28)', background: 'transparent', border: 'none' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.65)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.28)';
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <LogOut style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif" }}>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <Outlet />
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <ThemeProvider theme={galaxySunsetTheme}>
      <DashboardShell />
    </ThemeProvider>
  );
}
