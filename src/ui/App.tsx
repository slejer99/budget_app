import { useEffect, useState } from 'preact/hooks'

import {
  defaultLanguage,
  monthOf,
  monthPlanOf,
  parseBudgetDocument,
  translate,
  type BudgetDocument,
  type DocumentProblem,
  type Language,
  type Month,
} from '../core'
import { pickBudgetFile } from './budgetFile'
import { LanguageSwitch } from './LanguageSwitch'
import { MonthPlan } from './MonthPlan'
import { rememberLanguage, rememberedLanguage } from './rememberedLanguage'

type Props = {
  /** Today. The core reads no clock, so the date is handed to it. */
  today: Date
}

type Opened = {
  readonly budget: BudgetDocument
  readonly fileName: string
}

export function App({ today }: Props) {
  const [opened, setOpened] = useState<Opened | undefined>(undefined)
  const [chosenLanguage, setChosenLanguage] = useState<Language | undefined>(rememberedLanguage)
  const [problem, setProblem] = useState<DocumentProblem | undefined>(undefined)
  const [month, setMonth] = useState<Month>(() => monthOf(today))

  // The document is where the interface language lives now: a device that has
  // never been told otherwise takes it from the file, which is how one setting
  // reaches both devices. An explicit choice on the switch outranks it and
  // survives a restart, because this ticket cannot write that choice back into
  // the file and undoing it on every reload would lose what ticket 01 shipped.
  // Ticket 04 saves the choice into the document and drops the stored one.
  const language =
    chosenLanguage ?? opened?.budget.language ?? defaultLanguage(navigator.languages)

  function chooseLanguage(chosen: Language) {
    setChosenLanguage(chosen)
    rememberLanguage(chosen)
  }

  useEffect(() => {
    document.documentElement.lang = language
    document.title = translate('app.name', language)
  }, [language])

  async function choose() {
    const outcome = await pickBudgetFile(translate('file.type', language))

    if (!outcome.picked) {
      // Closing the picker leaves everything as it was; a file that would not
      // read has to say so, or the button appears to do nothing.
      setProblem(outcome.cancelled ? undefined : 'couldNotRead')
      return
    }

    const parsed = parseBudgetDocument(outcome.text)
    if (parsed.ok) {
      setOpened({ budget: parsed.document, fileName: outcome.name })
      setProblem(undefined)
    } else {
      setProblem(parsed.problem)
    }
  }

  const alert =
    problem === undefined ? null : (
      <p class="problem" role="alert">
        {translate(`file.problem.${problem}`, language)}
      </p>
    )

  return (
    <div class="app">
      <header class="masthead">
        <h1 class="masthead__name">{translate('app.name', language)}</h1>
        <LanguageSwitch language={language} onChoose={chooseLanguage} />
      </header>

      <main class="card">
        {opened === undefined ? (
          <section class="pick">
            <h2 class="pick__title">{translate('file.title', language)}</h2>
            <p class="pick__why">{translate('file.why', language)}</p>
            {alert}
            <button type="button" class="pick__button" onClick={() => void choose()}>
              {translate('file.choose', language)}
            </button>
          </section>
        ) : (
          <>
            <MonthPlan
              view={monthPlanOf(opened.budget, month)}
              language={language}
              onChooseMonth={setMonth}
            />
            {alert}
            <p class="opened">
              <span class="opened__label">{translate('file.open', language)}</span>
              {/* The operator's own filename. Shown as they named it. */}
              <span class="opened__name">{opened.fileName}</span>
            </p>
            <button type="button" class="reveal" onClick={() => void choose()}>
              {translate('file.change', language)}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
