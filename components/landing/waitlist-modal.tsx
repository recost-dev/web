import { useState } from "react"
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

export function WaitlistModal({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState("")

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        overlayClassName="bg-[#0a0a0a]"
        className="
          top-auto bottom-0 left-0 right-0 max-w-full translate-x-0 translate-y-0
          rounded-b-none rounded-t-xl max-h-[90svh] overflow-y-scroll overscroll-contain
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

        <form
          action="https://formspree.io/f/xqeyjybg"
          method="POST"
          className="flex flex-col gap-4 mt-2 pb-2"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="waitlist-email" className="text-sm text-[#a3a3a3]">
              Email <span className="text-[#34d399]">*</span>
            </label>
            <input
              id="waitlist-email"
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="h-11 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="waitlist-role" className="text-sm text-[#a3a3a3]">
              Role <span className="text-[#737373] text-xs">(optional)</span>
            </label>
            <div className="relative">
              <select
                id="waitlist-role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="h-11 w-full appearance-none rounded-md border border-[#262626] bg-[#0a0a0a] px-3 pr-8 text-sm text-[#fafafa] focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20 cursor-pointer"
              >
                <option value="" className="bg-[#0a0a0a] text-[#737373]">Select your role</option>
                <option value="student" className="bg-[#0a0a0a]">Student</option>
                <option value="developer" className="bg-[#0a0a0a]">Developer</option>
                <option value="founder" className="bg-[#0a0a0a]">Founder</option>
                <option value="other" className="bg-[#0a0a0a]">Other</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#737373]" />
            </div>
            {role === "other" && (
              <input
                type="text"
                name="roleOther"
                placeholder="Please specify your role"
                className="h-11 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20"
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
              className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2.5 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20 resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                name="mailingList"
                value="yes"
                className="peer h-4 w-4 appearance-none rounded border border-[#262626] bg-[#0a0a0a] checked:bg-[#34d399] checked:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20 cursor-pointer"
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
            className="mt-1 h-11 bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium w-full"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
