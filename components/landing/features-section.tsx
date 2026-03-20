import { Layers, Clock, Wifi, Code2, Globe } from "lucide-react"

const features = [
  {
    icon: Layers,
    title: "Cost attribution by provider",
    description: "Track spending across OpenAI, Anthropic, Cohere, and more. See exactly where your budget goes."
  },
  {
    icon: Clock,
    title: "30-second windowed telemetry",
    description: "Real-time cost aggregation with 30-second windows. No delayed billing surprises."
  },
  {
    icon: Wifi,
    title: "WebSocket + HTTPS delivery",
    description: "Stream cost events in real-time via WebSocket or batch via HTTPS. Your choice."
  },
  {
    icon: Code2,
    title: "VS Code extension",
    description: "See cost estimates inline as you code. Catch expensive calls before they ship."
  },
  {
    icon: Globe,
    title: "Works with any HTTP client",
    description: "Fetch, Axios, Got, node-fetch — wrap any client. Framework agnostic by design."
  }
]

export function FeaturesSection() {
  return (
    <section className="relative border-t border-[#262626] bg-[#0f0f0f]">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="glow-orb-sm w-[1050px] h-[450px] -top-20 left-1/2 -translate-x-1/2" />
      
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
            Built for developers
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
            Everything you need to understand and optimize your API costs
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.slice(0, 3).map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-[#262626] bg-[#111111]/50 p-6 transition-all hover:border-[#34d399]/30 hover:bg-[#111111]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#34d399]/10">
                <feature.icon className="h-5 w-5 text-[#34d399]" />
              </div>
              <h3 className="text-lg font-semibold text-[#fafafa]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#a3a3a3] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 lg:max-w-2xl lg:mx-auto">
          {features.slice(3).map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-[#262626] bg-[#111111]/50 p-6 transition-all hover:border-[#34d399]/30 hover:bg-[#111111]"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#34d399]/10">
                <feature.icon className="h-5 w-5 text-[#34d399]" />
              </div>
              <h3 className="text-lg font-semibold text-[#fafafa]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#a3a3a3] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
