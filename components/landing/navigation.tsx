"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="font-mono text-xl font-bold tracking-tight text-[#fafafa]">
          recost
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/docs"
            className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
          >
            Documentation
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
          >
            Dashboard
          </Link>
          <Link 
            href="https://github.com/recost-dev" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
          >
            GitHub
          </Link>
          <Link 
            href="/about"
            className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
          >
            Pricing
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          <Button 
            variant="ghost" 
            className="text-sm text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#1a1a1a]"
            asChild
          >
            <Link href="/login">Sign in</Link>
          </Button>
          <Button 
            className="bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium"
            asChild
          >
            <Link href="/login">Get started</Link>
          </Button>
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
              href="/docs"
              className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Documentation
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              href="https://github.com/recost-dev" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
              onClick={() => setMobileMenuOpen(false)}
            >
              GitHub
            </Link>
            <Link 
              href="/about"
              className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t border-[#262626]">
              <Button 
                variant="ghost" 
                className="w-full justify-center text-sm text-[#a3a3a3] hover:text-[#fafafa] hover:bg-[#1a1a1a]"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button 
                className="w-full bg-[#34d399] text-[#0a0a0a] hover:bg-[#34d399]/90 font-medium"
                asChild
              >
                <Link href="/login">Get started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
