import { useRef } from "react"
import { Layers, Clock, Wifi, Code2, Globe, TreePine, ScanSearch, MessageSquare, Leaf, Cpu, FlaskConical } from "lucide-react"
import { motion as Motion, useInView, useReducedMotion } from "motion/react"

const features = [
  {
    icon: Layers,
    title: "Cost attribution by provider",
    description: "Track spending across OpenAI, Anthropic, Stripe, and more. See exactly where your budget goes.",
  },
  {
    icon: ScanSearch,
    title: "AST-powered static analysis",
    description: "Web-Tree-Sitter parses your codebase to detect API calls across imports, aliases, and cross-file wrappers. No runtime overhead.",
  },
  {
    icon: Clock,
    title: "30-second windowed telemetry",
    description: "Real-time cost aggregation with 30-second windows. No delayed billing surprises.",
  },
  {
    icon: Wifi,
    title: "WebSocket + HTTPS delivery",
    description: "Stream cost events in real-time via WebSocket or batch via HTTPS. Your choice.",
  },
  {
    icon: Code2,
    title: "VS Code extension",
    description: "See cost estimates inline as you code. Catch expensive calls before they ship.",
  },
  {
    icon: TreePine,
    title: "Python SDK included",
    description: "Track Python API costs with zero config. Supports requests, httpx, aiohttp, FastAPI, and Flask out of the box.",
  },
  {
    icon: Globe,
    title: "Works with any HTTP client",
    description: "Automatically captures calls from fetch, Axios, Got, and any library built on Node's http module. Framework agnostic.",
  },
  {
    icon: MessageSquare,
    title: "Multi-provider AI chat",
    description: "Get cost optimization advice from 8 AI providers: ReCost AI (free), GPT-4o, Claude, Gemini, xAI, Cohere, Mistral, and Perplexity.",
  },
  {
    icon: Leaf,
    title: "Sustainability tracking",
    description: "Measure the environmental cost of every API call. Electricity, water, and CO2 estimates with an AI vs non-AI breakdown.",
  },
]

const comingSoon = [
  { icon: Cpu, title: "MCP server", description: "Give your LLM direct access to your cost data, endpoint graph, and suggestions. Rich context, no copy-paste." },
  { icon: FlaskConical, title: "Go, Java, and Ruby AST", description: "Full AST-powered analysis for Go, Java, and Ruby codebases. Same deep call detection as TypeScript and Python." },
]

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const shouldReduceMotion = useReducedMotion()

  const vis = shouldReduceMotion ? "visible" : (isInView ? "visible" : "hidden")

  return (
    <section className="relative overflow-hidden border-t border-[#262626] bg-[#0f0f0f]">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="glow-orb-sm h-[450px] w-[1050px] -top-20 left-1/2 -translate-x-1/2" />

      <div ref={ref} className="relative py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <Motion.div variants={headerVariants} initial="hidden" animate={vis}>
            <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
              Built for developers
            </h2>
            <p className="mt-3 text-lg text-[#a3a3a3]">
              Everything you need to understand and optimize your API costs
            </p>
          </Motion.div>
        </div>

        <div className="mx-auto mt-14 max-w-6xl px-6">
          <Motion.div
            className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate={vis}
          >
            {features.map((feature) => (
              <Motion.div
                key={feature.title}
                className="flex flex-col gap-4 rounded-2xl bg-transparent p-1"
                variants={itemVariants}
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4900a]/10">
                  <feature.icon className="h-5 w-5 text-[#d4900a]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#fafafa]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">{feature.description}</p>
                </div>
              </Motion.div>
            ))}
          </Motion.div>
        </div>

        <div className="mx-auto max-w-6xl px-6">
          <Motion.div
            className="mt-16 grid gap-x-12 gap-y-6 border-t border-[#262626] pt-10 sm:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            animate={vis}
          >
            {comingSoon.map(({ icon: Icon, title, description }) => (
              <Motion.div
                key={title}
                className="flex flex-col gap-4 rounded-lg border border-dashed border-[#d4900a]/35 bg-[#d4900a]/[0.06] p-5"
                variants={itemVariants}
              >
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d4900a]/20 bg-[#d4900a]/10">
                    <Icon className="h-4 w-4 text-[#d4900a]" />
                  </div>
                  <span className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#d4900a]/70 border border-[#d4900a]/25">
                    Soon
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#fafafa]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#737373]">{description}</p>
                </div>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </div>
    </section>
  )
}
