import { describe, expect, it } from 'vitest'

import { LANGUAGES, defaultLanguage, parseLanguage, translate } from '../src/core'

describe("the app's own words", () => {
  it('gives back the string for the language asked for', () => {
    expect(translate('app.name', 'en')).toBe('Budget')
    expect(translate('app.name', 'pl')).toBe('Budżet')
  })

  it('has something to say in every language it offers', () => {
    for (const language of LANGUAGES) {
      expect(translate('placeholder.explanation', language)).not.toBe('')
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
