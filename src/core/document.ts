import type { Amount } from './amount'
import { amountFromOre } from './amount'
import type { Language } from './language'
import { parseLanguage } from './language'

/** Income or expense. A group's kind is what decides which side of the month
 *  a line's figure lands on; there is no per-line kind. */
export type GroupKind = 'income' | 'expense'

export type Group = {
  readonly id: string
  readonly name: string
  readonly kind: GroupKind
}

/** A line carries a stable identifier that never changes. Its name and its
 *  group are attributes, so renaming reaches every month including past ones
 *  without rewriting a single figure — nothing stores the name but the line. */
export type Line = {
  readonly id: string
  readonly groupId: string
  readonly name: string
}

/** What the operator intends for a line in a month.
 *
 *  `typed` is present only where they typed something other than a plain
 *  number — `4912+1667+1667` — so that next month they can adjust one
 *  instalment rather than recompute the total. Where it is absent the figure
 *  was typed as-is and there is nothing to remember. */
export type PlannedAmount = {
  readonly value: Amount
  readonly typed: string | undefined
}

export type MonthEntry = {
  readonly planned: PlannedAmount | undefined
  readonly note: string | undefined
}

/** One month's figures, keyed by line identifier. */
export type MonthPlan = {
  readonly entries: Readonly<Record<string, MonthEntry>>
}

/** Everything the app holds, as it comes out of the file.
 *
 *  Only what this ticket reads is modelled. Unknown keys in the file are
 *  carried past rather than rejected, so a document written by a later version
 *  still opens here — and since this ticket is read-only, nothing it ignores
 *  can be lost by ignoring it. */
export type BudgetDocument = {
  readonly version: number
  readonly language: Language | undefined
  readonly groups: readonly Group[]
  readonly lines: readonly Line[]
  readonly months: Readonly<Record<string, MonthPlan>>
}

/** The document format this build understands. */
export const DOCUMENT_VERSION = 1

/** Why a file could not be opened.
 *
 *  Deliberately coarse — the operator cannot debug JSON — but not so coarse
 *  that different actions look the same: pick another file, update the app, or
 *  wait for Drive to fetch the file down. These are names, not sentences: the
 *  words shown on screen come from the translation catalogue. */
export type DocumentProblem = 'notABudgetFile' | 'unsupportedVersion' | 'couldNotRead'

export type ParsedDocument =
  | { readonly ok: true; readonly document: BudgetDocument }
  | { readonly ok: false; readonly problem: DocumentProblem }

/** Reads the text of a budget file.
 *
 *  Takes text rather than a parsed value so that malformed JSON and a
 *  well-formed file of the wrong shape come back the same way, and the storage
 *  adapter never needs a `try`. */
export function parseBudgetDocument(text: string): ParsedDocument {
  let value: unknown
  try {
    value = JSON.parse(text)
  } catch {
    return { ok: false, problem: 'notABudgetFile' }
  }
  return readDocument(value)
}

function readDocument(value: unknown): ParsedDocument {
  if (!isRecord(value)) return notABudgetFile

  const version = value['version']
  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) {
    return notABudgetFile
  }
  if (version > DOCUMENT_VERSION) return { ok: false, problem: 'unsupportedVersion' }

  const groups = readGroups(value['groups'])
  if (groups === undefined) return notABudgetFile

  const lines = readLines(value['lines'], groups)
  if (lines === undefined) return notABudgetFile

  const months = readMonths(value['months'], lines)
  if (months === undefined) return notABudgetFile

  return {
    ok: true,
    document: {
      version,
      language: parseLanguage(value['language']),
      groups,
      lines,
      months,
    },
  }
}

const notABudgetFile = { ok: false, problem: 'notABudgetFile' } as const

