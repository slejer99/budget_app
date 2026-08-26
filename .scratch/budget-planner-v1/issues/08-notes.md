# 08 — Notes

**What to build:** The operator attaches free text to a line within a single month. This is
the field the spreadsheet's comment column was doing the job of — 237 entries — now freed to
be an actual note, because ticket 07 gave the names somewhere proper to live.

**Blocked by:** 04 — Edit a planned amount and save.

**Status:** ready-for-agent

- [ ] A note can be added, edited and removed on a line in a given month
- [ ] A note belongs to that month only and does not appear in any other
- [ ] Lines carrying a note are visibly marked, so the operator does not have to open each one to find out
- [ ] Notes imported from the spreadsheet display on the line and in the month they came from
- [ ] Notes work on the phone as well as the desktop
- [ ] Tests exercise note storage and month isolation through the core
