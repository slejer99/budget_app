import { describe, expect, it } from 'vitest'

import type { BudgetDocument, MonthPlanGroup, MonthPlanLine } from '../src/core'
import { formatAmount, monthPlanOf, parseBudgetDocument } from '../src/core'

// U+00A0. Which space character these assertions expect is the whole point of
// them, so it is named once rather than typed invisibly into every string.
const NBSP = ' '

/** Builds a document the way the app will meet one: as the text of a file.
 *
 *  Going in through the parser rather than assembling the structure by hand
 *  keeps these tests on the public surface, and means a document shape the app
 *  would refuse to open cannot quietly pass a test. */
function documentFrom(value: unknown): BudgetDocument {
  const parsed = parseBudgetDocument(JSON.stringify(value))
  if (!parsed.ok) throw new Error(`Fixture is not a budget document: ${parsed.problem}`)
  return parsed.document
}

function planned(ore: number, typed?: string) {
  return typed === undefined ? { ore } : { ore, typed }
}

const SEPTEMBER = { year: 2026, month: 9 }

/** One income group and two expense groups, each holding a line called `Inne`
 *  so that the group-plus-name identity is under test in every case. */
const HOUSEHOLD = {
  version: 1,
  language: 'pl',
  groups: [
    { id: 'g-income', name: 'Przychody', kind: 'income' },
    { id: 'g-food', name: 'Jedzenie', kind: 'expense' },
    { id: 'g-transport', name: 'Transport', kind: 'expense' },
  ],
  lines: [
    { id: 'l-salary', groupId: 'g-income', name: 'Wynagrodzenie' },
    { id: 'l-akasa', groupId: 'g-income', name: 'akasa' },
    { id: 'l-food-home', groupId: 'g-food', name: 'Jedzenie dom' },
    { id: 'l-food-other', groupId: 'g-food', name: 'Inne' },
    { id: 'l-car', groupId: 'g-transport', name: 'auto' },
    { id: 'l-transport-other', groupId: 'g-transport', name: 'Inne' },
  ],
  months: {
    '2026-09': {
      entries: {
        'l-salary': { planned: planned(2620400) },
        'l-akasa': { planned: planned(1000000) },
        'l-food-home': { planned: planned(600000), note: 'w tym urodziny' },
        'l-car': { planned: planned(824600, '4912+1667+1667') },
        'l-transport-other': { planned: planned(50000) },
      },
    },
  },
}

/** The lines a group is hiding, which the view expresses as the difference
 *  between everything and what carries a figure. */
function unplannedIn(group: MonthPlanGroup): readonly MonthPlanLine[] {
  return group.allLines.filter((line) => line.planned === undefined)
}

function groupNamed(groups: readonly MonthPlanGroup[], name: string): MonthPlanGroup {
  const group = groups.find((candidate) => candidate.name === name)
  if (group === undefined) throw new Error(`No group called ${name}`)
  return group
}

