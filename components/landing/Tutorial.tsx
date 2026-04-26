import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  { n: "01", title: "Set your risk", body: "Enter your capital and how much you're willing to lose on this trade — $0.40 to $1 for a $20 account." },
  { n: "02", title: "Enter market data", body: "Input the coin price and ATR (14). Atrasi checks volatility and tells you whether the setup is worth taking." },
  { n: "03", title: "Configure the trade", body: "Set your stop multiplier (1–1.5× ATR) and your R:R target. Everything else is calculated for you." },
  { n: "04", title: "Read the output", body: "Position size, units, stop loss, take profit, leverage, and break-even win rate — all derived from your inputs." },
]

export default function Tutorial(){
	return(
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
	);
}
