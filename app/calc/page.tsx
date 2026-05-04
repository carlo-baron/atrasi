"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// --- Types ---
type Direction = "long" | "short"
type StopATRStatus = "tight" | "ideal" | "wide" | "unknown"
type LeverageStatus = "ideal" | "too-low" | "too-high" | "unknown"
type VolatilityStatus = "ideal" | "acceptable" | "skip" | "unknown"

// --- LocalStorage ---
const STORAGE_KEY = "trade-guide-inputs"

interface StoredInputs {
  capital: number
  riskAmt: number
  entry: number
  stopPrice: number
  atr: number
  rr: number
  direction: Direction
}

const DEFAULTS: StoredInputs = {
  capital: 20,
  riskAmt: 0.5,
  entry: 1.5,
  stopPrice: 1.45,
  atr: 0.015,
  rr: 2,
  direction: "long",
}

function loadInputs(): StoredInputs {
  if (typeof window === "undefined") return DEFAULTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

function saveInputs(inputs: StoredInputs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs))
  } catch {}
}

// --- Pure math hook ---
function useTradeCalc(
  capital: number,
  riskAmt: number,
  entry: number,
  stopPrice: number,
  atr: number,
  rr: number,
  direction: Direction
) {
  const isLong = direction === "long"

  // Stop distance from chart structure
  const stopDist = isLong
    ? entry - stopPrice
    : stopPrice - entry

  const stopDistValid = stopDist > 0

  const stopPct = stopDistValid && entry > 0 ? stopDist / entry : 0

  // Position sizing — same formula, different stop source
  const positionVal = stopPct > 0 ? riskAmt / stopPct : 0
  const units = entry > 0 ? positionVal / entry : 0
  const leverage = capital > 0 ? positionVal / capital : 0

  // Take profit
  const tpDist = stopDist * rr
  const tpPrice = isLong ? entry + tpDist : entry - tpDist

  const rewardAmt = riskAmt * rr
  const breakEvenWinRate = (1 / (1 + rr)) * 100
  const riskPct = capital > 0 ? (riskAmt / capital) * 100 : 0

  // ATR sanity checks
  const atrPct = entry > 0 && atr > 0 ? (atr / entry) * 100 : 0
  const stopInATR = atr > 0 ? stopDist / atr : 0

  const volatilityStatus: VolatilityStatus =
    atrPct === 0 ? "unknown"
    : atrPct <= 1.5 ? "ideal"
    : atrPct <= 2 ? "acceptable"
    : "skip"

  // Is the structure stop reasonable relative to ATR?
  const stopATRStatus: StopATRStatus =
    stopInATR === 0 ? "unknown"
    : stopInATR < 0.8 ? "tight"
    : stopInATR <= 2 ? "ideal"
    : "wide"

  const leverageStatus: LeverageStatus =
    leverage === 0 ? "unknown"
    : leverage < 1 ? "too-low"
    : leverage <= 5 ? "ideal"
    : "too-high"

  return {
    stopDist,
    stopDistValid,
    stopPct,
    positionVal,
    units,
    leverage,
    leverageStatus,
    tpPrice,
    tpDist,
    rewardAmt,
    breakEvenWinRate,
    riskPct,
    atrPct,
    stopInATR,
    volatilityStatus,
    stopATRStatus,
  }
}

// --- Helpers ---
const fmt = (n: number, d = 2) => (isFinite(n) && !isNaN(n) ? n.toFixed(d) : "—")

function leverageColor(status: LeverageStatus) {
  if (status === "ideal") return "text-emerald-600 dark:text-emerald-400"
  if (status === "too-low") return "text-amber-600 dark:text-amber-400"
  if (status === "too-high") return "text-red-500"
  return ""
}

function leverageLabel(status: LeverageStatus) {
  if (status === "ideal") return "✓ ideal"
  if (status === "too-low") return "⚠ too slow — not worth it"
  if (status === "too-high") return "✕ too risky — reduce size or skip"
  return ""
}

function leverageVariant(status: LeverageStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "ideal") return "default"
  if (status === "too-low") return "secondary"
  if (status === "too-high") return "destructive"
  return "outline"
}

function volatilityVariant(status: VolatilityStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "ideal") return "default"
  if (status === "acceptable") return "secondary"
  if (status === "skip") return "destructive"
  return "outline"
}

function stopATRVariant(status: StopATRStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "ideal") return "default"
  if (status === "tight") return "destructive"
  if (status === "wide") return "secondary"
  return "outline"
}

