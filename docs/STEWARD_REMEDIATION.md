# Steward remediation

## 1. Preserve the last valid scope across source failure

Previously, every epoch assigned `case.last_scope_digest = scope_digest`. A `SOURCE_UNAVAILABLE` result has no normalized scope, so this replaced the last valid digest with an empty string. The next successful assessment was therefore compared against empty state.

Protocol v2 now:

- writes a distinct `SOURCE_UNAVAILABLE` scope transition for failed assessments;
- records `prior_valid_scope_digest` in every epoch for audit readback;
- leaves the failed epoch's own `scope_digest` empty because it has no normalized scope;
- updates `case.last_scope_digest` only after a `NORMALIZED` result;
- compares the next successful result with the last valid scope, producing `UNCHANGED` or `SCOPE_CHANGED` correctly.

Tests cover both sequences:

- successful → unavailable → same successful scope = `UNCHANGED`;
- successful → unavailable → changed successful scope = `SCOPE_CHANGED`.

## 2. Load the selected case's latest epoch

Previously, the frontend displayed `get_epoch(get_counts().epochs)`, which is the newest global epoch and can belong to another case.

The frontend now derives the latest epoch ID from the selected case's `epoch_ids` and calls `get_epoch` only with that ID. Tests cover two cases with interleaved global epoch IDs and a case with no assessments.

## Verification

- Contract/direct and architecture tests: `23 passed`.
- Frontend tests: `6 passed`.
- GenVM lint: `3 checks` passed.
- Frontend production build: passed, `2,114 modules transformed`.

## Deployment requirement

These changes alter persistent contract behavior and increment `get_protocol().version` to `2`. The prior contract `0x60B0769ca7A88ac89288a98dE974e2527841b97C` is v1 and cannot prove these fixes. Resubmission requires a new v2 deployment, fresh successful → unavailable → successful on-chain evidence, a multi-case readback, and an updated production frontend address.
