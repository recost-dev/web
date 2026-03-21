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
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="border-[#262626] bg-[#111111] text-[#fafafa] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#fafafa]">Join the waitlist</DialogTitle>
          <DialogDescription className="text-[#a3a3a3]">
            Be the first to know when recost launches. We&apos;ll reach out when we launch!
          </DialogDescription>
        </DialogHeader>

        <form
          action="https://formspree.io/f/xqeyjybg"
          method="POST"
          className="flex flex-col gap-4 mt-2"
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
              className="h-10 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="waitlist-role" className="text-sm text-[#a3a3a3]">
              Role <span className="text-[#737373] text-xs">(optional)</span>
            </label>
            <select
              id="waitlist-role"
              name="role"
              className="h-10 rounded-md border border-[#262626] bg-[#0a0a0a] px-3 text-sm text-[#fafafa] focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20"
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="developer">Developer</option>
              <option value="founder">Founder</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="waitlist-problem" className="text-sm text-[#a3a3a3]">
              What&apos;s your biggest challenge with tracking API costs?{" "}
              <span className="text-[#737373] text-xs">(optional)</span>
            </label>
            <textarea
              id="waitlist-problem"
              name="problem"
              rows={3}
              placeholder="Describe the problem you're trying to solve..."
              className="rounded-md border border-[#262626] bg-[#0a0a0a] px-3 py-2 text-sm text-[#fafafa] placeholder:text-[#737373] focus:border-[#34d399] focus:outline-none focus:ring-1 focus:ring-[#34d399]/20 resize-none"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="mailingList"
              value="yes"
              className="h-4 w-4 rounded border-[#262626] bg-[#0a0a0a] accent-[#34d399]"
            />
            <span className="text-sm text-[#a3a3a3]">Sign me up for product updates</span>
          </label>

          <Button
            type="submit"
            className="mt-1 bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium w-full"
          >
            Join waitlist
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
