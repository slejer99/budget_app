import { describe, expect, it } from 'vitest'

import { formatMonthLabel, monthAfter, monthBefore, monthKey, monthOf } from '../src/core'

describe('labelling a month', () => {
  // The genitive is what a Polish date reads as inside a full date — `1 stycznia
  // 2026` — and what most locale data hands back. A bare month label needs the
  // stand-alone form. Listing every genitive is what makes this able to fail:
  // asserting the stand-alone form and then that it is not the genitive of the
  // same month says the same thing twice.
  const GENITIVES = [
    'stycznia',
    'lutego',
    'marca',
    'kwietnia',
    'maja',
    'czerwca',
    'lipca',
    'sierpnia',
    'września',
    'października',
    'listopada',
    'grudnia',
  ]

  it('never names a Polish month in its genitive form', () => {
    for (let month = 1; month <= 12; month += 1) {
      const label = formatMonthLabel({ year: 2026, month }, 'pl').toLowerCase()
      for (const genitive of GENITIVES) {
        expect(label, `${label} contains ${genitive}`).not.toContain(genitive)
      }
    }
  })

  // The app is almost entirely bare month labels, so every one of the twelve is
  // spelled out here. Expected values are the CLDR stand-alone forms.
  it('names all twelve Polish months', () => {
    const labels = Array.from({ length: 12 }, (_, index) =>
      formatMonthLabel({ year: 2026, month: index + 1 }, 'pl'),
    )
    expect(labels).toEqual([
      'Styczeń 2026',
      'Luty 2026',
      'Marzec 2026',
      'Kwiecień 2026',
      'Maj 2026',
      'Czerwiec 2026',
      'Lipiec 2026',
      'Sierpień 2026',
      'Wrzesień 2026',
      'Październik 2026',
      'Listopad 2026',
      'Grudzień 2026',
    ])
  })

  it('names all twelve English months', () => {
    const labels = Array.from({ length: 12 }, (_, index) =>
      formatMonthLabel({ year: 2025, month: index + 1 }, 'en'),
    )
    expect(labels).toEqual([
      'January 2025',
      'February 2025',
      'March 2025',
      'April 2025',
      'May 2025',
      'June 2025',
      'July 2025',
      'August 2025',
      'September 2025',
      'October 2025',
      'November 2025',
      'December 2025',
    ])
  })

  it('refuses a month outside the year rather than labelling it', () => {
    expect(() => formatMonthLabel({ year: 2026, month: 0 }, 'pl')).toThrow()
    expect(() => formatMonthLabel({ year: 2026, month: 13 }, 'pl')).toThrow()
  })
})

describe('the month a date falls in', () => {
  it('comes from the date it is given, not from a clock', () => {
    expect(monthOf(new Date(2026, 7, 31))).toEqual({ year: 2026, month: 8 })
    expect(monthOf(new Date(2024, 10, 1))).toEqual({ year: 2024, month: 11 })
  })
})

describe('stepping between months', () => {
  it('moves within a year', () => {
    expect(monthBefore({ year: 2026, month: 9 })).toEqual({ year: 2026, month: 8 })
    expect(monthAfter({ year: 2026, month: 9 })).toEqual({ year: 2026, month: 10 })
  })

  it('rolls the year over at January and December', () => {
    expect(monthBefore({ year: 2026, month: 1 })).toEqual({ year: 2025, month: 12 })
    expect(monthAfter({ year: 2026, month: 12 })).toEqual({ year: 2027, month: 1 })
  })

  it('comes back where it started after a step each way', () => {
    for (const month of [1, 6, 12]) {
      const start = { year: 2026, month }
      expect(monthAfter(monthBefore(start))).toEqual(start)
      expect(monthBefore(monthAfter(start))).toEqual(start)
    }
  })
})

describe('naming a month inside the document', () => {
  it('zero-pads, so the keys of a document sort as dates do', () => {
    expect(monthKey({ year: 2026, month: 9 })).toBe('2026-09')
    expect(monthKey({ year: 2026, month: 12 })).toBe('2026-12')
    expect([monthKey({ year: 2026, month: 10 }), monthKey({ year: 2026, month: 9 })].sort()).toEqual(
      ['2026-09', '2026-10'],
    )
  })
})
