import Link from "next/link"

export default function Footer(){
	return(
		<footer className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
			<span className="text-sm font-medium">Atrasi</span>
			<p className="text-xs text-muted-foreground text-center sm:text-left">
				For educational purposes only. Not financial advice. Always trade with capital you can afford to lose.
			</p>
			<div className="flex items-center gap-4">
				<Link href="/calc" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
					Calculator
				</Link>
				<Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
					Privacy Policy
				</Link>
			</div>
		</footer>
	);
}
