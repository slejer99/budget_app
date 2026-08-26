# 07 — The root list: lines and groups

**What to build:** The operator edits the master list of what they budget. No ceiling on how
many lines a group holds, and no fixed structure inherited from the template. Renaming a line
changes it everywhere, including in history — which is the whole reason the workarounds in
the spreadsheet's comment column can finally become real names.

This is the ticket that removes the constraint that caused the original problem. A line's
internal identity never changes; only its name and its group do. That is what makes renaming
retroactive without rewriting anything.

**Blocked by:** 04 — Edit a planned amount and save.

**Status:** ready-for-agent

- [ ] A line can be added to any group, with no limit on how many that group holds
- [ ] A line can be renamed, and the new name appears in every month including past ones
- [ ] A line can be moved to a different group, keeping all of its history
- [ ] A line with no history can be deleted
- [ ] Deleting a line that has history is refused, or requires explicit confirmation — two years of figures must not vanish by mistake
- [ ] Two lines with the same name in the same group are refused
- [ ] The same name in different groups is permitted, so `Transport → Inne` and `Jedzenie → Inne` can both exist
- [ ] Groups can be added, renamed and deleted
- [ ] A line's internal identity survives both renaming and moving between groups
- [ ] Tests exercise: a rename reflected in past months, the uniqueness rule in both directions, a group move preserving history, and refusal to delete a line with history
