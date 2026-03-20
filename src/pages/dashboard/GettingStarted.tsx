import { motion as Motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { FolderKanban, KeyRound, Terminal, ArrowRight } from 'lucide-react';
import { useAuth } from '@/src/lib/auth-context';

const accent = '#34d399';

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' as const },
});

const STEPS = [
  {
    icon: FolderKanban,
    step: '01',
    title: 'Create a Project',
    body: 'Projects are the top-level container for your API scans. Create one per product, repository, or environment.',
    action: '/dashboard/projects',
    cta: 'Go to Projects',
  },
  {
    icon: KeyRound,
    step: '02',
    title: 'Generate an API Key',
    body: 'One API key works across all your projects. Pass it as a Bearer token in the Authorization header. Keys are shown only once.',
    action: '/dashboard/account',
    cta: 'Go to Account',
  },
  {
    icon: Terminal,
    step: '03',
    title: 'Run Your First Scan',
    body: 'Point the Recost scanner at your source files. It extracts outbound HTTP calls and surfaces cost estimates and optimization suggestions.',
    action: '/docs',
    cta: 'View Docs',
  },
];

export default function GettingStarted() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="min-h-full">
      <div className="w-full px-6 md:px-10 pt-8 pb-16">

        {/* Header */}
        <Motion.div {...FADE(0)} className="mb-8">
          <p className="text-xs uppercase tracking-[0.15em] mb-2" style={{ color: accent, fontFamily: "'Geist Mono Variable', monospace" }}>
            Get Started
          </p>
          <h1 className="text-3xl font-bold text-[#fafafa]">Hey, {firstName}</h1>
          <p className="mt-1 text-sm text-[#737373]">Here's how to get up and running in a few minutes.</p>
        </Motion.div>

        {/* Steps */}
        <div className="space-y-2">
          {STEPS.map(({ icon: Icon, step, title, body, action, cta }, i) => (
            <Motion.div
              key={step}
              {...FADE(0.05 + i * 0.06)}
              className="flex items-start gap-5 px-5 py-5 rounded-xl"
              style={{ background: '#111111', border: '1px solid #262626' }}
            >
              <div className="p-2.5 rounded-lg flex-shrink-0 mt-0.5" style={{ background: `${accent}14`, border: `1px solid ${accent}28` }}>
                <Icon size={16} style={{ color: accent }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs mb-1 text-[#525252]" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>Step {step}</p>
                <p className="text-sm font-semibold text-[#fafafa] mb-1">{title}</p>
                <p className="text-sm text-[#737373] leading-relaxed mb-3">{body}</p>
                <button
                  onClick={() => navigate(action)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer"
                  style={{ background: `${accent}14`, border: `1px solid ${accent}30`, color: accent }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}20`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}14`; }}
                >
                  {cta}
                  <ArrowRight size={12} />
                </button>
              </div>
            </Motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
