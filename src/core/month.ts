import type { Language } from './language'
import { translate, type TranslationKey } from './translations'

/** A calendar month. `month` runs 1–12, so `{ year: 2026, month: 1 }` is
 *  January 2026 and reads the way it is written. */
export type Month = {
  readonly year: number
  readonly month: number
}

const MONTH_NAME_KEYS = [
  'month.1',
  'month.2',
  'month.3',
  'month.4',
  'month.5',
  'month.6',
  'month.7',
  'month.8',
  'month.9',
  'month.10',
  'month.11',
  'month.12',
] as const satisfies readonly TranslationKey[]

/** The month a date falls in, in the operator's own calendar.
 *
 *  The core never reads a clock; the date comes in from the caller. */
export function monthOf(date: Date): Month {
  return { year: date.getFullYear(), month: date.getMonth() + 1 }
}

/** `Styczeń 2026`, `January 2026`. */
export function formatMonthLabel(month: Month, language: Language): string {
  const nameKey = MONTH_NAME_KEYS[month.month - 1]
  if (nameKey === undefined) {
    throw new RangeError(`A month runs from 1 to 12, not ${month.month}.`)
  }
  return `${translate(nameKey, language)} ${month.year}`
}
