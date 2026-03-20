import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion as Motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/src/lib/auth-context';

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = sessionStorage.getItem('ecoapi_redirect') ?? '/dashboard';
      sessionStorage.removeItem('ecoapi_redirect');
      navigate(redirect, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: '#020202' }}
    >
      {/* Ambient glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-green-900/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-green-900/10 blur-[180px] rounded-full pointer-events-none" />

      <Link
        to="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <Motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-8 px-8 py-12 rounded-3xl border border-white/5 bg-zinc-900/60 backdrop-blur-xl shadow-2xl w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <h1
              className="text-3xl font-black tracking-tight text-white font-mono"
            >
              recost
            </h1>
            <p
              className="text-xs uppercase tracking-[0.2em] mt-1"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Know your API costs
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5" />

        {/* Sign in prompt */}
        <div className="text-center space-y-1">
          <p className="text-base font-medium text-white">
            Sign in to your dashboard
          </p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Manage projects and API keys
          </p>
        </div>

        {/* Google Sign-in button */}
        <a
          href={`${import.meta.env.VITE_API_URL ?? 'https://api.recost.dev'}/auth/google`}
          className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-pointer"
        >
          {/* Google icon */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
            Continue with Google
          </span>
        </a>

        {/* Footer note */}
        <p
          className="text-center text-xs leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          By signing in you agree to the Recost terms of service.
        </p>
      </Motion.div>
    </div>
  );
}
