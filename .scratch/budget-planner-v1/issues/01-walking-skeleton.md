# 01 — Walking skeleton: build, deploy, install

**What to build:** A real, installable app that proves the whole delivery path before any
budgeting logic exists. The operator can install it to the Windows Start menu and to the
Android home screen, open it on either device, and switch the interface between Polish and
English. It shows only a placeholder — a month label and a sample amount — but it shows
them correctly formatted, which is the point: the formatting rules and the delivery path
are the risky parts, not the placeholder.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Builds with Node pinned to one LTS version, with the exact version recorded in the repo
- [x] Published as static files to GitHub Pages from a public repository
- [x] Installs to the Windows Start menu from Edge or Chrome and opens in its own window
- [x] Installs to the Android home screen and opens as an app
- [x] Works in portrait on a phone with no horizontal scrolling
- [x] Interface language switch offers Polish and English and takes effect immediately
- [x] Language choice persists across restarts, stored in the browser for now — ticket 02 moves it into the budget document
- [x] Polish month labels use CLDR stand-alone forms: `Styczeń 2026`, never `Stycznia 2026`
- [x] Amounts render as `1 234,00 kr`, with U+00A0 as the grouping separator and before `kr`, identically in both languages
- [x] A plain-language Node maintenance page exists in the repo: how to install it, the exact version, how to rebuild the app, and what to do when a rebuild fails — written for someone who does not code
- [x] Every user-facing string goes through the translation mechanism from this ticket onward. This is a standing rule for all later tickets; there is deliberately no "translate the app" ticket at the end

## Comments

**2026-08-31 — built, reviewed, pushed. Three boxes left, all needing the operator.**

Done and verified:

- **Node is pinned to 24.19.0** in `.nvmrc`, and GitHub's build machine read it from
  there — its log says `node: v24.19.0`. `package.json` allows `>=24.19.0 <25` so a patch
  release does not break a rebuild on the desktop.
- **Portrait, no sideways scrolling** — measured at 320, 360 and 412 CSS pixels in Chrome;
  the page's scroll width equals its visible width at all three, so nothing overflows.
  Worth a glance on the real phone when installing, but the layout has no fixed widths in it.
- **The language switch** takes effect immediately (heading, labels, month name, the page's
  own language attribute and its title), and survives a reload through browser storage.
- **`Sierpień 2026`, not `Sierpnia 2026`.** All twenty-four month names are baked in rather
  than taken from the browser's locale data, which varies by ICU version. Tested, all twelve
  of each.
- **`1 234,00 kr`** — read back out of the live page, both spaces confirmed as U+00A0 by
  code point, not by eye.
- **The Node maintenance page** is `docs/maintaining-node.md`.
- **Translation:** every string the app says is a catalogue entry, and the type system
  refuses a build if a language is missing. Three things sit outside it on purpose and
  `CLAUDE.md` now names them: operator-typed text, the language names on the switch, and the
  name the installed app carries — no browser can switch a manifest at runtime.

**2026-08-31, later — it is live.** The operator set Pages to build from GitHub Actions and
the run went green: Node 24.19.0 from `.nvmrc`, fifteen tests, a clean build, published.
<https://slejer99.github.io/budget_app/> serves the page, the manifest (as
`application/manifest+json`, which is what makes it installable), the service worker, all
three icons and both hashed build files. The service worker, the manifest and the caching
were checked in Chrome against this same build before it went out.

Only the two installs are left, and they need hands on each device.

Also done here, beyond the checklist: the workbook, the three extracted CSVs and
`05-data-inventory.md` were removed from git and from its history before the first push,
because the repository is public and ADR-0001 says the operator's financial data never
reaches the host. They remain on the desktop, so the ticket-03 importer still has them.

**2026-09-01 — installed on both devices. Ticket closed.**

The operator installed it from <https://slejer99.github.io/budget_app/> to the Windows Start
menu and to the Android home screen, and checked the month label, the amount and portrait
layout on the phone. All eleven boxes are ticked.

One thing worth recording, because it will look like a bug to whoever reads this next: the
app showed `Wrzesień 2026` on the day of the install, where the note above says
`Sierpień 2026`. Both are correct — the placeholder shows the real current month, and the
month had turned over. `Wrzesień`, not `Wrześnie` or `Września`, is the stand-alone form the
ticket asked for.
