import { defaultLanguage, parseLanguage, type Language } from '../core'

/** Where the interface language is kept between visits.
 *
 *  The browser is a temporary home for it. Ticket 02 moves the choice into the
 *  budget document, so that setting it on the desktop also sets it on the
 *  phone. Nothing here decides anything — which language to fall back to and
 *  what counts as a valid stored value are both the core's calls. */
const STORAGE_KEY = 'budget_app.language'

export function rememberedLanguage(): Language {
  return parseLanguage(readStored()) ?? defaultLanguage(navigator.languages)
}

export function rememberLanguage(language: Language): void {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Storage can be switched off or full. The switch still works for this
    // visit; only the memory of it is lost.
  }
}

function readStored(): unknown {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
