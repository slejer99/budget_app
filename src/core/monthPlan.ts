import type { Amount } from './amount'
import { amountFromOre } from './amount'
import type { BudgetDocument, GroupKind, MonthEntry } from './document'
import type { Month } from './month'
import { monthKey } from './month'

/** One line as it appears in a month. */
export type MonthPlanLine = {
  readonly lineId: string
  readonly name: string
  /** Absent where the operator has planned nothing for this line this month.
   *  Absent is not zero: a line planned at zero is a decision, and a line never
   *  touched is not. */
  readonly planned: Amount | undefined
  /** The arithmetic the operator typed, where they typed any. */
  readonly typed: string | undefined
  readonly note: string | undefined
}

export type MonthPlanGroup = {
  readonly groupId: string
  readonly name: string
  readonly kind: GroupKind
  /** The lines carrying a planned amount. What the operator sees by default.
   *
   *  Both lists are in root-list order and one is a subset of the other, so
   *  revealing what is hidden cannot reshuffle what was already on screen. */
  readonly plannedLines: readonly MonthPlanLine[]
  /** Every line in the group, planned or not, in root-list order. */
  readonly allLines: readonly MonthPlanLine[]
  readonly subtotal: Amount
}

export type MonthPlanView = {
  readonly month: Month
  /** False where the operator has never planned this month. The view is still
   *  complete — every group, every line, all totals zero — so that an unplanned
   *  month reads as an empty plan rather than as an error. */
  readonly exists: boolean
  readonly groups: readonly MonthPlanGroup[]
  readonly totalIncome: Amount
  readonly totalExpenses: Amount
  /** Planned income minus planned expenses. Computed, never stored, and
   *  reported rather than enforced — the operator is not asked to drive it to
   *  zero. */
  readonly unallocated: Amount
}

const NOTHING: MonthEntry = { planned: undefined, note: undefined }

/** Everything the operator sees when they look at one month.
 *
 *  Groups and lines keep the order they hold in the root list, so the month
 *  reads the same way every time regardless of which lines carry figures. */
export function monthPlanOf(budget: BudgetDocument, month: Month): MonthPlanView {
  const plan = budget.months[monthKey(month)]
  const groups = budget.groups.map((group) => {
    const plannedLines: MonthPlanLine[] = []
    const allLines: MonthPlanLine[] = []
    let subtotal = 0

    for (const line of budget.lines) {
      if (line.groupId !== group.id) continue
      const entry = plan?.entries[line.id] ?? NOTHING
      const planned = entry.planned
      const viewLine: MonthPlanLine = {
        lineId: line.id,
        name: line.name,
        planned: planned?.value,
        typed: planned?.typed,
        note: entry.note,
      }
      allLines.push(viewLine)
      if (planned !== undefined) {
        plannedLines.push(viewLine)
        subtotal += planned.value
      }
    }

    return {
      groupId: group.id,
      name: group.name,
      kind: group.kind,
      plannedLines,
      allLines,
      subtotal: amountFromOre(subtotal),
    }
  })

  const totalIncome = sumOfKind(groups, 'income')
  const totalExpenses = sumOfKind(groups, 'expense')

  return {
    month,
    exists: plan !== undefined,
    groups,
    totalIncome,
    totalExpenses,
    unallocated: amountFromOre(totalIncome - totalExpenses),
  }
}

function sumOfKind(groups: readonly MonthPlanGroup[], kind: GroupKind): Amount {
  let total = 0
  for (const group of groups) {
    if (group.kind === kind) total += group.subtotal
  }
  return amountFromOre(total)
}
