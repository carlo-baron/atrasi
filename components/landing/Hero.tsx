import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import gsap from "gsap";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";

const fromSlideIn = {
	y: -20,
	opacity: 0,
}

const fromFadeIn = {
	opacity: 0,
}

const fromPopUp = {
  scale: 0.8,
  opacity: 0,
  ease: 'back.out',
  duration: 0.5,
};

export default function Hero(){
	const containerRef = useRef<HTMLElement | null>(null);

	useGSAP(() => { 
		if(!containerRef.current) return;

		const tl = gsap.timeline({defaults: { ease: 'power2.in' }});

		tl
			.from('.h1', fromSlideIn)
			.from('.desc', fromFadeIn)
			.from('.btn', {
				...fromPopUp,
				stagger: 0.20
			})
			.from('.badge', fromFadeIn)

	}, { scope: containerRef });

	return(
		<section ref={containerRef} className="max-w-5xl mx-auto px-6 pt-24 pb-20 flex flex-col items-center text-center">
			<Badge variant="secondary" className="badge mb-6 text-xs tracking-wide">
				Free · No account required
			</Badge>
			<h1 className="h1 text-5xl font-semibold tracking-tight leading-tight max-w-2xl">
				Trade sizing built on volatility, not guesswork
			</h1>
			<p className="desc mt-5 text-lg text-muted-foreground max-w-xl leading-relaxed">
				Atrasi is an ATR-based position calculator for crypto traders. Enter your risk and market data — it tells you exactly how many units to buy, where to set your stop, and what leverage you need.
			</p>
			<div className="mt-8 flex items-center gap-3">
				<div className="btn">
					<Button asChild size="lg">
						<Link href="/calc">Open calculator</Link>
					</Button>
				</div>
				<div className="btn">
					<Button asChild variant="outline" size="lg">
						<Link href="#how-it-works">See how it works</Link>
					</Button>
				</div>
			</div>
		</section>
	);
}
