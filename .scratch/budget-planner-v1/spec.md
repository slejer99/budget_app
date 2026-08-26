# budget_app v1 — the planner

Status: ready-for-agent

Design settled in the grilling session of 2026-08-25/26. Vocabulary: `CONTEXT.md`.
Binding decisions: `docs/adr/0001-web-app-with-build-step.md`,
`docs/adr/0002-one-json-file-in-google-drive.md`. Do not re-derive either.

## Problem Statement

The operator plans their household money in a heavily customised Polish spreadsheet
template. It works, badly, and the ways it fails are structural rather than cosmetic.

The category list is a fixed grid — 15 income slots and 15 groups of exactly 10 — and
several groups are full. When a new commitment appears there is nowhere to put it, so the
operator has been typing money into unnamed slots and writing the real name in the comment
column instead. That column now holds 237 entries: `sbab`, `pko`, `akasa`, `tablet`,
`auto`. The names of the things being budgeted live in a field never meant to hold them,
and the labels on screen say `Inne` and `.`.

Nothing that summarises works. The yearly rollup has returned `#REF!` in every cell for
roughly two years, because the month sheets were renamed and its formulas were not. Every
month sheet believes it is May 2021, so the weekday headers, the today marker and the
days-remaining count are wrong on all 26 of them. There is no way to ask what a line has
cost over the last six months — which is the question the operator is actually answering
when they plan.

There is no phone. The workbook lives on a Windows desktop, and a 165-row spreadsheet with
a 31-column daily grid is not usable on Android.

And it only works on the desktop the file happens to be on.

## Solution

A monthly budget planner, installed as an app on both the Windows desktop and the Android
phone, holding all its data in one document in the operator's Google Drive.

**The root list replaces the fixed grid.** Every line the operator budgets exists once, in
one editable list, with no ceiling on how many a group holds. Renaming a line renames it
everywhere including in history, so the workarounds in the comment column become real
names, and the note field goes back to being a note.

**Planning is the core loop and it is fast.** A month is created from the previous one,
already carrying its lines and figures; the operator corrects what has changed. Planned
amounts accept arithmetic, so `4912+1667+1667` stays visible as three instalments while
displaying as one figure.

**History is a feature, not an archive.** All 26 months come across, and the reports answer
what income, expenses, unallocated and each group's total have been over any range the
operator picks — from the last few months to everything.

**Tracking is optional and switchable.** The operator can record what was actually spent —
as it happens on the phone, in a batch at the desktop, or as one typed figure per line at
month end — and can switch the whole feature off, which hides it and deletes nothing.

**Two devices, one file, no server.** The desktop reaches the document as an ordinary file
through Google Drive for Desktop; the phone reaches the same file through Chrome's file
picker. Nothing to log into, nothing that expires, nothing that pauses for inactivity.

## User Stories

### Planning a month

1. As the operator, I want to open the app on the current month's plan, so that the thing I do most often needs no navigation.
2. As the operator, I want to see every line that has a planned amount this month with its figure, so that I can read my whole plan at once.
3. As the operator, I want lines with no planned amount hidden by default, so that a plan of 25 lines does not sit inside a list of 59.
4. As the operator, I want to reveal the hidden lines on demand, so that I can add one back without leaving the month.
5. As the operator, I want to set a line's planned amount by typing into it directly, so that planning is typing numbers and nothing else.
6. As the operator, I want to type arithmetic such as `4912+1667+1667` into a planned amount, so that a figure composed of instalments keeps its working.
7. As the operator, I want a planned amount entered as arithmetic to display as its result, so that the plan reads as figures.
8. As the operator, I want to see and re-edit the original expression when I return to that line, so that next month I can adjust one instalment rather than recompute the total.
9. As the operator, I want obviously malformed arithmetic to be refused visibly rather than silently treated as zero, so that a typo never quietly removes money from my plan.
10. As the operator, I want each group's subtotal shown, so that I can see what `Spłata długów` costs without adding it up.
11. As the operator, I want total planned income and total planned expenses shown, so that I know the shape of the month.
12. As the operator, I want the unallocated amount shown as information, so that I can see what is uncommitted without being asked to drive it to zero.
13. As the operator, I want to move between months freely, so that I can look at what I did in March while planning September.
14. As the operator, I want planning to work identically on the phone, so that a correction away from my desk does not have to wait.

### The root list

