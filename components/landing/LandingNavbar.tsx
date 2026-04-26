import { Button } from "../ui/button";
import Link from "next/link";

export default function LandingNavbar(){
	return(
		<nav className="w-full border-b border-border/60 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
			<span className="text-base font-semibold tracking-tight">Atrasi</span>
			<div className="flex items-center gap-6">
				<Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					How it works
				</Link>
				<Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					FAQ
				</Link>
				<Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
					Policy
				</Link>
				<Button asChild size="sm">
					<Link href="/calc">Open calculator</Link>
				</Button>
			</div>
		</nav>
	);
}
