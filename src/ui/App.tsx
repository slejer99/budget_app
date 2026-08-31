import { useEffect, useState } from 'preact/hooks'

import {
  amountFromOre,
  formatAmount,
  formatMonthLabel,
  monthOf,
  translate,
  type Language,
} from '../core'
import { LanguageSwitch } from './LanguageSwitch'
import { rememberLanguage, rememberedLanguage } from './rememberedLanguage'

/** The figure the ticket names, so the formatting can be checked at a glance on
 *  the phone: `1 234,00 kr`. */
const SAMPLE_AMOUNT = amountFromOre(123_400)

type Props = {
  /** Today. The core reads no clock, so the date is handed to it. */
  today: Date
}

export function App({ today }: Props) {
  const [language, setLanguage] = useState<Language>(rememberedLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    document.title = translate('app.name', language)
  }, [language])

  function chooseLanguage(chosen: Language) {
    setLanguage(chosen)
    rememberLanguage(chosen)
  }

  return (
    <div class="app">
      <header class="masthead">
        <h1 class="masthead__name">{translate('app.name', language)}</h1>
        <LanguageSwitch language={language} onChoose={chooseLanguage} />
      </header>

      <main class="card">
        <div class="figure">
          <span class="figure__label">{translate('placeholder.thisMonth', language)}</span>
          <span class="figure__value">{formatMonthLabel(monthOf(today), language)}</span>
        </div>

        <div class="figure">
          <span class="figure__label">{translate('placeholder.sampleAmount', language)}</span>
          <span class="figure__value">{formatAmount(SAMPLE_AMOUNT)}</span>
        </div>

        <p class="explanation">{translate('placeholder.explanation', language)}</p>
      </main>
    </div>
  )
}
