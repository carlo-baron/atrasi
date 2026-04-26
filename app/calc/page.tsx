"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// --- Types ---
type VolatilityStatus = "ideal" | "acceptable" | "skip" | "unknown"
type LeverageStatus = "ideal" | "too-low" | "too-high" | "unknown"

// --- LocalStorage persistence ---
const STORAGE_KEY = "trade-guide-inputs"

interface StoredInputs {
  capital: number
  riskAmt: number
  price: number
  atr: number
  stopMult: number
  rr: number
}

const DEFAULTS: StoredInputs = {
  capital: 20,
  riskAmt: 0.5,
  price: 1.5,
  atr: 0.015,
  stopMult: 1.5,
  rr: 2,
}

function loadInputs(): StoredInputs {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    const parsed = JSON.parse(raw)
    // Merge with defaults so any new fields added later are safe
    return { ...DEFAULTS, ...parsed }
  } catch {
    return DEFAULTS
  }
}

function saveInputs(inputs: StoredInputs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
  } catch {
    // storage quota exceeded or unavailable — fail silently
  }
}

// --- Pure math hook ---
function useTradeCalc(
  capital: number,
  riskAmt: number,
  price: number,
  atr: number,
  stopMult: number,
  rr: number
) {
  const atrPct = price > 0 ? (atr / price) * 100 : 0

  const volatilityStatus: VolatilityStatus =
    atrPct === 0 ? "unknown"
    : atrPct <= 1.5 ? "ideal"
    : atrPct <= 2 ? "acceptable"
    : "skip"

  const stopDist = atr * stopMult
  const stopPct = price > 0 ? stopDist / price : 0
  const positionVal = stopPct > 0 ? riskAmt / stopPct : 0
  const units = price > 0 ? positionVal / price : 0
  const leverage = capital > 0 ? positionVal / capital : 0
  const stopPrice = price - stopDist
  const tpDist = stopDist * rr
  const tpPrice = price + tpDist
  const rewardAmt = riskAmt * rr
  const breakEvenWinRate = (1 / (1 + rr)) * 100

  const leverageStatus: LeverageStatus =
    leverage === 0 ? "unknown"
    : leverage < 1 ? "too-low"
    : leverage <= 5 ? "ideal"
    : "too-high"

  const riskPct = capital > 0 ? (riskAmt / capital) * 100 : 0

  return {
    atrPct,
    volatilityStatus,
    stopDist,
    stopPct,
    positionVal,
    units,
    leverage,
    leverageStatus,
    stopPrice,
    tpPrice,
    tpDist,
    rewardAmt,
    breakEvenWinRate,
    riskPct,
  }
}

// --- Helpers ---
const fmt = (n: number, d = 2) => (isFinite(n) && !isNaN(n) ? n.toFixed(d) : "—")

function statusColor(status: VolatilityStatus | LeverageStatus) {
  if (status === "ideal") return "text-emerald-600 dark:text-emerald-400"
  if (status === "acceptable") return "text-amber-600 dark:text-amber-400"
  if (status === "too-low") return "text-amber-600 dark:text-amber-400"
  if (status === "too-high") return "text-red-500"
  return ""
}

function statusLabel(status: VolatilityStatus | LeverageStatus) {
  if (status === "ideal") return "✓ ideal"
  if (status === "acceptable") return "⚠ acceptable — reduce size"
  if (status === "too-low") return "⚠ too slow — not worth it"
  if (status === "too-high") return "✕ too risky — reduce size or skip"
  return ""
}

function volatilityVariant(status: VolatilityStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "ideal") return "default"
  if (status === "acceptable") return "secondary"
  if (status === "skip") return "destructive"
  return "outline"
}

function leverageVariant(status: LeverageStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "ideal") return "default"
  if (status === "too-low") return "secondary"
  if (status === "too-high") return "destructive"
  return "outline"
}

// --- Sub-components ---
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  )
}

function FieldInput({
  id,
  label,
  value,
  step,
  min,
  onChange,
}: {
  id: string
  label: string
  value: number
  step?: number
  min?: number
  onChange: (val: number) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm text-muted-foreground">{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        step={step}
        min={min}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="text-right font-mono"
      />
    </div>
  )
}

