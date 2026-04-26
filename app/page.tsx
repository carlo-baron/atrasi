"use client";
import { Separator } from "@/components/ui/separator"

import LandingNavbar from "@/components/landing/LandingNavbar"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import Tutorial from "@/components/landing/Tutorial"
import FAQ from "@/components/landing/Faq"
import CorePrinciples from "@/components/landing/CorePrinciples"
import Footer from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <main className="w-full min-h-screen">
			<LandingNavbar />
			<Hero />
      <Separator className="max-w-5xl mx-auto" />
			<Features />
      <Separator className="max-w-5xl mx-auto" />
			<Tutorial />
      <Separator className="max-w-5xl mx-auto" />
			<CorePrinciples />
      <Separator className="max-w-5xl mx-auto" />
			<FAQ />
      <Separator className="max-w-5xl mx-auto" />
			<Footer />
    </main>
  )
}
