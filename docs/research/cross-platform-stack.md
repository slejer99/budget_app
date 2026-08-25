# Cross-platform stack for budget_app

Research date: **2026-08-25**. Every factual claim below links to a primary source
(official docs, changelog, pricing page, release notes, or repository). Where a claim
rests on a vendor marketing page rather than documentation, it is labelled. Where I
could not verify something, it says so.

Grounding: `docs/spreadsheet/00-overview.md`. 165 category slots, 653 planned figures
across 26 months, 59 actual entries — all income, all on day 1. The daily-transaction
grid was never used in 26 months. **This is a monthly planning tool, not an expense
tracker.** One Windows 11 desktop, one Android phone, one user who directs coding
agents rather than writing code.

The ranking criterion, applied literally throughout: **fewest moving parts the
operator can be stranded by.** Not fastest, not most popular, not most capable.

---

## Bottom line

**Recommendation: a responsive web app, installed as a PWA on both devices.**
Static files on a static host. Data in the browser, with the authoritative copy
written out as a single JSON file through the File System Access API. Zero native
SDKs, zero build toolchain on the operator's machine, zero signing keys, zero
developer accounts, zero credentials that expire.

**Runner-up: the same web app wrapped in Tauri v2.** Identical frontend code, so
the frontend investment is the same either way. Tauri adds a real Windows `.exe`
and a locally-built Android APK at the cost of a Rust + MSVC + Android NDK
toolchain on the desktop.

The key property of this pairing: **choosing the recommendation does not foreclose
the runner-up.** The wrap-or-don't-wrap decision can be deferred until after the app
works, and either answer reuses 100% of the UI code. No other pair of candidates
has that property.

Full ranking:

| # | Option | Why here |
|---|---|---|
| 1 | **Installable PWA** | No toolchain, no keys, no accounts, nothing expires |
| 2 | **Tauri v2** | Same frontend; native artefacts; heavy but agent-drivable build setup |
| 3 | **Flutter** | One toolchain, genuinely stable Windows target, but a long documented breaking-change record and a second language |
| 4 | **KMP + Compose Multiplatform** | Desktop and Android both Stable, but JetBrains documents a locale/currency gap and it lives on Gradle |
| 5 | **.NET MAUI** | Best Windows target of any candidate, worst support window: each major dies ~6 months after its successor |
| 6 | **React Native / Expo** | Does not meet the Windows desktop requirement at all |

---

## Comparison table

