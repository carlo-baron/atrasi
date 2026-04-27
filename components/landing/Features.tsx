import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Card, CardContent } from "@/components/ui/card"
import { fromPopUp, fromSlideIn } from "@/animations/variants";


gsap.registerPlugin(ScrollTrigger);
export default function Features(){
	const containerRef = useRef<HTMLElement | null>(null);

	useGSAP(() => {
		if(!containerRef.current) return;

		const tl = gsap.timeline({ 
			scrollTrigger: {
				trigger: containerRef.current,
				start: 'top 80%'
			},
			defaults: { ease: 'power2.in' }
		});
		tl
			.from('.h2', fromSlideIn)
			.from('.desc', fromSlideIn, '-=0.2')
			.from('.card', {
				...fromPopUp,
				stagger: 0.15
			})

	}, );
	return(
		<section ref={containerRef} className="max-w-5xl mx-auto px-6 py-20">
			<div className="mb-10">
				<p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground mb-2">Features</p>
				<h2 className="h2 text-3xl font-semibold tracking-tight">Everything the math requires</h2>
				<p className="desc mt-2 text-muted-foreground max-w-lg">
					No fluff, no extra steps. Every feature exists because the risk-first framework demands it.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{features.map((f) => (
					<Card className='card' key={f.title}>
						<CardContent className="p-5 space-y-2">
							<p className="font-medium text-sm">{f.title}</p>
							<p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

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

