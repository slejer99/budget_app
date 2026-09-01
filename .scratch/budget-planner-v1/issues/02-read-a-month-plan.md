# 02 — Pick the file and read a month plan

**What to build:** On either device the operator picks their budget file in Google Drive and
sees a month plan: every line that has a planned amount, its group's subtotal, total planned
income, total planned expenses, and the unallocated figure. Read-only — nothing can be
changed yet.

This ticket establishes the budget core and the document shape, and it is the ticket that
proves Chrome on Android can genuinely reach a file in Drive. If that turns out not to work
in practice, stop and raise it rather than working around it: ADR-0002 depends on it.

**Blocked by:** 01 — Walking skeleton.

**Status:** ready-for-human

- [ ] The operator picks a file through the platform's own file picker, on Windows and on Android
- [x] Re-picking the file on app start is presented as a normal step, not as an error — the permission is not assumed to survive a browser restart
- [x] A month plan displays: line names, planned amounts, group subtotals, total planned income, total planned expenses, unallocated
- [x] Lines with no planned amount are hidden by default, with a control to reveal them
- [x] A line is identified by its group plus its name; the same name in different groups displays as two distinct lines
- [x] The budget core is a pure module — no file access, no network, no rendering, and no clock; the current date is passed in
- [x] Amounts are held as exact decimal values, not binary floating point, so that summing two years of figures does not drift
- [~] The interface language moves out of browser storage and into the budget document — read from the document; **writing it back needs saving and moved to ticket 04**
- [x] Tests exercise the month view and amount formatting through the core's public surface only, never its internals, and mock nothing
- [ ] Verified by hand: a small hand-made budget file placed in Drive opens and displays correctly on both the desktop and the phone

## Comments

**2026-09-01 — built and reviewed twice. Two boxes need the operator, one moved to 04.**

Done and covered by tests (57 now pass, from 15):

- **The budget core reads a document and computes a month.** `parseBudgetDocument` takes the
  text of a file and returns either a document or a named problem; `monthPlanOf` turns that
  into the month the operator sees. Group subtotals, planned income, planned expenses and
  unallocated all come out of the core, not the screen.
- **Amounts stay whole öre.** Sixty lines of ten öre come to exactly `6,00 kr`. The parser
  refuses a fractional öre rather than rounding it.
- **A line is its group plus its name.** Two lines called `Inne` in different groups are two
  lines; the same name twice in one group is refused, and so are two groups sharing a name.
- **Hiding is a core decision, not a rendering one.** The view returns the planned lines and
  all the lines, both in root-list order, so revealing what is hidden slots the lines into
  place instead of appending them.
- **A hand-made budget file** sits at `docs/sample-budget.json` — the operator's group names,
  entirely invented figures. A test reads the real file so the two cannot drift apart.

**The interface language is half of this ticket and half of ticket 04.** It is read from the
document, and browser storage is no longer where it lives. But this ticket is read-only, so a
choice made on the switch cannot reach the file. Deleting the stored copy outright would have
taken away something ticket 01 shipped — set the language once and it stays set — so a
remembered choice deliberately outranks the document until ticket 04 can save it. Ticket 04
now carries that box. Without it the switch would have been orphaned across the whole backlog.

**Raised rather than worked around, per this ticket's own instruction.** Chrome on Android has
no File System Access API. It can hand the app a read-only copy of a file the operator picks —
which is enough for this ticket, and the Android picker does list Drive. It cannot hand back a
writable handle. So ADR-0002's assumption that both devices write to one file in Drive is
proven for the desktop and still open for the phone. That question belongs to ticket 04, and it
should not be discovered there.

**Two reviews, twenty-odd defects.** Two critics with no memory of writing the code went
through it. Between them they found: the language regression above; the sample file's own
arithmetic wrong by 16 kr; a file Drive had not yet downloaded failing silently; notes readable
only on hover, on a device with no hover; tap targets of 37 px behind a comment claiming 44;
`Nierozdysponowane` unable to wrap on a 360 px phone; two assertions that could not fail; and
eight parser branches with no test. All fixed.

**Not verified: anything visual.** The browser extension was disconnected throughout, so no
screen in this ticket has been drawn or looked at by anyone. The month view, the reveal
control, the arrows, dark mode and a 360 px viewport are all unchecked.

**Checked on the desktop, 2026-09-01.** The operator opened the app on Windows, picked
`docs/sample-budget.json` through Chrome's own file picker, and confirmed the month reads
correctly. So the File System Access path works, and the month view is right by the only
judgement that counts. Neither box is ticked yet: both name the phone as well.

Left, in one step:

1. **Put `docs/sample-budget.json` in Drive and open it on the phone.** That is the only real
   test of whether Android's picker hands over a file from Drive, and ADR-0002 rests on it.

**Open question for the operator.** The Polish interface calls a line a *pozycja*
(`Pokaż pozycje bez kwoty`). `CONTEXT.md` lists "position" among the words to avoid for a
**Line**, though that list reads as being about English. `pozycja` is the natural Polish, so it
was used — but the glossary should say so either way rather than leaving it decided inside a
button label.
