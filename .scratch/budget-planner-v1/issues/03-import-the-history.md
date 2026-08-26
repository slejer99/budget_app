# 03 — Import the 26 months

**What to build:** A one-off Python program, run once on the desktop, that turns the
spreadsheet at the repo root into the operator's real budget document. It is not part of the
app, and the app never learns that spreadsheets exist. After this ticket, the screen built in
ticket 02 shows two years of the operator's actual history.

The extraction under `docs/spreadsheet/` is the authority on what the workbook contains. Any
disagreement between the import and the extraction is an import bug.

**Blocked by:** 02 — Pick the file and read a month plan.

**Status:** ready-for-agent

- [ ] Imports every month from `Listopad2024` through `Grudzien26`
- [ ] A line is imported if it ever carried a planned amount, an actual entry, or a comment
- [ ] A group is imported if it holds at least one imported line, which drops `INNE 2` and `INNE 3`
- [ ] Unnamed slots holding money are named `Inne` where their group has no `Inne` — `Rozrywka` and `INNE 1`
- [ ] Unnamed slots holding money are named `Inne 2` where their group already has an `Inne` — `Transport`, `Opieka zdrowotna`, `Inne wydatki`
- [ ] In `Spłata długów`, `inne` is renamed `Inne 2` and the unnamed slot becomes `Inne 3`
- [ ] The existing `Inne` and `inne` lines in `Spłata długów` are **not** merged — they hold different money in the same months, and merging would fuse their history irreversibly
- [ ] Comments are imported as notes, on the line and in the month they appeared in
- [ ] Planned cells holding arithmetic are imported as the expression, not as its result
- [ ] Recorded income entries are imported as purchases on the day they were recorded
- [ ] The 2021 month anchor, the weekday headers, the today marker, the `#REF!` yearly rollup and the `STAN KONT` sheet are all ignored
- [ ] Verified against the extraction: the per-month planned totals match `docs/spreadsheet/05-data-inventory.md` exactly
- [ ] Verified against the extraction: 653 planned figures, 237 notes, 59 recorded income entries
- [ ] The resulting document opens in the app and displays correctly on both devices
