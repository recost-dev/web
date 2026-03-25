import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const ROLES = [
  { value: "student", label: "Student" },
  { value: "developer", label: "Developer" },
  { value: "founder", label: "Founder" },
  { value: "other", label: "Other" },
]

export function RoleDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
