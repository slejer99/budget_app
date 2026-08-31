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
export { formatMonthLabel, monthOf } from './month'
