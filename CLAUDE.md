# budget_app

A personal budget application for one person on two devices — a Windows desktop and an
Android phone. It replaces the household budget spreadsheet
`Kopia 63-Szablon-budzet-domowy-2021-PLN-v7-4.xlsx` kept at the repo root (the Polish
jakoszczedzacpieniadze.pl v7.4 template, heavily customised).

**The design is settled and the walking skeleton is built.** As of 2026-08-26 the stack,
the sync mechanism, the data model and the scope were all decided in a grilling session —
see `CONTEXT.md` and `docs/adr/`. Ticket 01 landed on 2026-08-31: the app builds, installs
and formats months and amounts, but holds no budget yet. Work continues through the tickets
in `.scratch/budget-planner-v1/issues/`, in order.

## How to end every response

Always finish with **next steps**. Never end a substantial response without them.

Write that part in plain human language — no jargon, simple and concise, one person talking
to another. (This is the rule the `bro` skill applies; it is written out here so it holds
even when that skill isn't loaded.) The operator directs agents and does not write code, so
next steps full of tool names and framework terms are not steps they can act on.

- Say what to actually do, not what category of thing to do.
- If a decision is needed, ask it as a plain question with the options spelled out.
- If something is blocked, waiting, or unfinished, say so plainly rather than omitting it.
- Keep technical detail earlier in the response. The next steps must read on their own.

## Read these before working on anything

The `.xlsx` is the primary source, but it is a binary blob — **read the extraction instead**,
and go back to the workbook only to check something the extraction doesn't cover.

| Document | What it gives you |
|---|---|
| `docs/spreadsheet/00-overview.md` | **Start here.** The data model in one paragraph, plus six findings that should shape the app. |
| `docs/spreadsheet/01-categories.md` | The category tree — 15 income slots, 15 expense groups × 10 slots |
| `docs/spreadsheet/02-month-template.md` | Month sheet anatomy: row map, column map, complete formula vocabulary |
| `docs/spreadsheet/03-caly-rok.md` | The yearly rollup, and why it is currently `#REF!` throughout |
| `docs/spreadsheet/04-stan-kont.md` | Accounts & debts sheet — fully built, never filled in |
| `docs/spreadsheet/05-data-inventory.md` | What data actually exists, per month. **Not in git** — its tables are real monthly income and spend. On the operator's desktop only |
| `docs/spreadsheet/data/*.csv` | Machine-readable: 165 categories, 653 planned figures, 59 actual entries. **Not in git** — real figures, and the repo is public. They sit on the operator's desktop only |
| `docs/research/cross-platform-stack.md` | Stack and sync options, 71 primary-source citations. **Its recommendation was not the one chosen** — read the ADRs for what was |
| `CONTEXT.md` | **The glossary.** The project's vocabulary; use these words, avoid the listed synonyms |
| `docs/adr/0001-web-app-with-build-step.md` | Why a built web app rather than Tauri or a no-build page |
| `docs/adr/0002-one-json-file-in-google-drive.md` | Why one JSON file in Drive rather than a database or a sync service |
| `docs/maintaining-node.md` | Written for the operator, not for you. Keep it true when the build changes |

## The three facts that change most decisions

**It is a planner first.** 653 planned figures were entered across 26 months. Actual entries:
59 — every one of them income, recorded on day 1. The daily expense grid, which is the
template's centrepiece, was never used once. The observed loop is setting a monthly plan
across ~60 active lines. Spend tracking *is* being built, at the operator's request, but it
is a switchable feature layered on the planner — never assume transaction capture is the
core loop.

**The comment column is where the real names live.** `02-month-template.md` calls column `G`
a free-text comment and moves on. It holds **237 entries** — four times as many as the daily
grid ever did — and they are not notes, they are names: `sbab`, `pko`, `akasa`, `tablet`,
`auto`. The fixed category list could not hold the real names, so the comment column became
the name field. That is why the app has an editable root list with no slot ceiling.

**The operator does not write code.** They direct agents. The governing criterion for every
technical choice is *fewest moving parts the operator can be stranded by* — not what is
fastest, most popular, or most capable. An option that needs a non-programmer to rotate a
signing key or debug a native toolchain in two years is a bad option here, whatever its
other merits.

## Settled — do not reopen without the operator

Decided 2026-08-26. The full reasoning is in `docs/adr/`; `CONTEXT.md` carries the vocabulary.

- **Stack.** A responsive web app built with Node, hosted as static files on GitHub Pages
  from a public repo, installed as a PWA on both devices. Not Tauri, not native. The
  research file's own recommendation was a *no-build* PWA; the operator chose the build
  step deliberately and asked for a Node maintenance page as the price. See ADR-0001.
- **Sync.** One JSON document in Google Drive. Desktop reaches it through Drive for Desktop
  as an ordinary file; Android reaches the same file through Chrome's picker — **verified
  working on the operator's phone, 2026-08-26**. Last write wins, but the app prompts
  whenever Drive's copy is newer, and keeps ~20 overwritten versions beside it. Offline the
  phone opens read-only. Drive was chosen over the already-installed OneDrive because the
  operator keeps all documents in Drive. See ADR-0002.
- **Scope in.** Monthly planning; editable root list with no slot ceiling; full import of
  all 26 months of history; arithmetic in planned amounts; per-month notes; switchable
  spend tracking with three capture modes; reports of income, expenses, unallocated and
  per-group totals over any range.
- **Scope out.** Net worth (`STAN KONT`). The yearly `CAŁY ROK` grid, superseded by reports.

## Conventions

**The money is Swedish crowns, not złoty.** The workbook formats every cell as `zł` and its
filename says PLN — both are leftovers from the Polish template. The data is Swedish: `sbab`,
`akasa`, `knyckelkund`, `avanza`, `Mervärdesskatt`, Swedish subscription prices, and a
household income that only makes sense in SEK. Format as `1 234,00 kr` with U+00A0 as the
grouping separator and before `kr`. One currency throughout — no PLN, no exchange rate.

**The interface is Polish or English**, on a single switch. Only the app's own words
translate; line and group names are whatever the operator typed and are never translated.
Polish month names need CLDR **stand-alone** forms (`Styczeń 2026`, not `Stycznia 2026`),
which matters because this app is almost entirely bare month labels.

**Every user-facing string goes through the translation mechanism.** A string the app says
in its own voice is added to the catalogue in `src/core/translations.ts` with both
languages; the type system then refuses to build if one is missing. There is deliberately no
"translate the app" ticket at the end to catch up.

Three things sit outside that catalogue, each for a reason:

- **Operator-typed text** — line names, group names, notes. Shown exactly as typed, in
  whatever language the operator typed it, never translated.
- **The name of each language on the switch** (`Polski`, `English`). Proper names, identical
  in both languages; they live in `LANGUAGE_NAMES` in `src/core/language.ts`.
- **The name the installed app carries** on the Start menu and the home screen, in
  `public/manifest.webmanifest`. No browser can switch a manifest at runtime, so it is fixed
  at `Budget` — close enough to `Budżet` to read in either language. The `<title>` in
  `index.html` is only what shows in the fraction of a second before the app boots; the app
  then replaces it with the translated name.

Nothing else joins that list without the operator.

**All logic lives in the budget core**, the pure module behind `src/core/index.ts`. It reads
no clock, no file and no network, and renders nothing; the current date is passed in. Tests
reach it only through that one file. Everything else — storage, rendering — is a thin adapter
kept dull enough that not testing it is defensible.

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature-slug>/` in this repo — no remote tracker. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, used as-is, recorded as a `Status:` line in each issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` and one `docs/adr/` at the repo root. See `docs/agents/domain.md`.
