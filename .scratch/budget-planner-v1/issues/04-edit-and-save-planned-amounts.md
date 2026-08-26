# 04 — Edit a planned amount and save

**What to build:** The operator types a figure into a line, types arithmetic into another,
saves, and the file in Drive changes. Opening the app on the other device shows the new
figures. This is the first complete round trip through the app, and it is what makes the
thing usable at all.

Arithmetic matters more than it looks: the operator composes a mortgage figure from three
instalments and leaves the working visible. A plain number field would throw that away.

**Blocked by:** 02 — Pick the file and read a month plan.

**Status:** ready-for-agent

- [ ] A line's planned amount is editable directly on the line
- [ ] Plain numbers are accepted
- [ ] Arithmetic is accepted — `4912+1667+1667` displays as `8 246,00 kr`
- [ ] The typed expression is preserved and shown again when the line is reopened for editing, so one instalment can be adjusted without recomputing the total
- [ ] The doubled-operator form found in the operator's own history, `5531+2158++2158`, evaluates rather than failing
- [ ] Surrounding whitespace is tolerated
- [ ] Only `+` and `-` are supported; anything else is refused with a clear message
- [ ] Malformed input is refused visibly and never coerced to zero — a typo must not quietly remove money from the plan
- [ ] Saving writes the whole document to the picked file
- [ ] Group subtotals, income and expense totals, and unallocated all update as figures change
- [ ] Tests exercise the set-planned-amount command and the arithmetic evaluator through the core only
- [ ] Verified by hand: edit on the desktop, save, open on the phone, and see the change
