"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

const codeSnippet = `import { recost } from '@recost/sdk';

// Wrap your HTTP client
const client = recost.wrap(fetch);

// Make API calls as usual
const response = await client('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': \`Bearer \${process.env.OPENAI_KEY}\` },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

// Cost telemetry is logged automatically
// → Provider: openai | Model: gpt-4 | Cost: $0.0032`

export function CodeBlock() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(codeSnippet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="code-block rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#262626] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
            <div className="h-3 w-3 rounded-full bg-[#f59e0b]" />
            <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
          </div>
          <span className="ml-3 font-mono text-xs text-[#737373]">index.ts</span>
        </div>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[#737373] transition-colors hover:bg-[#1a1a1a] hover:text-[#a3a3a3]"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#34d399]" />
              <span className="text-[#34d399]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code */}
      <div className="overflow-x-auto p-4 text-left">
        <pre className="font-mono text-sm leading-relaxed text-left">
          <code>
            <span className="text-[#c084fc]">import</span>
            <span className="text-[#fafafa]">{" { "}</span>
            <span className="text-[#fbbf24]">recost</span>
            <span className="text-[#fafafa]">{" } "}</span>
            <span className="text-[#c084fc]">from</span>
            <span className="text-[#a5d6ff]">{" '@recost/sdk'"}</span>
            <span className="text-[#fafafa]">;</span>
            {"\n\n"}
            <span className="text-[#6b7280]">{"// Wrap your HTTP client"}</span>
            {"\n"}
            <span className="text-[#c084fc]">const</span>
            <span className="text-[#fafafa]"> client </span>
            <span className="text-[#c084fc]">=</span>
            <span className="text-[#fafafa]"> recost.</span>
            <span className="text-[#60a5fa]">wrap</span>
            <span className="text-[#fafafa]">(fetch);</span>
            {"\n\n"}
            <span className="text-[#6b7280]">{"// Make API calls as usual"}</span>
            {"\n"}
            <span className="text-[#c084fc]">const</span>
            <span className="text-[#fafafa]"> response </span>
            <span className="text-[#c084fc]">=</span>
            <span className="text-[#c084fc]"> await</span>
            <span className="text-[#fafafa]"> client(</span>
            <span className="text-[#a5d6ff]">{"'https://api.openai.com/v1/chat/completions'"}</span>
            <span className="text-[#fafafa]">, {"{"}</span>
            {"\n"}
            <span className="text-[#fafafa]">{"  "}method: </span>
            <span className="text-[#a5d6ff]">{"'POST'"}</span>
            <span className="text-[#fafafa]">,</span>
            {"\n"}
            <span className="text-[#fafafa]">{"  "}headers: {"{ "}</span>
            <span className="text-[#a5d6ff]">{"'Authorization'"}</span>
            <span className="text-[#fafafa]">: </span>
            <span className="text-[#a5d6ff]">{"`Bearer ${process.env.OPENAI_KEY}`"}</span>
            <span className="text-[#fafafa]">{" }"}</span>
            <span className="text-[#fafafa]">,</span>
            {"\n"}
            <span className="text-[#fafafa]">{"  "}body: JSON.</span>
            <span className="text-[#60a5fa]">stringify</span>
            <span className="text-[#fafafa]">({"{"}</span>
            {"\n"}
            <span className="text-[#fafafa]">{"    "}model: </span>
            <span className="text-[#a5d6ff]">{"'gpt-4'"}</span>
            <span className="text-[#fafafa]">,</span>
            {"\n"}
            <span className="text-[#fafafa]">{"    "}messages: [{"{ "}role: </span>
            <span className="text-[#a5d6ff]">{"'user'"}</span>
            <span className="text-[#fafafa]">, content: </span>
            <span className="text-[#a5d6ff]">{"'Hello!'"}</span>
            <span className="text-[#fafafa]">{" }"}]</span>
            {"\n"}
            <span className="text-[#fafafa]">{"  }"}</span>
            <span className="text-[#fafafa]">)</span>
            {"\n"}
            <span className="text-[#fafafa]">{"}"});</span>
            {"\n\n"}
            <span className="text-[#6b7280]">{"// Cost telemetry is logged automatically"}</span>
            {"\n"}
            <span className="text-[#34d399]">{"// → Provider: openai | Model: gpt-4 | Cost: $0.0032"}</span>
          </code>
        </pre>
      </div>
    </div>
  )
}