15. As the operator, I want one master list of every line I budget, so that a line is defined once rather than once per month.
16. As the operator, I want to rename a line, so that a slot I once called `Inne` can become what it actually is.
17. As the operator, I want a rename to apply to every month including past ones, so that history reads in today's language.
18. As the operator, I want to add a line to any group with no limit on how many that group holds, so that a new commitment never has to displace an existing one.
19. As the operator, I want to be prevented from creating two lines with the same name in the same group, so that my own list never becomes ambiguous.
20. As the operator, I want the same name to be allowed in different groups, so that `Transport → Inne` and `Jedzenie → Inne` can both exist.
21. As the operator, I want to rename a group, so that `INNE 1` can become something meaningful.
22. As the operator, I want to add and remove groups, so that the structure is mine rather than the template's.
23. As the operator, I want deleting a line that has history to be refused or to require explicit confirmation, so that I cannot erase two years of figures by mistake.
24. As the operator, I want to move a line to a different group, so that a misfiled commitment can be corrected without losing its history.
25. As the operator, I want lines to keep their own identity behind the scenes, so that renaming and regrouping never breaks the link to past figures.

### Creating a month

26. As the operator, I want to choose how a new month starts, so that the app fits how I am working rather than the reverse.
27. As the operator, I want to start a month as a full copy of the previous one, so that my usual plan is already there and I only correct what changed.
28. As the operator, I want to start a month with the same lines but no amounts, so that I can rebuild a plan deliberately.
29. As the operator, I want to start a month empty, so that an unusual month is not shaped by the last one.
30. As the operator, I want to create a month ahead of the current one, so that I can plan next year the way I already do.
31. As the operator, I want to be warned before creating a month that already exists, so that I cannot silently overwrite a plan.

### Notes

32. As the operator, I want to attach free text to a line within a single month, so that I can record that this month's `Inne` was paint.
33. As the operator, I want a note to belong to that month only, so that a one-off explanation does not attach itself to every month.
34. As the operator, I want lines carrying a note to be marked visibly, so that I do not have to open each one to find out.
35. As the operator, I want my 237 existing comments imported as notes, so that nothing I wrote in two years is lost.

### Tracking — switching it on and off

36. As the operator, I want a single switch that turns spend tracking on and off, so that I can use this as a pure planner when I want to.
37. As the operator, I want switching tracking off to hide actual amounts and purchases everywhere, so that the app is genuinely simpler and not just quieter.
38. As the operator, I want switching tracking off to delete nothing, so that turning it back on restores everything I recorded.
39. As the operator, I want the switch to apply to both devices through the document, so that I do not have to set it twice.

### Recording what was spent

40. As the operator, I want to record a single purchase against a line with its date and amount, so that I can capture spending as it happens.
41. As the operator, I want to record a purchase from the phone in a few taps, so that doing it while standing in a shop is realistic.
42. As the operator, I want to record several purchases in one sitting at the desktop, so that working through a bank statement is not painful.
43. As the operator, I want to type one actual amount for a line for the whole month, so that I can record an outcome without itemising it.
44. As the operator, I want a typed actual amount to take precedence over the sum of that line's purchases, so that the more accurate figure is the one that counts.
45. As the operator, I want to see the gap when a typed actual and the logged purchases disagree, so that I know how much went unrecorded.
46. As the operator, I want purchases to remain visible even when a typed actual overrides them, so that nothing I entered is thrown away.
47. As the operator, I want to correct or delete a purchase I entered wrongly, so that a mistyped figure is not permanent.
48. As the operator, I want a line's actual to fall back to the sum of its purchases when I have typed nothing, so that logging purchases alone is enough.
49. As the operator, I want to compare planned against actual for a line and for a group, so that I can see where the plan and reality parted company.

### Reports

50. As the operator, I want to choose the range a report covers, from the last few months up to my entire history, so that I can look at trends at whatever scale I need.
51. As the operator, I want total income per month across that range, so that I can see how my income has moved.
52. As the operator, I want total expenses per month across that range, so that I can see whether my planning is growing.
53. As the operator, I want the unallocated amount per month across that range, so that I can see how much has been going uncommitted.
54. As the operator, I want each group's total per month across that range, so that I can watch `Spłata długów` come down over two years.
55. As the operator, I want reports to cover planned figures whether or not tracking is on, so that the reports work in a plan-only app.
56. As the operator, I want reports to show actuals alongside planned when tracking is on, so that switching tracking on makes the reports richer rather than different.
57. As the operator, I want a report over a range where some months are missing to handle the gaps plainly, so that a month I never planned does not distort the picture.

