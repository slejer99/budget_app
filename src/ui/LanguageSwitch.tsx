import { LANGUAGES, translate, type Language, type TranslationKey } from '../core'

// Each language is offered under its own name, so the switch stays readable
// whichever language the app currently happens to be in.
const NAME_KEYS = {
  pl: 'language.name.pl',
  en: 'language.name.en',
} as const satisfies Record<Language, TranslationKey>

type Props = {
  language: Language
  onChoose: (language: Language) => void
}

export function LanguageSwitch({ language, onChoose }: Props) {
  return (
    <div class="switch" role="group" aria-label={translate('language.label', language)}>
      {LANGUAGES.map((option) => (
        <button
          key={option}
          type="button"
          class="switch__option"
          lang={option}
          aria-pressed={option === language}
          onClick={() => onChoose(option)}
        >
          {translate(NAME_KEYS[option], language)}
        </button>
      ))}
    </div>
  )
}
