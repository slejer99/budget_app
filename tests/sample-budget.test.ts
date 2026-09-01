import { describe, expect, it } from 'vitest'

import sample from '../docs/sample-budget.json?raw'
import { formatAmount, monthPlanOf, parseBudgetDocument } from '../src/core'

// U+00A0.
const NBSP = ' '

/** The file the operator copies into Drive to check the app on both devices.
 *
 *  Read as the text of the real file rather than restated here, so that the
 *  document shape and the file that demonstrates it cannot drift apart: change
 *  one without the other and this fails. Its figures are invented — the
 *  operator's real money is not in this repository. */

describe('the sample budget file', () => {
  it('opens', () => {
    expect(parseBudgetDocument(sample).ok).toBe(true)
  })

  it('adds up to the month it claims to describe', () => {
    const parsed = parseBudgetDocument(sample)
    if (!parsed.ok) throw new Error(parsed.problem)
    const view = monthPlanOf(parsed.document, { year: 2026, month: 9 })

    expect(view.exists).toBe(true)
    expect(formatAmount(view.totalIncome)).toBe(`59${NBSP}500,00${NBSP}kr`)
    expect(formatAmount(view.totalExpenses)).toBe(`47${NBSP}440,00${NBSP}kr`)
    expect(formatAmount(view.unallocated)).toBe(`12${NBSP}060,00${NBSP}kr`)
  })

  it('has lines with no amount, so the reveal control has something to reveal', () => {
    const parsed = parseBudgetDocument(sample)
    if (!parsed.ok) throw new Error(parsed.problem)
    const view = monthPlanOf(parsed.document, { year: 2026, month: 9 })

    const unplanned = view.groups.reduce(
      (count, g) => count + (g.allLines.length - g.plannedLines.length),
      0,
    )
    expect(unplanned).toBe(6)
  })

  // The file stores what the operator typed beside its result. Nothing in this
  // ticket evaluates the expression, so nothing in the app would notice the two
  // disagreeing — and a sample budget whose own arithmetic is wrong is worse
  // than no sample at all. Adding two numbers is cheap; this does it here.
  //
  // The expressions are taken from the parsed document rather than matched in
  // the text, so that reordering the keys of an entry cannot quietly drop it
  // out of the check while the check still passes on whatever it did match.
  it('has every typed expression agree with the figure stored beside it', () => {
    const parsed = parseBudgetDocument(sample)
    if (!parsed.ok) throw new Error(parsed.problem)

    const typed = Object.values(parsed.document.months)
      .flatMap((plan) => Object.values(plan.entries))
      .map((entry) => entry.planned)
      .filter((planned) => planned?.typed !== undefined)

    expect(typed.length).toBe(3)

    for (const planned of typed) {
      const crowns = [...planned!.typed!.matchAll(/([+-]?)\s*(\d+)/g)].reduce(
        (total, [, sign, digits]) => total + (sign === '-' ? -1 : 1) * Number(digits),
        0,
      )
      expect(crowns * 100, planned!.typed).toBe(planned!.value as number)
    }
  })
})
