import { useRef } from "react"
import { Cpu, FlaskConical } from "lucide-react"
import { motion as Motion, useInView, useReducedMotion } from "motion/react"

const comingSoon = [
  { icon: Cpu, title: "MCP server", description: "Give your LLM direct access to your cost data, endpoint graph, and suggestions. Rich context, no copy-paste." },
  { icon: FlaskConical, title: "Go, Java, and Ruby AST", description: "Full AST-powered analysis for Go, Java, and Ruby codebases. Same deep call detection as TypeScript and Python." },
]

const itemVariants2 = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function OpenSourceSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const shouldReduceMotion = useReducedMotion()

  const vis = shouldReduceMotion ? "visible" : (isInView ? "visible" : "hidden")

  return (
    <section className="relative overflow-hidden border-t border-[#262626] bg-[#0f0f0f]">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="glow-orb-sm w-[1050px] h-[450px] -top-20 left-1/2 -translate-x-1/2" />

      <Motion.div
        ref={ref}
        className="relative mx-auto max-w-6xl px-6 py-20 md:py-28"
        variants={itemVariants}
        initial="hidden"
        animate={vis}
      >
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
              Open source. Free forever.
            </h2>
            <p className="mt-3 max-w-lg text-lg text-[#a3a3a3]">
              The Node.js and Python SDKs are AGPL licensed. Full source, no vendor lock-in. Use in production, fork, contribute back.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-[#3b82f6]/30 bg-[#3b82f6]/8 px-3 py-1.5 text-sm text-[#93c5fd] font-mono">TypeScript</span>
              <span className="rounded-md border border-[#fbbf24]/30 bg-[#fbbf24]/8 px-3 py-1.5 text-sm text-[#fcd34d] font-mono">Python</span>
              <span className="rounded-md border border-[#262626] bg-[#111111] px-3 py-1.5 text-sm text-[#a3a3a3] font-mono">AGPL-3.0</span>
            </div>
          </div>
          <a
            href="https://github.com/recost-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-3 rounded-lg border border-[#262626] bg-[#111111] px-6 py-3 transition-all hover:border-[#d4900a]/30 hover:bg-[#1a1a1a]"
          >
            <svg
              className="h-5 w-5 text-[#fafafa]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-[#fafafa]">recost-dev</span>
          </a>
        </div>

        <Motion.div
          className="mt-16 grid gap-x-12 gap-y-6 border-t border-[#262626] pt-12 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate={vis}
        >
          {comingSoon.map(({ icon: Icon, title, description }) => (
            <Motion.div
              key={title}
              className="flex flex-col gap-4 rounded-lg border border-dashed border-[#d4900a]/35 bg-[#d4900a]/[0.06] p-5"
              variants={itemVariants2}
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
      </Motion.div>
    </section>
  )
}
