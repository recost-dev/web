import { Link, Outlet, useLocation, Navigate } from 'react-router';
import { useAuth } from '@/src/lib/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { Sparkles, FolderKanban, User, LogOut } from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: Sparkles, label: 'Get Started', exact: true },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/account', icon: User, label: 'Account' },
];

const accent = '#34d399';

function useBreadcrumb() {
  const { pathname } = useLocation();
  const qc = useQueryClient();

  const projectDetailMatch = pathname.match(/^\/dashboard\/projects\/([^/]+)/);
  if (projectDetailMatch) {
    const id = projectDetailMatch[1];
    const list = qc.getQueryData<{ id: string; name: string }[]>(['dashboard-projects']);
    const name = list?.find(p => p.id === id)?.name
      ?? qc.getQueryData<{ id: string; name: string }>(['dashboard-project', id])?.name
      ?? '…';
    return { segments: [
      { label: 'Projects', href: '/dashboard/projects' },
      { label: name },
    ]};
  }

  if (pathname === '/dashboard') return { segments: [{ label: 'Get Started' }] };
  const match = NAV.find(n => !n.exact && pathname.startsWith(n.href));
  return { segments: [{ label: match?.label ?? 'Dashboard' }] };
}

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: `${accent}33`, borderTopColor: accent }} />
    </div>
  );
}

function NavItem({ href, icon: Icon, label, exact }: { href: string; icon: React.ElementType; label: string; exact?: boolean }) {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link to={href} style={{ textDecoration: 'none' }}>
      <div
        className="flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] transition-all duration-150 cursor-pointer"
        style={{
          fontWeight: isActive ? 600 : 400,
          background: isActive ? `${accent}14` : 'transparent',
          border: isActive ? `1px solid ${accent}30` : '1px solid transparent',
          color: isActive ? accent : '#737373',
        }}
      >
        <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default function DashboardLayout() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { pathname } = useLocation();
  const { segments } = useBreadcrumb();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) {
    sessionStorage.setItem('ecoapi_redirect', pathname);
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>

      {/* Top header */}
      <header className="flex-shrink-0 flex items-center px-6 h-14" style={{ borderBottom: '1px solid #1e1e1e', background: '#0d0d0d' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="font-mono text-sm font-bold tracking-tight text-[#fafafa] hover:opacity-75 transition-opacity">recost</span>
        </Link>
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-2.5">
            <span className="mx-2.5 text-sm text-[#525252]">/</span>
            {seg.href ? (
              <Link to={seg.href} className="text-sm text-[#737373] hover:text-[#fafafa] transition-colors" style={{ textDecoration: 'none' }}>{seg.label}</Link>
            ) : (
              <span className="text-sm text-[#fafafa]">{seg.label}</span>
            )}
          </span>
        ))}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <aside
          className="hidden md:flex flex-col w-56 flex-shrink-0"
          style={{ borderRight: '1px solid #1e1e1e', background: '#0d0d0d' }}
        >
          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV.map(({ href, icon, label, exact }) => (
              <NavItem key={href} href={href} icon={icon} label={label} exact={exact} />
            ))}
          </nav>

          {/* User section */}
          <div className="px-3 py-4" style={{ borderTop: '1px solid #1e1e1e' }}>
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-1">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? ''}
                    className="w-7 h-7 rounded-full flex-shrink-0"
                    style={{ outline: '1px solid #262626' }}
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold" style={{ background: `${accent}20`, color: accent }}>
                    {(user.name ?? user.email)[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#fafafa] font-medium truncate">{user.name}</p>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: '#525252', fontFamily: "'Geist Mono Variable', monospace" }}>
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-[13px] transition-all duration-150 cursor-pointer"
              style={{ color: '#525252', background: 'transparent', border: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(248,113,113,0.06)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#525252'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <LogOut style={{ width: '15px', height: '15px', flexShrink: 0 }} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav
        className="flex md:hidden fixed bottom-0 inset-x-0 z-50 items-center justify-around px-2 py-1"
        style={{ background: 'rgba(10,10,10,0.95)', borderTop: '1px solid #1e1e1e', backdropFilter: 'blur(20px)' }}
      >
        {NAV.map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} to={href} style={{ textDecoration: 'none', flex: 1 }}>
              <div
                className="flex flex-col items-center gap-1 py-2 rounded-lg mx-1 transition-all duration-150"
                style={{ color: isActive ? accent : '#525252' }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400 }}>{label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
