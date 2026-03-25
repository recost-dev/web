import React from "react";
import { motion as Motion } from "motion/react";
import { Navigation } from "@/components/landing/navigation";
import { Footer } from "@/components/landing/footer";

const LAST_UPDATED = "March 24, 2026";
const CONTACT_EMAIL = "privacy@recost.dev";
const PRODUCT_NAME = "Recost";
const SITE_URL = "https://recost.dev";

const FADE = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: "easeOut" as const },
});

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-lg font-semibold text-white mb-3">{title}</h2>
    <div className="text-sm text-neutral-400 leading-relaxed space-y-3">{children}</div>
  </section>
);

export default function TermsOfService() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 animated-gradient" />
      <div className="glow-orb w-[1200px] h-[620px] top-0 left-1/2 -translate-x-1/2" />
      <div className="glow-orb-sm h-[380px] w-[540px] top-[22%] -left-20" />
      <div className="glow-orb-sm h-[460px] w-[600px] top-[58%] -right-32" />
      <Navigation />

      <Motion.div
        {...FADE(0)}
        className="relative mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-32"
      >
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-neutral-500">Legal</p>
          <h1 className="mb-2 text-3xl font-bold text-white">Terms of Service</h1>
          <p className="text-sm text-neutral-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="Acceptance of Terms">
          <p>
            By accessing or using {PRODUCT_NAME} ({SITE_URL}), the Recost VS Code extension,
            Node.js middleware, Python middleware, or web dashboard (collectively, the
            "Service"), you agree to be bound by these Terms of Service ("Terms"). If you
            do not agree, do not use the Service.
          </p>
          <p>
            {PRODUCT_NAME} is currently operated as an unincorporated project. These Terms
            will be updated upon formal incorporation and you will be notified of material
            changes.
          </p>
        </Section>

        <Section title="Description of Service">
          <p>
            {PRODUCT_NAME} is a developer tool for tracking, analyzing, and projecting the
            cost of third-party API usage in software projects. The Service includes:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>A VS Code extension for static code analysis and cost estimation</li>
            <li>Node.js and Python SDK middleware for runtime telemetry collection</li>
            <li>A web dashboard for analytics, cost visualization, and project management</li>
            <li>A REST API for programmatic access to your project data</li>
          </ul>
          <p>
            The Service is currently in public beta. Features, pricing, and availability
            are subject to change without notice.
          </p>
        </Section>

        <Section title="Accounts and API Keys">
          <p>
            You must sign in with a valid Google account to use the Service. You are
            responsible for maintaining the confidentiality of your API keys and for all
            activity that occurs under your account.
          </p>
          <p>
            You may generate up to 10 API keys per account. You must not share API keys
            publicly or embed them in client-side code. If you suspect a key has been
            compromised, revoke it immediately from the dashboard and generate a new one.
          </p>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms
            or that we reasonably believe are being used for abuse, unauthorized scraping,
            or circumvention of rate limits.
          </p>
        </Section>

        <Section title="Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Violate any applicable law or regulation</li>
            <li>Transmit malicious code, spam, or unauthorized automated requests</li>
            <li>Attempt to gain unauthorized access to our systems or other users' data</li>
            <li>Reverse engineer, decompile, or extract proprietary components of the Service</li>
            <li>Use the Service in a way that degrades performance for other users</li>
            <li>Resell or sublicense access to the Service without our written consent</li>
          </ul>
          <p>
            The open-source components of Recost (SDKs, extension) are licensed under
            AGPL-3.0. Use of those components is additionally governed by that license.
          </p>
        </Section>

        <Section title="Telemetry Data">
          <p>
            When you install and initialize the Recost SDK middleware in your application,
            it will collect and transmit aggregated telemetry about your outbound API calls
            to our servers. This telemetry includes provider names, endpoint paths, request
            counts, and estimated costs — it does not include request bodies, authentication
            credentials, or response data.
          </p>
          <p>
            You represent that you have the right to transmit this telemetry data to us and
            that doing so does not violate any agreement you have with a third party. You
            are responsible for disclosing the use of Recost in your own privacy policies
            where required.
          </p>
        </Section>

        <Section title="Rate Limits">
          <p>
            The Service enforces rate limits to ensure fair usage and system stability.
            Current limits include up to 1,000 telemetry window submissions per hour per
            project. We reserve the right to adjust rate limits at any time. Repeated
            violations of rate limits may result in temporary or permanent suspension of
            your API keys.
          </p>
        </Section>

        <Section title="Intellectual Property">
          <p>
            The Recost brand, logo, website design, and proprietary API are owned by the
            Recost project and its contributors. The open-source SDK and extension
            components are available under the AGPL-3.0 license as specified in each
            repository.
          </p>
          <p>
            You retain full ownership of your project data, telemetry, and any code you
            write. We do not claim any rights over your data beyond what is necessary to
            operate the Service.
          </p>
        </Section>

        <Section title="Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY
            KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            Cost estimates produced by {PRODUCT_NAME} are approximations based on
            publicly available provider pricing data. We do not guarantee accuracy and
            are not liable for billing discrepancies between our estimates and your actual
            third-party API bills.
          </p>
        </Section>

        <Section title="Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, {PRODUCT_NAME.toUpperCase()} AND ITS
            CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF OR INABILITY TO
            USE THE SERVICE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
          </p>
          <p>
            Our total liability to you for any claim arising from these Terms or your use
            of the Service shall not exceed the amount you paid us in the 12 months
            preceding the claim, or $100 USD, whichever is greater.
          </p>
        </Section>

        <Section title="Changes to the Service">
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the
            Service at any time with or without notice. We will make reasonable efforts
            to notify users of significant changes via the dashboard or email. We are not
            liable to you or any third party for any modification, suspension, or
            discontinuation of the Service.
          </p>
        </Section>

        <Section title="Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of
            the State of New Jersey, United States, without regard to conflict of law
            principles. Any disputes arising under these Terms shall be resolved in the
            courts located in New Jersey.
          </p>
        </Section>

        <Section title="Changes to These Terms">
          <p>
            We may update these Terms from time to time. We will notify you of material
            changes by updating the "Last updated" date and, where appropriate, by email.
            Continued use of the Service after changes constitutes your acceptance of the
            updated Terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have questions about these Terms, please contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </Section>
      </Motion.div>
      <Footer />
    </main>
  );
}
