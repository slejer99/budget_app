# 06 — Months: moving between them and creating them

**What to build:** The operator moves freely between months, and creates new ones in
whichever of three ways suits the month they are planning. Copying forward is what they
already do by hand — `Luty26` is a character-for-character copy of `Grudzien2025` — so it
should be the easy path, but not the only one.

**Blocked by:** 04 — Edit a planned amount and save.

**Status:** ready-for-agent

- [ ] The app opens on the current month by default
- [ ] The operator can navigate to any month that exists, forwards and backwards
- [ ] A new month can be created as a full copy of another, including its planned amounts
- [ ] A new month can be created with the same lines but amounts cleared
- [ ] A new month can be created empty
- [ ] The operator chooses which of the three each time — none is forced
- [ ] Notes are not carried forward by any of the three modes; a note belongs to its own month
- [ ] Creating a month that already exists requires explicit confirmation
- [ ] Months can be created ahead of the current one, so next year can be planned in advance
- [ ] Tests exercise all three creation modes, the confirmation path, and that notes do not travel
