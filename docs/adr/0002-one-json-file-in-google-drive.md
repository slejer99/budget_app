# One JSON file in Google Drive, not a database or a sync service

All budget data lives in a single JSON document held in the operator's Google Drive.
The desktop reaches it as an ordinary file through Google Drive for Desktop; the phone
reaches the same file directly through Chrome's file picker on Android. There is no
server, no account to create, and no database.

## Why this is surprising

Two devices sharing mutable data is the textbook case for a sync backend, and a reader
will wonder why one wasn't used. The reason is the operator's usage pattern: a budget is
touched a few times a month, and can go untouched for months. Every hosted free tier
surveyed either pauses on roughly a week of inactivity (Supabase, PowerSync) or belongs
to a vendor with a live deprecation record (Firebase, Turso) — see
`docs/research/cross-platform-stack.md`. A budget discovered to be gone, 91 days after a
pause email nobody read, is the worst outcome available. Self-hosting (PocketBase) means
a server, a domain and a bill for one person's spreadsheet replacement.

Google Drive specifically — over OneDrive, which was already installed on the desktop
while Drive was not — because the operator keeps all their documents in Drive and did
not want them split across two clouds.

## Considered options

- **Supabase / PowerSync / Firebase / Turso.** Rejected above.
- **A CRDT (Automerge).** Genuinely serverless and would make conflicts disappear.
  Rejected as premature: it buys nothing until the operator actually edits both devices
  between syncs, and costs a second data format forever.
- **SQLite in the synced folder.** Rejected outright — SQLite's own documentation warns
  that network and cloud-synced filesystems cause corruption. Whole-file JSON writes turn
  the same conflict into a readable duplicate file instead.
- **OneDrive.** Technically better positioned (already installed, real folder on Windows).
  Rejected by the operator on the grounds of keeping all documents in one place.

## Consequences

- **Last write wins**, with a guard: the app compares the file in Drive against what it
  loaded, and prompts only when Drive is newer. Every overwrite first copies the previous
  version aside in the same folder, keeping roughly the last twenty.
- **The phone has no local copy.** It reads and writes the Drive file directly, so with no
  connection it opens read-only, showing the last budget it saw and refusing edits. This
  knowingly removes in-the-moment purchase capture when offline, which was one of the
  three recording modes originally asked for. The operator accepted this trade.
- **Chrome Android reaching Drive is verified** on the operator's own phone (2026-08-26):
  the picker lists Drive and the operator can browse to a file in it. This was the single
  largest open risk in the design and it is now closed.
- Reaching the file is an explicit pick, not a silent open, and File System Access
  permissions do not reliably survive a browser restart on either platform. Expect the
  operator to choose the file on app start — design that as a normal step, not an error.
