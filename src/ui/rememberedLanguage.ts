import { parseLanguage, type Language } from '../core'

/** Where an explicitly chosen interface language survives a restart.
 *
 *  This ticket moved the language into the budget document, which is now where
 *  it is read from — but the app cannot write yet, so a choice made on the
 *  switch has nowhere durable to go. Deleting this file outright would have
 *  taken away something ticket 01 shipped: the operator sets the language once
 *  and it stays set. So the browser keeps the choice, and the document supplies
 *  it for any device that has never been told otherwise.
 *
 *  **Ticket 04 removes this.** Once the app can save, the switch writes into the
 *  document and the document becomes the only home the language has. Until then
 *  a remembered choice deliberately outranks the document, because silently
 *  undoing something the operator just did is the worse of the two failures.
 *
 *  Nothing here decides anything: what counts as a valid stored value is the
 *  core's call. */
const STORAGE_KEY = 'budget_app.language'

export function rememberedLanguage(): Language | undefined {
  return parseLanguage(readStored())
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
