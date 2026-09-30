# Threat model

## Protected invariants

- Deployment never creates a privileged runtime role.
- Only an item's authenticated registrant may edit it, and only before sealing.
- Only the case creator may seal its registration batch.
- Any wallet may assess a sealed case.
- User input cannot alter the FDA source URL.
- The model cannot directly assign an item status.
- Every assessment writes a new immutable epoch; prior epochs are never overwritten.
- Stale case revisions cannot open an epoch.
- Source or consensus failure reaches the explicit `SOURCE_UNAVAILABLE` state.
- Contract custody is always zero because no method is payable.

## Adversarial paths

- Prompt injection in page or item text: page is declared inert; model output is a closed schema; item status is derived outside the prompt.
- Arbitrary source substitution: impossible through public arguments.
- Cross-wallet item mutation: rejected through transaction sender binding.
- Creator rewriting after seal: rejected.
- Oversized or missing page: bounded safe failure.
- Unknown enum, duplicate/missing keys, malformed UPC/state/date: safe failure.
- Validator disagreement: safe failure.
- Concurrent/stale assessment: expected revision guard.
- Ambiguous or incomplete item data: rejected during registration; unmatched complete items resolve `NOT_AFFECTED` against this exact scope, not “safe.”

The application must not describe `NOT_AFFECTED` as proof that a product is safe; it only means the submitted fields did not intersect the normalized advisory scope.
