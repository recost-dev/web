import { Navigation } from "@/components/landing/navigation"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { FeaturesSection } from "@/components/landing/features-section"
import { DashboardPreview } from "@/components/landing/dashboard-preview"
import { OpenSourceSection } from "@/components/landing/open-source"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <HeroSection />
      <HowItWorks />
      <FeaturesSection />
      <div className="hidden md:block"><DashboardPreview /></div>
      <OpenSourceSection />
      <Footer />
    </main>
  )
}
