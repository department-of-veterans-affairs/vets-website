# Rspack E2E Test Failure Investigation

## Round 1 - Initial CI Comparison

Comparing CI runs:
- **Main:** run 22161584712
- **Branch (feature/rspack-config):** run 22161601873

| Metric | Main | Branch (rspack) |
|--------|------|-----------------|
| Failed shards | 3/7 | 4/7 |
| Unique failing specs | 4 | 13 |
| Branch-only failures | — | **9** |

### Fix 1: Missing Inline Scripts in Scaffold HTML

**Root cause:** `script/generate-scaffold-html.js` had no remote fallback for `record-event.js` and `static-page-widgets.js` when content-build isn't local (always the case in CI). Without `record-event.js`, `window.dataLayer` is never initialized → apps calling `window.dataLayer.push()` directly (burials-ez, pensions) throw TypeError → form submission hangs.

**Fix:** Added remote GitHub fallback to `generate-scaffold-html.js`. Committed as `48e32a7f25`.

---

## Round 2 - After Scaffold Fix

Comparing CI runs:
- **Main:** run 64200145515/64200145580/64200145585
- **Branch:** run 64199437774/64199437803/64199437827/64199438000

| Metric | Main | Branch (rspack) |
|--------|------|-----------------|
| Unique failing specs | 4 | 13 |
| Shared failures | 4 | 4 |
| Branch-only failures | — | **9** |

### Shared failures (flaky, not rspack-specific)
- `accreditation/21a/tests/e2e/21a-multiform-upload.cypress.spec.js`
- `representative-form-upload/tests/e2e/form-21-526EZ.cypress.spec.js`
- `representative-form-upload/tests/e2e/itf.cypress.spec.js`
- `letters/tests/03-letters-new-design.cypress.spec.js`

### Branch-only failures (9)

#### Category A: `require.ensure` broken in rspack (4 specs) — FIXED

rspack compiles `require.ensure([], require => { ... })` as `Promise.resolve().then((l => { ... }))` where `l` receives `undefined` instead of the `require` function. The only usage was in `claims-status/actions/index.js:submitFiles()` for FineUploaderBasic. `l("fine-uploader/lib/core")` throws silently → FineUploader never initializes → no upload POST request fires → `cy.wait('@documents')` times out.

**Fix:** Converted `require.ensure` to `import(/* webpackChunkName: "claims-uploader" */ 'fine-uploader/lib/core').then(...)`. Committed as `726cf4c58d`.

Affected specs:
1. `claims-status/tests/e2e/02.claim-files.v2.cypress.spec.js`
2. `claims-status/tests/e2e/05.claim-document-request.cypress.spec.js`
3. `claims-status/tests/e2e/10.va-file-input-multiple.cypress.spec.js`
4. `claims-status/tests/e2e/11.date-discrepancy-mitigation.cypress.spec.js`

#### Category B: `radioUI` rest-spread crashes under SWC (3 specs) — FIXED

**Root cause:** `radioUI('Branch of service')` in `veteranServiceInformation.js` passes a string to a function that destructures with `...rest` spread. SWC's `_object_without_properties` helper calls `Reflect.ownKeys(source)` which throws `TypeError: Reflect.ownKeys called on non-object` on primitives. Babel's equivalent uses `Object.getOwnPropertyNames` which is more lenient. This crash occurs during module initialization, preventing React from mounting entirely — no component renders, no router redirect fires.

**Misdiagnosed as:** `indexRoute.onEnter` redirect failure. The actual symptom (URL staying at `/appoint-rep/` instead of redirecting to `/introduction`) was caused by the app never mounting at all, not by a react-router bug.

**Fix:** Updated `radioUI` in `radioPattern.jsx` to handle string arguments like `selectUI` and `textUI` already do: `typeof options === 'object' ? options : { title: options }`. Committed as `f238f9fcc3`.

Affected specs:
1. `representative-appoint/tests/e2e/navigation/2122.cypress.spec.js`
2. `representative-appoint/tests/e2e/navigation/2122a.cypress.spec.js`
3. `representative-appoint/tests/e2e/navigation/2122-digital-submission.cypress.spec.js`

#### Category C: `.form-progress-buttons` not found (2 specs) — NOT YET FIXED

`income-and-asset-statement` E2E tests fail with: `Expected to find element: .form-progress-buttons, but never found it.` This class is rendered by `FormNavButtons.jsx`. The test ran for 4+ minutes before failing, suggesting it progressed through many pages before encountering the issue. Both non-veteran and veteran variants fail.

Possible causes:
- Same `indexRoute.onEnter` issue as Category B (income-and-asset-statement also uses this pattern)
- Timing difference — rspack bundle structure may affect component render timing
- Feature toggle or conditional rendering interaction

Affected specs:
1. `income-and-asset-statement/tests/e2e/income-and-asset-statement-non-veteran.cypress.spec.js`
2. `income-and-asset-statement/tests/e2e/income-and-asset-statement-veteran.cypress.spec.js`

---

## Expected Results After All Fixes

After scaffold fix (4→0 originally), `require.ensure` fix (4 specs), and `radioUI` fix (3 specs), 7 of 9 branch-only failures should be resolved. 2 remaining (`income-and-asset-statement`) need further investigation — they do NOT use `radioUI` with a string, so their `.form-progress-buttons` issue has a different root cause.
