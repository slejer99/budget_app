import { describe, expect, it } from 'vitest'

import { DOCUMENT_VERSION, parseBudgetDocument } from '../src/core'

/** The smallest thing that is still a budget document. */
const MINIMAL = {
  version: DOCUMENT_VERSION,
  groups: [{ id: 'g-food', name: 'Jedzenie', kind: 'expense' }],
  lines: [{ id: 'l-home', groupId: 'g-food', name: 'Jedzenie dom' }],
  months: {},
}

function parse(value: unknown) {
  return parseBudgetDocument(JSON.stringify(value))
}

describe('opening a budget file', () => {
  it('reads a well-formed document', () => {
    const parsed = parse(MINIMAL)

    expect(parsed.ok).toBe(true)
    if (!parsed.ok) return
    expect(parsed.document.groups.map((group) => group.name)).toEqual(['Jedzenie'])
    expect(parsed.document.lines.map((line) => line.name)).toEqual(['Jedzenie dom'])
  })

  it('takes the interface language from the document', () => {
    const parsed = parse({ ...MINIMAL, language: 'en' })

    expect(parsed.ok && parsed.document.language).toBe('en')
  })

  it('leaves the language unset when the document does not name one', () => {
    const parsed = parse(MINIMAL)

    expect(parsed.ok && parsed.document.language).toBeUndefined()
  })

  it('ignores a language it does not have rather than refusing the file', () => {
    const parsed = parse({ ...MINIMAL, language: 'sv' })

    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.document.language).toBeUndefined()
  })

  it('refuses something that is not a budget file at all', () => {
    expect(parseBudgetDocument('not json').ok).toBe(false)
    expect(parse({ hello: 'world' }).ok).toBe(false)
    expect(parse([1, 2, 3]).ok).toBe(false)
  })

  it('names an unsupported version separately, since the app is what is out of date', () => {
    const parsed = parse({ ...MINIMAL, version: DOCUMENT_VERSION + 1 })

    expect(parsed.ok).toBe(false)
    expect(!parsed.ok && parsed.problem).toBe('unsupportedVersion')
  })

  it('refuses two lines with the same name in one group', () => {
    const ambiguous = {
      ...MINIMAL,
      lines: [
        { id: 'l-a', groupId: 'g-food', name: 'Inne' },
        { id: 'l-b', groupId: 'g-food', name: 'Inne' },
      ],
    }

    expect(parse(ambiguous).ok).toBe(false)
  })

  it('allows the same name in different groups', () => {
    const twoGroups = {
      version: DOCUMENT_VERSION,
      groups: [
        { id: 'g-food', name: 'Jedzenie', kind: 'expense' },
        { id: 'g-transport', name: 'Transport', kind: 'expense' },
      ],
      lines: [
        { id: 'l-a', groupId: 'g-food', name: 'Inne' },
        { id: 'l-b', groupId: 'g-transport', name: 'Inne' },
      ],
      months: {},
    }

    expect(parse(twoGroups).ok).toBe(true)
  })

  it('refuses a figure filed against a line that does not exist', () => {
    const orphaned = {
      ...MINIMAL,
      months: { '2026-09': { entries: { 'l-missing': { planned: { ore: 100 } } } } },
    }

    expect(parse(orphaned).ok).toBe(false)
  })

  it('refuses a planned amount that is not a whole number of öre', () => {
    const fractional = {
      ...MINIMAL,
      months: { '2026-09': { entries: { 'l-home': { planned: { ore: 12.5 } } } } },
    }

    expect(parse(fractional).ok).toBe(false)
  })

  it('refuses a month key that is not a real month', () => {
    for (const key of ['2026-13', '2026-00', 'wrzesien', '2026-9']) {
      const wrong = {
        ...MINIMAL,
        months: { [key]: { entries: {} } },
      }
      expect(parse(wrong).ok, key).toBe(false)
    }
  })

  it('carries keys it does not know past, so a later document still opens', () => {
    const richer = {
      ...MINIMAL,
      trackingEnabled: true,
      purchases: [{ lineId: 'l-home', date: '2026-09-03', ore: 12900 }],
      deviceTag: 'desktop',
    }

    expect(parse(richer).ok).toBe(true)
  })

  it('refuses two groups with the same name, which would make group-plus-name ambiguous', () => {
    const ambiguous = {
      ...MINIMAL,
      groups: [
        { id: 'g-a', name: 'Inne wydatki', kind: 'expense' },
        { id: 'g-b', name: 'Inne wydatki', kind: 'expense' },
      ],
      lines: [{ id: 'l-home', groupId: 'g-a', name: 'Jedzenie dom' }],
    }

    expect(parse(ambiguous).ok).toBe(false)
  })

  it('refuses a version that is not a real one', () => {
    for (const version of [0, -1, 1.5]) {
      expect(parse({ ...MINIMAL, version }).ok, String(version)).toBe(false)
    }
  })

  it("refuses a group whose kind is not a side of the ledger", () => {
    // This decides whether a figure counts as money coming in or going out, so
    // guessing at it would silently move money across the unallocated line.
    for (const kind of ['Income', 'przychody', '', undefined]) {
      const wrong = { ...MINIMAL, groups: [{ id: 'g-food', name: 'Jedzenie', kind }] }
      expect(parse(wrong).ok, String(kind)).toBe(false)
    }
  })

  it('refuses two groups or two lines sharing an identifier', () => {
    const sameGroupId = {
      ...MINIMAL,
      groups: [
        { id: 'g-food', name: 'Jedzenie', kind: 'expense' },
        { id: 'g-food', name: 'Transport', kind: 'expense' },
      ],
    }
    const sameLineId = {
      ...MINIMAL,
      lines: [
        { id: 'l-home', groupId: 'g-food', name: 'Jedzenie dom' },
        { id: 'l-home', groupId: 'g-food', name: 'Jedzenie miasto' },
      ],
    }

    expect(parse(sameGroupId).ok).toBe(false)
    expect(parse(sameLineId).ok).toBe(false)
  })

  it('refuses a line filed under a group that does not exist', () => {
    const orphaned = {
      ...MINIMAL,
      lines: [{ id: 'l-home', groupId: 'g-missing', name: 'Jedzenie dom' }],
    }

    expect(parse(orphaned).ok).toBe(false)
  })

  it('refuses an empty identifier, which would not identify anything', () => {
    expect(parse({ ...MINIMAL, groups: [{ id: '', name: 'Jedzenie', kind: 'expense' }] }).ok).toBe(
      false,
    )
    expect(parse({ ...MINIMAL, lines: [{ id: '', groupId: 'g-food', name: 'x' }] }).ok).toBe(false)
  })

  it('opens a document that names no months at all', () => {
    const { months: _months, ...withoutMonths } = MINIMAL
    const parsed = parse(withoutMonths)

    expect(parsed.ok).toBe(true)
    expect(parsed.ok && Object.keys(parsed.document.months)).toEqual([])
  })

  it('refuses an entry it cannot read, rather than showing the line as unplanned', () => {
    // Silently dropping an unreadable figure would show a planned line as empty,
    // which reads as a deliberate decision the operator never made.
    for (const planned of [42, 'nonsense', [], { typed: '1+1' }, { ore: '100' }]) {
      const wrong = {
        ...MINIMAL,
        months: { '2026-09': { entries: { 'l-home': { planned } } } },
      }
      expect(parse(wrong).ok, JSON.stringify(planned)).toBe(false)
    }
  })

  it('treats a planned amount of null as no planned amount', () => {
    const parsed = parse({
      ...MINIMAL,
      months: { '2026-09': { entries: { 'l-home': { planned: null } } } },
    })

    expect(parsed.ok).toBe(true)
    expect(parsed.ok && parsed.document.months['2026-09']!.entries['l-home']!.planned).toBeUndefined()
  })

  it('refuses a note that is not text', () => {
    const wrong = {
      ...MINIMAL,
      months: { '2026-09': { entries: { 'l-home': { note: 42 } } } },
    }

    expect(parse(wrong).ok).toBe(false)
  })
})
