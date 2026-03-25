import { motion as Motion, useInView, useReducedMotion } from "motion/react"
import { useRef } from "react"

const stats = [
  { value: "30s", label: "telemetry windows" },
  { value: "10+", label: "SDK frameworks" },
  { value: "8",   label: "AI providers" },
  { value: "1",   label: "line to set up" },
]

export function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const shouldReduceMotion = useReducedMotion()
  const vis = shouldReduceMotion ? "visible" : (isInView ? "visible" : "hidden")

  return (
    <div ref={ref} className="border-t border-b border-[#1c1c1c] bg-[#0d0d0d]">
      <Motion.div
        className="mx-auto max-w-6xl px-6 py-6 grid grid-cols-2 gap-y-6 sm:grid-cols-4"
        initial="hidden"
        animate={vis}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {stats.map(({ value, label }) => (
          <Motion.div
            key={label}
            className="flex flex-col items-center text-center gap-1"
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
            }}
          >
            <span className="text-2xl font-bold font-mono text-[#d4900a] tabular-nums">{value}</span>
            <span className="text-xs text-[#737373] tracking-wide">{label}</span>
          </Motion.div>
        ))}
      </Motion.div>
    </div>
  )
}
