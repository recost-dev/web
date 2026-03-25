import { useEffect, useRef } from "react"
import { Layers, Wifi, Code2, ScanSearch, MessageSquare } from "lucide-react"
import { motion as Motion, useInView, useReducedMotion } from "motion/react"

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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function FeaturesSection() {
  const stickyRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const blurOverlayRefs = useRef<(HTMLDivElement | null)[]>([])
  const tickingRef = useRef(false)
  const progressRef = useRef(0)
  const lastGlowRef = useRef<number[]>(features.map(() => -1))
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) return

    const N = features.length

    function shapedFloat(progress: number) {
      const raw = progress * (N - 1)
      const i = Math.floor(raw)
      if (i >= N - 1) return N - 1
      const frac = raw - i
      const dwell = 0.7
      const half = dwell / 2
      if (frac <= half) return i
      if (frac >= 1 - half) return i + 1
      const t = (frac - half) / (1 - dwell)
      const eased = t * t
      return i + eased
    }

    function updateCarousel(progress: number) {
      const activeFloat = shapedFloat(progress)
      const activeIndex = Math.round(activeFloat)
      const cards = cardRefs.current
      const dots = dotRefs.current
      const overlays = blurOverlayRefs.current

      cards.forEach((card, i) => {
        if (!card) return
        const pos = i - activeFloat
        const absPos = Math.abs(pos)
        const t = Math.min(absPos, 1)
        const glowOpacity = Math.max(0, 1 - absPos)

        // compositor-only properties
        card.style.translate = `${pos * 85}% 0px`
        card.style.scale = String(1 - t * 0.2)
        // brightness only — blur moved to overlay
        card.style.filter = `brightness(${(1 - t * 0.6).toFixed(3)})`
        card.style.zIndex = String(10 - Math.round(absPos))
        card.style.pointerEvents = Math.round(pos) === 0 ? "auto" : "none"

        // blur overlay: opacity is compositor-only
        const overlay = overlays[i]
        if (overlay) overlay.style.opacity = String(Math.min(absPos, 1).toFixed(3))

        // boxShadow: only write when glow changes meaningfully (threshold 0.01)
        const prev = lastGlowRef.current[i]
        if (Math.abs(glowOpacity - prev) > 0.01) {
          lastGlowRef.current[i] = glowOpacity
          card.style.boxShadow = glowOpacity > 0
            ? `0 0 80px rgba(212,144,10,${(glowOpacity * 0.1).toFixed(3)}), 0 0 160px rgba(212,144,10,${(glowOpacity * 0.05).toFixed(3)})`
            : "none"
        }
      })

      dots.forEach((dot, i) => {
        if (!dot) return
        dot.classList.toggle("bg-[#d4900a]", i === activeIndex)
        dot.classList.toggle("bg-[#262626]", i !== activeIndex)
      })
    }

    function onScroll() {
      const sec = stickyRef.current
      if (!sec) return
      const rect = sec.getBoundingClientRect()
      progressRef.current = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      if (!tickingRef.current) {
        requestAnimationFrame(() => {
          updateCarousel(progressRef.current)
          tickingRef.current = false
        })
        tickingRef.current = true
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [shouldReduceMotion])

  // Reduced-motion: flat grid, no scroll effect
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
    <>
      {/* Sticky cinema section */}
      <section
        ref={stickyRef}
        className="relative border-t border-[#262626] bg-[#111111]"
        style={{ height: "450vh" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
          <div className="glow-orb-sm absolute h-[450px] w-[1050px] -top-20 left-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="relative h-full flex flex-col justify-center mt-12">
            <div className="mx-auto w-full max-w-6xl px-6 flex flex-col gap-48">
              {/* Section header */}
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-[#fafafa] md:text-5xl">
                  Built for developers
                </h2>
                <p className="mt-4 text-xl text-[#a3a3a3]">
                  Everything you need to understand and optimize your API costs
                </p>
              </div>

              {/* Stacked cards */}
              <div className="relative h-[340px]">
                {features.map((feature, i) => (
                  <div
                    key={feature.title}
                    ref={el => { cardRefs.current[i] = el }}
                    style={{
                      translate: `${i * 85}% 0px`,
                      scale: i === 0 ? "1" : "0.8",
                      filter: i === 0 ? "brightness(1)" : "brightness(0.4)",
                      zIndex: 10 - i,
                      pointerEvents: i === 0 ? "auto" : "none",
                      borderColor: "#d4900a40",
                      willChange: "transform, filter",
                      transition: "box-shadow 0.15s ease-out",
                    }}
                    className="absolute top-0 bottom-0 left-0 w-[58%] flex flex-col items-center justify-center rounded-2xl border bg-[#141414] p-8"
                  >
                    {/* Blur overlay — opacity driven, compositor-only */}
                    <div
                      ref={el => { blurOverlayRefs.current[i] = el }}
                      style={{
                        position: "absolute", inset: 0,
                        backdropFilter: "blur(8px)",
                        borderRadius: "inherit",
                        opacity: i === 0 ? 0 : 1,
                        willChange: "opacity",
                        pointerEvents: "none",
                      }}
                    />
                    <div className="w-[85%] relative">
                      <div className="flex items-start gap-4 mb-8">
                        <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d4900a]/10 mt-1">
                          <feature.icon className="h-7 w-7 text-[#d4900a]" />
                        </div>
                        <h3 className="text-4xl font-bold text-[#fafafa]">{feature.title}</h3>
                      </div>
                      <p className="text-lg leading-relaxed text-[#737373]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress bar — same width and alignment as cards */}
              <div className="flex items-center gap-2 w-[58%]">
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
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