### History and the import

58. As the operator, I want all 26 months from November 2024 onward present on first use, so that the app is immediately more useful than the spreadsheet.
59. As the operator, I want every planned figure to match what the spreadsheet held, so that I can trust the import without re-checking it myself.
60. As the operator, I want arithmetic expressions preserved through the import, so that the mortgage line still shows its three instalments.
61. As the operator, I want my income entries preserved, so that the actuals I did record are not lost.
62. As the operator, I want the money currently sitting in unnamed slots preserved under readable names, so that no figure arrives attached to a line called `.`.
63. As the operator, I want the import to run once and be done, so that there is no ongoing dependency on the spreadsheet.

### The file, and two devices

64. As the operator, I want all my data in one file in my Google Drive, so that I know where it is and can copy it myself.
65. As the operator, I want the desktop to reach that file as an ordinary file, so that it works the way every other document on my computer works.
66. As the operator, I want the phone to open the same file, so that both devices see one budget.
67. As the operator, I want to be told when the copy in Drive is newer than the one I am looking at, so that I do not overwrite something I have not seen.
68. As the operator, I want to choose between overwriting and loading the newer copy when that happens, so that the decision is mine.
69. As the operator, I want no prompt at all when there is nothing to lose, so that saving is silent in the ordinary case.
70. As the operator, I want the previous version kept beside the file whenever it is overwritten, so that a wrong choice is recoverable.
71. As the operator, I want only the most recent handful of those kept, so that the folder does not fill up over years.
72. As the operator, I want to pick the file when the app cannot remember my permission, so that a re-grant is a normal step rather than an error.
73. As the operator, I want the app to open read-only and show me the last budget it saw when it cannot reach the file, so that a lost connection still answers "what did I budget for food?".
74. As the operator, I want editing plainly disabled rather than silently failing in that state, so that I never believe I have saved something I have not.

### Installing, language and money

75. As the operator, I want to install the app to my Windows Start menu, so that it opens like a program rather than a bookmark.
76. As the operator, I want to install it to my Android home screen, so that it opens like an app.
77. As the operator, I want it to work on the phone in portrait without horizontal scrolling, so that it is genuinely usable there.
78. As the operator, I want to switch the interface between Polish and English, so that I can read it in whichever language suits me.
79. As the operator, I want my line and group names left exactly as I typed them when I switch language, so that the app never mangles my own words.
80. As the operator, I want Polish month names in their stand-alone form, so that a bare month label reads as `Styczeń 2026` and not `Stycznia 2026`.
81. As the operator, I want every amount shown in Swedish crowns as `1 234,00 kr`, so that the figures match my bank.
82. As the operator, I want my language choice remembered, so that I set it once.

## Implementation Decisions

### One seam: the budget core

All logic lives in a single pure module — the **budget core**. It takes a budget document
plus a command and returns a new budget document, or takes a document plus a query and
returns a computed view. It performs no file access, no network access, no rendering, and
reads no clock; the current date is passed in.

Everything with a decision in it belongs here: root list and group edits, month creation,
planned-amount entry and arithmetic evaluation, notes, the tracking switch, purchases,
actual amounts and discrepancy, all reports, and the sync decision.

Everything outside it is a deliberately thin adapter with no branching worth testing: the
storage adapter that performs the actual reads and writes, and the rendering layer. The
goal is one seam, not three; keeping the sync *decision* inside the core is what allows the
storage adapter to stay dull.

### The document

One JSON document holds everything: the root list of groups and lines, every month plan,
every purchase, the tracking switch, the interface language, and the sync metadata.

- A **line** carries a stable internal identifier that never changes. Its name and its
  group are attributes. Month plans, purchases and notes reference the identifier. This is
  what makes renaming retroactive with no rewriting: nothing stores the name but the line.
- The operator-facing identity of a line is **group plus name**, which must be unique
  within a group. Across groups, duplicates are allowed and expected.
- A **month plan** is a set of entries keyed by line identifier, each holding a planned
  amount, an optional typed actual amount, and an optional note.
- A **planned amount** stores both what was typed and its evaluated value. Where the
  operator typed a plain number the two coincide. The evaluator supports `+` and `-` over
  decimal numbers, tolerates surrounding whitespace and repeated operators — the history
  contains `5531+2158++2158` — and rejects anything else with a visible error rather than
  defaulting to zero.
