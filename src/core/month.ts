import type { Language } from './language'
import { monthName } from './translations'

/** A calendar month. `month` runs 1–12, so `{ year: 2026, month: 1 }` is
 *  January 2026 and reads the way it is written. */
export type Month = {
  readonly year: number
  readonly month: number
}

/** The month a date falls in, in the operator's own calendar.
 *
 *  The core never reads a clock; the date comes in from the caller. */
export function monthOf(date: Date): Month {
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}

/** `Styczeń 2026`, `January 2026`. */
export function formatMonthLabel(month: Month, language: Language): string {
  const name = monthName(month.month, language)
  if (name === undefined) {
    throw new RangeError(`A month runs from 1 to 12, not ${month.month}.`)
  }
  return `${name} ${month.year}`
}
