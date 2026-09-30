# Source manifest

## Authority

- Provider: U.S. Food and Drug Administration (FDA)
- Source ID stored by contract: `FDA_BLUEBERRY_2026`
- Canonical URL: `https://www.fda.gov/food/outbreaks-foodborne-illness/outbreak-investigation-e-coli-o145h28-frozen-blueberries-july-2026`
- Access: public HTTPS; no login, cookie, API key or user-controlled URL
- Purpose: normalize current recalled-product identifiers and distribution scope

The FDA page is an official public source. FDA explains that company recall announcements are posted as a public service and that recall records identify products using fields such as product names, packaging, UPCs, lot codes, use-by dates and distribution information.

## Contract acquisition policy

The source URL is a constant in production code. `assess_epoch` renders it in text mode and rejects content shorter than 500 or longer than 50,000 characters. Oversized content is not silently truncated. Source failure, malformed model output, validator disagreement and out-of-bound values produce `SOURCE_UNAVAILABLE`.

The source bytes/text used by each successful epoch are committed through `source_digest`. The normalized scope is separately committed through `scope_digest`. These prove the assessed snapshot and normalized tuple; they do not imply FDA endorsement or product safety.

## Closed normalized scope

Validators may return only:

- `greenwise_all_lots: boolean`
- `greenwise_upcs: bounded digits-only array`
- `great_value_lot: normalized alphanumeric string`
- `best_by: YYYY-MM-DD`
- `states: sorted, unique two-letter jurisdictions`

Contract code uses these values to classify registered items. Free-form explanations do not enter state.