- A **purchase** carries a line identifier, a date and an amount. Purchases are stored as a
  flat list, not nested under months; the month a purchase belongs to is derived from its
  date.
- **Unallocated** is computed, never stored.
- The document carries a **last-modified timestamp** and a **device tag**, which are the
  only inputs the sync decision needs beyond the file's own state.

### Amounts

Amounts are Swedish crowns throughout. There is no currency field, no exchange rate and no
conversion; ADR-0002 and `CONTEXT.md` both fix this. Amounts are held as exact decimal
values, not binary floating point, so that summing two years of figures does not drift.
Formatting is `1 234,00 kr`, with U+00A0 as the grouping separator and before `kr`, in both
interface languages.

### Tracking

A single document-level switch. When off, the core omits actual amounts, purchases and
discrepancies from every view it returns, so hiding is not a rendering concern. Nothing is
deleted, and switching back on restores every stored purchase and typed actual unchanged.

A line's actual amount resolves as: the typed actual if one exists, otherwise the sum of
that line's purchases in that month, otherwise absent. Where both a typed actual and
purchases exist, the core returns both figures and their difference, and never reconciles
them silently.

### Month creation

Three modes, chosen by the operator each time: full copy of the source month including
amounts; same lines with amounts cleared; empty. Notes are not carried forward by any mode
— a note belongs to its month. Creating over an existing month requires confirmation.

### Reports

Computed over a month range. Four series per month: total income, total expenses,
unallocated, and one total per group. When tracking is on, each series is also produced for
actual amounts. Months absent from the range are reported as absent rather than as zero, so
that a gap is visible rather than looking like a month of no spending.

### Sync

Whole-document writes. The sync decision is a pure function in the core: given the document
in hand and the metadata of the document in the file, it returns write, prompt, or load. It
returns prompt only when the file is newer than what the operator loaded — the only moment
anything can be lost. The storage adapter obeys the answer and does nothing else.

Before any overwrite, the adapter copies the existing file aside in the same folder under a
timestamped name, and prunes to roughly the most recent twenty.

The phone holds no local copy. When the file is unreachable, the app opens read-only,
displaying the last document it loaded, with editing disabled visibly. File System Access
permissions are not assumed to survive a browser restart on either platform; re-picking the
file is a designed step in opening the app, not an error path.

### The importer

A one-off Python program using `openpyxl`, run once on the desktop, producing the initial
document. It is not part of the app and the app has no knowledge of spreadsheets.

Import rules:

- A line is imported if it ever carried a planned amount, an actual entry, or a comment. A
  group is imported if it has at least one imported line, which drops `INNE 2` and `INNE 3`.
- Unnamed slots that carry money are named `Inne` where their group has no `Inne`, and
  `Inne 2` where it does. Specifically: `Rozrywka` and `INNE 1` take `Inne`; `Transport`,
  `Opieka zdrowotna` and `Inne wydatki` take `Inne 2`.
- `Spłata długów` is the exception, having both `Inne` and `inne` already: `inne` is renamed
  `Inne 2` and its unnamed slot becomes `Inne 3`. The two existing lines are **not** merged
  — they hold different money in the same months and merging would fuse their history
  irreversibly.
- Comments are imported as notes on the line and month they appeared in.
- Planned cells holding arithmetic are imported as the expression, not the result.
- Actual entries are imported as purchases on their recorded day.
- The 2021 month anchor, the weekday headers, the today marker, the `#REF!` yearly rollup
  and the `STAN KONT` sheet are all ignored.

### Interface

Polish and English behind one switch, stored in the document. Only the app's own strings
translate; line names, group names and notes are operator-typed and never translated.
Polish month names use CLDR stand-alone forms. The layout must work in portrait on a phone
without horizontal scrolling, since purchase capture happens there.

### Build and delivery

Per ADR-0001: built with Node pinned to one LTS version, deliberately not updated on a
schedule; published as static files to GitHub Pages from a public repository; installed as
a PWA on both devices. A plain-language Node maintenance page is a deliverable of this
spec, not an afterthought — install, exact version, how to rebuild, and what to do when a
rebuild fails.

## Testing Decisions

**What a good test looks like here.** A test constructs a budget document, issues a command
or a query through the budget core, and asserts on the document or view that comes back. It
never reaches into internal structure, never asserts on how a total was reached, and never
mocks anything — the core has no collaborators to mock. A test that would break when the
core is restructured without changing its answers is a bad test.

