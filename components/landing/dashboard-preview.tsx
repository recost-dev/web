const providers = [
  { name: "OpenAI", cost: "$127.45", calls: "12,847", color: "#d4900a" },
  { name: "Anthropic", cost: "$89.23", calls: "8,421", color: "#3b82f6" },
  { name: "Stripe", cost: "$23.67", calls: "2,156", color: "#6366f1" },
]

const endpoints = [
  { provider: "OpenAI",    method: "POST", url: "/v1/chat/completions",  callsPerDay: "1,240", cost: "$89.45" },
  { provider: "Anthropic", method: "POST", url: "/v1/messages",          callsPerDay: "680",   cost: "$67.20" },
  { provider: "OpenAI",    method: "POST", url: "/v1/embeddings",        callsPerDay: "840",   cost: "$38.10" },
  { provider: "Stripe",    method: "POST", url: "/v1/payment_intents",   callsPerDay: "420",   cost: "free"   },
  { provider: "SendGrid",  method: "POST", url: "/v3/mail/send",         callsPerDay: "180",   cost: "free"   },
]

const METHOD_STYLES: Record<string, { bg: string; border: string; color: string }> = {
  POST: { bg: "rgba(212,144,10,0.10)", border: "rgba(212,144,10,0.30)", color: "#d4900a" },
  GET:  { bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.22)", color: "#38bdf8" },
}

export function DashboardPreview() {
  return (
    <section className="relative overflow-hidden border-t border-[#262626] bg-[#0a0a0a]">
      <div className="glow-orb-sm w-[900px] h-[400px] -top-10 left-1/2 -translate-x-1/2" />
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-20 md:pt-32 md:pb-28 relative">
        {/* Section Header */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
            Dashboard preview
          </h2>
          <p className="mt-3 text-lg text-[#a3a3a3]">
            Real-time insights into your API spending
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-16 overflow-hidden rounded-xl border border-[#262626] bg-[#111111]">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between border-b border-[#262626] px-6 py-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-[#fafafa]">recost</span>
              <span className="text-sm text-[#737373]">/</span>
              <span className="text-sm text-[#a3a3a3]">Dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-[#22c55e] animate-pulse" />
              <span className="text-xs text-[#a3a3a3]">Live</span>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid gap-4 p-4 sm:gap-6 sm:p-6 lg:grid-cols-2">
            {/* Cost Breakdown */}
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-[#fafafa]">Cost by Provider</h3>
                <span className="text-xs text-[#737373]">Last 30 days</span>
              </div>
              
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#a3a3a3]">{provider.name}</span>
                      <span className="font-mono text-[#fafafa]">{provider.cost}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[#1a1a1a]">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(parseFloat(provider.cost.slice(1)) / 150) * 100}%`,
                          backgroundColor: provider.color
                        }}
                      />
                    </div>
                    <div className="text-xs text-[#737373]">{provider.calls} calls</div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-[#262626] flex items-center justify-between">
                <span className="text-sm text-[#a3a3a3]">Total</span>
                <span className="font-mono text-lg font-bold text-[#d4900a]">$240.35</span>
              </div>
            </div>

            {/* API Call Volume Chart */}
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-[#fafafa]">API Call Volume</h3>
                <span className="text-xs text-[#737373]">Last 7 days</span>
              </div>
              
              {/* Simple bar chart */}
              <div className="flex items-end justify-between gap-2 h-40">
                {[65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full rounded-t bg-[#d4900a]/80 transition-all duration-500 hover:bg-[#d4900a]"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-[#737373]">
                      {["M", "T", "W", "T", "F", "S", "S"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Endpoints Table */}
            <div className="hidden sm:block rounded-lg border border-[#262626] bg-[#0a0a0a] lg:col-span-2 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
                <h3 className="font-medium text-[#fafafa]">Endpoints</h3>
                <div className="w-[104px] flex items-center justify-between px-2 py-1 rounded text-xs text-[#a3a3a3] border border-[#262626] bg-[#111111] select-none pointer-events-none">
                  <span>By cost</span>
                  <svg className="w-3 h-3 text-[#737373]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[#262626]">
                      {["Provider", "Endpoint", "Method", "Calls / day", "Monthly cost"].map((h) => (
                        <th key={h} className="px-6 py-2.5 text-left font-medium text-[#737373]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {endpoints.map((ep, i) => {
                      const ms = METHOD_STYLES[ep.method] ?? METHOD_STYLES.GET
                      return (
                        <tr key={i} className="border-b border-[#262626]/40 last:border-0">
                          <td className="px-6 py-2.5 font-medium text-[#a3a3a3]">{ep.provider}</td>
                          <td className="px-6 py-2.5 font-mono text-[#fafafa] max-w-[200px] truncate">{ep.url}</td>
                          <td className="px-6 py-2.5">
                            <span
                              className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded"
                              style={{ background: ms.bg, border: `1px solid ${ms.border}`, color: ms.color }}
                            >
                              {ep.method}
                            </span>
                          </td>
                          <td className="px-6 py-2.5 font-mono tabular-nums text-[#a3a3a3]">{ep.callsPerDay}</td>
                          <td className="px-6 py-2.5 font-mono font-semibold tabular-nums" style={{ color: ep.cost !== "free" ? "#d4900a" : "#737373" }}>
                            {ep.cost}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
