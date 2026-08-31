import { describe, expect, it } from 'vitest'

import { amountFromOre, formatAmount } from '../src/core'

// U+00A0. Which space character appears is the whole point of these
// assertions, so it is spelled out rather than typed invisibly.
const NBSP = ' '

// `formatAmount` takes no interface language on purpose: there is one currency
// and one format, so a Polish reading of the app cannot show a different figure
// from an English one. That is a fact about the signature, not something these
// tests could usefully assert.
describe('formatting an amount', () => {
  it('writes an amount as Swedish crowns with two decimals', () => {
    expect(formatAmount(amountFromOre(123400))).toBe(`1${NBSP}234,00${NBSP}kr`)
  })

  it('writes a negative amount with a leading minus', () => {
    expect(formatAmount(amountFromOre(-12345678))).toBe(`-123${NBSP}456,78${NBSP}kr`)
  })

  it('groups only from a thousand upwards, and keeps öre below one crown', () => {
    expect(formatAmount(amountFromOre(99999))).toBe(`999,99${NBSP}kr`)
    expect(formatAmount(amountFromOre(5))).toBe(`0,05${NBSP}kr`)
    expect(formatAmount(amountFromOre(123456789))).toBe(`1${NBSP}234${NBSP}567,89${NBSP}kr`)
  })

  it('refuses a fraction of an öre rather than letting it drift', () => {
    expect(() => amountFromOre(1234.5)).toThrow()
    expect(() => amountFromOre(Number.NaN)).toThrow()
  })
})
