'use client';

import { useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/lib/auth-context';
import { galaxySunsetTheme } from '@/app/lib/themes';
import { Sparkles, FolderKanban, User, LogOut, BookOpen, PuzzleIcon } from 'lucide-react';

const NAV = [
  { href: '/dashboard', icon: Sparkles, label: 'Get Started', exact: true },
  { href: '/dashboard/projects', icon: FolderKanban, label: 'Projects' },
  { href: '/dashboard/account', icon: User, label: 'Account' },
  { href: '/docs/api', icon: BookOpen, label: 'API Docs', exact: true },
  { href: '/docs/extension', icon: PuzzleIcon, label: 'Extension', exact: true },
];

const accent = galaxySunsetTheme.btnGradient[0];

function Spinner() {
  return (
    <div className="flex h-screen items-center justify-center" style={{ backgroundColor: '#02060f' }}>
      <div className="w-5 h-5 rounded-full border-2 border-green-500/20 border-t-green-500 animate-spin" />
    </div>
  );
}

function NavItem({ href, icon: Icon, label, exact }: { href: string; icon: React.ElementType; label: string; exact?: boolean }) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[14px] transition-all duration-150 cursor-pointer"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: isActive ? 600 : 400,
          background: isActive ? `${accent}14` : 'transparent',
          border: isActive ? `1px solid ${accent}30` : '1px solid transparent',
          color: isActive ? accent : 'rgba(255,255,255,0.4)',
        }}
      >
        <Icon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        <span>{label}</span>
      </div>
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem('ecoapi_redirect', pathname);
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Spinner />;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: '#02060f', fontFamily: "'Inter', sans-serif" }}
    >
      {/* Sidebar — desktop only */}
      <aside
        className="hidden md:flex flex-col w-72 flex-shrink-0 backdrop-blur-xl"
        style={{ borderRight: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.5)' }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 px-6 py-5 transition-opacity duration-150 hover:opacity-75"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none' }}
        >
          <span className="text-[17px] text-white" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
            recost
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {NAV.map(({ href, icon, label, exact }) => (
            <NavItem key={href} href={href} icon={icon} label={label} exact={exact} />
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
            className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-[14px] transition-all duration-150 cursor-pointer hover:bg-white/5 hover:text-white/65"
            style={{ color: 'rgba(255,255,255,0.28)', background: 'transparent', border: 'none' }}
          >
            <LogOut style={{ width: '16px', height: '16px', flexShrink: 0 }} />
            <span style={{ fontFamily: "'Inter', sans-serif" }}>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <nav
        className="flex md:hidden fixed bottom-0 inset-x-0 z-50 items-center justify-around px-2 py-1"
        style={{ background: 'rgba(2,6,15,0.92)', borderTop: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}
      >
        {NAV.map(({ href, icon: Icon, label, exact }) => {
          const pathname2 = pathname;
          const isActive = exact ? pathname2 === href : pathname2.startsWith(href);
          return (
            <Link key={href} href={href} style={{ textDecoration: 'none', flex: 1 }}>
              <div
                className="flex flex-col items-center gap-1 py-2 rounded-xl mx-1 transition-all duration-150"
                style={{ color: isActive ? accent : 'rgba(255,255,255,0.3)' }}
              >
                <Icon style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '10px', fontFamily: "'Inter', sans-serif", fontWeight: isActive ? 600 : 400 }}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
