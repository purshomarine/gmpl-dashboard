/**
 * IRR Engine — replicates the Golden Curl ship acquisition model
 *
 * Model structure (from Golden Curl 27/03/2026):
 *  - Net Revenue = TC/Pool Rate × Operating Days × (1 − commission)
 *  - OPEX escalates at 2%/year
 *  - DD and SS are lump-sum costs in specified years
 *  - Loan: reducing balance, quarterly repayment
 *  - Project IRR: unlevered (before financing)
 *  - Equity IRR:  levered  (after debt service)
 *  - Scrap Value: LDT × scrap rate/ton
 */

// ─── NPV / IRR ────────────────────────────────────────────────────────────────

export function npv(rate, cashFlows) {
  return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0)
}

/** Newton-Raphson IRR — robust multi-start */
export function irr(cashFlows) {
  const hasPos = cashFlows.some(c => c > 0)
  const hasNeg = cashFlows.some(c => c < 0)
  if (!hasPos || !hasNeg) return null

  const dnpv = (r, cfs) =>
    cfs.reduce((acc, cf, t) => acc - t * cf / Math.pow(1 + r, t + 1), 0)

  const solve = (guess) => {
    let r = guess
    for (let i = 0; i < 200; i++) {
      const f  = npv(r, cashFlows)
      const df = dnpv(r, cashFlows)
      if (Math.abs(df) < 1e-14) break
      const rn = r - f / df
      if (Math.abs(rn - r) < 1e-9) return isFinite(rn) ? rn : null
      r = rn
    }
    return null
  }

  // Try multiple starting points to avoid local optima
  for (const guess of [0.1, 0.2, 0.05, 0.3, -0.05]) {
    const result = solve(guess)
    if (result !== null && result > -0.99 && result < 10) return result
  }
  return null
}

// ─── LOAN SCHEDULE ────────────────────────────────────────────────────────────

/**
 * Returns annual { interest, repayment } for each year.
 * Matches Golden Curl quarterly reducing-balance schedule aggregated to annual.
 */
export function buildLoanSchedule(loanAmount, interestRate, tenureYears) {
  const quarters     = tenureYears * 4
  const qRate        = interestRate / 4
  const qRepayment   = loanAmount / quarters
  const annual       = []
  let   balance      = loanAmount

  for (let yr = 1; yr <= tenureYears; yr++) {
    let annualInterest   = 0
    let annualRepayment  = 0
    for (let q = 0; q < 4; q++) {
      const interest    = balance * qRate
      annualInterest   += interest
      annualRepayment  += qRepayment
      balance          -= qRepayment
      if (balance < 0) balance = 0
    }
    annual.push({ interest: annualInterest, repayment: annualRepayment })
  }
  return annual
}

// ─── MAIN MODEL ───────────────────────────────────────────────────────────────

/**
 * Run the full Golden Curl-style acquisition model.
 *
 * @param {object} p - all input parameters
 * @returns {object} - full model output including IRRs, annual P&L, cash flows
 */
export function runModel(p) {
  const finalCost   = p.acquisitionCost + (p.prePurchaseCosts || 0)
  const loanAmount  = finalCost * p.loanLtv
  const equity      = finalCost - loanAmount
  const scrapValue  = (p.ldtMt || 0) * (p.scrapRatePerTon || 400)
  const loanSched   = buildLoanSchedule(loanAmount, p.interestRate, p.loanTenureYears)

  const years   = []
  const projCFs = [-finalCost]   // Project (unlevered) cash flows
  const eqCFs   = [-equity]      // Equity  (levered)   cash flows

  for (let yr = 1; yr <= p.operatingYears; yr++) {
    // Revenue
    const grossRev  = p.dailyRate * p.operatingDays
    const netRev    = grossRev * (1 - (p.commissionRate || 0.05))

    // OPEX — 2% annual escalation matching Golden Curl
    const opex      = p.opexPerDay * 365 * Math.pow(1 + (p.opexEscalation || 0.02), yr - 1)

    // DD / SS costs in specified years
    const ddCost    = yr === p.ddYear  ? (p.ddCost  || 0) : 0
    const ssCost    = yr === p.ssYear  ? (p.ssCost  || 0) : 0
    const dd2Cost   = yr === (p.dd2Year || p.ddYear + 5) ? (p.ddCost || 0) : 0  // second DD cycle

    const ebitda    = netRev - opex - ddCost - ssCost - dd2Cost

    // Debt service
    const ds        = yr <= p.loanTenureYears ? loanSched[yr - 1] : { interest: 0, repayment: 0 }
    const pbdt      = ebitda - ds.interest - ds.repayment

    const isTerminal = yr === p.operatingYears
    const termScrap  = isTerminal ? scrapValue : 0

    projCFs.push(isTerminal ? ebitda + termScrap : ebitda)
    eqCFs.push(isTerminal   ? pbdt   + termScrap : pbdt)

    years.push({
      year:        yr,
      grossRev:    Math.round(grossRev),
      netRev:      Math.round(netRev),
      opex:        Math.round(opex),
      ddCost:      Math.round(ddCost + ssCost + dd2Cost),
      ebitda:      Math.round(ebitda),
      interest:    Math.round(ds.interest),
      repayment:   Math.round(ds.repayment),
      pbdt:        Math.round(pbdt),
      scrap:       Math.round(termScrap),
      projCF:      Math.round(isTerminal ? ebitda + termScrap : ebitda),
      eqCF:        Math.round(isTerminal ? pbdt   + termScrap : pbdt),
    })
  }

  const projectIRR = irr(projCFs)
  const equityIRR  = irr(eqCFs)

  // Simple payback (equity)
  let cumEq = -equity
  let paybackYears = null
  for (let i = 0; i < years.length; i++) {
    cumEq += years[i].eqCF
    if (cumEq >= 0 && paybackYears === null) paybackYears = i + 1
  }

  return {
    // Inputs (echoed back)
    finalCost, loanAmount, equity, scrapValue,
    // Results
    projectIRR,
    equityIRR,
    paybackYears,
    // Annual breakdown
    years,
    // Raw cash flows (for charting)
    projCFs,
    eqCFs,
    // Summary year 1
    ebitdaYr1: years[0]?.ebitda || 0,
    pbdtYr1:   years[0]?.pbdt   || 0,
  }
}

// ─── SCENARIO RUNNER ─────────────────────────────────────────────────────────

export const SCENARIO_TEMPLATES = {
  base:  { label:'Base Case',   rateAdj:1.00, utilAdj:1.00, opexAdj:1.00 },
  bull:  { label:'Bull Case',   rateAdj:1.15, utilAdj:1.05, opexAdj:0.97 },
  bear:  { label:'Bear Case',   rateAdj:0.80, utilAdj:0.90, opexAdj:1.05 },
  rsea:  { label:'Red Sea +',   rateAdj:1.10, utilAdj:0.92, opexAdj:1.08 },
}

export function runScenario(baseParams, template) {
  return runModel({
    ...baseParams,
    dailyRate:     Math.round(baseParams.dailyRate     * template.rateAdj),
    operatingDays: Math.round(baseParams.operatingDays * template.utilAdj),
    opexPerDay:    Math.round(baseParams.opexPerDay    * template.opexAdj),
  })
}

export function fmt(n, prefix = '$') {
  if (n == null) return '—'
  return prefix + Math.abs(Math.round(n)).toLocaleString()
}
export function fmtPct(n) {
  if (n == null) return '—'
  return (n * 100).toFixed(1) + '%'
}
