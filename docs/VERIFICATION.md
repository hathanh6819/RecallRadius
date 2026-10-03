# Reviewer verification

1. Open the deployed frontend and confirm Studio Next chain ID `61997` and the visible contract address.
2. Connect any wallet and create an open case. No constructor role or deployer wallet is required.
3. Register the GreenWise positive fixture.
4. Connect another wallet and register the negative-control fixture.
5. Reconnect the case-creator wallet and seal the batch.
6. From either wallet—or a third reviewer wallet—run a new FDA scope epoch.
7. Read finalized state. The canonical positive item should be `AFFECTED`; the negative control should be `NOT_AFFECTED` when the current FDA scope matches the documented fixture.
8. Inspect the epoch's source digest, scope digest, transition and per-item diagnostics.
9. Attempt assessment with a stale case revision and confirm no epoch is added.
10. Run successful → unavailable → successful assessments. Confirm the unavailable epoch has transition `SOURCE_UNAVAILABLE`, the case retains its last valid scope digest, and the recovery transition compares against that digest.
11. Create at least two cases with interleaved epochs. Switch the selected case in the frontend and confirm its displayed epoch is the last entry in that case's `epoch_ids`, never the global epoch count.

Because the official advisory can evolve, the exact normalized facts are validator outputs bound to an append-only epoch. A changed page must appear as a new scope digest and `SCOPE_CHANGED`, never overwrite the earlier record.

## Steward remediation status

- Contract suite: `23 passed`, including successful → unavailable → unchanged-success and successful → unavailable → changed-success sequences.
- Frontend suite: `6 passed`, including selected-case and multi-case epoch readback.
- GenVM lint: passed (`3 checks`).
- Production build: passed (`2,114 modules transformed`).
- Studio Next protocol v2 deployment: verified.
- Live v2 SDK E2E: passed with `2 cases / 4 items / 3 epochs`, including interleaved per-case epoch histories.
- Production frontend deployment: verified at `https://recallradius.pages.dev` (HTTP 200). The published bundle contains the v2 address and does not contain the retired v1 address.
