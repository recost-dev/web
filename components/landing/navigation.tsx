import { Link, useLocation } from "react-router"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/src/lib/auth-context"
import { SignInModal } from "./sign-in-modal"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if ((location.state as { openSignIn?: boolean })?.openSignIn) {
      setSignInOpen(true)
    }
  }, [location.state])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
    <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 bg-[#0a0a0a]/80 backdrop-blur-md border-b ${scrolled ? 'border-[#262626]' : 'border-transparent'}`}>
      <nav className="mx-auto flex h-16 w-[85.7%] items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-mono text-xl font-extrabold tracking-tight text-white hover:opacity-85 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="28" height="28">
            <path d="M55 85 L240 85 L240 140 L105 140 L105 315 L55 315 Z" fill="none" stroke="#fafafa" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M345 315 L160 315 L160 260 L295 260 L295 85 L345 85 Z" fill="#fafafa" stroke="#fafafa" strokeWidth="14" strokeLinejoin="round" strokeLinecap="round"/>
          </svg>
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
              className="bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium"
              asChild
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#1a1a1a]"
                onClick={() => setSignInOpen(true)}
              >
                Sign in
              </Button>
              <Button
                className="bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium"
                onClick={() => setSignInOpen(true)}
              >
                Get started
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
                  className="w-full bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium"
                  asChild
                >
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#1a1a1a]"
                    onClick={() => { setMobileMenuOpen(false); setSignInOpen(true) }}
                  >
                    Sign in
                  </Button>
                  <Button
                    className="w-full bg-[#d4900a] text-[#0a0a0a] hover:bg-[#d4900a]/90 font-medium"
                    onClick={() => { setMobileMenuOpen(false); setSignInOpen(true) }}
                  >
                    Get started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>

    <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  )
}
