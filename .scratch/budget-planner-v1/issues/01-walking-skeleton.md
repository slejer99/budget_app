# 01 — Walking skeleton: build, deploy, install

**What to build:** A real, installable app that proves the whole delivery path before any
budgeting logic exists. The operator can install it to the Windows Start menu and to the
Android home screen, open it on either device, and switch the interface between Polish and
English. It shows only a placeholder — a month label and a sample amount — but it shows
them correctly formatted, which is the point: the formatting rules and the delivery path
are the risky parts, not the placeholder.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Builds with Node pinned to one LTS version, with the exact version recorded in the repo
- [ ] Published as static files to GitHub Pages from a public repository
- [ ] Installs to the Windows Start menu from Edge or Chrome and opens in its own window
- [ ] Installs to the Android home screen and opens as an app
- [ ] Works in portrait on a phone with no horizontal scrolling
- [ ] Interface language switch offers Polish and English and takes effect immediately
- [ ] Language choice persists across restarts, stored in the browser for now — ticket 02 moves it into the budget document
- [ ] Polish month labels use CLDR stand-alone forms: `Styczeń 2026`, never `Stycznia 2026`
- [ ] Amounts render as `1 234,00 kr`, with U+00A0 as the grouping separator and before `kr`, identically in both languages
- [ ] A plain-language Node maintenance page exists in the repo: how to install it, the exact version, how to rebuild the app, and what to do when a rebuild fails — written for someone who does not code
- [ ] Every user-facing string goes through the translation mechanism from this ticket onward. This is a standing rule for all later tickets; there is deliberately no "translate the app" ticket at the end
