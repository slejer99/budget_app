# 11 — Purchases

**What to build:** The operator records individual spending — a few taps on the phone while
it is happening, or comfortably in bulk at the desktop while working through a bank
statement. Both matter: the operator asked for every capture mode.

Where a typed actual and logged purchases disagree, the typed figure wins and the gap is
shown. Nothing is ever silently reconciled, and nothing entered is ever thrown away.

**Blocked by:** 10 — Tracking: the switch and typed actual amounts.

**Status:** ready-for-agent

- [ ] A purchase can be recorded against a line, with a date and an amount
- [ ] Recording one on the phone takes a few taps and works in portrait — realistic while standing in a shop
- [ ] Recording several in one sitting at the desktop is comfortable
- [ ] A recorded purchase can be corrected or deleted
- [ ] A purchase's month is derived from its date
- [ ] A line's actual falls back to the sum of its purchases when no actual has been typed
- [ ] A typed actual takes precedence over the sum of purchases
- [ ] Where both exist, both figures and the difference between them are shown — for example, eleven purchases totalling 12 400 against a typed 15 000, with 2 600 unaccounted
- [ ] Purchases remain visible when a typed actual overrides them
- [ ] All of it is hidden when tracking is switched off, and unchanged when it is switched back on
- [ ] Tests exercise precedence, the fallback, the discrepancy figure, and month derivation from a purchase's date
