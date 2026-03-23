import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"
import { WaitlistModal } from "./waitlist-modal"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 dot-grid opacity-40" />
      <div className="absolute inset-0 animated-gradient" />
      {/* Glow orb */}
      <div className="glow-orb w-[1500px] h-[750px] top-0 left-1/2 -translate-x-1/2" />
      
      {/* Content */}
      <div className="relative mx-auto max-w-6xl px-6 pt-24 sm:pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#111111] px-4 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[#a3a3a3]">Now in public beta</span>
          </div>

          {/* Headline */}
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-[#fafafa] sm:text-5xl md:text-6xl lg:text-7xl text-balance">
            Know exactly what your{" "}
            <span className="text-[#d4900a]">APIs cost</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 max-w-2xl text-lg text-[#a3a3a3] md:text-xl text-balance">
            One-line SDK install. Zero-config cost tracking. Full visibility into every API call across OpenAI, Anthropic, and more.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <WaitlistModal>
              <Button
                size="lg"
                className="bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium px-8 glow-amber"
              >
                Join waitlist
              </Button>
            </WaitlistModal>
            <Button 
              size="lg"
              variant="outline"
              className="border-[#262626] bg-transparent text-[#fafafa] hover:bg-[#1a1a1a] px-8"
              asChild
            >
              <Link to="/docs">View docs</Link>
            </Button>
          </div>

          {/* Code Block */}
          <div className="mt-16 w-full max-w-3xl">
            <CodeBlock />
          </div>
        </div>
      </div>
    </section>
  )
}
