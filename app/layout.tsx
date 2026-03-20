import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/app/providers'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Recost - Know exactly what your APIs cost',
  description: 'Open-source middleware SDK that intercepts HTTP calls to track, attribute, and optimize API costs across providers like OpenAI, Anthropic, and more.',
  keywords: ['API costs', 'developer tools', 'SDK', 'cost tracking', 'OpenAI', 'Anthropic', 'API monitoring'],
  authors: [{ name: 'Recost' }],
  openGraph: {
    title: 'Recost - Know exactly what your APIs cost',
    description: 'Open-source middleware SDK for tracking API costs across providers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recost - Know exactly what your APIs cost',
    description: 'Open-source middleware SDK for tracking API costs across providers.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-[#fafafa]">
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
