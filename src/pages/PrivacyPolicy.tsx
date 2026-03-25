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

export default function PrivacyPolicy() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 animated-gradient" />
      <div className="glow-orb w-[1200px] h-[620px] top-0 left-1/2 -translate-x-1/2" />
      <div className="glow-orb-sm h-[420px] w-[560px] top-[26%] -left-28" />
      <div className="glow-orb-sm h-[360px] w-[520px] top-[62%] -right-24" />
      <Navigation />

      <Motion.div
        {...FADE(0)}
        className="relative mx-auto max-w-5xl px-6 pb-24 pt-28 md:pt-32"
      >
        <div className="mb-12">
          <p className="mb-3 text-xs uppercase tracking-widest text-neutral-500">Legal</p>
          <h1 className="mb-2 text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-sm text-neutral-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <Section title="Overview">
          <p>
            {PRODUCT_NAME} ("we", "us", or "our") operates {SITE_URL} and the Recost
            developer tools including the VS Code extension, Node.js middleware, Python
            middleware, and web dashboard (collectively, the "Service"). This Privacy Policy
            explains what information we collect, how we use it, and your rights regarding
            that information.
          </p>
          <p>
            By using the Service, you agree to the collection and use of information as
            described in this policy. {PRODUCT_NAME} is not yet a formally incorporated
            entity. This policy reflects our current practices and will be updated upon
            incorporation.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p><span className="text-white font-medium">Account information.</span> When you
          sign in with Google OAuth, we receive your name, email address, and Google account
          ID. We use this solely to authenticate your identity and associate your projects
          and API keys with your account.</p>

          <p><span className="text-white font-medium">Project telemetry data.</span> When
          you use the Recost SDK middleware (Node.js or Python) in your application, the SDK
          intercepts outbound HTTP calls and sends aggregated telemetry payloads to our API.
          These payloads contain: provider name, endpoint path, estimated cost, request
          count, and timestamp windows. We do not collect the contents of your API requests
          or responses, authentication headers, or any payload body data.</p>

          <p><span className="text-white font-medium">API keys.</span> We generate and store
          hashed API keys (prefixed <code className="text-neutral-300 bg-neutral-800 px-1 rounded text-xs">rc-</code>)
          that you use to authenticate SDK and extension requests. We store a hash of the key,
          last-used timestamp, and a user-defined label. We do not store the raw key value
          after generation.</p>

          <p><span className="text-white font-medium">Usage metadata.</span> We log standard
          server-side request metadata (IP address, user agent, timestamp) for security,
          rate limiting, and debugging purposes. This data is not sold or shared with third
          parties.</p>
        </Section>

        <Section title="How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Authenticate your account and maintain your session</li>
            <li>Store and display your project cost analytics in the dashboard</li>
            <li>Generate API keys and enforce rate limits</li>
            <li>Compute environmental impact estimates (electricity, water, CO₂) from your telemetry</li>
            <li>Improve the accuracy of our provider pricing data</li>
            <li>Respond to support requests and communicate service updates</li>
          </ul>
          <p>
            We do not use your data to train machine learning models, serve advertisements,
            or build behavioral profiles.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>
            Raw telemetry window data is retained for 7 days, after which it is automatically
            pruned. Daily rollup aggregates are retained for the lifetime of your project.
            Account data is retained until you request deletion. API key metadata is retained
            until you revoke the key.
          </p>
        </Section>

        <Section title="Third-Party Services">
          <p>We use the following third-party services to operate the Service:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><span className="text-white font-medium">Google OAuth</span> — for authentication. Governed by Google's Privacy Policy.</li>
            <li><span className="text-white font-medium">Railway</span> — for API hosting and database infrastructure.</li>
            <li><span className="text-white font-medium">Cloudflare</span> — for CDN, DNS, and edge delivery of the frontend and extension assets.</li>
          </ul>
          <p>
            We do not sell, rent, or share your personal information with any other third
            parties except as required by law.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We implement industry-standard security practices including HTTPS-only transport,
            hashed credential storage, and rate limiting on all authenticated endpoints. API
            keys are generated with 64 bytes of cryptographic randomness. However, no method
            of transmission over the internet is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </Section>

        <Section title="Your Rights">
          <p>You have the right to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Access the personal data we hold about you</li>
            <li>Request deletion of your account and associated data</li>
            <li>Revoke API keys at any time from the dashboard</li>
            <li>Disconnect your Google account from Recost</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>.
          </p>
        </Section>

        <Section title="Children's Privacy">
          <p>
            The Service is not directed at children under the age of 13. We do not knowingly
            collect personal information from children. If you believe a child has provided
            us with personal information, please contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-white underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>{" "}
            and we will delete it promptly.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of
            material changes by updating the "Last updated" date at the top of this page.
            Continued use of the Service after changes constitutes your acceptance of the
            updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have questions about this Privacy Policy, please contact us at{" "}
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
