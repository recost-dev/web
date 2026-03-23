import { Download, Zap, BarChart3 } from "lucide-react"

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

export function HowItWorks() {
  return (
    <section className="relative border-t border-[#262626] bg-[#0a0a0a]">
      <div className="glow-orb-sm w-[1050px] h-[450px] -top-20 left-1/2 -translate-x-1/2" />
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            Start tracking in under 2 minutes
          </p>
        </div>

        {/* Steps */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div 
              key={step.title}
              className="group relative rounded-xl border border-[#262626] bg-[#111111] p-8 transition-colors hover:border-[#d4900a]/30"
            >
              {/* Step number */}
              <span className="absolute -top-3 right-6 font-mono text-sm text-[#d4900a]">
                {step.step}
              </span>
              
              {/* Icon */}
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-[#262626] bg-[#0a0a0a] transition-colors group-hover:border-[#d4900a]/30">
                <step.icon className="h-6 w-6 text-[#d4900a]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-[#fafafa]">{step.title}</h3>
              <p className="mt-3 text-[#a3a3a3] leading-relaxed">{step.description}</p>

              {/* Connector line (except last) */}
              {index < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-gradient-to-r from-[#262626] to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
