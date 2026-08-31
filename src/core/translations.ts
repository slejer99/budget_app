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
  // Each language is offered under its own name, so it is legible to someone
  // who cannot yet read the language the app is currently in.
  'language.name.pl': { pl: 'Polski', en: 'Polski' },
  'language.name.en': { pl: 'English', en: 'English' },

  'placeholder.thisMonth': { pl: 'Bieżący miesiąc', en: 'This month' },
  'placeholder.sampleAmount': { pl: 'Przykładowa kwota', en: 'Sample amount' },
  'placeholder.explanation': {
    pl: 'Nie wczytano jeszcze żadnego budżetu. Ten ekran istnieje po to, aby potwierdzić, że aplikacja instaluje się na obu urządzeniach i poprawnie zapisuje miesiące oraz kwoty.',
    en: 'No budget is loaded yet. This screen exists to prove the app installs on both devices and writes months and amounts correctly.',
  },

  // Month names, in the CLDR **stand-alone** forms. Polish inflects: a month
  // named beside a day is genitive (`15 stycznia 2026`), a month named on its
  // own is nominative (`Styczeń 2026`). This app is almost entirely bare month
  // labels, so the stand-alone form is the only one it ever needs. Capitalised
  // because every one of them appears as a heading, which is why they are held
  // here rather than taken from the browser's own locale data.
  'month.1': { pl: 'Styczeń', en: 'January' },
  'month.2': { pl: 'Luty', en: 'February' },
  'month.3': { pl: 'Marzec', en: 'March' },
  'month.4': { pl: 'Kwiecień', en: 'April' },
  'month.5': { pl: 'Maj', en: 'May' },
  'month.6': { pl: 'Czerwiec', en: 'June' },
  'month.7': { pl: 'Lipiec', en: 'July' },
  'month.8': { pl: 'Sierpień', en: 'August' },
  'month.9': { pl: 'Wrzesień', en: 'September' },
  'month.10': { pl: 'Październik', en: 'October' },
  'month.11': { pl: 'Listopad', en: 'November' },
  'month.12': { pl: 'Grudzień', en: 'December' },
} as const satisfies Record<string, Record<Language, string>>

/** The name of a string the app can say. */
export type TranslationKey = keyof typeof TRANSLATIONS

export function translate(key: TranslationKey, language: Language): string {
  return TRANSLATIONS[key][language]
}