describe('reading a month plan', () => {
  it('shows each planned line with its name and figure', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)
    const food = groupNamed(view.groups, 'Jedzenie')

    expect(food.plannedLines.map((line) => line.name)).toEqual(['Jedzenie dom'])
    expect(formatAmount(food.plannedLines[0]!.planned!)).toBe(`6${NBSP}000,00${NBSP}kr`)
  })

  it('subtotals each group', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)

    expect(formatAmount(groupNamed(view.groups, 'Transport').subtotal)).toBe(
      `8${NBSP}746,00${NBSP}kr`,
    )
    expect(formatAmount(groupNamed(view.groups, 'Przychody').subtotal)).toBe(
      `36${NBSP}204,00${NBSP}kr`,
    )
  })

  it('totals income and expenses, and reports what is left unallocated', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)

    expect(formatAmount(view.totalIncome)).toBe(`36${NBSP}204,00${NBSP}kr`)
    expect(formatAmount(view.totalExpenses)).toBe(`14${NBSP}746,00${NBSP}kr`)
    expect(formatAmount(view.unallocated)).toBe(`21${NBSP}458,00${NBSP}kr`)
  })

  it('reports unallocated as negative when the plan spends more than it earns', () => {
    const overspent = {
      ...HOUSEHOLD,
      months: {
        '2026-09': {
          entries: {
            'l-salary': { planned: planned(100000) },
            'l-food-home': { planned: planned(250000) },
          },
        },
      },
    }

    expect(formatAmount(monthPlanOf(documentFrom(overspent), SEPTEMBER).unallocated)).toBe(
      `-1${NBSP}500,00${NBSP}kr`,
    )
  })

  it('keeps lines with no planned amount apart from the rest', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)
    const food = groupNamed(view.groups, 'Jedzenie')

    expect(food.plannedLines.map((line) => line.name)).toEqual(['Jedzenie dom'])
    expect(unplannedIn(food).map((line) => line.name)).toEqual(['Inne'])
    expect(unplannedIn(food)[0]!.planned).toBeUndefined()
  })

  it('treats the same name in two groups as two distinct lines', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)

    const foodOther = unplannedIn(groupNamed(view.groups, 'Jedzenie'))[0]!
    const transportOther = groupNamed(view.groups, 'Transport').plannedLines.find(
      (line) => line.name === 'Inne',
    )!

    expect(foodOther.name).toBe(transportOther.name)
    expect(foodOther.lineId).not.toBe(transportOther.lineId)
    expect(formatAmount(transportOther.planned!)).toBe(`500,00${NBSP}kr`)
  })

  it('keeps the arithmetic the operator typed alongside its result', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)
    const car = groupNamed(view.groups, 'Transport').plannedLines.find((line) => line.name === 'auto')!

    expect(car.typed).toBe('4912+1667+1667')
    expect(formatAmount(car.planned!)).toBe(`8${NBSP}246,00${NBSP}kr`)
  })

  it('carries a note through to the line it belongs to', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)
    const home = groupNamed(view.groups, 'Jedzenie').plannedLines[0]!

    expect(home.note).toBe('w tym urodziny')
  })

  it('shows a month that was never planned as an empty plan, not as an error', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), { year: 2025, month: 3 })

    expect(view.exists).toBe(false)
    expect(view.groups.map((group) => group.name)).toEqual([
      'Przychody',
      'Jedzenie',
      'Transport',
    ])
    expect(view.groups.every((group) => group.plannedLines.length === 0)).toBe(true)
    expect(formatAmount(view.unallocated)).toBe(`0,00${NBSP}kr`)
  })

  it('keeps groups and lines in the order the root list holds them', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)

    expect(view.groups.map((group) => group.name)).toEqual([
      'Przychody',
      'Jedzenie',
      'Transport',
    ])
    expect(groupNamed(view.groups, 'Przychody').plannedLines.map((line) => line.name)).toEqual([
      'Wynagrodzenie',
      'akasa',
    ])
  })

  it('slots the hidden lines into root-list order rather than after the rest', () => {
    const view = monthPlanOf(documentFrom(HOUSEHOLD), SEPTEMBER)
    const transport = groupNamed(view.groups, 'Transport')

    // `auto` carries a figure and `Inne` does not, but the root list holds
    // `auto` first — so revealing must not move either of them.
    expect(transport.plannedLines.map((line) => line.name)).toEqual(['auto', 'Inne'])
    expect(transport.allLines.map((line) => line.name)).toEqual(['auto', 'Inne'])

    const food = groupNamed(view.groups, 'Jedzenie')
    expect(food.plannedLines.map((line) => line.name)).toEqual(['Jedzenie dom'])
    expect(food.allLines.map((line) => line.name)).toEqual(['Jedzenie dom', 'Inne'])
  })

  it('adds up many small figures without drifting', () => {
    // Sixty lines of ten öre. In binary floating point 0.1 added sixty times
    // is 6.000000000000001; as whole öre there is nothing to drift.
    const lines = Array.from({ length: 60 }, (_, index) => ({
      id: `l-${index}`,
      groupId: 'g-food',
      name: `Pozycja ${index}`,
    }))
    const entries = Object.fromEntries(
      lines.map((line) => [line.id, { planned: planned(10) }]),
    )
    const many = {
      version: 1,
      groups: [{ id: 'g-food', name: 'Jedzenie', kind: 'expense' }],
      lines,
      months: { '2026-09': { entries } },
    }

    const view = monthPlanOf(documentFrom(many), SEPTEMBER)

    expect(formatAmount(view.groups[0]!.subtotal)).toBe(`6,00${NBSP}kr`)
    expect(formatAmount(view.totalExpenses)).toBe(`6,00${NBSP}kr`)
  })
})
