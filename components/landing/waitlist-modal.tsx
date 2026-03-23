import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const ROLES = [
  { value: "student", label: "Student" },
  { value: "developer", label: "Developer" },
  { value: "founder", label: "Founder" },
  { value: "other", label: "Other" },
]

function RoleDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selected = ROLES.find((r) => r.value === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((o) => !o)}
        className="h-11 w-full flex items-center justify-between rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-left cursor-pointer focus:border-[#d4900a] focus:outline-none focus:ring-1 focus:ring-[#d4900a]/20 transition-colors"
      >
        <span className={selected ? "text-[#fafafa]" : "text-[#737373]"}>
          {selected ? selected.label : "Select your role"}
        </span>
        <ChevronDown
          className="h-4 w-4 text-[#737373] transition-transform duration-150"
          style={{ transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-[#262626] bg-[#111111] overflow-hidden shadow-lg">
          {ROLES.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => { onChange(r.value); setDropdownOpen(false) }}
              className="w-full px-3 py-2.5 text-sm text-left transition-colors hover:bg-[#1a1a1a]"
              style={{ color: value === r.value ? "#d4900a" : "#a3a3a3" }}
            >
              {r.label}
            </button>
          ))}
        </div>
      )}

      {/* hidden input so FormData picks up the value */}
      <input type="hidden" name="role" value={value} />
    </div>
  )
}

export function WaitlistModal({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState("")
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const form = e.currentTarget
    await fetch("https://formspree.io/f/xqeyjybg", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
    setSubmitting(false)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        overlayClassName="bg-black/60 backdrop-blur-sm"
        className="
          top-auto bottom-0 left-0 right-0 max-w-full translate-x-0 translate-y-0
          rounded-b-none rounded-t-xl max-h-[90svh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          sm:top-[50%] sm:left-[50%] sm:right-auto sm:bottom-auto
          sm:translate-x-[-50%] sm:translate-y-[-50%]
          sm:max-w-md sm:rounded-xl sm:max-h-[85svh]
          border-[#262626] bg-[#111111] text-[#fafafa]
        "
      >
        <DialogHeader>
          <DialogTitle className="text-[#fafafa]">Join the waitlist</DialogTitle>
          <DialogDescription className="text-[#a3a3a3]">
            Be the first to know when recost launches. We&apos;ll reach out when we launch!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2 pb-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="waitlist-email" className="text-sm text-[#a3a3a3]">
              Email <span className="text-[#d4900a]">*</span>
            </label>
            <input
              id="waitlist-email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="h-11 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#d4900a] focus:outline-none focus:ring-1 focus:ring-[#d4900a]/20 [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#0a0a0a] [&:-webkit-autofill]:[-webkit-text-fill-color:#fafafa]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#a3a3a3]">
              Role <span className="text-[#737373] text-xs">(optional)</span>
            </label>
            <RoleDropdown value={role} onChange={setRole} />
            {role === "other" && (
              <input
                type="text"
                name="roleOther"
                placeholder="Please specify your role"
                className="h-11 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#d4900a] focus:outline-none focus:ring-1 focus:ring-[#d4900a]/20"
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="waitlist-problem" className="text-sm text-[#a3a3a3]">
              What will you use recost for?{" "}
              <span className="text-[#737373] text-xs">(optional)</span>
            </label>
            <textarea
              id="waitlist-problem"
              name="problem"
              rows={3}
              placeholder="Describe the problem you're trying to solve..."
              className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#d4900a] focus:outline-none focus:ring-1 focus:ring-[#d4900a]/20 resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name="mailingList"
                value="yes"
                className="peer h-4 w-4 appearance-none rounded border border-[#262626] bg-[#0a0a0a] checked:bg-[#d4900a] checked:border-[#d4900a] focus:outline-none focus:ring-1 focus:ring-[#d4900a]/20 cursor-pointer"
              />
              <svg
                className="pointer-events-none absolute h-3 w-3 text-[#0a0a0a] opacity-0 peer-checked:opacity-100"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </div>
            <span className="text-sm text-[#a3a3a3]">Sign me up for product updates</span>
          </label>

          <Button
            type="submit"
            disabled={submitting}
            className="mt-1 h-11 bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium w-full disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
