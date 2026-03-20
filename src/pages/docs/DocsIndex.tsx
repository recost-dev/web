import { Link } from 'react-router'
import { Navigation } from '@/components/landing/navigation'
import { Footer } from '@/components/landing/footer'
import { Code2, PuzzleIcon, ArrowRight, BookOpen, Terminal, Zap } from 'lucide-react'

export default function DocsPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 animated-gradient pointer-events-none" />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#111111] px-4 py-1.5 text-sm">
            <BookOpen className="h-3.5 w-3.5 text-[#34d399]" />
            <span className="text-[#a3a3a3]">Documentation</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl text-balance">
            Everything you need to{' '}
            <span className="text-[#34d399]">get started</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#a3a3a3] text-balance">
            Learn how to integrate the Recost SDK, set up cost tracking, and use the browser extension — all in one place.
          </p>
        </div>
      </section>

      {/* Doc cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2">

          {/* API Docs card */}
          <Link to="/docs/api" className="group block">
            <div className="relative h-full rounded-2xl border border-[#262626] bg-[#111111] p-8 transition-all duration-200 hover:border-[#34d399]/40 hover:bg-[#111111]/80 glow-green">
              {/* Icon */}
              <div className="mb-6 inline-flex rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 group-hover:border-[#34d399]/30 transition-colors duration-200">
                <Code2 className="h-6 w-6 text-[#34d399]" />
              </div>

              <h2 className="text-xl font-bold text-[#fafafa] mb-2">API Documentation</h2>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">
                Full reference for the Recost SDK and REST API. Covers installation, authentication, cost tracking endpoints, scan management, and webhook events.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['SDK Install', 'REST API', 'Authentication', 'Webhooks'].map(label => (
                  <span
                    key={label}
                    className="rounded-full border border-[#262626] bg-[#0a0a0a] px-3 py-1 text-xs text-[#737373]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#34d399]">
                View API docs
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Extension Docs card */}
          <Link to="/docs/extension" className="group block">
            <div className="relative h-full rounded-2xl border border-[#262626] bg-[#111111] p-8 transition-all duration-200 hover:border-[#34d399]/40 hover:bg-[#111111]/80">
              {/* Icon */}
              <div className="mb-6 inline-flex rounded-xl border border-[#262626] bg-[#0a0a0a] p-3 group-hover:border-[#34d399]/30 transition-colors duration-200">
                <PuzzleIcon className="h-6 w-6 text-[#34d399]" />
              </div>

              <h2 className="text-xl font-bold text-[#fafafa] mb-2">Extension Documentation</h2>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">
                Set up and use the Recost browser extension. Covers installation across platforms, configuration, real-time cost overlays, and dashboard integration.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Chrome / Firefox', 'Installation', 'Configuration', 'Dashboard'].map(label => (
                  <span
                    key={label}
                    className="rounded-full border border-[#262626] bg-[#0a0a0a] px-3 py-1 text-xs text-[#737373]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#34d399]">
                View extension docs
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick links strip */}
        <div className="mt-8 rounded-2xl border border-[#262626] bg-[#111111] p-6">
          <p className="text-xs uppercase tracking-widest text-[#737373] mb-4 font-mono">Quick links</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              to="/docs/api#installation"
              className="flex items-center gap-3 rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-[#a3a3a3] hover:border-[#34d399]/30 hover:text-[#fafafa] transition-all duration-150"
            >
              <Terminal className="h-4 w-4 text-[#34d399] flex-shrink-0" />
              SDK Installation
            </Link>
            <Link
              to="/docs/api#authentication"
              className="flex items-center gap-3 rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-[#a3a3a3] hover:border-[#34d399]/30 hover:text-[#fafafa] transition-all duration-150"
            >
              <Zap className="h-4 w-4 text-[#34d399] flex-shrink-0" />
              Authentication
            </Link>
            <Link
              to="/docs/extension#installation"
              className="flex items-center gap-3 rounded-xl border border-[#262626] bg-[#0a0a0a] px-4 py-3 text-sm text-[#a3a3a3] hover:border-[#34d399]/30 hover:text-[#fafafa] transition-all duration-150"
            >
              <PuzzleIcon className="h-4 w-4 text-[#34d399] flex-shrink-0" />
              Extension Setup
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
