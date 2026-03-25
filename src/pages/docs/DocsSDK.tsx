
import React, { useRef, useState, useEffect } from 'react';
import { motion as Motion } from 'motion/react';
import { Link } from 'react-router';
import {
  ArrowLeft,
  ChevronUp,
  Layers,
  Zap,
  Code2,
  Settings,
  Server,
  Globe,
  Leaf,
  TreePine,
  GitBranch,
  DollarSign,
  MessageSquare,
} from 'lucide-react';

// ─── Animation helper ────────────────────────────────────────────────────────

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

// ─── CodeBlock ───────────────────────────────────────────────────────────────

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      style={{
        fontFamily: "'Geist Mono Variable', monospace",
        fontSize: '11px',
        lineHeight: 1.7,
        backgroundColor: 'rgba(0,0,0,0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '14px 16px',
        overflowX: 'auto',
        color: 'rgba(255,255,255,0.75)',
        margin: 0,
        whiteSpace: 'pre',
      }}
    >
      <code>{children}</code>
    </pre>
  );
}

// ─── SubHeading ───────────────────────────────────────────────────────────────

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Geist Mono Variable', monospace",
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

// ─── DataTable ────────────────────────────────────────────────────────────────

function DataTable({ rows, headers }: { rows: string[][]; headers: string[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '6px 10px',
                  fontFamily: "'Geist Mono Variable', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  style={{
                    padding: '7px 10px',
                    fontFamily: j <= 1 ? "'Geist Mono Variable', monospace" : 'inherit',
                    fontSize: j <= 1 ? '11px' : '12px',
                    color: j === 0 ? '#60a5fa' : j === 1 ? '#fbbf24' : 'rgba(255,255,255,0.45)',
                    verticalAlign: 'top',
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SectionCard ─────────────────────────────────────────────────────────────

function SectionCard({
  id,
  icon: Icon,
  badge,
  title,
  subtitle,
  delay,
  children,
}: {
  id: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  subtitle: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Motion.div
      id={id}
      {...FADE(delay)}
      className="rounded-2xl border p-8 backdrop-blur-xl scroll-mt-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderColor: 'rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-[22px] text-white mb-1" style={{ fontFamily: 'inherit', fontWeight: 700 }}>
            {title}
          </h2>
          <p className="text-[13px]" style={{ color: '#d4900a', fontFamily: 'inherit', fontWeight: 500 }}>
            {subtitle}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded text-[11px] uppercase tracking-widest flex-shrink-0"
          style={{
            background: `${'#d4900a'}22`,
            color: '#d4900a',
            border: `1px solid ${'#d4900a'}44`,
            fontFamily: "'Geist Mono Variable', monospace",
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

// ─── SectionLabel ─────────────────────────────────────────────────────────────

function SectionLabel({
  id,
  icon: Icon,
  label,
  delay,
}: {
  id: string;
  icon: React.ElementType;
  label: string;
  delay: number;
}) {
  return (
    <Motion.div id={id} {...FADE(delay)} className="flex items-center gap-3 pt-2 scroll-mt-8">
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-widest shrink-0"
        style={{
          background: `${'#d4900a'}18`,
          color: '#d4900a',
          border: `1px solid ${'#d4900a'}33`,
          fontFamily: "'Geist Mono Variable', monospace",
        }}
      >
        <Icon size={12} />
        {label}
      </div>
      <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
    </Motion.div>
  );
}

// ─── TOC ─────────────────────────────────────────────────────────────────────

const TOC_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { id: 'overview', label: 'Overview' },
    ],
  },
  {
    label: 'Node.js SDK',
    items: [
      { id: 'node-install', label: 'Installation' },
      { id: 'node-quick-start', label: 'Quick Start' },
      { id: 'node-config', label: 'Config Options' },
      { id: 'node-express', label: 'Express' },
      { id: 'node-fastify', label: 'Fastify' },
    ],
  },
  {
    label: 'Python SDK',
    items: [
      { id: 'python-install', label: 'Installation' },
      { id: 'python-quick-start', label: 'Quick Start' },
      { id: 'python-config', label: 'Config Options' },
      { id: 'python-fastapi', label: 'FastAPI' },
      { id: 'python-flask', label: 'Flask' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { id: 'transport', label: 'Transport Modes' },
      { id: 'custom-providers', label: 'Custom Providers' },
    ],
  },
];

function TOCSidebar({ activeSection }: { activeSection: string }) {
  return (
    <nav
      className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-hide"
      style={{ width: '100%', minWidth: '280px' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {TOC_SECTIONS.map((section, sectionIndex) => (
          <div key={section.label}>
            <p
              style={{
                fontFamily: "'Geist Mono Variable', monospace",
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
                marginTop: sectionIndex === 0 ? 0 : '18px',
                marginBottom: '10px',
              }}
            >
              {section.label}
            </p>
            {section.items.map(({ id, label }) => {
              const isActive = activeSection === id;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  style={{
                    fontFamily: 'inherit',
                    fontSize: isActive ? '16px' : '15px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.3)',
                    background: 'transparent',
                    textDecoration: 'none',
                    padding: '6px 10px 6px 16px',
                    borderRadius: '8px',
                    display: 'block',
                    transition: 'color 0.2s, background 0.2s, font-size 0.2s, font-weight 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.3)';
                    }
                  }}
                >
                  {label}
                </a>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocsSDK() {
  const mainRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const ids = TOC_SECTIONS.flatMap(s => s.items.map(i => i.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setShowScrollTop(el.scrollTop > 400);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[#0a0a0a]">
      {/* Background */}
      <div className="absolute inset-0 z-0 dot-grid opacity-40" />
      <div className="absolute inset-0 z-[1] animated-gradient" />

      {/* Top bar */}
      <header className="sticky top-0 z-20 flex-shrink-0 flex items-center justify-between px-8 py-3 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
        <Link
          to="/docs"
          className="flex items-center gap-2 text-[12px] text-[#a3a3a3] hover:text-[#fafafa] transition-colors font-mono"
        >
          <ArrowLeft size={14} />
          Back to Docs
        </Link>
        <span className="text-[17px] font-bold text-white font-mono">
          recost
        </span>
      </header>

      {/* Body: TOC (fixed) + scrollable main */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Left: TOC sidebar */}
        <aside className="hidden md:flex flex-col shrink-0 px-8 pt-14 pb-8 w-[260px] self-stretch bg-[#0a0a0a]/60 border-r border-[#262626]">
          <TOCSidebar activeSection={activeSection} />
        </aside>

        {/* Right: scrollable content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto scrollbar-hide px-6 md:px-10">
          <div className="pb-24 space-y-5" style={{ maxWidth: 'calc(100% * 6 / 7)', margin: '0 auto' }}>
            {/* Hero */}
            <Motion.div {...FADE(0)} className="px-4 pt-14 pb-6">
              <h1
                className="text-[40px] md:text-[52px] text-white mb-3"
                style={{ fontFamily: 'inherit', fontWeight: 900, lineHeight: 1.05 }}
              >
                SDK Docs
              </h1>
              <p style={{ fontFamily: 'inherit', fontSize: '16px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                Reference for the <code style={{ fontFamily: "'Geist Mono Variable', monospace", color: 'rgba(255,255,255,0.7)' }}>@recost/node</code> and <code style={{ fontFamily: "'Geist Mono Variable', monospace", color: 'rgba(255,255,255,0.7)' }}>recost</code> Python SDKs. One call to <code style={{ fontFamily: "'Geist Mono Variable', monospace", color: 'rgba(255,255,255,0.7)' }}>init()</code> patches your HTTP clients and starts streaming cost telemetry.
              </p>
            </Motion.div>

            {/* ── Overview ─────────────────────────────────────── */}
            <SectionCard id="overview" icon={Layers} badge="Overview" title="How the SDKs work" subtitle="Automatic HTTP interception · Zero config · 30-second telemetry windows" delay={0.05}>
              <p style={{ fontFamily: 'inherit', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '16px' }}>
                Both SDKs work the same way: call <code style={{ fontFamily: "'Geist Mono Variable', monospace", fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>init()</code> once at startup and every outbound HTTP call is automatically intercepted, matched against the built-in provider registry, and aggregated into 30-second windows. At each flush the summary is shipped to the Recost cloud API or your local VS Code extension — no changes to your existing HTTP clients required.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { icon: Zap, label: 'Zero config', desc: 'Call init() once. Patches fetch, http, https (Node) or urllib3, httpx, aiohttp (Python) automatically' },
                  { icon: DollarSign, label: 'Provider matching', desc: 'Built-in registry covers OpenAI, Anthropic, Stripe, Twilio, SendGrid, Pinecone, AWS, Google Cloud, and more' },
                  { icon: Leaf, label: 'Sustainability', desc: 'Every matched call is tagged with CO₂, electricity, and water estimates on the server side' },
                  { icon: Globe, label: 'Two transport modes', desc: 'Cloud mode sends to api.recost.dev; local mode streams to the VS Code extension via WebSocket' },
                  { icon: Code2, label: 'Framework adapters', desc: 'Express, Fastify (Node) and FastAPI, Flask (Python) — thin wrappers around init()' },
                  { icon: GitBranch, label: 'Custom providers', desc: 'Extend the built-in registry with your own host patterns, endpoint categories, and cost estimates' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-md shrink-0" style={{ background: '#d4900a14' }}>
                      <Icon size={12} style={{ color: '#d4900a' }} />
                    </div>
                    <div>
                      <p className="text-[12px] text-white mb-0.5" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>{label}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)', fontFamily: 'inherit' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ── Node.js SDK ────────────────────────────────────── */}
            <SectionLabel id="node-install" icon={TreePine} label="Node.js SDK" delay={0.08} />

            <SectionCard id="node-install" icon={TreePine} badge="Node.js" title="Installation" subtitle="@recost/node · Node 18+ · ESM + CJS" delay={0.09}>
              <SubHeading>npm / yarn / pnpm</SubHeading>
              <CodeBlock>{`npm install @recost/node
# yarn add @recost/node
# pnpm add @recost/node`}</CodeBlock>
              <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginTop: '10px' }}>
                Requires Node.js 18 or later. The package ships dual ESM + CJS output — no extra config needed for either module system.
              </p>
            </SectionCard>

            <SectionCard id="node-quick-start" icon={Zap} badge="Node.js" title="Quick Start" subtitle="Call init() once at process startup" delay={0.1}>
              <SubHeading>Cloud mode (sends to api.recost.dev)</SubHeading>
              <CodeBlock>{`import { init } from '@recost/node';

init({
  apiKey:    process.env.RECOST_API_KEY,
  projectId: process.env.RECOST_PROJECT_ID,
});

// All outbound HTTP calls are now tracked automatically.
// No changes to fetch, axios, got, or any other client needed.
const res = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${process.env.OPENAI_API_KEY}\` },
  body: JSON.stringify({ model: 'gpt-4o', messages: [...] }),
});`}</CodeBlock>
              <SubHeading>Local mode (streams to VS Code extension)</SubHeading>
              <CodeBlock>{`import { init } from '@recost/node';

// No arguments — connects to the VS Code extension on localhost:9847
init();`}</CodeBlock>
              <SubHeading>Teardown</SubHeading>
              <CodeBlock>{`const handle = init({ apiKey: '...', projectId: '...' });

// Stops interception, flushes pending events, closes transport
handle.dispose();`}</CodeBlock>
              <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginTop: '10px' }}>
                Calling <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>init()</code> a second time automatically disposes the previous instance before re-initializing. The flush timer uses <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>timer.unref()</code> so it will not keep your Node process alive.
              </p>
            </SectionCard>

            <SectionCard id="node-config" icon={Settings} badge="Node.js" title="Config Options" subtitle="All fields optional — sensible defaults out of the box" delay={0.11}>
              <DataTable
                headers={['Option', 'Type', 'Default', 'Description']}
                rows={[
                  ['apiKey', 'string', '—', 'API key for api.recost.dev. Omit to run in local (VS Code) mode.'],
                  ['projectId', 'string', '—', 'Project ID on api.recost.dev. Required when apiKey is set.'],
                  ['environment', 'string', '"development"', 'Environment tag attached to all telemetry.'],
                  ['flushIntervalMs', 'number', '30000', 'Milliseconds between automatic aggregator flushes.'],
                  ['maxBatchSize', 'number', '100', 'Trigger an early flush when this many raw events accumulate.'],
                  ['localPort', 'number', '9847', 'Localhost port for the VS Code extension WebSocket in local mode.'],
                  ['debug', 'boolean', 'false', 'Log detailed telemetry activity to stdout.'],
                  ['enabled', 'boolean', 'true', 'Master kill switch. Set to false to disable all patching (useful in tests).'],
                  ['customProviders', 'ProviderDef[]', '[]', 'Additional provider rules merged before built-ins (higher priority).'],
                  ['excludePatterns', 'string[]', '[]', 'URL substrings — matching requests are silently dropped.'],
                  ['baseUrl', 'string', '"https://api.recost.dev"', 'Cloud API base URL override.'],
                  ['maxRetries', 'number', '3', 'Maximum retry attempts for failed cloud flushes.'],
                  ['onError', '(e: Error) => void', '—', 'Called when the SDK encounters an internal error. Silently swallowed if omitted.'],
                ]}
              />
            </SectionCard>

            <SectionCard id="node-express" icon={Server} badge="Node.js" title="Express" subtitle="Mount early in the middleware chain" delay={0.12}>
              <CodeBlock>{`import express from 'express';
import { createExpressMiddleware } from '@recost/node';

const app = express();

app.use(createExpressMiddleware({
  apiKey:    process.env.RECOST_API_KEY,
  projectId: process.env.RECOST_PROJECT_ID,
}));

// ... your routes`}</CodeBlock>
              <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginTop: '10px' }}>
                <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>createExpressMiddleware</code> calls <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>init()</code> internally and returns a no-op <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>next()</code> middleware. Express is a peer dependency.
              </p>
            </SectionCard>

            <SectionCard id="node-fastify" icon={Server} badge="Node.js" title="Fastify" subtitle="Register at the root level" delay={0.13}>
              <CodeBlock>{`import Fastify from 'fastify';
import { createFastifyPlugin } from '@recost/node';

const app = Fastify();

await app.register(createFastifyPlugin, {
  apiKey:    process.env.RECOST_API_KEY,
  projectId: process.env.RECOST_PROJECT_ID,
});

// ... your routes`}</CodeBlock>
              <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginTop: '10px' }}>
                <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>createFastifyPlugin</code> is a standard Fastify plugin (accepts <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>done</code> callback). Fastify is a peer dependency.
              </p>
            </SectionCard>

            {/* ── Python SDK ────────────────────────────────────── */}
            <SectionLabel id="python-install" icon={TreePine} label="Python SDK" delay={0.15} />

            <SectionCard id="python-install" icon={TreePine} badge="Python" title="Installation" subtitle="recost · Python 3.9+ · zero core dependencies" delay={0.16}>
              <SubHeading>pip</SubHeading>
              <CodeBlock>{`pip install recost

# With FastAPI / Starlette support
pip install "recost[fastapi]"

# With Flask support
pip install "recost[flask]"`}</CodeBlock>
              <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginTop: '10px' }}>
                The core package has zero dependencies. Optional extras install <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>starlette</code> or <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>flask</code> for their respective framework adapters.
              </p>
            </SectionCard>

            <SectionCard id="python-quick-start" icon={Zap} badge="Python" title="Quick Start" subtitle="Call init() once at application startup" delay={0.17}>
              <SubHeading>Cloud mode (sends to api.recost.dev)</SubHeading>
              <CodeBlock>{`import os
from recost import init, RecostConfig

init(RecostConfig(
    api_key=os.environ["RECOST_API_KEY"],
    project_id=os.environ["RECOST_PROJECT_ID"],
))

# All outbound HTTP calls via requests, httpx, or aiohttp are now tracked.
import requests
response = requests.post(
    "https://api.openai.com/v1/chat/completions",
    headers={"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"},
    json={"model": "gpt-4o", "messages": [...]},
)`}</CodeBlock>
              <SubHeading>Local mode (streams to VS Code extension)</SubHeading>
              <CodeBlock>{`from recost import init

# No arguments — connects to the VS Code extension on localhost:9847
init()`}</CodeBlock>
              <SubHeading>Async (httpx / aiohttp)</SubHeading>
              <CodeBlock>{`import httpx
from recost import init, RecostConfig

init(RecostConfig(api_key="...", project_id="..."))

async def main():
    async with httpx.AsyncClient() as client:
        # Tracked automatically
        resp = await client.post("https://api.anthropic.com/v1/messages", ...)`}</CodeBlock>
              <SubHeading>Teardown</SubHeading>
              <CodeBlock>{`from recost import init, RecostConfig

handle = init(RecostConfig(api_key="...", project_id="..."))

# Stops interception, flushes pending events, closes transport
handle.dispose()`}</CodeBlock>
            </SectionCard>

            <SectionCard id="python-config" icon={Settings} badge="Python" title="Config Options" subtitle="All fields optional — pass as RecostConfig dataclass" delay={0.18}>
              <DataTable
                headers={['Option', 'Type', 'Default', 'Description']}
                rows={[
                  ['api_key', 'str | None', 'None', 'API key for api.recost.dev. Omit to run in local (VS Code) mode.'],
                  ['project_id', 'str | None', 'None', 'Project ID on api.recost.dev. Required when api_key is set.'],
                  ['environment', 'str', '"development"', 'Environment tag attached to all telemetry.'],
                  ['flush_interval', 'float', '30.0', 'Seconds between automatic aggregator flushes.'],
                  ['max_batch_size', 'int', '100', 'Trigger an early flush when this many raw events accumulate.'],
                  ['local_port', 'int', '9847', 'Localhost port for the VS Code extension WebSocket in local mode.'],
                  ['debug', 'bool', 'False', 'Print detailed telemetry activity to stderr.'],
                  ['enabled', 'bool', 'True', 'Master kill switch. Set to False to disable all patching (useful in tests).'],
                  ['custom_providers', 'list[ProviderDef]', '[]', 'Additional provider rules merged before built-ins (higher priority).'],
                  ['exclude_patterns', 'list[str]', '[]', 'URL substrings — matching requests are silently dropped.'],
                  ['base_url', 'str', '"https://api.recost.dev"', 'Cloud API base URL override.'],
                  ['max_retries', 'int', '3', 'Maximum retry attempts for failed cloud flushes.'],
                  ['on_error', 'Callable | None', 'None', 'Called when the SDK encounters an internal error. Silently swallowed if None.'],
                ]}
              />
            </SectionCard>

            <SectionCard id="python-fastapi" icon={Server} badge="Python" title="FastAPI" subtitle="ASGI middleware — initializes on app startup" delay={0.19}>
              <CodeBlock>{`from fastapi import FastAPI
from recost.frameworks.fastapi import RecostMiddleware

app = FastAPI()

app.add_middleware(
    RecostMiddleware,
    api_key="rc-xxxxxxxxxxxx",
    project_id="your-project-id",
)

# ... your routes`}</CodeBlock>
              <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginTop: '10px' }}>
                You can also pass a <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>RecostConfig</code> instance directly: <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>RecostMiddleware(config=RecostConfig(...))</code>. Requires <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>pip install "recost[fastapi]"</code>.
              </p>
            </SectionCard>

            <SectionCard id="python-flask" icon={Server} badge="Python" title="Flask" subtitle="Flask extension — supports init_app() pattern" delay={0.2}>
              <CodeBlock>{`from flask import Flask
from recost.frameworks.flask import ReCost

app = Flask(__name__)
ReCost(app, api_key="rc-xxxxxxxxxxxx", project_id="your-project-id")

# ... your routes`}</CodeBlock>
              <SubHeading>Application factory pattern</SubHeading>
              <CodeBlock>{`from flask import Flask
from recost.frameworks.flask import ReCost

recost = ReCost()

def create_app():
    app = Flask(__name__)
    recost.init_app(app, api_key="rc-xxxxxxxxxxxx", project_id="your-project-id")
    return app`}</CodeBlock>
              <p style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6, marginTop: '10px' }}>
                Requires <code style={{ fontFamily: "'Geist Mono Variable', monospace" }}>pip install "recost[flask]"</code>.
              </p>
            </SectionCard>

            {/* ── Reference ────────────────────────────────────── */}
            <SectionLabel id="transport" icon={Globe} label="Reference" delay={0.22} />

            <SectionCard id="transport" icon={Globe} badge="Reference" title="Transport Modes" subtitle="Cloud mode and local mode — selected automatically" delay={0.23}>
              <p style={{ fontFamily: 'inherit', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '16px' }}>
                The transport mode is determined automatically at init time: if <code style={{ fontFamily: "'Geist Mono Variable', monospace", fontSize: '12px' }}>apiKey</code> (Node) or <code style={{ fontFamily: "'Geist Mono Variable', monospace", fontSize: '12px' }}>api_key</code> (Python) is provided, the SDK runs in cloud mode; otherwise it runs in local mode and streams to the VS Code extension.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: 'Cloud mode',
                    items: [
                      'HTTPS POST to api.recost.dev on each flush',
                      'Exponential-backoff retry (max 3 attempts)',
                      '4xx responses skip retry — payload is dropped',
                      'SDK endpoint auto-excluded to prevent self-instrumentation',
                    ],
                  },
                  {
                    label: 'Local mode',
                    items: [
                      'WebSocket to localhost:9847 (VS Code extension)',
                      'Auto-reconnect every 3s on connection loss',
                      'Messages queued during disconnection, drained on reconnect',
                      'Background daemon thread (Python) or unref\'d timer (Node)',
                    ],
                  },
                ].map(({ label, items }) => (
                  <div key={label}>
                    <p
                      style={{ fontFamily: "'Geist Mono Variable', monospace", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d4900a', marginBottom: '10px' }}
                    >
                      {label}
                    </p>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {items.map((item) => (
                        <li key={item} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <span style={{ color: '#d4900a', marginTop: '2px', flexShrink: 0 }}>·</span>
                          <span style={{ fontFamily: 'inherit', fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard id="custom-providers" icon={GitBranch} badge="Reference" title="Custom Providers" subtitle="Extend the built-in registry with your own host patterns" delay={0.24}>
              <p style={{ fontFamily: 'inherit', fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: '12px' }}>
                Custom providers are prepended before built-in rules and take priority. Supports exact hostnames and wildcard patterns like <code style={{ fontFamily: "'Geist Mono Variable', monospace", fontSize: '12px' }}>*.mycompany.com</code>.
              </p>
              <SubHeading>Node.js</SubHeading>
              <CodeBlock>{`import { init } from '@recost/node';

init({
  apiKey:    process.env.RECOST_API_KEY,
  projectId: process.env.RECOST_PROJECT_ID,
  customProviders: [
    {
      hostPattern: 'api.my-internal-service.com',
      provider: 'my-service',
      endpointCategory: 'internal',
      costPerRequestCents: 0.001,
    },
    {
      hostPattern: '*.my-cloud.io',
      provider: 'my-cloud',
    },
  ],
});`}</CodeBlock>
              <SubHeading>Python</SubHeading>
              <CodeBlock>{`from recost import init, RecostConfig
from recost import ProviderDef

init(RecostConfig(
    api_key="rc-xxxxxxxxxxxx",
    project_id="your-project-id",
    custom_providers=[
        ProviderDef(
            host_pattern="api.my-internal-service.com",
            provider="my-service",
            endpoint_category="internal",
            cost_per_request_cents=0.001,
        ),
        ProviderDef(
            host_pattern="*.my-cloud.io",
            provider="my-cloud",
        ),
    ],
))`}</CodeBlock>
              <SubHeading>ProviderDef fields</SubHeading>
              <DataTable
                headers={['Field', 'Type', 'Required', 'Description']}
                rows={[
                  ['hostPattern / host_pattern', 'string', 'yes', 'Exact hostname or wildcard prefix (e.g. *.amazonaws.com)'],
                  ['provider', 'string', 'yes', 'Provider name assigned when this rule matches'],
                  ['pathPrefix / path_prefix', 'string', 'no', 'Optional path prefix to narrow the match (e.g. /v1/chat)'],
                  ['endpointCategory / endpoint_category', 'string', 'no', 'Endpoint category assigned (e.g. chat_completions). Raw path used if omitted.'],
                  ['costPerRequestCents / cost_per_request_cents', 'number', 'no', 'Estimated cost per request in cents. Reported as 0 if omitted.'],
                ]}
              />
            </SectionCard>
          </div>
        </main>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-9 h-9 rounded-full border border-[#262626] bg-[#111111] text-[#a3a3a3] hover:text-[#fafafa] hover:border-[#404040] transition-all"
          aria-label="Scroll to top"
        >
          <ChevronUp size={16} />
        </button>
      )}
    </div>
  );
}
