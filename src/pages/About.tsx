import React from 'react';
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
} from 'lucide-react';

const ACCENT = '#d4900a';

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

function Section({
  icon: Icon,
  badge,
  title,
  subtitle,
  description,
  features,
  delay,
}: {
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: { icon: React.ElementType; label: string; desc: string }[];
  delay: number;
}) {
  return (
    <Motion.div
      {...FADE(delay)}
      className="rounded-2xl border border-[#262626] bg-[#111111] p-8"
    >
      {/* Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#0a0a0a] px-3 py-1 mb-4">
        <Icon size={12} className="text-[#d4900a]" />
        <span className="text-xs text-[#a3a3a3] font-mono">{badge}</span>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-[#fafafa] mb-1">{title}</h2>
      <p className="text-sm mb-4 font-medium" style={{ color: ACCENT }}>{subtitle}</p>
      <p className="text-sm leading-relaxed mb-6 text-[#a3a3a3]">{description}</p>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map(({ icon: FIcon, label, desc }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-3.5 rounded-xl border border-[#262626] bg-[#0a0a0a]"
          >
            <div
              className="mt-0.5 p-1.5 rounded-lg shrink-0"
              style={{ background: `${ACCENT}18` }}
            >
              <FIcon size={13} style={{ color: ACCENT }} />
            </div>
            <div>
              <p className="text-xs text-[#fafafa] mb-0.5 font-mono">{label}</p>
              <p className="text-xs text-[#737373]">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Motion.div>
  );
}

export default function About() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 animated-gradient pointer-events-none" />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <Motion.div {...FADE(0)} className="relative mx-auto max-w-5xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl text-balance">
            About <span className="text-[#d4900a]">Recost</span>
          </h1>
          <p className="mt-6 text-lg text-[#a3a3a3] text-balance">
            A full-stack platform to analyze your codebase&apos;s API usage, estimate costs, surface risks, and suggest optimizations across three integrated surfaces.
          </p>
        </Motion.div>
      </section>

      {/* Sections */}
      <section className="mx-auto max-w-5xl px-6 pb-24 space-y-6">
        <Section
          icon={Server}
          badge="REST API"
          title="Recost Backend"
          subtitle="Cloudflare Workers · Hono · D1 SQLite"
          description="The core engine. Send a list of API calls found in your codebase and Recost analyses them, detecting redundant calls, N+1 patterns, cacheable endpoints, batch opportunities, and rate-limit risks. It calculates monthly cost estimates per provider, groups endpoints by file or provider, and generates actionable optimization suggestions with code fixes."
          features={[
            { icon: Code2, label: 'Scan endpoint', desc: 'POST raw API call data extracted from your source code' },
            { icon: DollarSign, label: 'Cost analytics', desc: 'Per-provider cost breakdown with monthly estimates' },
            { icon: AlertTriangle, label: 'Risk detection', desc: 'N+1, rate limit, redundancy, and cache opportunities' },
            { icon: GitBranch, label: 'Dependency graph', desc: 'File → endpoint relationships, cluster by provider or cost' },
          ]}
          delay={0.1}
        />

        <Section
          icon={PuzzleIcon}
          badge="IDE Extension"
          title="IDE Extension"
          subtitle="VS Code Extension Host · TypeScript · Webview UI"
          description="Install the Recost extension and scan your entire workspace without leaving your editor. Because Recost is built on the VS Code extension host, it runs natively in any compatible editor: VS Code, Cursor, Windsurf, and more. The extension scans TypeScript, JavaScript, Python, Go, and Ruby files, detects API calls using regex patterns across popular HTTP libraries (fetch, axios, requests, got), and sends them to the Recost backend for analysis. Results appear in a sidebar panel with findings, suggestions, and an AI chat assistant."
          features={[
            { icon: Zap, label: 'One-click scan', desc: 'Scan your workspace instantly from the sidebar' },
            { icon: AlertTriangle, label: 'Inline findings', desc: 'Severity-grouped suggestions with code fix previews' },
            { icon: MessageSquare, label: 'AI chat', desc: 'Ask GPT-4o about any endpoint or suggestion' },
            { icon: Globe, label: 'Extension host compatible', desc: 'VS Code, Cursor, Windsurf, any host-compatible editor' },
          ]}
          delay={0.2}
        />

        <Section
          icon={LayoutDashboard}
          badge="Web Dashboard"
          title="Recost Dashboard"
          subtitle="React · TanStack Query · Tailwind CSS"
          description="This web app. Manage multiple projects, view full cost breakdowns, explore the API dependency graph, read optimization suggestions with estimated savings, and re-run scans with new API call data. Every page fetches live data from the Recost backend."
          features={[
            { icon: LayoutDashboard, label: 'Project dashboard', desc: 'Cost breakdown, stat cards, provider cost bars' },
            { icon: Server, label: 'Endpoints explorer', desc: 'Filter by provider, status, or HTTP method' },
            { icon: DollarSign, label: 'Savings summary', desc: 'Total estimated monthly savings across all suggestions' },
            { icon: GitBranch, label: 'Graph view', desc: 'Interactive file → endpoint dependency visualization' },
          ]}
          delay={0.3}
        />

        {/* CTA */}
        <Motion.div {...FADE(0.4)} className="text-center pt-4">
          <Link
            to="/docs/extension"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-[#0a0a0a] text-[15px] font-medium transition-all hover:-translate-y-0.5"
            style={{ background: ACCENT }}
          >
            Extension docs
            <ArrowRight size={16} />
          </Link>
        </Motion.div>
      </section>

      <Footer />
    </main>
  );
}
