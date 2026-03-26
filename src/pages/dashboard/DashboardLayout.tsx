import { Link, Outlet, useLocation, Navigate } from 'react-router';
import { useAuth } from '@/src/lib/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { colors, accent } from '@/src/lib/tokens';
import { Sparkles, FolderKanban, User, LogOut, ScanSearch } from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: Sparkles, label: 'Get Started', exact: true },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/parser', icon: ScanSearch, label: 'Auto Parser' },
  { href: '/dashboard/account', icon: User, label: 'Account' },
];

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
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: colors.bgPage }}>
      <div className="w-5 h-5 rounded-full border-2 animate-spin" style={{ borderColor: colors.accentSubtle, borderTopColor: accent }} />
    </div>
  );
}

function NavItem({ href, icon: Icon, label, exact }: { href: string; icon: React.ElementType; label: string; exact?: boolean }) {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      to={href}
      className="flex items-center gap-3.5 px-4 py-2.5 rounded-md text-[14px] transition-all duration-150"
      style={{
        textDecoration: 'none',
        fontWeight: isActive ? 600 : 400,
        background: isActive ? colors.accentSubtle : 'transparent',
        border: isActive ? `1px solid ${colors.accentBorder}` : '1px solid transparent',
        color: isActive ? accent : colors.textMuted,
      }}
    >
      <Icon style={{ width: '16px', height: '16px', flexShrink: 0 }} />
      <span>{label}</span>
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
    <div className="flex flex-col h-screen overflow-hidden" style={{ backgroundColor: colors.bgPage }}>

      {/* Top header */}
      <header
        className="flex-shrink-0 flex items-center px-6 h-14 min-w-0"
        style={{ borderBottom: `1px solid ${colors.borderSubtle}`, background: colors.bgHeader }}
      >
        <Link to="/" className="flex items-center gap-2 hover:opacity-75 transition-opacity flex-shrink-0" style={{ textDecoration: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="20" height="20">
            <path d="M55 85 L240 85 L240 140 L105 140 L105 315 L55 315 Z" fill="none" stroke="#fafafa" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M345 315 L160 315 L160 260 L295 260 L295 85 L345 85 Z" fill="#fafafa" stroke="#fafafa" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
          <span className="font-mono text-sm font-bold tracking-tight" style={{ color: colors.textPrimary }}>recost</span>
        </Link>
        <div className="flex items-center min-w-0 overflow-hidden">
          {segments.map((seg, i) => (
            <span key={i} className="flex items-center min-w-0">
              <span className="mx-2 sm:mx-3 text-sm flex-shrink-0" style={{ color: colors.borderHover }}>/</span>
              {seg.href ? (
                <Link
                  to={seg.href}
                  className="text-sm hover:text-[#fafafa] transition-colors flex-shrink-0"
                  style={{ color: colors.textMuted, textDecoration: 'none' }}
                >
                  {seg.label}
                </Link>
              ) : (
                <span className="text-sm truncate" style={{ color: colors.textPrimary }}>{seg.label}</span>
              )}
            </span>
          ))}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — desktop only */}
        <aside
          className="hidden md:flex flex-col w-56 flex-shrink-0"
          style={{ borderRight: `1px solid ${colors.borderSubtle}`, background: colors.bgHeader }}
        >
          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV.map(({ href, icon, label, exact }) => (
              <NavItem key={href} href={href} icon={icon} label={label} exact={exact} />
            ))}
          </nav>

          {/* User section */}
          <div className="px-3 py-4" style={{ borderTop: `1px solid ${colors.borderSubtle}` }}>
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-1">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name ?? ''}
                    className="w-7 h-7 rounded-full flex-shrink-0"
                    loading="lazy"
                    decoding="async"
                    style={{ outline: `1px solid ${colors.borderDefault}` }}
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold"
                    style={{ background: colors.accentSubtle, color: accent }}
                  >
                    {(user.name ?? user.email)[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: colors.textPrimary }}>{user.name}</p>
                  <p className="text-[11px] truncate mt-0.5 font-mono" style={{ color: colors.textMuted }}>
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            <button
              onClick={logout}
              aria-label="Sign out"
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-md text-[13px] transition-all duration-150 cursor-pointer"
              style={{ color: colors.textMuted, background: 'transparent', border: 'none' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = colors.error; (e.currentTarget as HTMLButtonElement).style.background = colors.errorSubtle; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = colors.textMuted; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              <LogOut style={{ width: '15px', height: '15px', flexShrink: 0 }} />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-0 no-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <nav
        className="flex md:hidden fixed bottom-0 inset-x-0 z-50 items-center justify-around px-2 py-1"
        style={{ background: colors.bgPage, borderTop: `1px solid ${colors.borderSubtle}` }}
      >
        {NAV.map(({ href, icon: Icon, label, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} to={href} style={{ textDecoration: 'none', flex: 1 }}>
              <div
                className="flex flex-col items-center gap-1 py-2.5 rounded-md mx-1 transition-all duration-150"
                style={{ color: isActive ? accent : colors.textMuted }}
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
