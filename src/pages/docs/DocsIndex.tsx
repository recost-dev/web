import React from 'react'
import { Link } from 'react-router'
import { Navigation } from '@/components/landing/navigation'
import { Footer } from '@/components/landing/footer'
import { Code2, PuzzleIcon, ArrowRight, Terminal, Zap, TreePine, Download, BarChart3, KeyRound } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Download,
    title: 'Install the SDK or extension',
    description: 'npm install @recost/node for Node.js, pip install recost for Python, or install the VS Code extension to scan your workspace without any code changes. Zero configuration required.',
    link: '/docs/sdk',
    linkLabel: 'SDK documentation',
    secondaryLink: '/docs/extension',
    secondaryLinkLabel: 'Extension docs',
  },
  {
    step: '02',
    icon: KeyRound,
    title: 'Get your API key',
    description: 'Sign in to your Recost account and generate an API key from the Account page. Pass it as RECOST_API_KEY in your environment — the SDK picks it up automatically.',
    link: '/dashboard/account',
    linkLabel: 'Account settings',
  },
  {
    step: '03',
    icon: Zap,
    title: 'Call init() once',
    description: 'One line at process startup. Recost patches fetch, http, and https automatically and starts capturing every outbound API call with no wrappers or manual instrumentation.',
    link: '/docs/api',
    linkLabel: 'API reference',
  },
  {
    step: '04',
    icon: BarChart3,
    title: 'See costs in real time',
    description: 'Cost breakdowns by provider, endpoint, and model appear in your dashboard and VS Code extension. Streamed every 30 seconds with no delay.',
    link: '/docs/extension',
    linkLabel: 'Extension docs',
  },
]

const docCards = [
  {
    icon: Code2,
    title: 'API Documentation',
    description: 'Full reference for the Recost SDK and REST API. Covers installation, authentication, cost tracking endpoints, scan management, and webhook events.',
    tags: ['SDK Install', 'REST API', 'Authentication', 'Webhooks'],
    link: '/docs/api',
    linkLabel: 'View API docs',
  },
  {
    icon: PuzzleIcon,
    title: 'Extension Documentation',
    description: 'Set up and use the Recost VS Code extension. Covers installation across platforms, configuration, real-time cost overlays, and dashboard integration.',
    tags: ['VS Code', 'Installation', 'Configuration', 'Dashboard'],
    link: '/docs/extension',
    linkLabel: 'View extension docs',
  },
  {
    icon: TreePine,
    title: 'SDK Documentation',
    description: 'Integrate the Node.js and Python SDKs. One call to init() patches your HTTP clients and starts streaming cost telemetry automatically.',
    tags: ['Node.js', 'Python', 'Express', 'FastAPI', 'Flask'],
    link: '/docs/sdk',
    linkLabel: 'View SDK docs',
  },
]

function DocCard({ icon: Icon, title, description, tags, link, linkLabel }: {
  icon: React.ElementType
  title: string
  description: string
  tags: string[]
  link: string
  linkLabel: string
}) {
  return (
    <Link to={link} className="group block h-full">
      <div className="relative h-full rounded-lg border border-[#262626] bg-[#0d0d0d] p-8 transition-all duration-200 hover:border-[#d4900a]/40">
        <div className="mb-6 inline-flex rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 group-hover:border-[#d4900a]/30 transition-colors duration-200">
          <Icon className="h-6 w-6 text-[#d4900a]" />
        </div>
        <h2 className="text-xl font-bold text-[#fafafa] mb-2">{title}</h2>
        <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">{description}</p>
        <div className="flex flex-wrap gap-1.5 mb-8">
          {tags.map(label => (
            <span key={label} className="rounded border border-[#262626] px-2.5 py-1 text-xs text-[#737373]">
              {label}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-[#d4900a]">
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

export default function DocsPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 animated-gradient pointer-events-none" />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-12">
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.12em] mb-3 text-[#d4900a]">Documentation</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl text-balance">
            Everything you need to{' '}
            <span className="text-[#d4900a]">get started</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[#a3a3a3]">
            Integrate the SDK, set up cost tracking, or install the VS Code extension. Start in under 2 minutes.
          </p>
        </div>
      </section>

      {/* How it works — editorial list, not cards */}
      <section className="relative mx-auto max-w-6xl px-6 pb-16">
        {steps.map(({ step, icon: Icon, title, description, link, linkLabel, secondaryLink, secondaryLinkLabel }, i) => (
          <div key={step} className="group border-t border-[#262626] py-10 grid grid-cols-[80px_1fr_auto] gap-8 items-start">
            {/* Step number */}
            <span className="font-mono text-5xl font-bold tabular-nums leading-none select-none"
              style={{ color: `rgba(212,144,10,${0.12 + i * 0.06})` }}>
              {step}
            </span>

            {/* Content */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-4 w-4 text-[#d4900a] shrink-0" />
                <h2 className="text-2xl font-bold text-[#fafafa]">{title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-[#737373] max-w-xl">{description}</p>
            </div>

            {/* Direction links */}
            <div className="flex flex-col gap-2 mt-1">
              <Link
                to={link}
                className="flex items-center gap-2 text-sm font-medium text-[#a3a3a3] hover:text-[#d4900a] transition-colors whitespace-nowrap"
              >
                {linkLabel}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              {secondaryLink && (
                <Link
                  to={secondaryLink}
                  className="flex items-center gap-2 text-sm font-medium text-[#a3a3a3] hover:text-[#d4900a] transition-colors whitespace-nowrap"
                >
                  {secondaryLinkLabel}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Reference docs */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="border-t border-[#262626] pt-10 mb-8">
          <p className="text-xs uppercase tracking-[0.12em] text-[#737373]">Reference docs</p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {docCards.slice(0, 2).map(({ icon: Icon, title, description, tags, link, linkLabel }) => (
            <DocCard key={title} icon={Icon} title={title} description={description} tags={tags} link={link} linkLabel={linkLabel} />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <div className="w-1/2">
            {docCards.slice(2).map(({ icon: Icon, title, description, tags, link, linkLabel }) => (
              <DocCard key={title} icon={Icon} title={title} description={description} tags={tags} link={link} linkLabel={linkLabel} />
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-10 border-t border-[#262626] pt-8">
          <p className="text-xs uppercase tracking-[0.12em] text-[#737373] mb-5">Quick links</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { to: '/docs/api#installation', icon: Terminal, label: 'SDK Installation' },
              { to: '/docs/api#authentication', icon: Zap, label: 'Authentication' },
              { to: '/docs/extension#installation', icon: PuzzleIcon, label: 'Extension Setup' },
              { to: '/docs/sdk#node-quick-start', icon: TreePine, label: 'Node.js Quick Start' },
              { to: '/docs/sdk#python-quick-start', icon: TreePine, label: 'Python Quick Start' },
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors duration-150"
              >
                <Icon className="h-3.5 w-3.5 text-[#d4900a] flex-shrink-0" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
