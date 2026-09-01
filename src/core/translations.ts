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

  'file.title': { pl: 'Otwórz swój budżet', en: 'Open your budget' },
  'file.choose': { pl: 'Wybierz plik', en: 'Choose file' },
  'file.change': { pl: 'Zmień plik', en: 'Change file' },
  'file.why': {
    pl: 'Przeglądarka nie zapamiętuje dostępu do pliku, więc wskazujesz go przy każdym otwarciu aplikacji. To zwykły krok, a nie błąd.',
    en: 'The browser does not remember access to the file, so you point to it each time the app opens. This is an ordinary step, not an error.',
  },
  'file.problem.notABudgetFile': {
    pl: 'To nie jest plik budżetu. Wybierz inny plik.',
    en: 'That is not a budget file. Choose a different one.',
  },
  'file.problem.unsupportedVersion': {
    pl: 'Ten plik pochodzi z nowszej wersji aplikacji. Zaktualizuj aplikację, aby go otworzyć.',
    en: 'This file comes from a newer version of the app. Update the app to open it.',
  },
  'file.problem.couldNotRead': {
    pl: 'Nie udało się odczytać tego pliku. Jeśli jest na Dysku Google, poczekaj, aż się pobierze, i spróbuj ponownie.',
    en: 'That file could not be read. If it is in Google Drive, wait for it to download and try again.',
  },
  // Shown by the operating system's own file picker as the file-type filter.
  'file.type': { pl: 'Plik budżetu (JSON)', en: 'Budget file (JSON)' },
  'file.open': { pl: 'Otwarty plik', en: 'Currently open' },

  'month.totalIncome': { pl: 'Planowane przychody', en: 'Planned income' },
  'month.totalExpenses': { pl: 'Planowane wydatki', en: 'Planned expenses' },
  'month.unallocated': { pl: 'Nierozdysponowane', en: 'Unallocated' },
  'month.notPlanned': {
    pl: 'Ten miesiąc nie ma jeszcze planu.',
    en: 'This month has no plan yet.',
  },
  'month.showUnplanned': {
    pl: 'Pokaż pozycje bez kwoty',
    en: 'Show lines with no amount',
  },
  'month.hideUnplanned': {
    pl: 'Ukryj pozycje bez kwoty',
    en: 'Hide lines with no amount',
  },
  'month.note': { pl: 'Notatka', en: 'Note' },
  'month.previous': { pl: 'Poprzedni miesiąc', en: 'Previous month' },
  'month.next': { pl: 'Następny miesiąc', en: 'Next month' },
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
