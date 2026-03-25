import { useState } from "react"
import { motion as Motion, useReducedMotion } from "motion/react"
import { Check, Copy } from "lucide-react"

type Token = { text: string; color: string }

const C = {
  white:  '#fafafa',
  muted:  '#6b7280',
  purple: '#c084fc',
  blue:   '#60a5fa',
  str:    '#a5d6ff',
  amber:  '#d4900a',
  yellow: '#fbbf24',
}

const CODE_LINES: (Token[] | null)[] = [
  [
    { text: 'import', color: C.purple }, { text: ' { ', color: C.white },
    { text: 'init', color: C.yellow }, { text: ' } ', color: C.white },
    { text: 'from', color: C.purple }, { text: " '@recost/node'", color: C.str },
    { text: ';', color: C.white },
  ],
  null,
  [{ text: '// One line. Patches fetch, http, and https automatically.', color: C.muted }],
  [
    { text: 'init', color: C.blue }, { text: '({', color: C.white },
  ],
  [
    { text: '  apiKey', color: C.white }, { text: ': ', color: C.white },
    { text: 'process.env.RECOST_API_KEY', color: C.str }, { text: ',', color: C.white },
  ],
  [
    { text: '  projectId', color: C.white }, { text: ': ', color: C.white },
    { text: 'process.env.RECOST_PROJECT_ID', color: C.str }, { text: ',', color: C.white },
  ],
  [{ text: '});', color: C.white }],
  null,
  [{ text: '// Make API calls as usual. No other changes needed.', color: C.muted }],
  [
    { text: 'const', color: C.purple }, { text: ' response = ', color: C.white },
    { text: 'await', color: C.purple }, { text: ' fetch(', color: C.white },
    { text: "'https://api.openai.com/v1/chat/completions'", color: C.str },
    { text: ', {', color: C.white },
  ],
  [{ text: "  method: ", color: C.white }, { text: "'POST'", color: C.str }, { text: ',', color: C.white }],
  [
    { text: "  headers: { ", color: C.white },
    { text: "'Authorization'", color: C.str },
    { text: ": `Bearer ${process.env.OPENAI_KEY}` },", color: C.white },
  ],
  [{ text: '  body: JSON.', color: C.white }, { text: 'stringify', color: C.blue }, { text: '({', color: C.white }],
  [{ text: "    model: ", color: C.white }, { text: "'gpt-4o'", color: C.str }, { text: ',', color: C.white }],
  [
    { text: '    messages: [{ role: ', color: C.white },
    { text: "'user'", color: C.str }, { text: ', content: ', color: C.white },
    { text: "'Hello!'", color: C.str }, { text: ' }]', color: C.white },
  ],
  [{ text: '  })', color: C.white }],
  [{ text: '});', color: C.white }],
  null,
  [{ text: '// Telemetry sent automatically every 30 seconds', color: C.muted }],
  [{ text: '// → openai · /v1/chat/completions · 142 req · $0.31 today', color: C.amber }],
]

const CODE_STRING = `import { init } from '@recost/node';

// One line. Patches fetch, http, and https automatically.
init({
  apiKey: process.env.RECOST_API_KEY,
  projectId: process.env.RECOST_PROJECT_ID,
});

// Make API calls as usual. No other changes needed.
const response = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: { 'Authorization': \`Bearer \${process.env.OPENAI_KEY}\` },
  body: JSON.stringify({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello!' }]
  })
});

// Telemetry sent automatically every 30 seconds
// → openai · /v1/chat/completions · 142 req · $0.31 today`


const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.2 } },
}

const lineVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.08, ease: 'easeOut' as const } },
}

export function CodeBlock() {
  const [copied, setCopied] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(CODE_STRING)
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
              <Check className="h-3.5 w-3.5 text-[#22c55e]" />
              <span className="text-[#22c55e]">Copied</span>
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
        <Motion.div
          className="font-mono text-sm leading-relaxed text-left"
          variants={shouldReduceMotion ? undefined : containerVariants}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
        >
          {CODE_LINES.map((line, i) => (
            <Motion.div
              key={i}
              className="min-h-[1.5em]"
              variants={shouldReduceMotion ? undefined : lineVariants}
            >
              {line === null
                ? <span>{'\u00a0'}</span>
                : <>
                    {line.map((token, j) => (
                      <span key={j} style={{ color: token.color }}>{token.text}</span>
                    ))}
                    {i === CODE_LINES.length - 1 && !shouldReduceMotion && (
                      <span className="cursor-blink" style={{ color: C.amber }}>▋</span>
                    )}
                  </>
              }
            </Motion.div>
          ))}
        </Motion.div>
      </div>
    </div>
  )
}
