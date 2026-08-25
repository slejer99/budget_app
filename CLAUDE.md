# budget_app

A personal budget application for one person on two devices — a Windows desktop and an
Android phone. It replaces the household budget spreadsheet
`Kopia 63-Szablon-budzet-domowy-2021-PLN-v7-4.xlsx` kept at the repo root (the Polish
jakoszczedzacpieniadze.pl v7.4 template, heavily customised).

**Nothing is built yet.** As of 2026-08-25 the repo holds analysis only: no stack chosen,
no code, no spec, no tickets.

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
| `docs/spreadsheet/05-data-inventory.md` | What data actually exists, per month |
| `docs/spreadsheet/data/*.csv` | Machine-readable: 165 categories, 653 planned figures, 59 actual entries |
| `docs/research/cross-platform-stack.md` | Stack and sync options, 71 primary-source citations |

## The two facts that change most decisions

**It is a planner, not a tracker.** 653 planned figures were entered across 26 months.
Actual entries: 59 — every one of them income, recorded on day 1. The daily expense grid,
which is the template's centrepiece, was never used once. Do not assume transaction capture
is the core loop; the observed loop is setting a monthly plan across ~50 active categories.

**The operator does not write code.** They direct agents. The governing criterion for every
technical choice is *fewest moving parts the operator can be stranded by* — not what is
fastest, most popular, or most capable. An option that needs a non-programmer to rotate a
signing key or debug a native toolchain in two years is a bad option here, whatever its
other merits.

## Open questions — not yet decided

Do not treat these as settled, and do not let the research file's recommendation read as a
decision. It is a recommendation awaiting a grilling session.

- **Stack.** `docs/research/cross-platform-stack.md` recommends a PWA, runner-up Tauri v2
  wrapping the same frontend. Undecided.
- **Sync between desktop and Android.** The weakest part of the recommendation and probably
  the crux of the whole build. `syncthing-android` is archived; Drive/Dropbox do not keep a
  real local folder on Android; File System Access on Chrome Android 132 is documented but
  unverified on a real device.
- **Scope.** Which of the 165 category slots, and which of the spreadsheet's features, are
  actually wanted. The 10-slot-per-group ceiling is a known pain point worth removing.

## Conventions

Polish is the domain language — category names, month labels and UI text are Polish.
PLN formatting needs U+00A0 both as the grouping separator and before `zł`; Polish month
names need CLDR **stand-alone** forms (`Styczeń 2026`, not `Stycznia 2026`), which matters
because this app is almost entirely bare month labels.

## Agent skills

### Issue tracker

Issues live as markdown files under `.scratch/<feature-slug>/` in this repo — no remote tracker. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, used as-is, recorded as a `Status:` line in each issue file. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — one `CONTEXT.md` and one `docs/adr/` at the repo root. See `docs/agents/domain.md`.
