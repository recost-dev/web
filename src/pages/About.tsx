import { motion as Motion } from 'motion/react';
import { Link } from 'react-router';
import { Navigation } from '@/components/landing/navigation';
import { Footer } from '@/components/landing/footer';
import {
  Server,
  PuzzleIcon,
  LayoutDashboard,
  Code2,
  Zap,
  DollarSign,
  AlertTriangle,
  GitBranch,
  MessageSquare,
  ArrowRight,
  Globe,
  Leaf,
  Clock,
  ScanSearch,
  TreePine,
} from 'lucide-react';

const ACCENT = '#d4900a';

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

const SECTIONS = [
  {
    num: '01',
    icon: Server,
    badge: 'REST API',
    title: 'Recost Backend',
    subtitle: 'Cloudflare Workers · Hono · D1 SQLite',
    description: 'The core engine. Send a list of API calls found in your codebase and Recost analyses them, detecting redundant calls, N+1 patterns, cacheable endpoints, batch opportunities, and rate-limit risks. It calculates monthly cost estimates per provider, groups endpoints by file or provider, and generates actionable optimization suggestions with code fixes.',
    features: [
      { icon: Code2, label: 'Scan endpoint', desc: 'POST raw API call data extracted from your source code' },
      { icon: DollarSign, label: 'Cost analytics', desc: 'Per-provider cost breakdown with monthly estimates' },
      { icon: AlertTriangle, label: 'Risk detection', desc: 'N+1, rate limit, redundancy, and cache opportunities' },
      { icon: GitBranch, label: 'Dependency graph', desc: 'File → endpoint relationships, cluster by provider or cost' },
      { icon: Leaf, label: 'Sustainability stats', desc: 'Electricity, water, and CO₂ footprint per provider with AI vs non-AI breakdown' },
      { icon: Clock, label: 'Real-time telemetry', desc: '30-second windowed cost aggregation, delivered via WebSocket or HTTPS' },
    ],
  },
  {
    num: '02',
    icon: PuzzleIcon,
    badge: 'IDE Extension',
    title: 'IDE Extension',
    subtitle: 'VS Code Extension Host · TypeScript · Webview UI',
    description: 'Install the Recost extension and scan your entire workspace without leaving your editor. Because Recost is built on the VS Code extension host, it runs natively in any compatible editor: VS Code, Cursor, Windsurf, and more. The extension scans TypeScript, JavaScript, Python, Go, and Ruby files, detects API calls using regex patterns across popular HTTP libraries (fetch, axios, requests, got), and sends them to the Recost backend for analysis. Results appear in a sidebar panel with findings, suggestions, and an AI chat assistant.',
    features: [
      { icon: Zap, label: 'One-click scan', desc: 'Scan your workspace instantly from the sidebar' },
      { icon: AlertTriangle, label: 'Inline findings', desc: 'Severity-grouped suggestions with code fix previews' },
      { icon: MessageSquare, label: 'AI chat', desc: 'Ask any of 8 AI providers about any endpoint or suggestion' },
      { icon: Globe, label: 'Extension host compatible', desc: 'VS Code, Cursor, Windsurf, any host-compatible editor' },
      { icon: ScanSearch, label: 'AST-powered analysis', desc: 'Web-Tree-Sitter detects API calls across imports, aliases, and cross-file wrappers' },
      { icon: Leaf, label: 'Sustainability tracking', desc: 'CO₂, electricity, and water estimates per API call with AI vs non-AI breakdown' },
    ],
  },
  {
    num: '03',
    icon: TreePine,
    badge: 'SDKs',
    title: 'Node.js & Python SDKs',
    subtitle: '@recost/node · recost (Python) · Zero config',
    description: 'Drop in one line at process startup and every outbound HTTP call is automatically intercepted, matched against the built-in provider registry, and aggregated into 30-second windows. The Node SDK patches globalThis.fetch, http, and https. The Python SDK patches urllib3 (requests), httpx, and aiohttp. Both ship framework adapters so you can initialize via middleware instead of a bare init() call.',
    features: [
      { icon: Zap, label: 'One-line setup', desc: 'init() patches your HTTP clients automatically. No wrappers, no manual instrumentation.' },
      { icon: Globe, label: 'Framework adapters', desc: 'Express, Fastify (Node) and FastAPI, Flask (Python) — thin wrappers around init()' },
      { icon: Clock, label: '30-second windows', desc: 'Events aggregated into time windows with p50/p95 latency, cost, and byte totals' },
      { icon: DollarSign, label: 'Provider registry', desc: 'Built-in rules for OpenAI, Anthropic, Stripe, Twilio, SendGrid, Pinecone, AWS, and more' },
      { icon: GitBranch, label: 'Custom providers', desc: 'Extend the registry with your own host patterns, endpoint categories, and cost estimates' },
      { icon: Leaf, label: 'Two transport modes', desc: 'Cloud mode posts to api.recost.dev; local mode streams to the VS Code extension via WebSocket' },
    ],
  },
  {
    num: '04',
    icon: LayoutDashboard,
    badge: 'Web Dashboard',
    title: 'Recost Dashboard',
    subtitle: 'React · TanStack Query · Tailwind CSS',
    description: 'This web app. Manage multiple projects, view full cost breakdowns, explore the API dependency graph, read optimization suggestions with estimated savings, and re-run scans with new API call data. Every page fetches live data from the Recost backend.',
    features: [
      { icon: LayoutDashboard, label: 'Project dashboard', desc: 'Cost breakdown, stat cards, provider cost bars' },
      { icon: Server, label: 'Endpoints explorer', desc: 'Filter by provider, status, or HTTP method' },
      { icon: DollarSign, label: 'Savings summary', desc: 'Total estimated monthly savings across all suggestions' },
      { icon: GitBranch, label: 'Graph view', desc: 'Interactive file → endpoint dependency visualization' },
      { icon: Leaf, label: 'Sustainability view', desc: 'Per-provider CO₂, electricity, and water footprint on the project dashboard' },
      { icon: MessageSquare, label: 'AI chat', desc: 'Multi-provider AI assistant with full context from your scan results' },
    ],
  },
];