function readGroups(value: unknown): readonly Group[] | undefined {
  if (!Array.isArray(value)) return undefined
  const groups: Group[] = []
  const seenIds = new Set<string>()
  // Two groups sharing a name would make group-plus-name stop identifying a
  // line to the operator, however distinct their identifiers are.
  const seenNames = new Set<string>()
  for (const raw of value) {
    if (!isRecord(raw)) return undefined
    const id = raw['id']
    const name = raw['name']
    const kind = raw['kind']
    if (typeof id !== 'string' || id === '') return undefined
    if (typeof name !== 'string') return undefined
    if (kind !== 'income' && kind !== 'expense') return undefined
    if (seenIds.has(id) || seenNames.has(name)) return undefined
    seenIds.add(id)
    seenNames.add(name)
    groups.push({ id, name, kind })
  }
  return groups
}

function readLines(value: unknown, groups: readonly Group[]): readonly Line[] | undefined {
  if (!Array.isArray(value)) return undefined
  const groupIds = new Set(groups.map((group) => group.id))
  const lines: Line[] = []
  const seenIds = new Set<string>()
  // The operator-facing identity of a line is its group plus its name, so the
  // same name in two groups is two lines, and the same name twice in one group
  // is a document that cannot be displayed unambiguously.
  const seenNamesByGroup = new Map<string, Set<string>>()
  for (const raw of value) {
    if (!isRecord(raw)) return undefined
    const id = raw['id']
    const groupId = raw['groupId']
    const name = raw['name']
    if (typeof id !== 'string' || id === '') return undefined
    if (typeof groupId !== 'string' || !groupIds.has(groupId)) return undefined
    if (typeof name !== 'string') return undefined
    if (seenIds.has(id)) return undefined
    seenIds.add(id)
    const namesInGroup = seenNamesByGroup.get(groupId) ?? new Set<string>()
    if (namesInGroup.has(name)) return undefined
    namesInGroup.add(name)
    seenNamesByGroup.set(groupId, namesInGroup)
    lines.push({ id, groupId, name })
  }
  return lines
}

function readMonths(
  value: unknown,
  lines: readonly Line[],
): Readonly<Record<string, MonthPlan>> | undefined {
  if (value === undefined) return {}
  if (!isRecord(value)) return undefined
  const lineIds = new Set(lines.map((line) => line.id))
  const months: Record<string, MonthPlan> = {}
  for (const [key, rawPlan] of Object.entries(value)) {
    if (!isMonthKey(key)) return undefined
    if (!isRecord(rawPlan)) return undefined
    const rawEntries = rawPlan['entries']
    if (!isRecord(rawEntries)) return undefined
    const entries: Record<string, MonthEntry> = {}
    for (const [lineId, rawEntry] of Object.entries(rawEntries)) {
      // A figure against a line that no longer exists cannot be shown under any
      // name, so the file is wrong rather than merely surprising.
      if (!lineIds.has(lineId)) return undefined
      if (!isRecord(rawEntry)) return undefined
      const planned = readPlanned(rawEntry['planned'])
      if (planned === invalid) return undefined
      const note = rawEntry['note']
      if (note !== undefined && typeof note !== 'string') return undefined
      entries[lineId] = { planned, note }
    }
    months[key] = { entries }
  }
  return months
}

/** Distinguishes "there is no planned amount here" from "this planned amount
 *  is unreadable", which `undefined` alone cannot. */
const invalid = Symbol('invalid')

function readPlanned(value: unknown): PlannedAmount | undefined | typeof invalid {
  if (value === undefined || value === null) return undefined
  if (!isRecord(value)) return invalid
  const ore = value['ore']
  if (typeof ore !== 'number' || !Number.isSafeInteger(ore)) return invalid
  const typed = value['typed']
  if (typed !== undefined && typeof typed !== 'string') return invalid
  return { value: amountFromOre(ore), typed }
}

/** `2026-09`. Zero-padded so that keys sort as dates do. */
function isMonthKey(key: string): boolean {
  if (!/^\d{4}-\d{2}$/.test(key)) return false
  const month = Number(key.slice(5))
  return month >= 1 && month <= 12
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
