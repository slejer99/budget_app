import { useState } from 'preact/hooks'

import {
  formatAmount,
  formatMonthLabel,
  monthAfter,
  monthBefore,
  translate,
  type Amount,
  type Language,
  type Month,
  type MonthPlanGroup,
  type MonthPlanLine,
  type MonthPlanView,
} from '../core'

type Props = {
  view: MonthPlanView
  language: Language
  onChooseMonth: (month: Month) => void
}

export function MonthPlan({ view, language, onChooseMonth }: Props) {
  const [showUnplanned, setShowUnplanned] = useState(false)
  const unplannedCount = view.groups.reduce(
    (count, group) => count + (group.allLines.length - group.plannedLines.length),
    0,
  )

  return (
    <>
      <nav class="months">
        <button
          type="button"
          class="months__step"
          aria-label={translate('month.previous', language)}
          onClick={() => onChooseMonth(monthBefore(view.month))}
        >
          ‹
        </button>
        <h2 class="months__label">{formatMonthLabel(view.month, language)}</h2>
        <button
          type="button"
          class="months__step"
          aria-label={translate('month.next', language)}
          onClick={() => onChooseMonth(monthAfter(view.month))}
        >
          ›
        </button>
      </nav>

      <dl class="totals">
        <Total label={translate('month.totalIncome', language)} amount={view.totalIncome} />
        <Total label={translate('month.totalExpenses', language)} amount={view.totalExpenses} />
        <Total
          label={translate('month.unallocated', language)}
          amount={view.unallocated}
          emphasis
        />
      </dl>

      {!view.exists && <p class="notice">{translate('month.notPlanned', language)}</p>}

      {view.groups.map((group) => (
        <GroupSection
          key={group.groupId}
          group={group}
          showUnplanned={showUnplanned}
          language={language}
        />
      ))}

      {unplannedCount > 0 && (
        <button
          type="button"
          class="reveal"
          aria-expanded={showUnplanned}
          onClick={() => setShowUnplanned(!showUnplanned)}
        >
          {showUnplanned
            ? translate('month.hideUnplanned', language)
            : translate('month.showUnplanned', language)}
          {/* A count, not a sentence — kept as its own element so that no
              user-facing string is assembled outside the catalogue. */}
          {!showUnplanned && <span class="reveal__count">{unplannedCount}</span>}
        </button>
      )}
    </>
  )
}

function Total({
  label,
  amount,
  emphasis = false,
}: {
  label: string
  amount: Amount
  emphasis?: boolean
}) {
  return (
    <div class={emphasis ? 'totals__row totals__row--lead' : 'totals__row'}>
      <dt class="totals__label">{label}</dt>
      <dd class={amount < 0 ? 'totals__value totals__value--negative' : 'totals__value'}>
        {formatAmount(amount)}
      </dd>
    </div>
  )
}

function GroupSection({
  group,
  showUnplanned,
  language,
}: {
  group: MonthPlanGroup
  showUnplanned: boolean
  language: Language
}) {
  // Both lists come out of the core in root-list order, so revealing the hidden
  // lines slots them into place rather than appending them at the end.
  const visible = showUnplanned ? group.allLines : group.plannedLines
  if (visible.length === 0) return null

  return (
    <section class="group">
      <header class="group__head">
        {/* Operator-typed. Never translated, shown exactly as entered. */}
        <h3 class="group__name">{group.name}</h3>
        <span class="group__subtotal">{formatAmount(group.subtotal)}</span>
      </header>
      <ul class="lines">
        {visible.map((line) => (
          <LineRow key={line.lineId} line={line} language={language} />
        ))}
      </ul>
    </section>
  )
}

function LineRow({ line, language }: { line: MonthPlanLine; language: Language }) {
  return (
    <li class={line.planned === undefined ? 'line line--unplanned' : 'line'}>
      <div class="line__what">
        <span class="line__name">{line.name}</span>
        {/* Shown rather than hidden behind a hover: the phone has no hover, and
            this is the field the operator used 237 times. */}
        {line.note !== undefined && (
          <span class="line__note">
            <span class="line__noteLabel">{translate('month.note', language)}</span>
            {line.note}
          </span>
        )}
      </div>
      <div class="line__amount">
        <span class="line__figure">
          {line.planned === undefined ? '—' : formatAmount(line.planned)}
        </span>
        {line.typed !== undefined && <span class="line__typed">{line.typed}</span>}
      </div>
    </li>
  )
}