export default function About() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 animated-gradient pointer-events-none" />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <Motion.div {...FADE(0)} className="relative mx-auto max-w-5xl px-6">
          <p className="text-xs uppercase tracking-[0.12em] mb-3" style={{ color: ACCENT }}>About</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl text-balance leading-tight">
            Four surfaces.<br className="hidden sm:block" /> One cost picture.
          </h1>
          <p className="mt-6 text-lg text-[#a3a3a3] max-w-2xl">
            A full-stack platform to analyze your codebase&apos;s API usage, estimate costs, surface risks, and suggest optimizations.
          </p>
        </Motion.div>
      </section>

      {/* Sections */}
      <section className="relative mx-auto max-w-5xl px-6 pb-24">
        {SECTIONS.map(({ num, icon: Icon, badge, title, subtitle, description, features }, i) => (
          <Motion.div
            key={num}
            {...FADE(0.05 + i * 0.1)}
            className="border-t border-[#262626] py-14"
          >
            <div className="grid gap-10 md:grid-cols-[200px_1fr]">
              {/* Left: number + identity */}
              <div>
                <span
                  className="block text-5xl font-bold font-mono leading-none mb-4"
                  style={{ color: `${ACCENT}33` }}
                >
                  {num}
                </span>
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon size={12} style={{ color: ACCENT }} />
                  <span className="text-xs uppercase tracking-[0.1em]" style={{ color: ACCENT }}>{badge}</span>
                </div>
                <h2 className="text-lg font-bold text-[#fafafa]">{title}</h2>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: '#737373' }}>{subtitle}</p>
              </div>

              {/* Right: description + features */}
              <div>
                <p className="text-sm leading-relaxed text-[#a3a3a3] mb-8">{description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                  {features.map(({ icon: FIcon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex-shrink-0 p-1.5 rounded-md"
                        style={{ background: `${ACCENT}14` }}
                      >
                        <FIcon size={12} style={{ color: ACCENT }} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#fafafa] mb-0.5">{label}</p>
                        <p className="text-xs leading-relaxed" style={{ color: '#737373' }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Motion.div>
        ))}

        {/* CTA */}
        <Motion.div {...FADE(0.35)} className="border-t border-[#262626] pt-12 flex items-center gap-4 flex-wrap">
          <Link
            to="/docs/sdk"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-[#0a0a0a] text-sm font-medium transition-all hover:-translate-y-0.5"
            style={{ background: ACCENT }}
          >
            SDK docs
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/docs/extension"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium border border-[#262626] text-[#a3a3a3] hover:text-[#fafafa] hover:border-[#404040] transition-all hover:-translate-y-0.5"
          >
            Extension docs
            <ArrowRight size={14} />
          </Link>
        </Motion.div>
      </section>

      <Footer />
    </main>
  );
}
