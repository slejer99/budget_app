/** The budget core.
 *
 *  Everything with a decision in it lives behind this file, and this file is
 *  the only thing the rendering layer and the tests are allowed to import. The
 *  core is pure: no file access, no network, no rendering, and no clock — the
 *  current date is passed in. */

export type { Language } from './language'
export { LANGUAGES, LANGUAGE_NAMES, defaultLanguage, parseLanguage } from './language'

export type { TranslationKey } from './translations'
export { translate } from './translations'

export type { Amount } from './amount'
export { amountFromOre, formatAmount } from './amount'

export type { Month } from './month'
export { formatMonthLabel, monthAfter, monthBefore, monthKey, monthOf } from './month'

export type {
  BudgetDocument,
  DocumentProblem,
  Group,
  GroupKind,
  Line,
  MonthEntry,
  MonthPlan,
  ParsedDocument,
  PlannedAmount,
} from './document'
export { DOCUMENT_VERSION, parseBudgetDocument } from './document'

export type { MonthPlanGroup, MonthPlanLine, MonthPlanView } from './monthPlan'
export { monthPlanOf } from './monthPlan'
