import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { WaitlistModal } from "./waitlist-modal"
import { motion as Motion, useInView, useReducedMotion } from "motion/react"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
}

export function FooterCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const shouldReduceMotion = useReducedMotion()

  const vis = shouldReduceMotion ? "visible" : (isInView ? "visible" : "hidden")

  return (
    <section className="relative overflow-hidden border-t border-[#262626] bg-[#0a0a0a]">
      <div className="glow-orb-sm w-[900px] h-[400px] -top-16 left-1/2 -translate-x-1/2" />
      <Motion.div
        ref={ref}
        className="mx-auto max-w-6xl px-6 py-24 md:py-32 relative"
        variants={itemVariants}
        initial="hidden"
        animate={vis}
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl lg:text-5xl">
            Start tracking in 2 minutes
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[#a3a3a3]">
            Join thousands of developers who have already shipped with full cost visibility.
          </p>

          <div className="mt-10 flex justify-center">
            <WaitlistModal>
              <Button
                size="lg"
                className="h-12 bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium glow-amber"
              >
                Join waitlist
              </Button>
            </WaitlistModal>
          </div>

          <p className="mt-6 text-sm text-[#737373]">
            Free tier available. No credit card required.
          </p>
        </div>
      </Motion.div>
    </section>
  )
}
