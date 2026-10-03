# Studio Next live evidence

## Protocol v2 remediation run — 2026-10-03

- Contract: `0xDAD201Cde0623C1e1BC1FFe87795f5ef7140A96f`
- Network: GenLayer Studio Next, chain ID `61997`
- Protocol readback: `RecallRadius`, version `2`, `custody=false`
- Actors: case author `0x1D283b45974B0be9630DFD1deC6A62a9B72B2760`; independent participant/assessor `0xf96Cf822F9f4e76956AB9fAAa22B3BdCD7b10aD6`
- Deployer wallet performed deployment only and held no application role.

### Finalized transaction evidence

| Action | Transaction hash |
|---|---|
| Create case 1 | `0x25222c67e22be4a30ad9d7746a91d1a748bf3fb532ce86a86de0623d40410337` |
| Register case 1 positive fixture | `0x41239300a0027924a07e81eb03cad20048321334d91b9f562342d8231f6df449` |
| Register case 1 negative control | `0xc5787173b55bb6d5d32a5deb2420430d8db05806ff2def7dc7d3cf8bcaeddd68` |
| Seal case 1 | `0x99eec0ff3d2b22387706e3e3bcbe5b76966019bb01a5148644ca1b894c3374ce` |
| Create case 2 | `0x631c92ac525a0a2a44960f3e5fe647b858470a3b8411fbb97c38c1c20db028a5` |
| Register case 2 positive fixture | `0xa48a58edbf4bdc2c8277ee5ab04561d8e983192b537082e1cc94015c34b2801c` |
| Register case 2 negative control | `0xd22e17ccab0d5664d320a2f15e31699374d7b8ac7f2515218454bd0564e17d5c` |
| Seal case 2 | `0x3e3170fc788c7bab21bcbbce221d787bf95ce300076aaa22b38ed4dcb5be6d2d` |
| Assess case 1 → epoch 1 | `0xb16b84f8faa0bfd0aaf00f9c6d9ab9ec4936e073f5629a94709784b231649a35` |
| Assess case 2 → epoch 2 | `0x0f893a7686a504fcbf10571a43552626670fbe10c6f19d81d05e453851641b37` |
| Assess case 1 again → epoch 3 | `0x27a9c4c61a97c0a444f5daf5f7e52e854879546600922b36a393ca981cd34622` |

Every receipt reached `FINISHED_WITH_RETURN` with `MAJORITY_AGREE` consensus.

### Finalized state and steward-request proof

- Final counters: `2 cases / 4 items / 3 epochs`.
- Case 1 owns epoch IDs `[1, 3]`; case 2 owns `[2]`.
- Global epoch ownership is `1 -> case 1`, `2 -> case 2`, `3 -> case 1`.
- All three epochs are `NORMALIZED`; transitions are `INITIAL`, `INITIAL`, `UNCHANGED`.
- Epoch 3's `prior_valid_scope_digest` equals epoch 1's valid `scope_digest`.
- Case 1's `last_scope_digest` equals epoch 3's valid `scope_digest`.
- Four finalized item classifications read back as `AFFECTED`, `NOT_AFFECTED`, `AFFECTED`, `NOT_AFFECTED`.

This live run proves that selected-case history is not inferred from the global epoch counter and that a later valid assessment is compared with the case's prior valid scope. The deliberate `SOURCE_UNAVAILABLE` transition is covered by controlled contract tests because the fixed public FDA source was not sabotaged for live evidence. Those tests prove both successful → unavailable → unchanged-success and successful → unavailable → changed-success behavior.

### Reproduction

Run `node scripts/run_live_v2_e2e.mjs` with the two designated test-wallet keys in the environment. The script rejects unexpected wallet addresses, waits for finality after every write, checks per-case epoch ownership and exits nonzero on any mismatch. It never assigns an application role to the deployment wallet.

### Production frontend

Cloudflare Pages deployed the v2 build at `https://recallradius.pages.dev` (immutable deployment `https://d4f44078.recallradius.pages.dev`). Both returned HTTP 200. The published JavaScript bundle contains `0xDAD201Cde0623C1e1BC1FFe87795f5ef7140A96f` and does not contain the retired v1 contract address.

## Protocol v1 historical run — 2026-09-30

Verified on GenLayer Studio Next (chain ID `61997`) on 2026-09-30.

- Production UI: https://recallradius.pages.dev
- GitHub repository: https://github.com/hathanh6819/RecallRadius

## Deployment and actors

- Contract: `0x60B0769ca7A88ac89288a98dE974e2527841b97C`
- Case author: `0x1D283b45974B0be9630DFD1deC6A62a9B72B2760`
- Independent shopper and permissionless assessor: `0xf96Cf822F9f4e76956AB9fAAa22B3BdCD7b10aD6`
- Deployer is not assigned any protocol authority. The constructor has no arguments.

