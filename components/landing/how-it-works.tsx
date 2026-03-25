import { useRef } from "react"
import { Download, Zap, BarChart3 } from "lucide-react"
import { motion as Motion, useInView, useReducedMotion } from "motion/react"

const steps = [
  {
    icon: Download,
    title: "Install the SDK",
    description: "npm install @recost/node — or pip install recost for Python. Zero configuration required.",
    step: "01"
  },
  {
    icon: Zap,
    title: "Call init() once",
    description: "One line at startup. Recost patches fetch, http, and https automatically and starts capturing every outbound API call.",
    step: "02"
  },
  {
    icon: BarChart3,
    title: "See costs in real time",
    description: "Cost breakdowns by provider, endpoint, and model. Streamed every 30 seconds to your dashboard or VS Code extension.",
    step: "03"
  }
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const shouldReduceMotion = useReducedMotion()

  const vis = shouldReduceMotion ? "visible" : (isInView ? "visible" : "hidden")

  return (
    <section className="relative overflow-hidden border-t border-[#262626] bg-[#0a0a0a]">
      <div className="glow-orb-sm w-[1050px] h-[450px] -top-20 left-1/2 -translate-x-1/2" />
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Section Header */}
        <Motion.div variants={itemVariants} initial="hidden" animate={vis}>
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-lg text-[#a3a3a3]">
            Start tracking in under 2 minutes
          </p>
        </Motion.div>

        {/* Steps */}
        <Motion.div
          className="mt-16 grid gap-12 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={vis}
        >
          {steps.map((step) => (
            <Motion.div key={step.title} variants={itemVariants}>
              <div className="flex items-center gap-4 mb-5">
                <span className="font-mono text-5xl font-bold leading-none text-[#d4900a]/25 tabular-nums">
                  {step.step}
                </span>
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#262626] bg-[#0f0f0f]">
                  <step.icon className="h-5 w-5 text-[#d4900a]" />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-[#fafafa]">{step.title}</h3>
              <p className="mt-2 text-sm text-[#a3a3a3] leading-relaxed">{step.description}</p>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
