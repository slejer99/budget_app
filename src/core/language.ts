/** The interface language. Only the app's own words translate — never the
 *  operator's line names, group names or notes. */
export type Language = 'pl' | 'en'

/** Every language the switch offers, in the order it offers them. */
export const LANGUAGES: readonly Language[] = ['pl', 'en']

/** Each language under its own name, so the switch stays readable to someone
 *  who cannot read the language the app is currently in.
 *
 *  These are proper names and sit outside the translation catalogue on purpose:
 *  `Polski` is `Polski` in English too, the same way a line's name is whatever
 *  the operator typed. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  pl: 'Polski',
  en: 'English',
}

/** The language to start in when the operator has never chosen one.
 *
 *  Takes the browser's ordered preferences — `navigator.languages` — and picks
 *  the first the app actually speaks. English is the fallback, because the
 *  operator reads it and it is one tap to switch. */
export function defaultLanguage(preferred: readonly string[]): Language {
  for (const tag of preferred) {
    const language = parseLanguage(tag.split('-')[0])
    if (language !== undefined) return language
  }
  return 'en'
}

/** Reads a language back out of somewhere untrusted — browser storage now, the
 *  budget document from ticket 02 on. Anything unrecognised is refused rather
 *  than guessed at, so a corrupted value falls back to the default. */
export function parseLanguage(value: unknown): Language | undefined {
  return LANGUAGES.find((language) => language === value)
}
