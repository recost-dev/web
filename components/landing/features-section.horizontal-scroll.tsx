import { useEffect, useRef } from "react"
import { Layers, Wifi, Code2, ScanSearch, MessageSquare } from "lucide-react"
import { useReducedMotion } from "motion/react"

const features = [
  {
    icon: Layers,
    color: "#d4900a",
    title: "Cost attribution by provider",
    description: "Every API call is tagged to its provider and file, aggregated in 30-second windows. Track spending across OpenAI, Anthropic, Stripe, and more — no delayed billing surprises.",
  },
  {
    icon: ScanSearch,
    color: "#3b82f6",
    title: "AST-powered static analysis",
    description: "Web-Tree-Sitter parses your entire codebase to map every external API call across imports, aliases, and cross-file wrappers. Complete coverage with zero runtime overhead.",
  },
  {
    icon: Wifi,
    color: "#14b8a6",
    title: "WebSocket + HTTPS delivery",
    description: "Stream cost events live via WebSocket for real-time dashboards, or batch-collect via HTTPS for ingestion pipelines. Both modes from a single SDK with one line of setup.",
  },
  {
    icon: Code2,
    color: "#6366f1",
    title: "VS Code extension & Python SDK",
    description: "See cost estimates inline as you write code, before anything ships. The Python SDK auto-intercepts requests, httpx, aiohttp, FastAPI, and Flask with zero configuration.",
  },
  {
    icon: MessageSquare,
    color: "#8b5cf6",
    title: "AI insights & sustainability",
    description: "Get optimization advice from 8 AI providers in one interface. Every recommendation includes estimated electricity usage, water consumption, and CO2 output per API call.",
  },
]

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const tickingRef = useRef(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    function onScroll() {
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          const c = scrollRef.current
          if (!c) return
          const index = Math.round(c.scrollLeft / c.offsetWidth)
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return
            dot.classList.toggle("bg-[#d4900a]", i === index)
            dot.classList.toggle("bg-[#262626]", i !== index)
          })
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  // Reduced-motion: flat grid
  if (shouldReduceMotion) {
    return (
      <section className="relative border-t border-[#262626] bg-[#111111]">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative py-24 md:py-32 mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">Built for developers</h2>
          <p className="mt-3 text-lg text-[#a3a3a3]">Everything you need to understand and optimize your API costs</p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex flex-col gap-5 rounded-2xl border bg-[#141414] p-7"
                style={{ borderColor: "#d4900a40" }}
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4900a]/10">
                  <f.icon className="h-7 w-7 text-[#d4900a]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#fafafa]">{f.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#a3a3a3]">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="relative border-t border-[#262626] bg-[#111111] py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="glow-orb-sm absolute h-[450px] w-[1050px] -top-20 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section header */}
        <h2 className="text-4xl font-bold tracking-tight text-[#fafafa] md:text-5xl">
          Built for developers
        </h2>
        <p className="mt-4 text-xl text-[#a3a3a3]">
          Everything you need to understand and optimize your API costs
        </p>
      </div>

      {/* Horizontal scroll carousel */}
      <div
        ref={scrollRef}
        className="mt-16 flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {/* Left padding spacer to align first card with max-w-6xl */}
        <div className="shrink-0 w-[max(1.5rem,calc((100vw-72rem)/2))]" />

        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="snap-start shrink-0 w-[min(580px,85vw)] mr-5 last:mr-0 flex flex-col justify-center rounded-2xl border bg-[#141414] p-8"
            style={{
              borderColor: "#d4900a40",
              boxShadow: i === 0
                ? "0 0 80px rgba(212,144,10,0.10), 0 0 160px rgba(212,144,10,0.05)"
                : "none",
            }}
          >
            <div className="flex items-start gap-4 mb-8">
              <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4900a]/10 mt-1">
                <feature.icon className="h-7 w-7 text-[#d4900a]" />
              </div>
              <h3 className="text-4xl font-bold text-[#fafafa]">{feature.title}</h3>
            </div>
            <p className="text-lg leading-relaxed text-[#737373]">{feature.description}</p>
          </div>
        ))}

        {/* Right padding spacer */}
        <div className="shrink-0 w-[max(1.5rem,calc((100vw-72rem)/2))]" />
      </div>

      {/* Progress dots */}
      <div className="relative mx-auto max-w-6xl px-6 mt-8 flex items-center gap-2 w-[min(580px,85vw)]">
        {features.map((_, i) => (
          <div
            key={i}
            ref={el => { dotRefs.current[i] = el }}
            className={[
              "flex-1 h-0.5 rounded-full transition-colors duration-300",
              i === 0 ? "bg-[#d4900a]" : "bg-[#262626]",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  )
}
