import { useEffect, useRef } from "react"
import { Layers, Wifi, Code2, ScanSearch, MessageSquare } from "lucide-react"
import { useReducedMotion } from "motion/react"

const features = [
  {
    icon: Layers,
    color: "#d4900a",
    title: "Cost attribution by provider",
    description:
      "Every API call is tagged to its provider and file, aggregated in 30-second windows. Track spending across OpenAI, Anthropic, Stripe, and more — no delayed billing surprises.",
  },
  {
    icon: ScanSearch,
    color: "#3b82f6",
    title: "AST-powered static analysis",
    description:
      "Web-Tree-Sitter parses your entire codebase to map every external API call across imports, aliases, and cross-file wrappers. Complete coverage with zero runtime overhead.",
  },
  {
    icon: Wifi,
    color: "#14b8a6",
    title: "WebSocket + HTTPS delivery",
    description:
      "Stream cost events live via WebSocket for real-time dashboards, or batch-collect via HTTPS for ingestion pipelines. Both modes from a single SDK with one line of setup.",
  },
  {
    icon: Code2,
    color: "#6366f1",
    title: "VS Code extension & Python SDK",
    description:
      "See cost estimates inline as you write code, before anything ships. The Python SDK auto-intercepts requests, httpx, aiohttp, FastAPI, and Flask with zero configuration.",
  },
  {
    icon: MessageSquare,
    color: "#8b5cf6",
    title: "AI insights & sustainability",
    description:
      "Get optimization advice from 8 AI providers in one interface. Every recommendation includes estimated electricity usage, water consumption, and CO2 output per API call.",
  },
]

const GAP = 20 // mr-5 = 20px

