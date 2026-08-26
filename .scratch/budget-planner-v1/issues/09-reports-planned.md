# 09 — Reports on planned figures

**What to build:** The operator picks a range — from the last few months up to the entire
history — and sees how their planning has moved. This is what replaces the yearly rollup,
which has returned `#REF!` in every cell for roughly two years.

Reports must work with tracking switched off. The app is a planner first, and a planner's
reports are about planned figures.

**Blocked by:** 03 — Import the 26 months.

**Status:** ready-for-agent

- [ ] The range is selectable, from a few recent months up to everything
- [ ] Total planned income per month across the range
- [ ] Total planned expenses per month across the range
- [ ] Unallocated per month across the range
- [ ] Each group's planned total per month across the range
- [ ] A month with no plan is reported as absent, not as zero — a gap must look like a gap, not like a month of no spending
- [ ] Reports are complete and correct with tracking switched off
- [ ] Reports are readable on the phone in portrait
- [ ] Tests exercise the four series and the absent-month behaviour through the core
