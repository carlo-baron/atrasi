import { Card, CardContent } from "@/components/ui/card"

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

export default function FAQ(){
	return(
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
	);
}
