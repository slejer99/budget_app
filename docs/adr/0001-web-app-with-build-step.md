# A built web app, not an installed native app

budget_app is a responsive web app, built from source with Node and served as static
files over HTTPS, installed to the Start menu and the Android home screen as a PWA.
It is not a Tauri, Flutter, MAUI or React Native application, and it is not a no-build
plain-HTML app either.

## Why this is surprising

The project's stated criterion is *fewest moving parts the operator can be stranded by*,
and the operator does not write code. On that criterion the no-build option wins outright:
it needs nothing installed on the desktop, ever. The operator chose the build step anyway,
knowingly, in exchange for a better-built app — and asked for written instructions on
keeping Node alive as the price of it.

## Considered options

- **No build step** (plain files, no Node). The purest reading of the criterion. Rejected
  by the operator in favour of a real frontend toolchain.
- **Tauri v2**, the research file's runner-up. Rejected: needs Rust and MSVC build tools
  on the desktop, and an Android signing key which, if lost, cannot be recovered —
  updating the phone app would then require uninstalling it. That is precisely the
  stranding scenario the criterion exists to avoid.
- **Flutter / KMP+Compose / .NET MAUI.** Rejected in `docs/research/cross-platform-stack.md`
  on toolchain weight, support windows and i18n gaps. MAUI additionally loses support
  roughly six months after each successor ships.
- **React Native / Expo.** Does not support Windows desktop at all.

## Consequences

- Node is a dependency of *changing* the app, never of *running* it. Once built, the app
  is static files; a broken Node install cannot take the budget down.
- Node is pinned to one LTS version and deliberately not updated on a schedule. A
  plain-language maintenance page in the repo covers install, version, rebuild, and what
  to do when a rebuild fails.
- Hosting is GitHub Pages on a public repository. The source is public; the operator's
  financial data never reaches the host — it lives only in Google Drive and on the two
  devices.
- Nothing in this stack expires: no signing key, no developer account, no certificate,
  no vendor free tier that pauses on inactivity.
