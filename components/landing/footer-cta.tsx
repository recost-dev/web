import { Button } from "@/components/ui/button"
import { WaitlistModal } from "./waitlist-modal"

export function FooterCTA() {
  return (
    <section className="relative border-t border-[#262626] bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl lg:text-5xl">
            Start tracking in 2 minutes
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[#a3a3a3]">
            Join thousands of developers who have already shipped with full cost visibility.
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <WaitlistModal>
              <Button
                size="lg"
                className="h-12 bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium glow-green"
              >
                Join waitlist
              </Button>
            </WaitlistModal>
          </div>

          {/* Trust badges */}
          <p className="mt-6 text-sm text-[#737373]">
            Free tier available. No credit card required.
          </p>
        </div>
      </div>
    </section>
  )
}
