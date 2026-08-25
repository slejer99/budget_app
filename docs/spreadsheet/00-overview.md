# `Kopia 63-Szablon-budzet-domowy-2021-PLN-v7-4.xlsx` — extraction

A readable rendering of the household budget workbook this project is being built from.
Generated from the file at the repo root; the `.xlsx` remains the primary source.

The workbook is the widely-circulated Polish household budget template from
`jakoszczedzacpieniadze.pl` (v7.4, 2021 edition), customised by the user.

## Contents

| File | What's in it |
|---|---|
| `01-categories.md` | The category tree — 15 income slots, 15 expense groups × 10 slots |
| `02-month-template.md` | Anatomy of a month sheet: row map, column map, every formula shape |
| `03-caly-rok.md` | The yearly rollup, and why it is currently dead |
| `04-stan-kont.md` | Accounts & debts / net worth sheet (never filled in) |
| `05-data-inventory.md` | What data actually exists, per month |
| `data/*.csv` | Machine-readable: categories, planned figures, actual entries |

## Structure

31 sheets, ~50,400 non-empty cells, 56 charts (28 pie + 28 bar — one pair per month sheet
plus the yearly one), 909 table definitions.

| Sheet | Role |
|---|---|
| `Wzorzec kategorii` | **The category definition.** Every other sheet pulls its labels from here by cell reference. |
| `PRZYKŁAD` | A worked example month shipped with the template. |
| `STAN KONT` | Account balances and debts, month by month. Never used. |
| `CAŁY ROK` | Yearly rollup across 12 month columns. Currently `#REF!` throughout. |
| 26 month sheets | `Listopad2024` → `Grudzien26`. Structurally identical to one another. |

## The data model, in one paragraph

A **category** is a fixed slot: 15 income slots plus 15 expense groups of exactly 10 slots
each, 165 in total. Unused slots hold `.` and still occupy a row. Each month sheet is a
**165 × 31 grid** — every category row crossed with every day of the month — plus a summary
block to its left holding, per category, a **planned** amount (typed), an **actual** amount
(`=SUM` across that row's 31 day cells), the difference, and a % realisation. Group totals sum
their 10 slots; the month total sums the 15 group headers. `CAŁY ROK` repeats the same shape
with the 31 day columns replaced by 12 month columns. The budget year lives in a single cell,
`'CAŁY ROK'!D2`, and every month sheet derives its dates from it.

## Findings that should shape the app

**1. It is a planner, not a tracker.** 653 planned figures have been entered across 26 months.
Actual entries: **59** — and every one of them is *income*, recorded on day 1. Not one expense
has ever been typed into the daily grid. Every dashboard figure that depends on actual spending
— headroom, average per day, % of income spent, all 15 realisation bars — has therefore never
displayed a real number. Whatever the template was designed for, the observed use is monthly
planning. See `05-data-inventory.md`.

**2. The yearly rollup is broken and has been for a long time.** `CAŁY ROK` still references the
template's original sheet names (`Styczeń`, `Luty`, `Marzec`, …). The month sheets were renamed to
`Styczen2025`-style names, so all 12 month columns and every year total resolve to `#REF!`.
See `03-caly-rok.md`.

**3. Every month sheet thinks it is May 2021.** The month anchor is
`G1 = DATE('CAŁY ROK'!D2, 5, 1)` — identical on all 26 sheets, with the month hardcoded to `5`
and the year read from `D2`, which still says `2021`. So the weekday header row, the `DZIŚ`
marker, the days-remaining count and the month-progress bar are wrong on every sheet. The sheet
*name* is the only thing that says which month it is, and nothing computes from it.

**4. The fixed 10-slot ceiling is a real constraint.** Adding an eleventh subcategory to a group
means restructuring all 31 sheets. Several groups are already full, and some slots hold
throwaway names (`rzesy`, `tance`, `szwedzki`, `psy`, `inne`, `klarna`) that look like the user
running out of room and reusing whatever was free.

**5. Planned cells are used as a calculator.** 31 planned cells hold arithmetic the user typed
(`=5269+1932+1932`, `=4584+179+200+45`) rather than a single number — a planned figure composed
of parts, with the working left in place. A plain numeric field would throw that away.

**6. Net worth is aspirational.** `STAN KONT` is fully built and entirely zero.

## Regenerating

Extraction scripts are not checked in; the outputs above are the artefact. To regenerate,
re-derive from the `.xlsx` with `openpyxl` (`pip install openpyxl`), reading each sheet twice —
`data_only=False` for formulas, `data_only=True` for cached values.
