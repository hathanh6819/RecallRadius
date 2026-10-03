# RecallRadius — FDA Recall Scope Resolver

RecallRadius is a GenLayer dApp that converts one fixed FDA advisory into append-only scope epochs, then deterministically intersects registered products with the normalized UPC, lot, best-by and distribution fields. AI consensus extracts a closed fact tuple; contract code—not the model—derives `AFFECTED` or `NOT_AFFECTED` for every item.

The constructor takes no arguments. The deployer has no admin or reviewer role. Any wallet can create its own case, multiple wallets can register their own products while it is open, and any wallet can trigger assessment after the creator seals the batch.

## Lifecycle

```text
create open case → independent wallets register products → creator seals batch
→ any wallet opens FDA scope epoch → validators normalize closed source facts
→ deterministic item intersection → append-only epoch diagnostics
```

## Public source fixture

The contract derives and fetches one fixed official source: the [FDA frozen-blueberry outbreak advisory](https://www.fda.gov/food/outbreaks-foodborne-illness/outbreak-investigation-e-coli-o145h28-frozen-blueberries-july-2026). It does not accept user-provided evidence URLs.

Canonical reviewer fixtures:

- Positive: GreenWise, UPC `41415-06453`, Florida.
- Negative control: Other Brand, UPC `999999999999`, lot `SAFE77`, Florida.
- Exact-lot branch: Great Value, lot `6040 01-6`, best by `2028-02-09`, a listed distribution jurisdiction. The contract does not require a Great Value UPC because the advisory does not publish one in its product scope text.

FDA states that its recall pages publish company announcements as a public service. RecallRadius classifies an item against the normalized page scope; it does not certify product safety or provide medical advice.

## Architecture difference

This is not a renamed claim graph, escrow, authorization gate, policy comparison, or recall circuit breaker. Its persistent primitive is a multi-wallet **sealed classification batch** with append-only source epochs. There are no dependencies or propagation waves. Each valid source epoch preserves its source digest, scope digest, per-item field-intersection diagnostics, and scope transition (`INITIAL`, `UNCHANGED`, or `SCOPE_CHANGED`). A failed assessment records the distinct `SOURCE_UNAVAILABLE` transition without replacing the case's last valid scope digest, so recovery is compared with the last valid scope.

Unlike one-shot semantic-verdict contracts, the model cannot directly select item status. Validators only normalize a bounded FDA tuple; deterministic contract logic performs the intersection.

## Local verification

```powershell
python -m pytest tests -q
python -X utf8 -m genvm_linter.cli contracts/recall_radius.py
cd frontend
npm ci
npm test
npm run build
```

## Current deployment status

- Website: https://recallradius.pages.dev
- Repository: https://github.com/hathanh6819/RecallRadius
- Retired v1 contract: `0x60B0769ca7A88ac89288a98dE974e2527841b97C`
- Chain ID: `61997`
- Full finalized transaction matrix and UI readback: [`docs/LIVE_EVIDENCE.md`](docs/LIVE_EVIDENCE.md)

The source now reports protocol v2 and fixes audit-readback behavior requested by the steward. A new v2 address and fresh live evidence are required before resubmission; the existing production URL still represents the retired v1 deployment until that redeploy is completed.
