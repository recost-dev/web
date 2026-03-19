import { NavLink, Outlet, Navigate } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { Leaf, FolderKanban, KeyRound, User, LogOut } from 'lucide-react';

const NAV = [
  { to: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/dashboard/keys', icon: KeyRound, label: 'API Keys' },
  { to: '/dashboard/account', icon: User, label: 'Account' },
];

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#020202' }}>
      <div className="w-6 h-6 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
    </div>
  );
}

export default function DashboardLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#020202', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside className="flex flex-col w-56 flex-shrink-0 border-r border-white/5 bg-zinc-900/60 backdrop-blur-xl">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 px-5 py-5 border-b border-white/5 hover:opacity-80 transition-opacity duration-150"
        >
          <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <Leaf className="w-4 h-4 text-green-400" />
          </div>
          <span
            className="text-base font-black tracking-tight text-white"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            EcoApi
          </span>
        </NavLink>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-green-400' : ''}`} />
                  <span className="font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-white/5">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
              <img
                src={user.picture}
                alt={user.name}
                className="w-7 h-7 rounded-full flex-shrink-0 ring-1 ring-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white/80 truncate">{user.name}</p>
                <p className="text-[10px] text-white/30 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