function ResultCard({
  label,
  value,
  sub,
  valueClass = "",
  badge,
  badgeVariant = "outline",
}: {
  label: string
  value: string
  sub?: string
  valueClass?: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
}) {
  return (
    <Card>
      <CardContent className="p-4 space-y-0.5">
        <p className="text-[11px] text-muted-foreground uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-medium font-mono ${valueClass}`}>{value}</p>
        {badge && (
          <Badge variant={badgeVariant} className="text-[10px] px-1.5 py-0 h-4">
            {badge}
          </Badge>
        )}
        {sub && <p className="text-[11px] text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function StepRow({
  step,
  label,
  value,
  valueClass = "",
}: {
  step: number
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-muted-foreground bg-muted rounded-full w-5 h-5 flex items-center justify-center shrink-0">
          {step}
        </span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className={`text-sm font-mono font-medium ${valueClass}`}>{value}</span>
    </div>
  )
}

function ChecklistItem({ label, pass }: { label: string; pass: boolean }) {
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <span className={`text-sm mt-0.5 shrink-0 ${pass ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
        {pass ? "✓" : "✕"}
      </span>
      <span className={`text-sm ${pass ? "text-foreground" : "text-muted-foreground line-through"}`}>
        {label}
      </span>
    </div>
  )
}

// --- Main page ---
export default function Page() {
  const [capital, setCapital] = useState(DEFAULTS.capital)
  const [riskAmt, setRiskAmt] = useState(DEFAULTS.riskAmt)
  const [price, setPrice] = useState(DEFAULTS.price)
  const [atr, setAtr] = useState(DEFAULTS.atr)
  const [stopMult, setStopMult] = useState(DEFAULTS.stopMult)
  const [rr, setRr] = useState(DEFAULTS.rr)
  const [hydrated, setHydrated] = useState(false)

  // Load from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = loadInputs()
    setCapital(stored.capital)
    setRiskAmt(stored.riskAmt)
    setPrice(stored.price)
    setAtr(stored.atr)
    setStopMult(stored.stopMult)
    setRr(stored.rr)
    setHydrated(true)
  }, [])

  // Save to localStorage whenever any input changes (skip before hydration)
  useEffect(() => {
    if (!hydrated) return
    saveInputs({ capital, riskAmt, price, atr, stopMult, rr })
  }, [capital, riskAmt, price, atr, stopMult, rr, hydrated])

  const calc = useTradeCalc(capital, riskAmt, price, atr, stopMult, rr)

  const checklist = [
    { label: `ATR% within 0.3–1.5% (currently ${fmt(calc.atrPct)}%)`, pass: calc.atrPct >= 0.3 && calc.atrPct <= 1.5 },
    { label: `Stop = ${fmt(stopMult, 1)}× ATR (1–1.5× required)`, pass: stopMult >= 1 && stopMult <= 1.5 },
    { label: `Risk = $${fmt(riskAmt)} (target $0.40–$1.00)`, pass: riskAmt >= 0.4 && riskAmt <= 1 },
    { label: `Leverage ${fmt(calc.leverage, 1)}× within 2×–5×`, pass: calc.leverage >= 2 && calc.leverage <= 5 },
    { label: `R:R ratio ≥ 1.5 (currently 1:${rr})`, pass: rr >= 1.5 },
  ]

  const allGreen = checklist.every(c => c.pass)

  return (
    <main className="pb-12 w-full min-h-screen flex flex-col items-center justify-center">
      <nav className="mb-12 w-full border-b border-border/60 px-6 py-5.5 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-base font-semibold tracking-tight">Atrasi</Link>
      </nav>

      <section className="w-full max-w-md px-4 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Trade Guide</h1>
          <p className="text-sm text-muted-foreground mt-0.5">ATR-based position & leverage calculator</p>
        </div>

        <Separator />

        {/* Account */}
        <div className="space-y-3">
          <SectionLabel>Account</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput id="capital" label="Capital ($)" value={capital} step={1} min={1} onChange={setCapital} />
            <FieldInput id="riskAmt" label="Risk amount ($)" value={riskAmt} step={0.1} min={0.1} onChange={setRiskAmt} />
          </div>
          <p className="text-[11px] text-muted-foreground">
            Risk % of capital: <span className="font-mono font-medium text-foreground">{fmt(calc.riskPct)}%</span>
            <span className="ml-1">(target 2–5%)</span>
          </p>
        </div>

        <Separator />

        {/* Market */}
        <div className="space-y-3">
          <SectionLabel>Market</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput id="price" label="Coin price ($)" value={price} step={0.01} min={0} onChange={setPrice} />
            <FieldInput id="atr" label="ATR ($)" value={atr} step={0.001} min={0} onChange={setAtr} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              ATR%: <span className="font-mono font-medium text-foreground">{fmt(calc.atrPct)}%</span>
            </p>
            {calc.volatilityStatus !== "unknown" && (
              <Badge variant={volatilityVariant(calc.volatilityStatus)} className="text-[10px] px-1.5 py-0 h-4">
                {calc.volatilityStatus === "skip" ? "✕ skip — too volatile" : statusLabel(calc.volatilityStatus)}
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Trade Setup */}
        <div className="space-y-3">
          <SectionLabel>Trade Setup</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput id="stopMult" label="Stop (×ATR)" value={stopMult} step={0.5} min={0.5} onChange={setStopMult} />
            <FieldInput id="rr" label="R:R ratio" value={rr} step={0.5} min={1} onChange={setRr} />
          </div>
        </div>

        <Separator />

        {/* Risk-first process */}
        <div className="space-y-1">
          <SectionLabel>Risk-first process</SectionLabel>
          <Card>
            <CardContent className="px-3 pt-1 pb-0.5">
              <StepRow step={1} label="Risk amount" value={`$${fmt(riskAmt)}`} valueClass="text-amber-600 dark:text-amber-400" />
              <StepRow step={2} label="Stop distance (ATR × mult)" value={`$${fmt(calc.stopDist, 4)}`} />
              <StepRow step={3} label="Stop %" value={`${fmt(calc.stopPct * 100, 3)}%`} />
              <StepRow step={4} label="Position size (risk ÷ stop%)" value={`$${fmt(calc.positionVal)}`} />
              <StepRow step={5} label="Units (position ÷ price)" value={`${fmt(calc.units, 2)}`} />
              <StepRow
                step={6}
                label="Leverage (position ÷ capital)"
                value={`${fmt(calc.leverage, 2)}×`}
                valueClass={statusColor(calc.leverageStatus)}
              />
            </CardContent>
          </Card>
          {calc.leverageStatus !== "unknown" && (
            <p className={`text-[11px] px-1 ${statusColor(calc.leverageStatus)}`}>
              {statusLabel(calc.leverageStatus)}
            </p>
          )}
        </div>

        <Separator />

        {/* Results */}
        <div className="space-y-2">
          <SectionLabel>Results</SectionLabel>
          <div className="grid grid-cols-2 gap-2.5">
            <ResultCard
              label="Stop loss"
              value={`$${fmt(calc.stopPrice, 4)}`}
              sub={`${fmt(calc.stopPct * 100, 2)}% below entry`}
              valueClass="text-red-500"
            />
            <ResultCard
              label="Take profit"
              value={`$${fmt(calc.tpPrice, 4)}`}
              sub={`${fmt((calc.tpDist / price) * 100, 2)}% above entry`}
              valueClass="text-emerald-600 dark:text-emerald-400"
            />
            <ResultCard
              label="Risk"
              value={`$${fmt(riskAmt)}`}
              sub={`${fmt(calc.riskPct)}% of capital`}
              valueClass="text-amber-600 dark:text-amber-400"
            />
            <ResultCard
              label="Reward"
              value={`$${fmt(calc.rewardAmt)}`}
              sub={`1:${rr} risk/reward`}
              valueClass="text-emerald-600 dark:text-emerald-400"
            />
            <ResultCard
              label="Leverage needed"
              value={`${fmt(calc.leverage, 2)}×`}
              badge={calc.leverageStatus !== "unknown" ? statusLabel(calc.leverageStatus) : undefined}
              badgeVariant={leverageVariant(calc.leverageStatus)}
              valueClass={statusColor(calc.leverageStatus)}
            />
            <ResultCard
              label="Break-even win rate"
              value={`${fmt(calc.breakEvenWinRate)}%`}
              sub="to be profitable long-term"
            />
          </div>
        </div>

        <Separator />

        {/* Pre-trade checklist */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <SectionLabel>Pre-trade checklist</SectionLabel>
            <Badge variant={allGreen ? "default" : "destructive"} className="text-[10px] px-1.5 py-0 h-4">
              {allGreen ? "✓ clear to trade" : "✕ skip trade"}
            </Badge>
          </div>
          <Card>
            <CardContent className="px-3 py-0 divide-y divide-border/30">
              {checklist.map((item, i) => (
                <ChecklistItem key={i} label={item.label} pass={item.pass} />
              ))}
            </CardContent>
          </Card>
        </div>

      </section>
    </main>
  )
}
