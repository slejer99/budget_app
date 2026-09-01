import { describe, expect, it } from 'vitest'

import { defaultLanguage, parseLanguage, translate } from '../src/core'

describe("the app's own words", () => {
  it('gives back the string for the language asked for', () => {
    expect(translate('app.name', 'en')).toBe('Budget')
    expect(translate('app.name', 'pl')).toBe('Budżet')
  })

  // A missing language is already a compile error, so asserting a string is
  // non-empty proves nothing. What the type system cannot catch is English
  // pasted into the Polish column, which is what this looks for.
  it('says something different in each language, where the two should differ', () => {
    const keys = [
      'file.title',
      'file.choose',
      'file.change',
      'file.why',
      'file.open',
      'month.totalIncome',
      'month.totalExpenses',
      'month.unallocated',
      'month.showUnplanned',
      'month.note',
      'month.previous',
    ] as const

    for (const key of keys) {
      expect(translate(key, 'pl'), key).not.toBe(translate(key, 'en'))
    }
  })
})

describe('choosing the interface language on a first run', () => {
  it('takes the first language the browser prefers that the app speaks', () => {
    expect(defaultLanguage(['pl-PL', 'en-US'])).toBe('pl')
    expect(defaultLanguage(['en-GB', 'pl'])).toBe('en')
  })

  it('falls back to English when the browser prefers neither', () => {
    expect(defaultLanguage(['sv-SE', 'de'])).toBe('en')
    expect(defaultLanguage([])).toBe('en')
  })
})

describe('reading a remembered interface language', () => {
  it('accepts a language the app speaks', () => {
    expect(parseLanguage('pl')).toBe('pl')
    expect(parseLanguage('en')).toBe('en')
  })

  it('rejects anything else rather than guessing', () => {
    expect(parseLanguage('sv')).toBeUndefined()
    expect(parseLanguage(null)).toBeUndefined()
    expect(parseLanguage(42)).toBeUndefined()
  })
})
