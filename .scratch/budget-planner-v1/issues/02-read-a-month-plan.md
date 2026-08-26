# 02 — Pick the file and read a month plan

**What to build:** On either device the operator picks their budget file in Google Drive and
sees a month plan: every line that has a planned amount, its group's subtotal, total planned
income, total planned expenses, and the unallocated figure. Read-only — nothing can be
changed yet.

This ticket establishes the budget core and the document shape, and it is the ticket that
proves Chrome on Android can genuinely reach a file in Drive. If that turns out not to work
in practice, stop and raise it rather than working around it: ADR-0002 depends on it.

**Blocked by:** 01 — Walking skeleton.

**Status:** ready-for-agent

- [ ] The operator picks a file through the platform's own file picker, on Windows and on Android
- [ ] Re-picking the file on app start is presented as a normal step, not as an error — the permission is not assumed to survive a browser restart
- [ ] A month plan displays: line names, planned amounts, group subtotals, total planned income, total planned expenses, unallocated
- [ ] Lines with no planned amount are hidden by default, with a control to reveal them
- [ ] A line is identified by its group plus its name; the same name in different groups displays as two distinct lines
- [ ] The budget core is a pure module — no file access, no network, no rendering, and no clock; the current date is passed in
- [ ] Amounts are held as exact decimal values, not binary floating point, so that summing two years of figures does not drift
- [ ] The interface language moves out of browser storage and into the budget document
- [ ] Tests exercise the month view and amount formatting through the core's public surface only, never its internals, and mock nothing
- [ ] Verified by hand: a small hand-made budget file placed in Drive opens and displays correctly on both the desktop and the phone
