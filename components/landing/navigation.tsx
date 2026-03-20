import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/src/lib/auth-context"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 w-[85.7%] items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-mono text-xl font-bold tracking-tight text-[#fafafa]">
          recost
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/docs"
            className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
          >
            Documentation
          </Link>
          <Link
            to="/about"
            className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
          >
            About
          </Link>
          <a
            href="https://github.com/recost-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
          >
            GitHub
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Button
              className="bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium"
              asChild
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#1a1a1a]"
                asChild
              >
                <Link to="/login">Sign in</Link>
              </Button>
              <Button
                className="bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium"
                asChild
              >
                <Link to="/login">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#fafafa]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-[#262626] bg-[#0a0a0a] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              to="/docs"
              className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              to="/about"
              className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <a
              href="https://github.com/recost-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-[#262626]">
              {isAuthenticated ? (
                <Button
                  className="w-full bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium"
                  asChild
                >
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#1a1a1a]"
                    asChild
                  >
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                  </Button>
                  <Button
                    className="w-full bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium"
                    asChild
                  >
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Get started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
