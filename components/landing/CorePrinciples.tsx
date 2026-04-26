import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function CorePrinciples(){
	return(
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
	);
}
