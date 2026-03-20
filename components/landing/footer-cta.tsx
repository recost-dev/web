import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Check } from "lucide-react"

export function FooterCTA() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

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

          {/* Email Form */}
          <div className="mt-10 w-full max-w-md">
            {submitted ? (
              <div className="flex items-center justify-center gap-2 rounded-lg border border-[#34d399]/30 bg-[#34d399]/10 p-4">
                <Check className="h-5 w-5 text-[#34d399]" />
                <span className="text-[#34d399]">{"You're on the list! Check your inbox."}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-[#262626] bg-[#111111] text-[#fafafa] placeholder:text-[#737373] focus-visible:border-[#34d399] focus-visible:ring-[#34d399]/20"
                />
                <Button 
                  type="submit"
                  size="lg"
                  className="h-12 bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium whitespace-nowrap glow-green"
                >
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
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
