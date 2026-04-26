import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

const LAST_UPDATED = "April 26, 2026"
const OWNER = "lodev"
const CONTACT_EMAIL = "lodev@lods.fun"
const SITE_URL = "https://atrasi.vercel.app"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  )
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1 pl-1">
      {items.map((item, i) => <li key={i}>{item}</li>)}
    </ul>
  )
}

export default function PolicyPage() {
  return (
    <main className="w-full min-h-screen">

      {/* Nav */}
      <nav className="w-full border-b border-border/60 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-base font-semibold tracking-tight">Atrasi</Link>
        <Button asChild size="sm">
          <Link href="/calc">Open calculator</Link>
        </Button>
      </nav>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-16 space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Legal</p>
          <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy & Terms of Use</h1>
          <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <Separator />

        {/* Privacy Policy */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Privacy Policy</p>
          <h2 className="text-xl font-semibold tracking-tight pt-1">How Atrasi handles your data</h2>
        </div>

        <Section title="1. Who we are">
          <p>
            Atrasi is operated by {OWNER}, an independent developer. This site is available at{" "}
            <span className="font-mono text-xs text-foreground">{SITE_URL}</span>. For any
            privacy-related questions, contact{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="2. What data we collect">
          <p>Atrasi collects minimal data. Here is a complete breakdown:</p>

          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <p className="text-foreground font-medium text-sm">a) Data you enter into the calculator</p>
              <p>
                Values you type into the calculator (capital, risk amount, coin price, ATR, etc.) are
                saved to your browser's <span className="font-mono text-xs text-foreground">localStorage</span>.
                This data never leaves your device. It is not transmitted to any server, not stored by
                Atrasi, and not accessible to anyone other than you on your own device.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-foreground font-medium text-sm">b) Data collected by Google AdSense</p>
              <p>
                Atrasi displays ads served by Google AdSense. Google may use cookies and similar
                tracking technologies to serve personalized advertisements based on your browsing
                history and interests. This data collection is governed entirely by Google's own
                privacy policy. Atrasi does not receive or store this data.
              </p>
              <p>
                You can opt out of personalized ads at{" "}
               <a 
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4"
                >
                  adssettings.google.com
                </a>
                {" "}or via the{" "}
               	<a 
                  href="https://optout.networkadvertising.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4"
                >
                  NAI opt-out tool
                </a>
                .
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-foreground font-medium text-sm">c) Analytics (Vercel Analytics — if enabled)</p>
              <p>
                Atrasi may use Vercel Analytics to understand how visitors use the site. If enabled,
                Vercel Analytics collects anonymized, aggregated data such as page views, referrer
                URLs, and general geographic region (country level). It does not use cookies, does not
                track individuals across sites, and does not collect personally identifiable
                information. See{" "}
               	<a 
                  href="https://vercel.com/docs/analytics/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground underline underline-offset-4"
                >
                  Vercel's privacy policy
                </a>
                {" "}for full details.
              </p>
            </div>
          </div>
        </Section>

        <Section title="3. Cookies">
          <p>Atrasi itself does not set any cookies.</p>
          <p>
            Google AdSense sets its own cookies for ad serving and measurement purposes. These are
            third-party cookies and are subject to Google's cookie policy. You can manage or disable
            cookies through your browser settings at any time.
          </p>
        </Section>

        <Section title="4. Third-party services">
          <p>Atrasi uses the following third-party services, each with their own privacy policies:</p>
          <Ul items={[
            "Google AdSense — advertising (policies.google.com/privacy)",
            "Vercel — hosting and optional analytics (vercel.com/legal/privacy-policy)",
          ]} />
          <p>Atrasi is not responsible for the privacy practices of these third-party services.</p>
        </Section>

        <Section title="5. Data retention">
          <p>
            Calculator inputs stored in <span className="font-mono text-xs text-foreground">localStorage</span>{" "}
            persist until you clear your browser storage. Atrasi has no access to this data and
            cannot delete it on your behalf — you can clear it at any time through your browser settings.
          </p>
          <p>Atrasi does not maintain any server-side database of user data.</p>
        </Section>

        <Section title="6. Children's privacy">
          <p>
            Atrasi is not directed at children under 13. We do not knowingly collect any personal
            information from children. If you believe a child has provided personal information through
            this site, please contact us and we will take appropriate steps.
          </p>
        </Section>

        <Section title="7. Your rights">
          <p>
            Depending on your location, you may have rights under GDPR (EU), CCPA (California), or
            similar laws, including the right to access, correct, or delete personal data held about
            you. Since Atrasi holds no server-side personal data, most of these rights are exercised
            directly through your browser (clearing localStorage, managing cookies).
          </p>
          <p>
            For any privacy requests or questions, contact{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Section title="8. Changes to this policy">
          <p>
            We may update this privacy policy from time to time. The "last updated" date at the top
            of this page will reflect any changes. Continued use of Atrasi after changes are posted
            constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Separator />

        {/* Terms of Use */}
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Terms of Use</p>
          <h2 className="text-xl font-semibold tracking-tight pt-1">Rules for using Atrasi</h2>
        </div>

        <Section title="9. Acceptance of terms">
          <p>
            By accessing or using Atrasi, you agree to these terms. If you do not agree, please do
            not use the site.
          </p>
        </Section>

        <Section title="10. Not financial advice">
          <p>
            Atrasi is a mathematical calculator and educational tool. Nothing on this site constitutes
            financial advice, investment advice, trading advice, or any other kind of professional
            advice. All content is for informational and educational purposes only.
          </p>
          <p>
            Trading cryptocurrencies involves significant risk, including the risk of losing all
            capital invested. Past performance is not indicative of future results. Always consult a
            qualified financial advisor before making any investment decisions.
          </p>
          <p>
            {OWNER} and Atrasi are not liable for any trading losses, financial damages, or decisions
            made based on information or calculations from this site.
          </p>
        </Section>

        <Section title="11. No guarantees">
          <p>
            Atrasi is provided "as is" without warranties of any kind, express or implied. We do not
            guarantee the accuracy, completeness, or fitness for a particular purpose of any
            calculation or content on this site. Calculation results depend entirely on the inputs
            you provide.
          </p>
        </Section>

        <Section title="12. Acceptable use">
          <p>You agree not to:</p>
          <Ul items={[
            "Use Atrasi for any unlawful purpose",
            "Attempt to disrupt, hack, or interfere with the site or its infrastructure",
            "Reproduce or resell any part of Atrasi without written permission",
            "Represent Atrasi's output as professional financial advice to others",
          ]} />
        </Section>

        <Section title="13. Intellectual property">
          <p>
            All content, design, and code on Atrasi is owned by {OWNER} unless otherwise noted.
            You may not copy, reproduce, or redistribute any part of Atrasi without prior written
            consent.
          </p>
        </Section>

        <Section title="14. Governing law">
          <p>
            These terms are governed by the laws of the Republic of the Philippines, without regard
            to conflict of law principles. Any disputes arising from use of this site shall be subject
            to the exclusive jurisdiction of the courts of the Philippines.
          </p>
        </Section>

        <Section title="15. Contact">
          <p>
            For any questions about this policy or these terms, reach out at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-foreground underline underline-offset-4">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>

        <Separator />

        {/* Footer nav */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
          <Button asChild size="sm">
            <Link href="/calc">Open calculator</Link>
          </Button>
        </div>

      </div>
    </main>
  )
}