**There is no prior art.** The repository contains no code. This spec establishes the
pattern, and later work should follow it rather than introducing a second style.

**What is tested.** The budget core, and only the budget core:

- Root list: renaming a line and observing every month including past ones reflect it;
  duplicate names rejected within a group and permitted across groups; adding beyond ten
  lines in a group succeeding; moving a line between groups preserving its history;
  deleting a line with history being refused.
- Month creation: all three modes; notes not carried forward; creating over an existing
  month requiring confirmation.
- Planned amounts: plain numbers; `4912+1667+1667`; the doubled-operator case
  `5531+2158++2158`; whitespace; malformed input rejected rather than coerced to zero; the
  typed expression surviving a round trip.
- Tracking: purchases and actuals absent from views when off and unchanged when switched
  back on; a typed actual taking precedence; the discrepancy figure; falling back to the sum
  of purchases; a purchase's month derived from its date.
- Reports: the four series over a range; absent months reported as absent rather than zero;
  actual series appearing only when tracking is on.
- Sync decision: write when the file is unchanged; prompt when the file is newer; load when
  the operator chooses it; the device tag not causing a prompt against the operator's own
  last write.
- Amounts: summing two years without drift; formatting with non-breaking spaces in both
  languages.

**What is not unit-tested.** The storage adapter and the rendering layer, which are kept
thin precisely so this is defensible. They are exercised by hand on both devices: install on
Windows and Android, pick the file, save, overwrite, decline an overwrite, restore from a
kept version, and open with the file unreachable.

**How the import is verified.** Once, by comparison against the existing extraction rather
than by unit tests: the imported document must reproduce the per-month planned totals in
`docs/spreadsheet/05-data-inventory.md` exactly, along with 653 planned figures, 237 notes
and 59 recorded income entries. Any discrepancy is an import bug, and the extraction is the
authority.

## Out of Scope

- **Net worth.** Account balances and debt principal — the spreadsheet's `STAN KONT`. Built
  in the template, never filled in, explicitly excluded in `CONTEXT.md`.
- **The `CAŁY ROK` yearly grid.** Superseded by the reports. It has been broken for two
  years and was not missed.
- **Any currency but Swedish crowns.** No PLN, no exchange rate, no per-line currency. This
  was raised, considered and withdrawn by the operator.
- **A second person editing.** The partner's salary appears in the budget; the partner does
  not use the app.
- **Automatic merging of concurrent edits.** No CRDT. Last write wins, guarded by a prompt
  and by kept versions.
- **A local copy on the phone.** Deliberately declined; the phone talks to the file directly
  and is read-only without it.
- **The 31-column daily grid.** The spreadsheet's centrepiece, never used once in 26 months.
- **Charts.** Reports present figures. Visualisation is a plausible later addition and is not
  part of this spec.
- **Importing further spreadsheets.** The importer runs once. A future import is a small job
  for an agent, not a feature.
- **Native applications and app stores.** Ruled out in ADR-0001.
- **Reminders, notifications and budget alerts.** Nothing in two years of use suggests these
  are wanted.

## Further Notes

**The operator does not write code.** Every choice here was measured against *fewest moving
parts the operator can be stranded by*. Nothing in this design expires: no signing key, no
developer account, no certificate, no free tier that pauses on inactivity. Anything
introduced later that fails that test should be challenged before it is built.

**Google Drive for Desktop is installed and mounted at `G:`**, with the operator's `Mój
dysk` folder in it. The budget file's exact location within it has not yet been chosen.

**Chrome on Android reaching Drive is verified** on the operator's own phone, 2026-08-26 —
the picker lists Drive and the file can be browsed to. This was the largest open risk in the
design and it is closed. The operator must select the file rather than the app opening it
silently.

**The observed use is planning, not tracking.** 653 planned figures against 59 actual
entries, all of them income, all on day one, across 26 months. Tracking is built because the
operator asked for it, and it is switchable because the evidence says it may go unused. If
after some months it is genuinely never used, removing it should be an easy decision, and the
one-seam design is what keeps it easy.

**Two answers changed during grilling in ways that added work**: purchase capture on the
phone, and a prompt before overwriting. Both were deliberate choices made against a stated
recommendation. They are recorded here so that a future reader does not mistake them for
accidents and quietly simplify them away.
