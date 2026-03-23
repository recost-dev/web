import { useRef } from "react"
import { Layers, Clock, Wifi, Code2, Globe } from "lucide-react"
import { motion as Motion, useInView, useReducedMotion } from "motion/react"

const features = [
  {
    icon: Layers,
    title: "Cost attribution by provider",
    description: "Track spending across OpenAI, Anthropic, Cohere, and more. See exactly where your budget goes."
  },
  {
    icon: Clock,
    title: "30-second windowed telemetry",
    description: "Real-time cost aggregation with 30-second windows. No delayed billing surprises."
  },
  {
    icon: Wifi,
    title: "WebSocket + HTTPS delivery",
    description: "Stream cost events in real-time via WebSocket or batch via HTTPS. Your choice."
  },
  {
    icon: Code2,
    title: "VS Code extension",
    description: "See cost estimates inline as you code. Catch expensive calls before they ship."
  },
  {
    icon: Globe,
    title: "Works with any HTTP client",
    description: "Fetch, Axios, Got, node-fetch — wrap any client. Framework agnostic by design."
  }
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
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const shouldReduceMotion = useReducedMotion()

  const vis = shouldReduceMotion ? "visible" : (isInView ? "visible" : "hidden")

  return (
    <section className="relative overflow-hidden border-t border-[#262626] bg-[#0f0f0f]">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="glow-orb-sm w-[1050px] h-[450px] -top-20 left-1/2 -translate-x-1/2" />

      <div ref={ref} className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <Motion.div variants={itemVariants} initial="hidden" animate={vis}>
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
            Built for developers
          </h2>
          <p className="mt-3 text-lg text-[#a3a3a3]">
            Everything you need to understand and optimize your API costs
          </p>
        </Motion.div>

        {/* Features Grid */}
        <Motion.div
          className="mt-16 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={vis}
        >
          {features.map((feature) => (
            <Motion.div key={feature.title} className="flex flex-col gap-4" variants={itemVariants}>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#d4900a]/10 border border-[#d4900a]/20">
                <feature.icon className="h-4 w-4 text-[#d4900a]" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#fafafa]">{feature.title}</h3>
                <p className="mt-2 text-sm text-[#a3a3a3] leading-relaxed">{feature.description}</p>
              </div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
