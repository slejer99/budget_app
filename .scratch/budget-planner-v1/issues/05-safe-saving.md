# 05 — Safe saving: the newer-file prompt and kept versions

**What to build:** Saving stops being able to lose work silently. When the copy in Drive is
newer than the one the operator loaded, the app says so and offers a choice; when there is
nothing to lose it stays silent. Every overwrite leaves the previous version beside the file,
so a wrong choice is recoverable.

The operator chose last-write-wins over automatic merging, and then asked to be warned before
an overwrite. This ticket is that combination. Keeping the *decision* inside the budget core
is what allows the storage adapter to stay thin enough not to need its own tests.

**Blocked by:** 04 — Edit a planned amount and save.

**Status:** ready-for-agent

- [ ] The sync decision is a pure function inside the budget core, returning write, prompt or load
- [ ] It returns prompt only when the file is newer than what the operator loaded — the only moment anything can be lost
- [ ] Ordinary saves are silent, with no interruption
- [ ] On a prompt, the operator can choose to overwrite or to load the newer copy
- [ ] Choosing to load the newer copy discards local changes only after explicit confirmation
- [ ] Before every overwrite, the existing file is copied aside in the same folder under a timestamped name
- [ ] Kept versions are pruned to roughly the most recent twenty, so the folder does not fill up over years
- [ ] The document's device tag does not cause a prompt against the operator's own previous write
- [ ] Tests exercise the sync decision through the core, covering unchanged, newer, and own-previous-write cases
- [ ] Verified by hand: save from both devices in turn, force a prompt, decline an overwrite, and restore from a kept version
