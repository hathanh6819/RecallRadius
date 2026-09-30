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

Because the official advisory can evolve, the exact normalized facts are validator outputs bound to an append-only epoch. A changed page must appear as a new scope digest and `SCOPE_CHANGED`, never overwrite the earlier record.
