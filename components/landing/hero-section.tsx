import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"
import { MailingListModal } from "./mailing-list-modal"
import { motion as Motion, useReducedMotion } from "motion/react"

const HEADLINE_WORDS = [
  { text: 'Know',    accent: false },
  { text: 'exactly', accent: false },
  { text: 'what',    accent: false },
  { text: 'your',    accent: false },
  { text: 'APIs',    accent: true  },
  { text: 'cost',    accent: true  },
]

const headlineVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
}

const wordVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
}

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  const fade = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial:    { opacity: 0, y: 20 },
          animate:    { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  const stats = [
    { value: "30s", label: "telemetry windows" },
    { value: "10+", label: "SDK frameworks" },
    { value: "8",   label: "AI providers" },
    { value: "1",   label: "line to set up" },
  ]

  return (
    <section className="relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute inset-0 animated-gradient" />
      {/* Glow orbs */}
      <div className="glow-orb w-[1500px] h-[750px] top-0 left-1/2 -translate-x-1/2" />
      <div className="glow-orb-purple w-[1000px] h-[600px] -top-10 left-[28%] -translate-x-1/2" />
      <div className="glow-orb-blue w-[900px] h-[540px] top-28 left-[70%] -translate-x-1/2" />
      <div className="glow-orb-teal w-[800px] h-[500px] top-16 left-1/2 -translate-x-1/2" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-center px-6 py-20 pb-32 sm:py-24 sm:pb-32">
        <div className="flex w-full flex-col items-center text-center">

          {/* Badge */}
          <Motion.div
            {...fade(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#111111] px-4 py-1.5 text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#a3a3a3]">Now in public beta</span>
          </Motion.div>

          {/* Headline — word-by-word stagger */}
          <Motion.h1
            className="max-w-4xl text-4xl font-bold tracking-tight text-[#fafafa] text-balance sm:text-5xl md:text-[3.6rem] lg:text-[4.35rem]"
            variants={shouldReduceMotion ? undefined : headlineVariants}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
          >
            {HEADLINE_WORDS.map((word, i) => (
              <span key={i}>
                {i > 0 && <span aria-hidden="true"> </span>}
                <Motion.span
                  className="inline-block"
                  variants={shouldReduceMotion ? undefined : wordVariants}
                  style={{ color: word.accent ? '#d4900a' : undefined }}
                >
                  {word.text}
                </Motion.span>
              </span>
            ))}
          </Motion.h1>

          {/* Subheadline */}
          <Motion.p
            {...fade(0.55)}
            className="mt-5 max-w-2xl text-base text-[#a3a3a3] text-balance md:text-lg"
          >
            One-line SDK install. Zero-config cost tracking. Full visibility into every API call across OpenAI, Anthropic, Stripe, Twilio, and more.
          </Motion.p>

          {/* CTA Buttons */}
          <Motion.div {...fade(0.68)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <MailingListModal>
              <Button
                size="lg"
                className="bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium px-8 glow-amber"
              >
                Get Updates
              </Button>
            </MailingListModal>
            <Button
              size="lg"
              variant="outline"
              className="border-[#262626] bg-transparent text-[#fafafa] hover:bg-[#1a1a1a] px-8"
              asChild
            >
              <Link to="/docs">View docs</Link>
            </Button>
          </Motion.div>

          {/* Code Block */}
          <Motion.div {...fade(0.82)} className="mt-10 w-full max-w-3xl md:mt-12">
            <CodeBlock />
          </Motion.div>

        </div>
      </div>

      {/* Stats bar pinned to bottom of hero viewport */}
      <Motion.div
        {...fade(1.0)}
        className="absolute bottom-0 left-0 right-0 border-t border-[#1c1c1c] bg-[#0a0a0a]/80 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-7xl px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1">
              <span className="text-xl font-bold font-mono text-[#d4900a] tabular-nums">{value}</span>
              <span className="text-xs text-[#737373] tracking-wide">{label}</span>
            </div>
          ))}
        </div>
      </Motion.div>
    </section>
  )
}
