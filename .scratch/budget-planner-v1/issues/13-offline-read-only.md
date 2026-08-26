# 13 — Offline read-only on the phone

**What to build:** When the phone cannot reach the file in Drive, the app is still worth
opening. It shows the last budget it saw, clearly marked as possibly out of date, and refuses
edits visibly rather than failing silently.

The operator chose a phone that talks to the file directly rather than keeping its own copy,
knowing it costs them capture when offline. This ticket makes that cost as small as it can be:
a blank screen answers nothing, but last month's plan at least answers "what did I budget for
food?" while standing in a shop.

**Blocked by:** 05 — Safe saving: the newer-file prompt and kept versions.

**Status:** ready-for-agent

- [ ] When the file is unreachable, the app opens showing the last budget document it loaded
- [ ] The state is clearly marked, so the operator knows the figures may not be current
- [ ] Editing is visibly disabled rather than failing silently
- [ ] The operator is never led to believe something was saved when it was not
- [ ] When the file becomes reachable again, recovering does not require reinstalling the app or re-picking the file beyond the ordinary permission step
- [ ] Verified by hand on the phone with the connection turned off, then turned back on