export function FeaturesSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const blurOverlayRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const tickingRef = useRef(false)
  const lastGlowRef = useRef<number[]>(features.map(() => -1))
  const shouldReduceMotion = useReducedMotion()

  // Dynamically compute and apply the right padding so the last card is
  // always scrollable to the snap position.
  //
  // WHY PADDING, NOT A SPACER DIV:
  // A spacer div gets clipped when any ancestor has overflow-x:hidden
  // (common in layout wrappers). Browsers always include padding-right in
  // scrollWidth regardless of parent overflow, so this is more reliable.
  //
  // FORMULA:
  //   rightPad = viewportWidth - cardWidth - leftSpacerWidth
  // This ensures the last card's left edge can reach the same indent as the
  // heading (= leftSpacerWidth from the viewport left edge).
  useEffect(() => {
    function applyRightPad() {
      const c = scrollRef.current
      const cardEl = cardRefs.current[0]
      if (!c || !cardEl) return

      const vw = window.innerWidth
      const cardW = cardEl.offsetWidth
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
      // mirrors CSS: max(1.5rem, calc((100vw - 72rem) / 2))
      const leftSpacer = Math.max(1.5 * rem, (vw - 72 * rem) / 2)
      const rightPad = Math.max(0, vw - cardW - leftSpacer)

      c.style.paddingRight = `${rightPad}px`
    }

    requestAnimationFrame(applyRightPad)
    window.addEventListener("resize", applyRightPad)
    return () => window.removeEventListener("resize", applyRightPad)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    function updateCards() {
      const c = scrollRef.current
      const cardEl = cardRefs.current[0]
      if (!c || !cardEl) return

      const stride = cardEl.offsetWidth + GAP
      const activeFloat = c.scrollLeft / stride
      const activeIndex = Math.round(activeFloat)

      cardRefs.current.forEach((card, i) => {
        if (!card) return
        const dist = Math.abs(i - activeFloat)
        const t = Math.min(dist, 1)
        const glowOpacity = Math.max(0, 1 - dist)

        card.style.filter = `brightness(${(1 - t * 0.6).toFixed(3)})`
        card.style.zIndex = String(Math.round(10 - dist * 5))

        const overlay = blurOverlayRefs.current[i]
        if (overlay) {
          overlay.style.opacity = String(Math.min(dist, 1).toFixed(3))
          overlay.style.backdropFilter = `blur(${Math.min(dist * 3, 8).toFixed(1)}px)`
        }

        const prev = lastGlowRef.current[i]
        if (Math.abs(glowOpacity - prev) > 0.01) {
          lastGlowRef.current[i] = glowOpacity
          card.style.boxShadow =
            glowOpacity > 0
              ? `0 0 80px rgba(212,144,10,${(glowOpacity * 0.1).toFixed(3)}), 0 0 160px rgba(212,144,10,${(glowOpacity * 0.05).toFixed(3)})`
              : "none"
        }
      })

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return
        dot.classList.toggle("bg-[#d4900a]", i === activeIndex)
        dot.classList.toggle("bg-[#262626]", i !== activeIndex)
      })

      tickingRef.current = false
    }

    function onScroll() {
      if (!tickingRef.current) {
        requestAnimationFrame(updateCards)
        tickingRef.current = true
      }
    }

    container.addEventListener("scroll", onScroll, { passive: true })
    requestAnimationFrame(updateCards)
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  // ─── Reduced-motion: flat grid ───────────────────────────────────────────
  if (shouldReduceMotion) {
    return (
      <section className="relative border-t border-[#262626] bg-[#111111]">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative py-24 md:py-32 mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
            Built for developers
          </h2>
          <p className="mt-3 text-lg text-[#a3a3a3]">
            Everything you need to understand and optimize your API costs
          </p>
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

  // ─── Carousel ─────────────────────────────────────────────────────────────
  return (
    <section className="relative border-t border-[#262626] bg-[#111111] min-h-screen flex flex-col justify-center py-16">
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
      <div className="glow-orb-sm absolute h-[450px] w-[1050px] -top-20 left-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Heading */}
      <div className="relative pl-[max(1.5rem,calc((100vw-72rem)/2))] pr-6">
        <h2 className="text-4xl font-bold tracking-tight text-[#fafafa] md:text-5xl">
          Built for developers
        </h2>
        <p className="mt-4 text-xl text-[#a3a3a3]">
          Everything you need to understand and optimize your API costs
        </p>
      </div>

      {/*
        overflow-x: scroll (not "auto") — ensures the browser never decides
        scrolling is unnecessary. scroll-padding-left aligns snapped cards
        with the heading. padding-left replaces the old left-spacer div.
        padding-right is injected by the resize effect above.
      */}
      <div
        ref={scrollRef}
        className="flex overflow-x-scroll snap-x snap-mandatory scrollbar-none items-start"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          scrollPaddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2))",
          paddingLeft: "max(1.5rem, calc((100vw - 72rem) / 2))",
          paddingTop: "200px",
          paddingBottom: "200px",
          marginTop: "-12px",
          // paddingRight set dynamically by applyRightPad effect
        }}
      >
        {features.map((feature, i) => (
          <div
            key={feature.title}
            ref={(el) => { cardRefs.current[i] = el }}
            className="snap-start shrink-0 w-[min(580px,85vw)] mr-5 last:mr-0 relative flex flex-col justify-center rounded-2xl border bg-[#141414] px-14 py-10 min-h-[380px]"
            style={{
              borderColor: "#d4900a40",
              filter: i === 0 ? "brightness(1)" : "brightness(0.4)",
              zIndex: i === 0 ? 10 : 1,
              willChange: "transform, filter",
              transition: "box-shadow 0.15s ease-out",
            }}
          >
            {/* Blur overlay */}
            <div
              ref={(el) => { blurOverlayRefs.current[i] = el }}
              style={{
                position: "absolute",
                inset: 0,
                backdropFilter: "blur(3px)",
                borderRadius: "inherit",
                opacity: i === 0 ? 0 : 1,
                willChange: "opacity",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
            <div className="relative">
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

      {/* Progress dots */}
      <div
        className="relative mt-8 flex items-center gap-2 pl-[max(1.5rem,calc((100vw-72rem)/2))] pr-6"
        style={{ maxWidth: "calc(min(580px, 85vw) + max(1.5rem, calc((100vw - 72rem) / 2)))" }}
      >
        {features.map((_, i) => (
          <div
            key={i}
            ref={(el) => { dotRefs.current[i] = el }}
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
