import { useRef } from "react"
import { Download, Zap, BarChart3 } from "lucide-react"
import { motion as Motion, useInView, useReducedMotion } from "motion/react"

const steps = [
  {
    icon: Download,
    title: "Install SDK",
    description: "Add the Recost SDK to your project with a single npm install. Zero configuration required.",
    step: "01"
  },
  {
    icon: Zap,
    title: "Intercept calls automatically",
    description: "Wrap your HTTP client once. Recost captures every API call to supported providers automatically.",
    step: "02"
  },
  {
    icon: BarChart3,
    title: "See costs in dashboard",
    description: "View real-time cost breakdowns by provider, model, and endpoint. Export data or stream via WebSocket.",
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
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-24 md:py-32">
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
          className="mt-16 grid gap-8 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={vis}
        >
          {steps.map((step, index) => (
            <Motion.div
              key={step.title}
              className="group relative rounded-xl border border-[#262626] bg-[#111111] p-6 transition-colors hover:border-[#d4900a]/30"
              variants={itemVariants}
            >
              <span className="absolute -top-3 right-6 font-mono text-sm text-[#d4900a]">
                {step.step}
              </span>

              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[#262626] bg-[#0a0a0a] transition-colors group-hover:border-[#d4900a]/30">
                <step.icon className="h-6 w-6 text-[#d4900a]" />
              </div>

              <h3 className="text-xl font-semibold text-[#fafafa]">{step.title}</h3>
              <p className="mt-3 text-[#a3a3a3] leading-relaxed">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-[#262626] to-transparent md:block" />
              )}
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </section>
  )
}
