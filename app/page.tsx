import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "ATR-Based Sizing",
    description:
      "Position size is calculated from real volatility, not guesswork. ATR controls your stop, your stop controls your size.",
  },
  {
    title: "Leverage Emerges from Math",
    description:
      "You never pick leverage manually. It's derived automatically from your risk, stop distance, and capital.",
  },
  {
    title: "Volatility Filter",
    description:
      "Built-in ATR% filter tells you whether a coin is tradeable right now — ideal, acceptable, or skip entirely.",
  },
  {
    title: "Risk-First Process",
    description:
      "Six enforced steps in the correct order. Risk → Stop → Position → Units → Leverage → Execute. Never reversed.",
  },
  {
    title: "Pre-Trade Checklist",
    description:
      "Five conditions checked live before every trade. All green means clear to trade. One red means skip.",
  },
  {
    title: "Inputs Remembered",
    description:
      "Your capital, risk amount, and setup are saved automatically. Pick up where you left off every session.",
  },
]

const steps = [
  { n: "01", title: "Set your risk", body: "Enter your capital and how much you're willing to lose on this trade — $0.40 to $1 for a $20 account." },
  { n: "02", title: "Enter market data", body: "Input the coin price and ATR (14). Atrasi checks volatility and tells you whether the setup is worth taking." },
  { n: "03", title: "Configure the trade", body: "Set your stop multiplier (1–1.5× ATR) and your R:R target. Everything else is calculated for you." },
  { n: "04", title: "Read the output", body: "Position size, units, stop loss, take profit, leverage, and break-even win rate — all derived from your inputs." },
]

const faqs = [
  {
    q: "What is ATR and why does it matter?",
    a: "Average True Range (ATR) measures how much a coin moves on average over 14 periods. It reflects real volatility — not arbitrary percentages. Using ATR for your stop means your exit respects the actual market structure instead of being random.",
  },
  {
    q: "Why shouldn't I just pick my leverage manually?",
    a: "Picking leverage first is working backwards. It leads to oversized positions and stops that don't match the market. Atrasi derives leverage as the last step — a result of your risk and stop, not an input.",
  },
  {
    q: "What coins does this work for?",
    a: "The calculator is optimized for liquid pairs: BTC, ETH, XRP, and optionally SOL and BNB when volume is clearly strong. Low-cap and thin-liquidity coins introduce too much unpredictability for ATR-based sizing to be reliable.",
  },
  {
    q: "What if my leverage comes out above 5×?",
    a: "That's a signal to reduce your position or skip the trade. High leverage usually means your stop is too tight relative to ATR, or you're risking too much. Atrasi flags this clearly so you don't proceed blindly.",
  },
  {
    q: "Is this a trading bot or signal service?",
    a: "No. Atrasi is a calculator and decision framework. It helps you size trades correctly — it does not tell you when to buy or sell, and it does not connect to any exchange.",
  },
  {
    q: "Is Atrasi free?",
    a: "Yes, completely free to use in your browser with no account required.",
  },
]

export default function LandingPage() {
  return (
    <main className="w-full min-h-screen">

      {/* Nav */}
      <nav className="w-full border-b border-border/60 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-base font-semibold tracking-tight">Atrasi</span>
        <div className="flex items-center gap-6">
          <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How it works
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
          <Link href="/policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Policy
          </Link>
          <Button asChild size="sm">
            <Link href="/calc">Open calculator</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
        <Badge variant="secondary" className="mb-6 text-xs tracking-wide">
          Free · No account required
        </Badge>
        <h1 className="text-5xl font-semibold tracking-tight leading-tight max-w-2xl">
          Trade sizing built on volatility, not guesswork
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
          Atrasi is an ATR-based position calculator for crypto traders. Enter your risk and market data — it tells you exactly how many units to buy, where to set your stop, and what leverage you need.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/calc">Open calculator</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#how-it-works">See how it works</Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">Features</p>
          <h2 className="text-3xl font-semibold tracking-tight">Everything the math requires</h2>
          <p className="mt-2 text-muted-foreground max-w-lg">
            No fluff, no extra steps. Every feature exists because the risk-first framework demands it.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-5 space-y-2">
                <p className="font-medium text-sm">{f.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* How it works */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">How it works</p>
          <h2 className="text-3xl font-semibold tracking-tight">Four steps, every trade</h2>
          <p className="mt-2 text-muted-foreground max-w-lg">
            The framework enforces a strict order so nothing is calculated before its inputs exist.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s) => (
            <Card key={s.n}>
              <CardContent className="p-5 flex gap-4">
                <span className="text-2xl font-semibold font-mono text-muted-foreground/40 leading-none mt-0.5 shrink-0">
                  {s.n}
                </span>
                <div className="space-y-1">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <Button asChild>
            <Link href="/calc">Try it now</Link>
          </Button>
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Core principle callout */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <Card>
          <CardContent className="p-8 sm:p-12 flex flex-col sm:flex-row gap-8 items-start">
            <div className="space-y-4 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Core principle</p>
              <h2 className="text-2xl font-semibold tracking-tight leading-snug">
                You don't choose leverage.<br />It emerges from your math.
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                ATR controls volatility. Your stop respects volatility. Risk defines position size. Position size defines leverage. Everything is connected — nothing is arbitrary.
              </p>
              <Button asChild variant="outline">
                <Link href="/calc">Open calculator</Link>
              </Button>
            </div>
            <div className="flex-1 space-y-3 w-full">
              {[
                { label: "ATR controls", value: "volatility" },
                { label: "Stop respects", value: "ATR" },
                { label: "Risk defines", value: "position size" },
                { label: "Position defines", value: "leverage" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span className="text-sm font-medium font-mono">{row.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* FAQ */}
      <section id="faq" className="max-w-5xl mx-auto px-6 py-20">
        <div className="mb-10">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">FAQ</p>
          <h2 className="text-3xl font-semibold tracking-tight">Common questions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {faqs.map((faq) => (
            <Card key={faq.q}>
              <CardContent className="p-5 space-y-2">
                <p className="font-medium text-sm">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="max-w-5xl mx-auto" />

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-medium">Atrasi</span>
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          For educational purposes only. Not financial advice. Always trade with capital you can afford to lose.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/calc" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Calculator
          </Link>
          <Link href="/policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Policy
          </Link>
        </div>
      </footer>

    </main>
  )
}
