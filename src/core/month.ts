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

/** The month before this one, rolling the year over at January. */
export function monthBefore(month: Month): Month {
  return month.month === 1
    ? { year: month.year - 1, month: 12 }
    : { year: month.year, month: month.month - 1 }
}

/** The month after this one, rolling the year over at December. */
export function monthAfter(month: Month): Month {
  return month.month === 12
    ? { year: month.year + 1, month: 1 }
    : { year: month.year, month: month.month + 1 }
}

/** How a month is named inside the document: `2026-09`.
 *
 *  Zero-padded so that the keys of a document sort as dates do, which is what
 *  makes "the months either side of this one" a matter of sorting rather than
 *  arithmetic. */
export function monthKey(month: Month): string {
  return `${String(month.year).padStart(4, '0')}-${String(month.month).padStart(2, '0')}`
}

/** `Styczeń 2026`, `January 2026`. */
export function formatMonthLabel(month: Month, language: Language): string {
  const name = monthName(month.month, language)
  if (name === undefined) {
    throw new RangeError(`A month runs from 1 to 12, not ${month.month}.`)
  }
  return `${name} ${month.year}`
}
