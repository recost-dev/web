import { Link } from 'react-router'
import { Navigation } from '@/components/landing/navigation'
import { Footer } from '@/components/landing/footer'
import { Code2, PuzzleIcon, ArrowRight, Terminal, Zap, TreePine } from 'lucide-react'

export default function DocsPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a]">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 animated-gradient pointer-events-none" />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="relative mx-auto max-w-6xl px-6">
          <p className="text-xs uppercase tracking-[0.12em] mb-3 text-[#d4900a]">Documentation</p>
          <h1 className="text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl text-balance">
            Everything you need to{' '}
            <span className="text-[#d4900a]">get started</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[#a3a3a3]">
            Learn how to integrate the Recost SDK, set up cost tracking, and use the browser extension — all in one place.
          </p>
        </div>
      </section>

      {/* Doc cards */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {/* API Docs card */}
          <Link to="/docs/api" className="group block">
            <div className="relative h-full rounded-lg border border-[#262626] bg-[#111111] p-8 transition-all duration-200 hover:border-[#d4900a]/40">
              <div className="mb-6 inline-flex rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 group-hover:border-[#d4900a]/30 transition-colors duration-200">
                <Code2 className="h-6 w-6 text-[#d4900a]" />
              </div>

              <h2 className="text-xl font-bold text-[#fafafa] mb-2">API Documentation</h2>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">
                Full reference for the Recost SDK and REST API. Covers installation, authentication, cost tracking endpoints, scan management, and webhook events.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-8">
                {['SDK Install', 'REST API', 'Authentication', 'Webhooks'].map(label => (
                  <span
                    key={label}
                    className="rounded border border-[#262626] px-2.5 py-1 text-xs text-[#737373]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#d4900a]">
                View API docs
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* Extension Docs card */}
          <Link to="/docs/extension" className="group block">
            <div className="relative h-full rounded-lg border border-[#262626] bg-[#111111] p-8 transition-all duration-200 hover:border-[#d4900a]/40">
              <div className="mb-6 inline-flex rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 group-hover:border-[#d4900a]/30 transition-colors duration-200">
                <PuzzleIcon className="h-6 w-6 text-[#d4900a]" />
              </div>

              <h2 className="text-xl font-bold text-[#fafafa] mb-2">Extension Documentation</h2>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">
                Set up and use the Recost VS Code extension. Covers installation across platforms, configuration, real-time cost overlays, and dashboard integration.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-8">
                {['VS Code', 'Installation', 'Configuration', 'Dashboard'].map(label => (
                  <span
                    key={label}
                    className="rounded border border-[#262626] px-2.5 py-1 text-xs text-[#737373]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#d4900a]">
                View extension docs
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          {/* SDK Docs card */}
          <Link to="/docs/sdk" className="group block">
            <div className="relative h-full rounded-lg border border-[#262626] bg-[#111111] p-8 transition-all duration-200 hover:border-[#d4900a]/40">
              <div className="mb-6 inline-flex rounded-lg border border-[#262626] bg-[#0a0a0a] p-3 group-hover:border-[#d4900a]/30 transition-colors duration-200">
                <TreePine className="h-6 w-6 text-[#d4900a]" />
              </div>

              <h2 className="text-xl font-bold text-[#fafafa] mb-2">SDK Documentation</h2>
              <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">
                Integrate the Node.js and Python SDKs. One call to init() patches your HTTP clients and starts streaming cost telemetry automatically.
              </p>

              <div className="flex flex-wrap gap-1.5 mb-8">
                {['Node.js', 'Python', 'Express', 'FastAPI', 'Flask'].map(label => (
                  <span
                    key={label}
                    className="rounded border border-[#262626] px-2.5 py-1 text-xs text-[#737373]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-[#d4900a]">
                View SDK docs
                <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 border-t border-[#262626] pt-8">
          <p className="text-xs uppercase tracking-[0.12em] text-[#737373] mb-5">Quick links</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Link
              to="/docs/api#installation"
              className="flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors duration-150"
            >
              <Terminal className="h-3.5 w-3.5 text-[#d4900a] flex-shrink-0" />
              SDK Installation
            </Link>
            <Link
              to="/docs/api#authentication"
              className="flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors duration-150"
            >
              <Zap className="h-3.5 w-3.5 text-[#d4900a] flex-shrink-0" />
              Authentication
            </Link>
            <Link
              to="/docs/extension#installation"
              className="flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors duration-150"
            >
              <PuzzleIcon className="h-3.5 w-3.5 text-[#d4900a] flex-shrink-0" />
              Extension Setup
            </Link>
            <Link
              to="/docs/sdk#node-quick-start"
              className="flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors duration-150"
            >
              <TreePine className="h-3.5 w-3.5 text-[#d4900a] flex-shrink-0" />
              Node.js Quick Start
            </Link>
            <Link
              to="/docs/sdk#python-quick-start"
              className="flex items-center gap-2 text-sm text-[#a3a3a3] hover:text-[#fafafa] transition-colors duration-150"
            >
              <TreePine className="h-3.5 w-3.5 text-[#d4900a] flex-shrink-0" />
              Python Quick Start
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
