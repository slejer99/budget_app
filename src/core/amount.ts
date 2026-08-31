/** A quantity of money, always Swedish crowns.
 *
 *  Held as a whole number of öre rather than a decimal fraction of a crown, so
 *  that adding up two years of figures cannot drift the way binary floating
 *  point would. The brand keeps a raw number of crowns from being passed where
 *  öre are expected. */
declare const amountBrand: unique symbol
export type Amount = number & { readonly [amountBrand]: 'öre' }

/** U+00A0. Both spaces in `1 234,00 kr` are non-breaking, so a figure never
 *  wraps across a line break. */
const NBSP = ' '

export function amountFromOre(ore: number): Amount {
  if (!Number.isSafeInteger(ore)) {
    throw new RangeError(`An amount must be a whole number of öre, not ${ore}.`)
  }
  return ore as Amount
}

/** Writes an amount the way the operator's bank does: `1 234,00 kr`.
 *
 *  Takes no interface language, and that is the point. There is one currency
 *  and one format, so a Polish reading of the app shows the same figures as an
 *  English one — not because a test says so, but because there is no language
 *  here to vary on. */
export function formatAmount(amount: Amount): string {
  const ore = amount as number
  const sign = ore < 0 ? '-' : ''
  const magnitude = Math.abs(ore)
  const crowns = Math.trunc(magnitude / 100)
  const fraction = magnitude % 100
  return `${sign}${groupThousands(String(crowns))},${String(fraction).padStart(2, '0')}${NBSP}kr`
}

function groupThousands(digits: string): string {
  let grouped = ''
  for (let i = 0; i < digits.length; i += 1) {
    if (i > 0 && (digits.length - i) % 3 === 0) grouped += NBSP
    grouped += digits.charAt(i)
  }
  return grouped
}
