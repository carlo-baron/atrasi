import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Hero(){
	return(
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
	);
}
