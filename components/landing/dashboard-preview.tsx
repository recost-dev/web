const providers = [
  { name: "OpenAI", cost: "$127.45", calls: "12,847", color: "#d4900a" },
  { name: "Anthropic", cost: "$89.23", calls: "8,421", color: "#3b82f6" },
  { name: "Cohere", cost: "$23.67", calls: "2,156", color: "#f59e0b" },
]

const apiKeys = [
  { name: "production-main", key: "rct_prod_***8f3a", status: "active", created: "Mar 15, 2026" },
  { name: "staging-test", key: "rct_stg_***2b7c", status: "active", created: "Mar 12, 2026" },
  { name: "dev-local", key: "rct_dev_***9d4e", status: "inactive", created: "Mar 10, 2026" },
]

export function DashboardPreview() {
  return (
    <section className="relative border-t border-[#262626] bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#fafafa] md:text-4xl">
            Dashboard preview
          </h2>
          <p className="mt-4 text-lg text-[#a3a3a3]">
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
          <div className="grid gap-6 p-6 lg:grid-cols-2">
            {/* Cost Breakdown */}
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-6">
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
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-6">
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

            {/* API Keys Table */}
            <div className="rounded-lg border border-[#262626] bg-[#0a0a0a] p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-medium text-[#fafafa]">API Keys</h3>
                <button className="text-xs text-[#d4900a] hover:underline">+ Create key</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#262626]">
                      <th className="pb-3 text-left font-medium text-[#737373]">Name</th>
                      <th className="pb-3 text-left font-medium text-[#737373]">Key</th>
                      <th className="pb-3 text-left font-medium text-[#737373]">Status</th>
                      <th className="pb-3 text-left font-medium text-[#737373]">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiKeys.map((key) => (
                      <tr key={key.name} className="border-b border-[#262626]/50">
                        <td className="py-3 text-[#fafafa]">{key.name}</td>
                        <td className="py-3 font-mono text-[#a3a3a3]">{key.key}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs ${
                            key.status === "active" 
                              ? "bg-[#d4900a]/10 text-[#d4900a]" 
                              : "bg-[#737373]/10 text-[#737373]"
                          }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              key.status === "active" ? "bg-[#d4900a]" : "bg-[#737373]"
                            }`} />
                            {key.status}
                          </span>
                        </td>
                        <td className="py-3 text-[#737373]">{key.created}</td>
                      </tr>
                    ))}
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
