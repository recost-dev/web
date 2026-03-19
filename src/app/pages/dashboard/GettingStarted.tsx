import { motion as Motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { FolderKanban, KeyRound, Terminal, Zap, Shield, Activity, ArrowRight } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { useTheme } from '../../theme-context';

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
        marginBottom: '8px',
        marginTop: '20px',
      }}
    >
      {children}
    </p>
  );
}

function SectionCard({
  icon: Icon,
  badge,
  title,
  subtitle,
  delay,
  children,
}: {
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  delay: number;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const accent = theme.btnGradient[0];
  return (
    <Motion.div
      {...FADE(delay)}
      className="rounded-2xl border p-8 backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[22px] text-white mb-1" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>
            {title}
          </h2>
          <p className="text-[13px]" style={{ color: accent, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-[11px] uppercase tracking-widest flex-shrink-0"
          style={{
            background: `${accent}22`,
            color: accent,
            border: `1px solid ${accent}44`,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <Icon size={12} />
          {badge}
        </div>
      </div>
      {children}
    </Motion.div>
  );
}

const STEPS = [
  {
    icon: FolderKanban,
    badge: 'Step 1',
    title: 'Create a Project',
    subtitle: 'Organize · Group · Track',
    body: 'Projects are the top-level container for your API scans and findings. Create one per product, repository, or environment. Each project tracks its scan history independently.',
    action: '/dashboard/projects',
    cta: 'Go to Projects',
    features: [
      { icon: FolderKanban, label: 'Unlimited scans', desc: 'Each project stores its full scan history so you can track changes over time' },
      { icon: Activity, label: 'Up to 20 projects', desc: 'Create separate projects per product, microservice, or team' },
    ],
  },
  {
    icon: KeyRound,
    badge: 'Step 2',
    title: 'Generate an API Key',
    subtitle: 'Authenticate · Authorize · Access',
    body: 'One API key works across all your projects. Pass it as a Bearer token in the Authorization header. Keys are shown only once — copy it immediately after creating.',
    action: '/dashboard/keys',
    cta: 'Go to API Keys',
    features: [
      { icon: Shield, label: 'Bearer token auth', desc: 'Authorization: Bearer <your-key>' },
      { icon: KeyRound, label: 'Rotate anytime', desc: 'Generate a new key and instantly invalidate the old one with one click' },
    ],
  },
  {
    icon: Terminal,
    badge: 'Step 3',
    title: 'Run Your First Scan',
    subtitle: 'Scan · Analyze · Optimize',
    body: 'Point the EcoApi scanner at your source files. It extracts outbound HTTP calls, submits them to the API, and surfaces cost estimates, sustainability stats, and optimization suggestions.',
    action: '/docs',
    cta: 'View API Docs',
    features: [
      { icon: Zap, label: 'Instant results', desc: 'Scans complete synchronously — results are available immediately in the response' },
      { icon: Terminal, label: 'Up to 2,000 calls', desc: 'Submit up to 2,000 API calls per scan payload' },
    ],
  },
];

export default function GettingStarted() {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const accent = theme.btnGradient[0];

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div
      className="min-h-full"
      style={{ paddingTop: '140px', fontFamily: "'Inter', sans-serif" }}
    >
      <div className="pb-24 space-y-5" style={{ maxWidth: 'calc(100% * 6 / 7)', margin: '0 auto', paddingLeft: '40px', paddingRight: '40px' }}>

        {/* Hero */}
        <Motion.div {...FADE(0)} className="px-4 pb-6">
          <h1
            className="text-[40px] md:text-[52px] text-white mb-3"
            style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: 1.05 }}
          >
            Hey, {firstName}
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
            EcoApi measures the environmental footprint of your APIs. Here's how to get up and running in a few minutes.
          </p>
        </Motion.div>

        {/* Step cards */}
        {STEPS.map(({ icon, badge, title, subtitle, body, action, cta, features }, i) => (
          <SectionCard key={badge} icon={icon} badge={badge} title={title} subtitle={subtitle} delay={0.05 + i * 0.07}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '16px' }}>
              {body}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              {features.map(({ icon: FIcon, label, desc }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-3.5 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <div
                    className="mt-0.5 p-1.5 rounded-lg shrink-0"
                    style={{ background: `${accent}18` }}
                  >
                    <FIcon size={13} style={{ color: accent }} />
                  </div>
                  <div>
                    <p className="text-[12px] text-white mb-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{label}</p>
                    <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: "'Inter', sans-serif" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <SubHeading>Next step</SubHeading>
            <button
              onClick={() => navigate(action)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer"
              style={{
                fontFamily: "'Inter', sans-serif",
                background: `${accent}18`,
                border: `1px solid ${accent}44`,
                color: accent,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}28`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = `${accent}18`; }}
            >
              {cta}
              <ArrowRight size={14} />
            </button>
          </SectionCard>
        ))}

      </div>
    </div>
  );
}
