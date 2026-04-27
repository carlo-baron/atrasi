import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/src/SplitText";
import { fromPopUp, fromSlideIn } from "@/animations/variants";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(useGSAP);

export default function CorePrinciples(){
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(() => {
    if(!containerRef.current) return;

    const tl = gsap.timeline({ 
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      },
      defaults: { ease: 'power2.inOut' }
    });

		const split = SplitText.create('.split', { type: "chars" })

		tl
			.from('.h2', fromSlideIn)
			.from('.desc', fromSlideIn, "-=0.2")
			.from('.btn', fromPopUp, '-=0.2')
			.from(split.chars, {
				y: 100,
				autoAlpha: 0,
				stagger: 0.05
			}, '-=1')

	}, { scope: containerRef });

	return(
		<section ref={containerRef} className="max-w-5xl mx-auto px-6 py-20">
			<Card>
				<CardContent className="p-8 sm:p-12 flex flex-col sm:flex-row gap-8 items-start">
					<div className="space-y-4 flex-1">
						<p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Core principle</p>
						<h2 className="h2 text-2xl font-semibold tracking-tight leading-snug">
							You don't choose leverage.<br />It emerges from your math.
						</h2>
						<p className="desc text-muted-foreground text-sm leading-relaxed max-w-md">
							ATR controls volatility. Your stop respects volatility. Risk defines position size. Position size defines leverage. Everything is connected — nothing is arbitrary.
						</p>
						<div className="btn">
							<Button asChild variant="outline">
								<Link href="/calc">Open calculator</Link>
							</Button>
						</div>
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
								<span className="overflow-hidden split text-sm font-medium font-mono">{row.value}</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
