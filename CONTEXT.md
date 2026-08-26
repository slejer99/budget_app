# budget_app

A personal monthly budget planner for one operator, replacing the household budget
spreadsheet at the repo root. The observed loop is **planning a month**; recording what
was actually spent is a feature the operator can switch on and off.

This glossary is the project's vocabulary. It is not a spec and holds no implementation
detail. Terms are added as they are resolved.

## Language

**Month plan**:
The complete set of planned figures for one calendar month. The unit the operator sits
down and produces.
_Avoid_: budget, sheet, month sheet

**Root list**:
The single master list of every line the operator budgets. A line exists once here, not
once per month. Renaming a line in the root list changes it everywhere, including in
history — past months show the new name.
_Avoid_: category tree, template, Wzorzec, catalogue

**Line**:
One entry in the root list — `sbab`, `Jedzenie dom`, `spotify`. Identified by its **group
plus its name**, so several groups may each hold a line called `Inne` and they remain
distinct. There is no ceiling on how many lines a group holds.
_Avoid_: category, slot, subcategory, item, position

**Group**:
The coarse bucket a line is filed under, for subtotals — `Jedzenie`, `Transport`,
`Spłata długów`. Inherited from the spreadsheet's 15 expense groups plus income, and
editable like lines are.
_Avoid_: category, section

**Planned amount**:
The figure the operator intends for a line in a given month. Always present — the primary
thing this app exists to hold. May be entered as arithmetic (`4912+1667+1667`), which is
stored as written and displayed as its result.
_Avoid_: budgeted, estimate, forecast

**Actual amount**:
What was really spent or received against a line in a month. One number per line. If the
operator types it directly it stands, even where purchases were also recorded — the
difference between the two is shown, never silently resolved.
_Avoid_: real, spent, realised, wykonanie

**Purchase**:
One individually recorded spend against a line, with its own date. Purchases may be
entered in the moment on the phone, in a batch at the desktop, or not at all. They sum
into a line's actual amount only where no actual amount was typed.
_Avoid_: transaction, entry, expense record

**Tracking**:
The switchable feature covering actual amounts and purchases. When off, all of it is
hidden and the app is a pure planner. Switching off never deletes anything.
_Avoid_: expense mode, actuals mode

**Note**:
Free text carried by a line in a particular month — the spreadsheet's comment column,
which was used 237 times. A note belongs to one month, unlike a line's name.
_Avoid_: comment, description, memo

**Unallocated**:
A month's planned income minus its planned expenses. Historically 14 000–59 000 every
month. It is reported, never enforced — the operator is not asked to drive it to zero.
_Avoid_: left to allocate, surplus, balance

**History**:
Every month plan ever recorded, from `Listopad2024` onward, imported in full from the
spreadsheet. A first-class feature, not an archive — it is what the operator consults
while planning the next month.
_Avoid_: archive, past data

**Operator**:
The single person who owns and edits the budget. Nobody else enters data, including the
partner whose salary appears in it.
_Avoid_: user, household, account

## Money and locale

**Amount**:
A quantity of money. Always **Swedish crowns (SEK)** — one currency throughout, no
conversion, no per-line currency, no exchange rate. The source spreadsheet formats cells
as `zł` (PLN), a leftover from the Polish template that does not reflect the data.
Written `1 234,00 kr` with a non-breaking space.
_Avoid_: PLN, złoty, zł, value

**Interface language**:
Polish or English, chosen by a single switch. Only the app's own words translate; line
and group names are whatever the operator typed and are never translated.

## Out of scope

**Net worth**: Account balances and debt principal (the spreadsheet's `STAN KONT`) are
deliberately not modelled. The sheet was built and never filled in.