| | Windows desktop | Android install path | Sync options | Agent-buildability | Longevity risk |
|---|---|---|---|---|---|
| **PWA / responsive web** | Installable via Edge or Chrome; own window, Start menu entry ([Edge docs](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/)) | Chrome mints a [WebAPK](https://web.dev/webapks/) on install. No Play account, no fee, no signing key | File System Access on **both** platforms ([Chrome 86 desktop / 132 Android](https://developer.chrome.com/release-notes/132)); manual export/import; optional CRDT | **Highest.** No SDK, no native build, no emulator | **Lowest.** Web platform back-compat; nothing to renew |
| **Tauri v2** | First-class. Uses WebView2, present on Win10 1803+ ([prereqs](https://v2.tauri.app/start/prerequisites/)) | Locally-built APK; needs a signing key | Same as PWA, plus filesystem plugin | Medium. Needs Rust + MSVC Build Tools + Android Studio + NDK + 3 env vars | Low–medium. v2 stable since [Oct 2024](https://v2.tauri.app/blog/tauri-20/); v1→v2 was a large migration |
| **Flutter** | Stable. Needs VS "Desktop development with C++" ([docs](https://docs.flutter.dev/platform-integration/windows/building)) | Locally-built APK; needs signing key | Any (Dart libs); no CRDT ecosystem to speak of | Medium. `flutter doctor` is a real diagnostic; Android still means Gradle | Medium. [Breaking-changes index](https://docs.flutter.dev/release/breaking-changes) lists 4–10 per release, every release |
| **KMP + Compose MP** | Desktop (JVM) is **Stable** ([stability table](https://kotlinlang.org/docs/multiplatform/supported-platforms.html)) | Locally-built APK; needs signing key | Any JVM lib | Medium–low. Gradle + Kotlin/AGP/JDK version alignment | Medium. JetBrains [documents](https://kotlinlang.org/docs/multiplatform/compose-regional-format.html) "no common API" for regional formats; CMP 1.7 deprecated the old resources API |
| **.NET MAUI** | Windows 10 1809+ via WinUI 3 ([supported platforms](https://learn.microsoft.com/en-us/dotnet/maui/supported-platforms)) | Locally-built APK; needs signing key | Any .NET lib | Medium. Visual Studio installs everything in one action | **Highest.** [Support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/maui): 6 months after successor. MAUI 9 out of support 2026-05-12; MAUI 10 dies 2027-05-11 |
| **React Native / Expo** | **Not supported by Expo.** [Expo FAQ](https://docs.expo.dev/faq/): "Android, iOS, and the web". [Expo's own docs](https://docs.expo.dev/modules/additional-platform-support/) say out-of-tree platforms are not built in | EAS cloud build, or local Gradle | Any JS lib | Low for this target. Windows means dropping Expo for [RNW](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies) (4 VS workloads) | High. 3 SDK majors/year; classic builds killed; RNW 0.82 removed Paper entirely |

---

## 1. Cross-platform stack

### The Windows-desktop reality check

Three candidates are genuinely first-class on Windows, one is a Microsoft product
with a caveat, one is stable-but-JVM, and one simply is not there.

**Flutter — genuinely first-class.** Windows desktop is a supported build target;
`flutter build windows` produces an `.exe` plus DLLs plus a `data` directory, and
the docs describe both plain-folder distribution and MSIX packaging
([building Windows apps](https://docs.flutter.dev/platform-integration/windows/building)).
Current stable is **3.47.1, released 2026-08-19, on Dart 3.13.1** — verified from
Flutter's own release manifest
([releases_windows.json](https://storage.googleapis.com/flutter_infra_release/releases/releases_windows.json)).
Build prerequisite: Visual Studio with the **Desktop development with C++** workload
([setup](https://docs.flutter.dev/platform-integration/windows/setup)).

**Compose Multiplatform — Stable on desktop, and JetBrains says so in a table.**
The official stability matrix marks both *Kotlin Multiplatform → Desktop (JVM)* and
*Compose Multiplatform → Desktop (JVM)* as **Stable**, alongside Android
([supported platforms](https://kotlinlang.org/docs/multiplatform/supported-platforms.html),
page dated 10 September 2025). This deserves the check the brief asked for, and it
passes: desktop is not an afterthought in CMP. The caveat is elsewhere — see §5.
Current CMP is 1.12.0-rc01 (2026-08-11, per the
[releases](https://github.com/JetBrains/compose-multiplatform/releases)), i.e. twelve
minor majors since 1.0.

**.NET MAUI — first-class, and this also checks out.** Windows 11 and Windows 10
1809+ via WinUI 3, on every moniker from .NET MAUI 8 through 11
([supported platforms](https://learn.microsoft.com/en-us/dotnet/maui/supported-platforms),
updated 2026-04-09). Publishing offers both an MSIX *packaged* app and an
*unpackaged* `.exe`
([deployment overview](https://learn.microsoft.com/en-us/dotnet/maui/windows/deployment/overview)).
MAUI's Windows story is the strongest of any candidate on the technical merits. Its
problem is the calendar, not the platform — see §4.

**Tauri v2 — first-class on Windows, and it does not ship a browser.** It renders
through Microsoft Edge WebView2, which is already present on Windows 10 1803 and
later ([prerequisites](https://v2.tauri.app/start/prerequisites/)). Tauri 2.0 went
stable in **October 2024** and extended the same codebase to Android and iOS
([release post](https://v2.tauri.app/blog/tauri-20/) — this is a vendor blog, but
it is the project's own release announcement, and the version numbers are
corroborated by [tauri-v2.11.5 on GitHub](https://github.com/tauri-apps/tauri/releases),
2026-07-01).

**PWA — installable on Windows, and Microsoft documents it.** Edge shows an
"App available" button in the address bar and installs the app locally with a
standalone window ([Edge PWA docs](https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/),
updated 2026-06-12). Notably: *"A Progressive Web App doesn't need to have a service
worker for Microsoft Edge to be able to install the app"* — though one is needed for
offline.

**React Native / Expo — this is where the "cross-platform" claim breaks.**
Expo's own FAQ states Expo is "an open-source framework for apps that run natively
on **Android, iOS, and the web**" ([FAQ](https://docs.expo.dev/faq/)). Windows
desktop requires [React Native for Windows](https://microsoft.github.io/react-native-windows/),
a separate Microsoft project, and Expo's own documentation acknowledges out-of-tree
platforms are not supported by Expo CLI
([additional platform support](https://docs.expo.dev/modules/additional-platform-support/)).
RNW is real and maintained — v0.84.0 shipped 2026-06-30 — but it **lags upstream**:
React Native's npm `latest` is **0.87.0** while RNW is on 0.84, roughly three minors
behind. Setup requires Visual Studio 2022 with **four** workloads (Node.js
development, .NET Desktop, Desktop development with C++, *and* UWP development),
Windows 10 SDK 10.0.22621.0, .NET 6.0 SDK, Developer Mode, and long-path support
([rnw-dependencies](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies)).

**Verdict on Q1:** for this project, "one codebase, Windows + Android" is really
"one codebase, Windows + Android, built by an agent, without the operator opening
Visual Studio." Only the PWA clears that bar with nothing installed. Tauri, Flutter,
CMP and MAUI all clear it with a one-time toolchain install that an agent can script
but the operator will eventually have to nurse. RN/Expo does not clear it at all.

### How much can an agent build end-to-end?

| Option | What the operator must have installed | Realistic stranding scenario |
|---|---|---|
| PWA | A browser. A text editor is optional | None at build time. Deployment is `git push` |
| Tauri v2 | Rust (MSVC host triple), MS C++ Build Tools, Android Studio + SDK + NDK, `JAVA_HOME`/`ANDROID_HOME`/`NDK_HOME` | NDK version drift; a Rust target not added via `rustup` |
| Flutter | Flutter SDK (1.64 GB), VS C++ workload, Android Studio, Git for Windows | Gradle/JDK mismatch on the Android side |
| CMP | JDK, Android Studio, Gradle | Kotlin ↔ AGP ↔ Compose-compiler version triples |
| MAUI | Visual Studio 2022 with MAUI workload | Windows App SDK version pinning; annual .NET major bump |
| RN/Expo | Node, VS 2022 ×4 workloads (for Windows), Android Studio | Anything in the RN upgrade path; EAS queue |

One specific trap worth naming: **`eas build --local` does not support Windows.**
Expo's docs say plainly *"we do not officially test against this platform and do not
support Windows for local builds (macOS and Linux are supported)"*
([local builds](https://docs.expo.dev/build-reference/local-builds/)). The operator's
machine is Windows 11. That means Expo's Android builds go through EAS cloud or
through `npx expo run:android` with a full local Android SDK — the very toolchain the
brief wants to avoid.

---

## 2. Getting it onto the phone

This is the section most framework comparisons skip, and for this project it is the
section that decides the answer.

### Google Play: the fee, and the testing rule

- **US$25, one time**, to create a Play Console developer account
  ([Get started with Play Console](https://support.google.com/googleplay/android-developer/answer/6112435)).
- **Personal accounts created after 13 November 2023 must run a closed test with at
  least 12 testers, opted in continuously for at least 14 days**, before applying for
  production access
  ([App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)).
  The requirement was originally 20 testers and was reduced to 12; the current page
  states 12. Testers who opt in for fewer than 14 days and drop out do not count.

**But — and this is the load-bearing finding — the 12-tester rule does not block
internal testing.** The same official page states that the features disabled until
the requirement is met are *"Production (Test and release > Production) and
Pre-registration"*. Internal testing is listed with **"None"** as its access
requirement. Internal testing allows **up to 100 testers per app**
([testing tracks](https://support.google.com/googleplay/android-developer/answer/9845334)).

So a brand-new personal Play account can pay $25 once, push an internal-testing
release, add its own Gmail address as a tester, and install from a Play URL —
forever, without ever recruiting 12 people. That makes Play a *viable* path for
every native candidate. It is not a *free* path and it is not a *zero-maintenance*
path (see the inactivity policy below).

### Sideloading: the ground is currently shifting

Android is rolling out **developer verification**. Apps must be registered by a
verified developer to be installed on certified devices — in **Brazil, Indonesia,
Singapore and Thailand from 30 September 2026**, with global rollout in **2027 and
beyond** ([Android developer verification](https://developer.android.com/developer-verification)).
Poland is not in the first wave, but is in scope for the global phase.

Three facts materially soften this for a personal app:

1. **ADB installs are exempt.** Google's FAQ: *"As a developer, you are free to
   install apps without verification with ADB."* The 24-hour waiting period in the
   power-user flow does not apply to ADB
   ([verification FAQ](https://developer.android.com/developer-verification/guides/faq)).
   A USB cable and `adb install` will keep working.
2. **There is a free tier.** A **Limited Distribution account** — no government ID,
   no registration fee — allows distribution to **up to 20 devices**. Per the
   [March 2026 announcement](https://android-developers.googleblog.com/2026/03/android-developer-verification.html),
   limited-distribution accounts and the power-user advanced flow arrive **in August
   2026**, i.e. this month. A full-distribution Android Developer Console account
   costs **$25**, matching Play.
3. **The power-user flow is genuinely unpleasant.** Per the same FAQ: enable
   developer mode → confirm you are not being coached → restart and re-authenticate
   → **wait 24 hours** → biometric/PIN → install with a warning. That is a
   deliberately hostile path, and it is exactly the kind of thing that strands a
   non-programmer.

**Assessment:** for a native app, plan on either ADB-over-USB (exempt, permanent,
requires the desktop) or the free Limited Distribution account (20 devices). Do not
plan on plain "enable install from unknown sources" surviving 2027 unassisted.

*Caveat I could not verify:* the exact mechanism by which devices are registered
against a Limited Distribution account, and whether that registration expires. The
FAQ does not say. Because the free tier launched this month, there is no operational
history to check.

### EAS Build (Expo only)

Free plan, per [expo.dev/pricing](https://expo.dev/pricing) and
[build limitations](https://docs.expo.dev/build-reference/limitations/):

- **30 builds/month**, of which up to 15 iOS (so effectively 15 Android + 15 iOS).
- **Low-priority queue**, with the pricing page itself warning of **"wait times of
  90+ minutes"** at peak.
- **1 concurrent build.** Quota resets on the 1st of the calendar month; once spent,
  no more builds until then.
- Since 1 May 2024, builds that fail within 3 minutes stop counting against quota,
  max 10 waived per month
  ([changelog](https://expo.dev/changelog/2024-05-02-fast-failed-builds-exclusion)).
- Cheapest paid tier is **$19/month** (Starter).

On free-tier history: the [1 August 2023 changelog](https://expo.dev/changelog/2023-08-01-eas-free-plan-limits)
announced *enforcement* of the existing limits rather than a reduction. I found no
primary evidence that Expo cut its free tier — the change was from unenforced to
enforced, which in practice felt like a cut to people relying on it.

### PWA "add to home screen" on Android in 2026

What it actually gets you:

- Chrome on a device with Google Mobile Services generates a **WebAPK** — a real
  Android package, minted and signed on a Google-run server, then silently installed
  ([WebAPKs on Android](https://web.dev/webapks/),
  [PWA installation](https://web.dev/learn/pwa/installation)). It appears in the app
  launcher and in Android's app settings like any other app.
- **No Play account, no $25, no signing key, no upload certificate.** The minting
  server signs it.
- Offline works via a service worker.
- Storage: Chromium gives an origin up to **60% of total disk** for IndexedDB /
  Cache API / OPFS
  ([MDN storage quotas](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)).
  For a dataset measured in kilobytes this is irrelevant except in one direction:
  eviction.

The three honest weaknesses, all cited:

1. **Clearing Chrome's data wipes it.** web.dev's WebAPK FAQ answers *"Will my
   installed site's storage be cleared if the user clears Chrome's cache?"* with a
   flat **"Yes."** The WebAPK uses the Chrome profile's storage; it is not segregated.
2. **Persistent storage is a heuristic, not a guarantee.** In Chrome,
   `navigator.storage.persist()` is auto-granted or silently denied based on site
   engagement, whether the site is installed or bookmarked, and notification
   permission ([Persistent storage](https://web.dev/articles/persistent-storage)).
   **Flagging staleness: that article was last updated 2020-05-12** and is the best
   primary statement of the heuristics I could find; treat the specifics as
   possibly out of date. MDN adds that even persistent storage can be evicted by
   Chrome under storage pressure.
3. **The minting server is a Google dependency.** No GMS, or a minting failure, and
   Chrome falls back to a plain shortcut instead of a WebAPK.

Mitigation, and it is a strong one for *this* dataset: **treat the browser as a
cache, not a vault.** Because the data is kilobytes and the app already needs an
export path for sync, have every save also write the canonical JSON to a real file
via the File System Access API. Then "Chrome cleared my data" costs one re-import,
not the budget.

### What expires or breaks over time

This is where the options separate most sharply.

| Thing | Applies to | What happens | What the operator must do |
|---|---|---|---|
| **App signing key** | Every native option | Google recommends keys valid **≥25 years**, and for Play the key **must expire after 22 October 2033** ([app signing](https://developer.android.com/studio/publish/app-signing)) | Generate once with a long validity; back it up. Nothing to rotate |
| **Lost upload key (Play App Signing)** | Play-distributed native apps | Recoverable. *"Resetting your upload key will not affect the app signing key"* (same page) | Request a reset in Play Console |
| **Lost signing key (self-signed sideload)** | Sideloaded native apps | **Unrecoverable.** *"if you lose your app's signing key, you lose the ability to update your app"* | Uninstall + reinstall, losing local app data unless exported |
| **Play developer account inactivity** | Play-distributed apps | Account marked for closure if: created >1 year ago, all apps under 1,000 lifetime installs, **phone/email not verified**, and Play Console unused for 180 days. Reminder emails at 60/30/7 days. **Registration fee is not refunded** ([closure of inactive accounts](https://support.google.com/googleplay/android-developer/answer/11605267)) | The criteria are **conjunctive** — verifying phone and contact email defuses it without ever logging in again |
| **Target API level** | Play-distributed apps | New apps/updates must target **Android 16 (API 36)**; existing apps must target API 35+ to stay available to new users ([target API requirements](https://support.google.com/googleplay/android-developer/answer/11926878)) | Nothing, if never updating — *"Users who have previously installed the app from Google Play will not be impacted and will still be able to discover, re-install, and use the app"* |
| **EAS build credentials** | Expo | Managed by EAS; free-tier quota resets monthly | Keep an Expo account alive |
| **Nothing** | **PWA** | — | — |

**The PWA row is the whole argument.** It is the only option where the "what
expires" table is empty.

---

## 3. Sync between desktop and Android

### Hosted BaaS — and which ones pause

The brief asked specifically about pausing and free-tier revocation. Three of the
four fail on exactly that.

**Supabase — pauses, and the restore window was cut.**
Free plan: 500 MB database, 5 GB egress, 2 active projects, $25/mo Pro
([pricing](https://supabase.com/pricing)). *"Supabase pauses Free projects that show
low activity over a 7-day period"*; a warning email gives roughly a week
([project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)).
On **24 June 2024** Supabase announced that *"paused Free projects are restorable for
90 days following their pause date"*, where **previously paused projects could be
restored indefinitely**
([changelog](https://supabase.com/changelog/27497-paused-free-plan-projects-are-restorable-for-90-days)).
**Note the inconsistency in Supabase's own sources**: the docs page still says
*"You can restore a paused project for up to 1 year after it was paused"* while the
changelog says 90 days. I could not reconcile these; the discrepancy is itself the
point. This is a documented free-tier reduction on a platform that pauses after one
week of not touching it. **Disqualifying** for an operator who will have months of
inactivity.

**PowerSync — same failure mode.** Free plan: 2 GB synced/month, 500 MB hosted,
50 peak connections, 2 instances — and *"Free projects are deactivated after 1 week
of inactivity"* ([pricing](https://www.powersync.com/pricing)). Also requires a
backend database (Postgres/MongoDB/MySQL/SQL Server), so it is a sync layer, not a
backend. There is a source-available self-hosted Open Edition, which means running a
server. **Disqualifying.**

**Firebase — does not pause on inactivity, but has a deprecation record.**
Spark (free) still exists: Firestore 1 GiB storage, 50K reads/day, 20K writes/day,
10 GiB egress/month; Auth free to 50K MAU
([pricing](https://firebase.google.com/pricing)). **Cloud Functions are not available
on Spark** — the pricing table lists them as not applicable. I found no documented
inactivity-pause policy for Firebase projects, and I am stating that as "not found",
not as "does not exist." The concrete mark against it is Google's willingness to
switch things off: **Firebase Dynamic Links shut down on 25 August 2025**, with all
links returning HTTP 404 afterwards
([Dynamic Links deprecation FAQ](https://firebase.google.com/support/dynamic-links-faq)).

**Turso — free tier is generous, but the platform is in motion.**
Free: 100 databases, 5 GB storage, 500M rows read/month, 10M written, 3 GB syncs;
cheapest paid is **$4.99/mo** ([pricing](https://turso.tech/pricing)). The pricing
page does not state an inactivity policy — **unverified**. More concerning for a
two-year horizon: Turso's own roadmap post discontinues **edge replicas** for new
users, removes **multi-DB schemas and ATTACH** for new users, migrates free-tier
users to AWS, renames Limbo to Turso, and makes **the new multitenant server
proprietary/closed-source**
([upcoming changes](https://turso.tech/blog/upcoming-changes-to-the-turso-platform-and-roadmap)).
Existing paid customers are grandfathered; free users are the ones being moved.

**PocketBase — self-hosted, which means a server the operator maintains.**
A single Go binary with embedded SQLite, actively developed: **v0.40.1 released
2026-08-24**, 60.8k stars, not archived (verified via the GitHub API against
[pocketbase/pocketbase](https://github.com/pocketbase/pocketbase/releases)). But it
is **still pre-1.0 after four years**, and ships breaking changes between minors —
the v0.40.0 notes carry *"⚠️ Note that this could be a slight breaking change…"*.
And it needs somewhere to run, with a domain and TLS. That is a server, a bill, and
a thing to patch. **Fails the stated criterion**, despite being excellent software.

### File sync over a folder the operator already has

This is the approach that matches the workload — but only with one rule.

**The rule: never put a live SQLite file in a sync folder.** SQLite's own
documentation is unusually blunt about network/remote filesystems: *"Rely upon it at
your (and your customers') peril."* It documents three failure modes — writes
landing out of order, exclusive locks operating incorrectly (*"This has led to
database corruption"*), and no support for consistent simultaneous read/write
([SQLite over a network](https://www.sqlite.org/useovernet.html)). Dropbox, Drive,
OneDrive and Syncthing are all in scope for that warning when they touch a file
that a process has open.

With **whole-file writes of a single JSON document**, the failure modes become
benign and readable:

- **Dropbox** never merges. It saves the original and the newer one as a *conflicted
  copy* with the editor's name and date in the filename, explicitly so nobody loses
  anything ([What's a conflicted copy?](https://help.dropbox.com/organize/conflicted-copy)).
  It notes that leaving a file open on another machine is a common cause, "especially
  when using applications with an auto-save feature" — read that as a direct warning
  about an app holding a file open.
- **Google Drive for desktop** keeps a copy of your edited file under the original
  parent folder when *"Your local changes are incompatible with changes in the
  cloud"*, falling back to My Drive root or Lost & Found
  ([Fix problems in Drive for desktop](https://support.google.com/drive/answer/2565956)).
- **OneDrive** keeps both versions for non-Office file types, typically appending the
  device name. Microsoft's primary documentation on this is thin; most of what I
  found was Q&A threads rather than docs — **flagging that as weakly sourced.**
- **Syncthing** renames the losing side to
  `<filename>.sync-conflict-<date>-<time>-<modifiedBy>.<ext>`, decided by modification
  time with device ID as tiebreaker, and propagates the conflict file to all devices.
  It never writes directly to a destination file — all changes go via a temporary
  copy ([Syncing](https://docs.syncthing.net/users/syncing.html)). Technically the
  cleanest of the four, and it needs no cloud account.

**But Syncthing has an Android problem.** The official
[syncthing/syncthing-android](https://github.com/syncthing/syncthing-android) repo is
**archived** (last push 2024-12-03), following the maintainers'
[Discontinuing syncthing-android](https://forum.syncthing.net/t/discontinuing-syncthing-android/23002)
announcement. What remains is a community fork (Syncthing-Fork, v2.1.3.0 released
2026-08-05, ~2.7k stars, actively pushed) — healthy today, but a single-maintainer
fork of an abandoned app is precisely a moving part that can strand a non-programmer.

**And Drive/OneDrive/Dropbox have a symmetrical Android problem**: on Android they do
not maintain a genuinely synced local folder the way Drive for Desktop does on
Windows. So the elegant "one folder, both machines" picture is real on Windows and
approximate on Android.

### Local-first / CRDT libraries

All version data below verified against the GitHub API on 2026-08-25.

| Library | Latest | Needs a server? | Funding | Assessment |
|---|---|---|---|---|
| **Automerge** | `js/automerge-3.4.1`, 2026-08-12 | **No.** Transport-agnostic sync protocol + binary storage format; `automerge-repo` adds pluggable storage/network adapters and *"does not inherently require a sync server"* ([concepts](https://automerge.org/docs/reference/concepts/)) | Ink & Switch fund full-time engineering staff; sponsors include Fly.io and Prisma ([Automerge 2.0](https://automerge.org/blog/automerge-2/)) | **Production-ready and the only one that fits "no server."** Two devices can sync by exchanging binary blobs |
| **Yjs** | `v13.6.32`, 2026-08-04 (v14 in RC) | In practice yes — a provider (`y-websocket` etc.) | Community + sponsorship | Mature, but the ecosystem assumes a provider. **v14 is in RC**, so a major is imminent |
| **ElectricSQL** | `@core/sync-service@1.7.12`, 2026-08-21 | **Yes** — Postgres + the Electric sync service | VC-backed | Production-ready *and* a cautionary tale: Electric was **rewritten from scratch** in 2024, switching from the Satellite WebSocket protocol to HTTP replication ([a new approach](https://electric-sql.com/blog/2024/07/17/electric-next)), reaching [1.0 in March 2025](https://electric-sql.com/blog/2025/03/17/electricsql-1.0-released). Anyone who built on pre-rewrite Electric was stranded |
| **PowerSync** | `@powersync/web@2.2.0`, 2026-08-13 | **Yes** — backend DB + service | Commercial | Free cloud tier deactivates after 1 week idle (above) |
| **Dexie Cloud** | Dexie.js `v4.4.5`, 2026-08-14 | Yes for Cloud; Dexie.js itself is a local IndexedDB wrapper needing nothing | Awarica AB (Sweden). Free tier: 3 production users, 10 databases, 100 MB. Self-host: **€3,495 forever** ([pricing](https://dexie.org/cloud/pricing)) | Dexie.js standalone is a fine local store. Dexie **Cloud** is a commercial product with a small free ceiling |

### Single device plus manual export/import

Cheapest to build, zero failure modes, and the honest baseline for a dataset of 653
numbers touched once a month. Its weakness is discipline: the operator has to
remember. That is a real cost, but it is a cost the operator can always recover from,
which is more than can be said for a paused Supabase project discovered 91 days late.

### Sync recommendation

**One JSON file, written whole, exchanged explicitly. Ranked as follows:**

1. **Windows: File System Access pointed at a file inside an existing synced folder**
   (`%USERPROFILE%\OneDrive\budget\budget.json` or the Drive/Dropbox equivalent).
   The app reads on open, writes on save, whole file, atomically.
2. **Android: the same JSON, via the document picker.** Chrome Android has supported
   `showOpenFilePicker`/`showSaveFilePicker`/`showDirectoryPicker` since **Chrome 132**
   ([release notes](https://developer.chrome.com/release-notes/132); corroborated by
   [MDN browser-compat-data](https://github.com/mdn/browser-compat-data/blob/main/api/Window.json),
   which records `chrome_android: 132` for all three and `false` for Firefox and
   Safari). Note the API landed in **WebView too**, so a Tauri or Capacitor shell
   gets it as well.
3. **A `lastModified` timestamp and a device tag inside the JSON**, so the app can
   say "the file on disk is newer than what you have — load it?" rather than silently
   clobbering.
4. **Automerge only if conflicts ever become real** — i.e. if the operator starts
   editing the same month on both devices between syncs. Today they do not; adding a
   CRDT now buys nothing and costs a second data format.

Explicitly avoid: Supabase, PowerSync Cloud (both pause after ~1 week idle), and any
self-hosted server. Firebase and Turso are technically usable but add an account, a
console, and a vendor with a live deprecation record.

One friction point to plan for, not hide: **File System Access permissions do not
reliably survive a browser restart.** Chrome's docs state permissions *"are not
always persisted between sessions"* and handles stored in IndexedDB need
`queryPermission()`/`requestPermission()` re-verification
([File System Access API](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access)).
In practice: one click on app start. Design for it rather than being surprised.

---

## 4. Longevity and repairability

The question is which of these a coding agent can still confidently work on in two
years — August 2028.

**.NET MAUI — the clearest documented risk, on two counts.**

*Count one, the support window.* Microsoft's own policy: *"A major version of .NET
MAUI receives support for a **minimum of 6 months after a successor (the next major
release) ships**"*
([MAUI support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/maui)).
The published table is unambiguous:

| Version | Released | End of support |
|---|---|---|
| MAUI 8 | 2023-11-14 | 2025-05-14 |
| MAUI 9 | 2024-11-12 | **2026-05-12 (already past)** |
| MAUI 10 | 2025-11-11 | **2027-05-11** |

That is an ~18-month life per major, i.e. an annual forced upgrade, *inside the
two-year horizon the brief asks about*. There are no LTS/STS designations to hide
behind.

*Count two, the precedent.* **Xamarin support ended 1 May 2024** for all Xamarin SDKs
including Xamarin.Forms; Android API 34 and Xcode 15 were the final targets
([Xamarin support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/xamarin)).
Xamarin.Essentials' own repo now reads *"Xamarin.Essentials is no longer supported.
Migrate your apps to .NET MAUI"*. MAUI is the successor to a product line Microsoft
retired. That is not a prediction about MAUI's future — it is the documented history
the brief asked for.

**Expo / React Native — the most documented churn.**

- **Three SDK majors per year**, stated on Expo's
  [SDK reference](https://docs.expo.dev/versions/latest/). Current `latest` on npm is
  **57.0.16**, with 58 already in canary — verified via the npm registry. SDK 52 was
  current about two years ago.
- **Classic Builds were killed.** `expo build` stopped working on **4 January 2023**;
  projects on SDK 47+ had to migrate to EAS Build
  ([expo build's Final Year](https://blog.expo.dev/expo-builds-final-year-d334db2a6b60)).
  `expo publish` and Classic Updates were sunset in the same era
  ([Sunsetting expo publish](https://blog.expo.dev/sunsetting-expo-publish-and-classic-updates-6cb9cd295378)).
- **Expo Go only supports the latest SDK version.** Development builds get longer
  backwards compatibility on EAS, *"but not forever"*
  ([upgrading Expo SDK](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)).
- On the Windows side, **RNW 0.82 removed the legacy Paper architecture entirely** —
  *"All apps now run exclusively on the New Architecture (Fabric)"*
  ([getting started](https://microsoft.github.io/react-native-windows/docs/getting-started)).

An app left untouched for a year in this ecosystem does not come back cleanly.

**Flutter — high churn, but unusually well-managed churn.**
Flutter maintains a public [breaking-changes index](https://docs.flutter.dev/release/breaking-changes)
with a guide per change. Recent counts: 3 in 3.47, 9 in 3.44, 5 in 3.41, 6 in 3.38,
9 in 3.35. The big historical migrations are all documented: **null safety (2.0)**,
**Material 3 default (3.16)**, `MaterialState` → `WidgetState` (3.22), **removal of
the v1 Android embedding Java APIs (3.29)** — deprecated back in 1.22, removed seven
years later. Deprecated APIs are typically removed **2–3 minor releases** after
deprecation. Crucially, Flutter ships `dart fix`, which mechanically applies many
migrations. For an agent, "a documented breaking change with a migration guide and
an automated fixer" is close to the best case.

**Kotlin Multiplatform / Compose Multiplatform — stable core, moving surface.**
KMP and CMP are both **Stable** for Android and Desktop
([stability table](https://kotlinlang.org/docs/multiplatform/supported-platforms.html)).
But CMP is on **1.12.0-rc01** after twelve minor majors, and CMP **1.7.0 deprecated
the `compose.ui` resources API** in favour of a new multiplatform resource library
([resources usage](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-resources-usage.html)).
Underneath sits Gradle plus the Kotlin/AGP/compose-compiler version triple — the
single most common source of "the build stopped working and nobody changed anything"
in the Android world.

**Tauri — one big migration behind it, none announced ahead.**
v1 → v2 was a substantial migration (new permissions/capabilities model, mobile
support). v2 has been stable since October 2024 and is on 2.11.x as of July 2026.
Tauri is under the Commons Conservancy, which is a healthier governance story than a
single VC-backed company. The Rust dependency is two-edged: Rust's own stability
guarantees are excellent, but the Android NDK toolchain underneath is not Tauri's to
stabilise.

**Web platform — the outlier, in the right direction.**
The web is the only candidate here whose maintainers treat breaking changes as
failures rather than as a release note. The specific APIs this app needs — DOM,
IndexedDB or localStorage, `Intl`, service workers, web app manifest, File System
Access — are all shipped and, apart from File System Access (Chromium-only, and
still WICG-stage), broadly implemented. An HTML/CSS/JS app written today and left
alone will still run in 2028. That is a claim no other candidate here can make.

---

## 5. Polish-language and currency specifics

I verified these against **CLDR's `pl.xml` source data directly** (fetched from
[unicode-org/cldr `common/main/pl.xml`](https://github.com/unicode-org/cldr/blob/main/common/main/pl.xml))
rather than trusting any framework's documentation. Findings, with exact codepoints:

### PLN formatting

| Element | Value | Codepoints |
|---|---|---|
| Decimal separator | `,` | U+002C |
| Group separator | non-breaking space | **U+00A0** |
| Currency pattern | `#,##0.00 ¤` — symbol is a **suffix** | the space is **U+00A0**, not U+0020 |
| PLN symbol | `zł` | U+007A U+0142 |
| Accounting pattern | `#,##0.00 ¤;(#,##0.00 ¤)` | negatives in parentheses |

So the correct rendering of 1 234 567,50 złotych is
`1<NBSP>234<NBSP>567,50<NBSP>zł`. **Both** spaces are U+00A0. Getting the grouping
NBSP right but the pre-symbol space wrong is the classic error, and it is
invisible in a diff.

**Observed discrepancy worth knowing about:** running this on the operator's actual
Windows machine, `.NET Framework 4.8` (which is what Windows PowerShell 5.1 uses, and
which uses NLS rather than ICU) produced `1 234 567,50 zł` with codepoints
`0031 00A0 … 0030 0020 007A 0142` — group separator correctly U+00A0, but an
**ordinary space U+0020 before `zł`**, diverging from CLDR. Modern .NET (5+) uses ICU
by default on Windows, so this specific discrepancy should not affect a MAUI app, but
I could not verify that empirically: **there is no .NET SDK installed on this
machine** (`dotnet --list-sdks` returns nothing), only a runtime. Treat "modern .NET
matches CLDR here" as **inferred, not confirmed**.

### Month declension — the one that will actually bite

CLDR carries two sets of Polish month names, and they are different words:

| Context | Names |
|---|---|
| **`format`** (month inside a full date) | stycznia, lutego, marca, kwietnia, maja, czerwca, lipca, sierpnia, września, października, listopada, grudnia |
| **`stand-alone`** (month as a bare label) | styczeń, luty, marzec, kwiecień, maj, czerwiec, lipiec, sierpień, wrzesień, październik, listopad, grudzień |

CLDR's `pl` date patterns: `full` = `EEEE, d MMMM y`, `long` = `d MMMM y`,
`short` = `d.MM.y`. Weekdays: niedziela, poniedziałek, wtorek, środa, czwartek,
piątek, sobota.

**This app is almost entirely stand-alone.** The spreadsheet's 26 sheets are named
`Listopad2024`, `Styczen2025` … — month labels standing alone, month pickers, column
headers, a yearly rollup with 12 month columns. Every one of those needs the
**nominative/stand-alone** form. A naive `MMMM` will render "Stycznia 2026", which is
wrong in Polish the way "of January 2026" is wrong in English. The dashboard headline
for a month sheet must say **Styczeń 2026**, not *Stycznia 2026*.

Framework support for the distinction:

- **Web / `Intl`** — ECMA-402 handles the format/stand-alone distinction internally
  based on whether a day field is present. I could not run Node on this machine
  (not installed) to demonstrate it, so this is **inferred from the spec's design,
  not empirically confirmed here**. Worth a two-line check in the browser before
  relying on it.
- **.NET** — explicit and well-documented: `DateTimeFormatInfo.MonthNames` vs
  [`MonthGenitiveNames`](https://learn.microsoft.com/en-us/dotnet/api/system.globalization.datetimeformatinfo.monthgenitivenames),
  which the docs describe as existing precisely because *"In some languages, a month
  name that is part of a date appears in the genitive case."* I confirmed empirically
  on this machine that `pl-PL` populates both arrays correctly, and that
  `.ToString("D")` yields `poniedziałek, 5 stycznia 2026`.
- **Dart / Flutter** — supported via distinct skeletons: `DateFormat.LLLL()` /
  `STANDALONE_MONTH` versus `DateFormat.MMMM()`
  ([DateFormat](https://pub.dev/documentation/intl/latest/intl/DateFormat-class.html)).
  But `initializeDateFormatting()` **must** be called for non-`en_US` locales, and
  Polish is not among Flutter's default `supportedLocales` — it must be added
  explicitly, along with `flutter_localizations` + `intl` and an `l10n.yaml`
  ([internationalization](https://docs.flutter.dev/ui/accessibility-and-internationalization/internationalization)).
- **Kotlin/JVM** — `java.time` has `MMMM` (format) vs `LLLL` (stand-alone). Available
  on both Android and Desktop because both are JVM. See the caveat below.

### Plural forms — the second Polish trap

Polish has **four** CLDR plural categories (`one`, `few`, `many`, `other`), and CLDR
carries all four for PLN itself:

- one → *złoty polski*
- few → *złote polskie*
- many → *złotych polskich*
- other → *złotego polskiego*

Any string like "N kategorii" / "N kategoria" / "N kategorie" needs real plural
rules, not an `if (n === 1)`. Compose Multiplatform's resources library does support
`zero`/`one`/`two`/`few`/`many`/`other`
([resources usage](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-resources-usage.html)),
as do Flutter's ARB files, .NET (via ICU), and the web's `Intl.PluralRules`.

### Where the i18n story is genuinely weak

**Kotlin Multiplatform.** JetBrains says it themselves. On regional formats:
*"Formatting is currently implemented using the `kotlinx-datetime` library on iOS and
the JDK API on Android and desktop"*, and — the important sentence — **"Although
there is no common API for a unified multiplatform solution, the formatting behavior
is still consistent in most cases"**
([Manage regional formats](https://kotlinlang.org/docs/multiplatform/compose-regional-format.html)).
There is no multiplatform locale-aware number/currency formatter in the Kotlin
standard library.

**But for this project that gap largely closes**, because the only two targets are
Android and Desktop, and **both are JVM**.
`java.text.NumberFormat.getCurrencyInstance(Locale("pl","PL"))` and
`java.time.format.DateTimeFormatter` are available on both. This is an important
piece of nuance the generic "KMP has no i18n" criticism misses — *and it is inferred
reasoning on my part, not a JetBrains statement.* It would need a shared JVM source
set rather than pure `commonMain`. If iOS were ever added, the gap reopens fully.

**Everything else is fine.** Flutter needs two extra packages and explicit setup but
gets there. .NET has the richest Polish support of any candidate out of the box. The
web's `Intl` is ICU/CLDR directly, with nothing to install and no locale data to
bundle — for a Polish-only app this is the smallest amount of machinery of any option.

### Diacritics

`ą ć ę ł ń ó ś ź ż` in category names are a non-issue in any modern framework — all
six candidates are UTF-8/UTF-16 end to end, and NTFS and ext4 both store them fine in
file paths.

The bite is in **tooling around the app, not the app**. A concrete instance from this
session: a Python subprocess on this very machine crashed with
`UnicodeEncodeError: 'charmap' codec can't encode characters` when printing Polish
text, because the Windows console defaulted to **cp1250**. Any build script, data
importer, or CLI an agent writes needs an explicit UTF-8 encoding declaration. This
is an observed reproduction on the operator's machine, not a citation. The web option
minimises this surface because there is no build script.

**One further point specific to this project**: finding 5 in the overview says
31 planned cells hold typed arithmetic (`=5269+1932+1932`). Whatever is built must
store the **expression** alongside the value. That is a data-model requirement, not a
framework one, and no candidate helps or hinders — but it does argue for a text-ish,
human-readable persistence format, which the recommended single-JSON-file approach
gives for free.

---

## What would change this recommendation

Named facts, each of which would flip or substantially reorder the call:

1. **If storage durability is judged unacceptable.** If the operator would rather not
   have "I cleared my browser data" as a possible event at all, the PWA drops and
   **Tauri v2 becomes the recommendation** — same code, real filesystem, no browser
   profile in the way. This is the single most likely flip.

2. **If iOS is ever in scope.** The PWA still works, but a native option becomes much
   more attractive, and **KMP+CMP's i18n gap reopens hard** (§5) while Flutter's
   position improves markedly.

3. **If File System Access on Chrome Android turns out unreliable in practice.**
   Chrome 132 is recent; my evidence is release notes and MDN compat data, not
   hands-on use against a Syncthing or Drive folder on a real phone. If directory
   handles or permission persistence prove flaky on Android, the sync plan degrades
   to share-sheet export/import — annoying but survivable — and the case for a native
   shell with plain filesystem access strengthens.

4. **If the operator will actually use it daily rather than monthly.** Finding 1 says
   they will not, on 26 months of evidence. But if transaction capture becomes the
   centre, "quick capture from the home screen" starts to matter, and a native app's
   share targets, widgets and cold-start behaviour begin to justify their cost.

5. **If Android developer verification lands harder than announced.** If sideloading
   or the free Limited Distribution account is curtailed in the 2027 global rollout,
   every native option gets worse and the PWA — which is minted and signed by Google's
   own WebAPK server — gets relatively better. Conversely, if Limited Distribution
   turns out to be frictionless and permanent, Tauri and Flutter both improve.

6. **If Microsoft publishes an LTS commitment for .NET MAUI.** The 6-months-after-
   successor policy is the main thing keeping MAUI at #5 despite having the best
   Windows target here. A genuine LTS designation would move it up two places.

7. **If a free, non-pausing hosted sync tier appears.** Every hosted BaaS surveyed
   either pauses on ~1 week of inactivity (Supabase, PowerSync) or belongs to a vendor
   with a live deprecation record (Firebase, Turso). A durable free tier that
   tolerates months of silence would make "just use a backend" viable and simplify
   the sync design considerably.

---

## Confirmed vs inferred

**Confirmed against primary sources** (all linked above): every Play Console
requirement, fee and inactivity criterion; the internal-testing exemption from the
12-tester rule; Android developer verification dates, tiers and the ADB exemption;
Expo pricing, build limits and the Windows local-build exclusion; Compose
Multiplatform and KMP stability levels; .NET MAUI supported platforms and support
end dates; Xamarin's end of support; Flutter 3.47.1 as current stable; Tauri v2
prerequisites; RNW dependencies and version lag; Supabase/PowerSync pausing; the
Supabase 90-day changelog; SQLite's network-filesystem warning; Syncthing's conflict
naming and the archival of the official Android app; Chrome 132 File System Access
on Android (two independent primary sources); GitHub Pages limits (1 GB site, 100 GB/mo
soft bandwidth, 10 builds/hr soft —
[docs](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits));
all Polish CLDR number, currency, month and plural data.

**Inferred, and flagged as such in the text:**

- That modern .NET (ICU-based) renders PLN with U+00A0 before `zł` — I observed only
  the .NET Framework/NLS behaviour, which uses U+0020, and no .NET SDK is installed
  on this machine to test against.
- That `Intl.DateTimeFormat` selects stand-alone month forms correctly for `pl` —
  Node is not installed here, so this was not run.
- That a shared JVM source set closes KMP's currency-formatting gap for an
  Android+Desktop-only project. Sound reasoning from JetBrains' own statement that
  Android and desktop both use "the JDK API", but not something JetBrains says.

**Could not verify at all:**

- Whether Turso archives, pauses, or deletes inactive free databases. Not stated on
  the pricing page.
- Whether Firebase pauses inactive projects. I found no policy either way and am
  reporting absence of evidence, not evidence of absence.
- The device-registration mechanism and any expiry for Android Limited Distribution
  accounts. The FAQ does not say, and the tier launched this month.
- Whether GitHub has an inactivity policy that could remove a long-dormant Pages
  site. I found limits but no dormancy policy.
- Microsoft's primary documentation on OneDrive non-Office file conflict naming.
  What I found was Q&A threads, not docs.
- The internal Supabase contradiction between its docs page (1 year restore) and its
  changelog (90 days). Both are Supabase's own sources and they disagree.
