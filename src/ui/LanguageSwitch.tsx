import { LANGUAGES, LANGUAGE_NAMES, translate, type Language } from '../core'

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
          {LANGUAGE_NAMES[option]}
        </button>
      ))}
    </div>
  )
}