function stopATRLabel(status: StopATRStatus) {
  if (status === "ideal") return "✓ stop within 0.8–2× ATR"
  if (status === "tight") return "⚠ stop too tight — noise may stop you out"
  if (status === "wide") return "⚠ stop too wide — position will be very small"
  return ""
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
  const [entry, setEntry] = useState(DEFAULTS.entry)
  const [stopPrice, setStopPrice] = useState(DEFAULTS.stopPrice)
  const [atr, setAtr] = useState(DEFAULTS.atr)
  const [rr, setRr] = useState(DEFAULTS.rr)
  const [direction, setDirection] = useState<Direction>(DEFAULTS.direction)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = loadInputs()
    setCapital(stored.capital)
    setRiskAmt(stored.riskAmt)
    setEntry(stored.entry)
    setStopPrice(stored.stopPrice)
    setAtr(stored.atr)
    setRr(stored.rr)
    setDirection(stored.direction)
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveInputs({ capital, riskAmt, entry, stopPrice, atr, rr, direction })
  }, [capital, riskAmt, entry, stopPrice, atr, rr, direction, hydrated])

  const calc = useTradeCalc(capital, riskAmt, entry, stopPrice, atr, rr, direction)

  const isLong = direction === "long"

  const checklist = [
    {
      label: `ATR% within 0.3–1.5% (currently ${fmt(calc.atrPct)}%)`,
      pass: calc.atrPct >= 0.3 && calc.atrPct <= 1.5,
    },
    {
      label: `Stop within 0.8–2× ATR (currently ${fmt(calc.stopInATR, 2)}× ATR)`,
      pass: calc.stopATRStatus === "ideal",
    },
    {
      label: `Risk = $${fmt(riskAmt)} (target $0.40–$1.00)`,
      pass: riskAmt >= 0.4 && riskAmt <= 1,
    },
    {
      label: `Leverage ${fmt(calc.leverage, 1)}× within 2×–5×`,
      pass: calc.leverage >= 2 && calc.leverage <= 5,
    },
    {
      label: `R:R ratio ≥ 1.5 (currently 1:${rr})`,
      pass: rr >= 1.5,
    },
    {
      label: isLong
        ? `Stop is below entry ($${fmt(stopPrice, 4)} < $${fmt(entry, 4)})`
        : `Stop is above entry ($${fmt(stopPrice, 4)} > $${fmt(entry, 4)})`,
      pass: calc.stopDistValid,
    },
  ]

  const allGreen = checklist.every(c => c.pass)

  return (
    <main className="pb-12 w-full min-h-screen flex flex-col items-center justify-center">
      <nav className="mb-12 w-full border-b border-border/60 px-6 py-5.5 flex items-center justify-between max-w-5xl mx-auto">
        <Link href="/" className="text-base font-semibold tracking-tight">Atrasi</Link>
      </nav>

      <section className="w-full max-w-md px-4 space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Trade Guide</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Structure-based position calculator</p>
          </div>
          <div className="flex items-center rounded-md border border-border overflow-hidden shrink-0">
            <button
              onClick={() => setDirection("long")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                isLong
                  ? "bg-emerald-600 text-white dark:bg-emerald-500"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Long
            </button>
            <button
              onClick={() => setDirection("short")}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                !isLong
                  ? "bg-red-500 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Short
            </button>
          </div>
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
            Risk % of capital:{" "}
            <span className="font-mono font-medium text-foreground">{fmt(calc.riskPct)}%</span>
            <span className="ml-1">(target 2–5%)</span>
          </p>
        </div>

        <Separator />

        {/* Trade prices */}
        <div className="space-y-3">
          <SectionLabel>Trade Prices</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput id="entry" label="Entry price ($)" value={entry} step={0.0001} min={0} onChange={setEntry} />
            <FieldInput
              id="stopPrice"
              label={isLong ? "Stop loss price ($)" : "Stop loss price ($)"}
              value={stopPrice}
              step={0.0001}
              min={0}
              onChange={setStopPrice}
            />
          </div>
          {calc.stopDistValid ? (
            <p className="text-[11px] text-muted-foreground">
              Stop distance:{" "}
              <span className="font-mono font-medium text-foreground">${fmt(calc.stopDist, 4)}</span>
              <span className="mx-1">·</span>
              <span className="font-mono font-medium text-foreground">{fmt(calc.stopPct * 100, 3)}%</span>
              <span className="ml-1">from entry</span>
            </p>
          ) : (
						<p className="text-[11px] text-muted-foreground">
							Recommended stop:{" "}
							<span className="font-mono font-medium text-foreground">
								${fmt(isLong ? entry - atr * 0.8 : entry + atr * 0.8, 4)}
							</span>
							{" "}–{" "}
							<span className="font-mono font-medium text-foreground">
								${fmt(isLong ? entry - atr * 1.5 : entry + atr * 1.5, 4)}
							</span>
						</p>
          )}
        </div>

        <Separator />

        {/* ATR + R:R */}
        <div className="space-y-3">
          <SectionLabel>Volatility & Target</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <FieldInput id="atr" label="ATR ($)" value={atr} step={0.0001} min={0} onChange={setAtr} />
            <FieldInput id="rr" label="R:R ratio" value={rr} step={0.5} min={1} onChange={setRr} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              ATR%:{" "}
              <span className="font-mono font-medium text-foreground">{fmt(calc.atrPct)}%</span>
              <span className="mx-1">·</span>
              Stop = <span className="font-mono font-medium text-foreground">{fmt(calc.stopInATR, 2)}× ATR</span>
            </p>
            {calc.stopATRStatus !== "unknown" && (
              <Badge variant={stopATRVariant(calc.stopATRStatus)} className="text-[10px] px-1.5 py-0 h-4">
                {calc.stopATRStatus === "ideal" ? "✓ stop ok" : calc.stopATRStatus === "tight" ? "⚠ too tight" : "⚠ too wide"}
              </Badge>
            )}
          </div>
          {calc.volatilityStatus !== "unknown" && (
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground">Coin volatility</p>
              <Badge variant={volatilityVariant(calc.volatilityStatus)} className="text-[10px] px-1.5 py-0 h-4">
                {calc.volatilityStatus === "ideal" && "✓ ideal"}
                {calc.volatilityStatus === "acceptable" && "⚠ acceptable"}
                {calc.volatilityStatus === "skip" && "✕ too volatile"}
              </Badge>
            </div>
          )}
        </div>

        <Separator />

        {/* Risk-first process */}
        <div className="space-y-1">
          <SectionLabel>Process</SectionLabel>
          <Card>
            <CardContent className="px-3 pt-1 pb-0.5">
              <StepRow step={1} label="Risk amount" value={`$${fmt(riskAmt)}`} valueClass="text-amber-600 dark:text-amber-400" />
              <StepRow step={2} label={isLong ? "Stop = entry − stop price" : "Stop = stop price − entry"} value={`$${fmt(calc.stopDist, 4)}`} />
              <StepRow step={3} label="Stop %" value={`${fmt(calc.stopPct * 100, 3)}%`} />
              <StepRow step={4} label="Position size (risk ÷ stop%)" value={`$${fmt(calc.positionVal)}`} />
              <StepRow step={5} label="Units (position ÷ entry)" value={`${fmt(calc.units, 2)}`} />
              <StepRow
                step={6}
                label="Leverage (position ÷ capital)"
                value={`${fmt(calc.leverage, 2)}×`}
                valueClass={leverageColor(calc.leverageStatus)}
              />
            </CardContent>
          </Card>
          {calc.leverageStatus !== "unknown" && (
            <p className={`text-[11px] px-1 ${leverageColor(calc.leverageStatus)}`}>
              {leverageLabel(calc.leverageStatus)}
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
              value={`$${fmt(stopPrice, 4)}`}
              sub={`${fmt(calc.stopPct * 100, 2)}% ${isLong ? "below" : "above"} entry`}
              valueClass="text-red-500"
            />
            <ResultCard
              label="Take profit"
              value={`$${fmt(calc.tpPrice, 4)}`}
              sub={`${fmt((calc.tpDist / entry) * 100, 2)}% ${isLong ? "above" : "below"} entry`}
              valueClass="text-emerald-600 dark:text-emerald-400"
            />
            <ResultCard
              label="Position size"
              value={`$${fmt(calc.positionVal)}`}
              sub={`${fmt(calc.units, 2)} units`}
            />
            <ResultCard
              label="Risk / Reward"
              value={`$${fmt(riskAmt)} / $${fmt(calc.rewardAmt)}`}
              sub={`1:${rr} · break-even ${fmt(calc.breakEvenWinRate)}%`}
            />
            <ResultCard
              label="Leverage needed"
              value={`${fmt(calc.leverage, 2)}×`}
              badge={calc.leverageStatus !== "unknown" ? leverageLabel(calc.leverageStatus) : undefined}
              badgeVariant={leverageVariant(calc.leverageStatus)}
              valueClass={leverageColor(calc.leverageStatus)}
            />
            <ResultCard
              label="Stop in ATR"
              value={`${fmt(calc.stopInATR, 2)}× ATR`}
              badge={calc.stopATRStatus !== "unknown" ? stopATRLabel(calc.stopATRStatus) : undefined}
              badgeVariant={stopATRVariant(calc.stopATRStatus)}
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
