import { Link } from "react-router"

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Pricing", href: "/pricing" },
    { name: "Changelog", href: "/changelog" },
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "API Reference", href: "/docs/api" },
    { name: "Examples", href: "/docs/examples" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
  Connect: [
    { name: "GitHub", href: "https://github.com/recost-dev" },
    { name: "Email", href: "mailto:hello@recost.dev" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-[#262626] bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="font-mono text-xl font-bold tracking-tight text-[#fafafa]">
              recost
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[#a3a3a3]">
              Open-source API cost tracking for developers. Know exactly what your APIs cost.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium text-[#fafafa]">{category}</h4>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto:") ? (
                      <a
                        href={link.href}
                        className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
                        {...(link.href.startsWith("http") && {
                          target: "_blank",
                          rel: "noopener noreferrer",
                        })}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-[#a3a3a3] transition-colors hover:text-[#fafafa]"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#262626] pt-8 sm:flex-row">
          <p className="text-sm text-[#737373]">
            &copy; {new Date().getFullYear()} Recost. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-[#737373]">
            <span>Built with</span>
            <span className="text-[#d4900a]">{"♥"}</span>
            <span>for developers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
