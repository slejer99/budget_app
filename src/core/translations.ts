import type { Language } from './language'

/** Every word the app says in its own voice.
 *
 *  A key exists once and carries every language, so a string that reaches the
 *  screen without a translation is a compile error rather than something to
 *  notice on the phone. Operator-typed text — line names, group names, notes —
 *  never appears here; it is shown exactly as it was typed. */
const TRANSLATIONS = {
  'app.name': { pl: 'Budżet', en: 'Budget' },

  'language.label': { pl: 'Język interfejsu', en: 'Interface language' },

  'placeholder.thisMonth': { pl: 'Bieżący miesiąc', en: 'This month' },
  'placeholder.sampleAmount': { pl: 'Przykładowa kwota', en: 'Sample amount' },
  'placeholder.explanation': {
    pl: 'Nie wczytano jeszcze żadnego budżetu. Ten ekran istnieje po to, aby potwierdzić, że aplikacja instaluje się na obu urządzeniach i poprawnie zapisuje miesiące oraz kwoty.',
    en: 'No budget is loaded yet. This screen exists to prove the app installs on both devices and writes months and amounts correctly.',
  },
} as const satisfies Record<string, Record<Language, string>>

/** The name of a string the app can say. */
export type TranslationKey = keyof typeof TRANSLATIONS

export function translate(key: TranslationKey, language: Language): string {
  return TRANSLATIONS[key][language]
}

/** Exactly twelve, so a missing month is a compile error. */
type MonthNames = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
]

/** The month names, in the CLDR **stand-alone** forms.
 *
 *  Polish inflects: a month named beside a day is genitive (`15 stycznia
 *  2026`), a month named on its own is nominative (`Styczeń 2026`). This app is
 *  almost entirely bare month labels, so the stand-alone form is the only one
 *  it ever needs. Capitalised because every one of them appears as a heading.
 *
 *  Held here rather than taken from the browser's own locale data, which varies
 *  by whichever version of ICU the browser was built against. */
const MONTH_NAMES = {
  pl: [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
} as const satisfies Record<Language, MonthNames>

/** The name of a month, 1–12. `undefined` for anything else, which is the
 *  caller's to refuse. */
export function monthName(month: number, language: Language): string | undefined {
  return MONTH_NAMES[language][month - 1]
}