Initial finalized `get_protocol` returned `RecallRadius`, source `FDA_BLUEBERRY_2026`, architecture `append-only-scope-epochs-deterministic-intersection`, `custody=false`. Initial counts were zero.

## Finalized transaction matrix

| Scenario | Transaction | Finalized result |
|---|---|---|
| Create case | `0x83ead554bcc7b19fc0109d0832f129cac17730075eae773ffad73441e1f92ae3` | `FINISHED_WITH_RETURN`, `MAJORITY_AGREE`; cases 0 → 1 |
| Register GreenWise positive fixture | `0x7e5f99b9dacb4a038c4a26e99c9f2f8b92b4f56e2e40509e1b6a54ba332c4f42` | items 0 → 1 |
| Independent wallet registers negative control | `0x7fbbde1b3b3409d73dda147ea2e169bd030617a4aba971be1a6b45ceefee853a` | items 1 → 2 |
| Unauthorized item edit | `0x1159ccd40d47c870828f8a34035a341e26d587ab3d3776e18dcfb653e5d3e2cd` | finalized; item/counters unchanged |
| Unauthorized seal | `0xf65ed1015e8bb5f7d1df74dfe08bd03e520a9ac51e1de539ca611b82c7a1424a` | finalized; case remained open and counters unchanged |
| Creator seals case | `0x5c47b49e1de0521966a373e02285b4163fdb9f03d77aea8e80e95117ebe37e47` | case status `SEALED`, revision `4` |
| Stale revision assessment | `0xbe420bc360c0c4b83a981dc7ebcaa2a8200f13ee8cff09b3e8db7245e0742637` | finalized; epochs remained `0` |
| Permissionless live assessment | `0x8cef7816e2cbcc703fcd62cffc5ccc5397aa962678ca539f27bd9a6d9cbe5650` | `FINISHED_WITH_RETURN`, `MAJORITY_AGREE`; epochs 0 → 1 |

All successful and guarded calls above reached finality with validator consensus. Guard failures are modeled as explicit return values, so their transactions finalize while preserving state.

## Finalized readback

Epoch 1 is `NORMALIZED` with transition `INITIAL`. Validators extracted:

- GreenWise all-lots flag: `true`
- GreenWise UPCs: `4141506453`, `4141506753`, `4141512053`, `4141512153`
- Great Value lot: `6040016`
- Best-by: `2028-02-09`
- Distribution jurisdictions: 27 codes including FL and PR
- Source digest: `sha256:c9576b53d6ffd44aa0d6a510101773930082d10b88419a37691e26f7bb64d61a`
- Scope digest: `sha256:5f3760522af10924b8aa94b73728984975806a870677111a8fbe2fe1a6e90441`

Deterministic contract intersection produced:

- Item 1, GreenWise UPC `4141506453`, FL: `AFFECTED`, reason `GREENWISE_ALL_LOTS_SCOPE`.
- Item 2, Other Brand UPC `999999999999`, FL: `NOT_AFFECTED`, reason `FIELD_INTERSECTION_MISS`.

Final counters: `1 case / 2 items / 1 epoch`.

## Frontend finalized-state synchronization

The production build was opened against the deployed contract and allowed to complete its finalized RPC reads. The rendered UI matched the contract readback:

- counters: `1 case / 2 items / 1 scope epoch`;
- case 1: `SEALED`, title `Frozen berry recall scope audit`;
- item 1: `AFFECTED / GREENWISE_ALL_LOTS_SCOPE`;
- item 2: `NOT_AFFECTED / FIELD_INTERSECTION_MISS`;
- latest epoch: `#1 / NORMALIZED / INITIAL`;
- source digest: `sha256:c9576b53d6ffd44aa0d6a510101773930082d10b88419a37691e26f7bb64d61a`;
- displayed contract: `0x60B0769ca7A88ac89288a98dE974e2527841b97C`.

The UI write helper waits for transaction finality and calls the same readback routine after every submitted action. Reviewer-triggered manual refresh uses that routine as well.

The Cloudflare Pages production URL returned HTTP 200 and was inspected after deployment. Its rendered state showed the same `1 / 2 / 1` counters, sealed case, two item verdicts, normalized epoch, source digest and contract address listed above.

## Adversarial and fail-closed coverage

Automated contract tests cover malformed or missing model fields, wrong field types, oversized/undersized source bodies, invalid consensus payloads, adversarial authority text attempting to add an administrator field, invalid item input, unauthorized mutation, unauthorized seal, post-seal edits and stale revisions. Nondeterministic source/model failure cases are intentionally tested with controlled mocks; the fixed live FDA page is not modified for testing.

The first assessment attempt made during testing used validator allocation 700 and was rejected by the RPC before contract execution (`PhaseTimeoutOutOfBounds(700,30,600)`). The client and scripts now use the accepted maximum of 600; this rejected envelope did not alter contract state.
