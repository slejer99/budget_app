import { describe, expect, it } from 'vitest'

import { formatMonthLabel, monthOf } from '../src/core'

describe('labelling a month', () => {
  it('names a Polish month in its stand-alone form, never its genitive', () => {
    expect(formatMonthLabel({ year: 2026, month: 1 }, 'pl')).toBe('Styczeń 2026')
    expect(formatMonthLabel({ year: 2026, month: 1 }, 'pl')).not.toBe('Stycznia 2026')
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
