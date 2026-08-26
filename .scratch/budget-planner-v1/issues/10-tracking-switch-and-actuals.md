# 10 — Tracking: the switch and typed actual amounts

**What to build:** Spend tracking becomes real, but optional. One switch turns the whole
feature on and off. When it is on, the operator can type a single actual figure per line for
the month — "food ended up 15 000" — without itemising anything.

Switching off must make the app genuinely simpler, not merely quieter: the core omits the
data from the views it returns, rather than the interface concealing it. And switching off
must never delete anything.

**Blocked by:** 04 — Edit a planned amount and save.

**Status:** ready-for-agent

- [ ] A single switch, stored in the budget document, so it applies on both devices without being set twice
- [ ] With tracking on, one actual amount can be typed per line per month
- [ ] Planned and actual can be compared for a line and for a group
- [ ] Switching tracking off hides actual amounts everywhere
- [ ] Switching tracking off deletes nothing; switching it back on restores every figure unchanged
- [ ] Hiding is done by the core omitting the data from its views, not by the rendering layer concealing it
- [ ] Tests exercise the switch's effect on every view that can carry actuals, and the round trip of switching off and back on
