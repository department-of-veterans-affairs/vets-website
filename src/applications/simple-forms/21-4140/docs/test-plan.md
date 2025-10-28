# VA Form 21-4140 Test Plan

## Overview
This document outlines the recommended automated test coverage for the redesigned VA Form 21-4140 simple-form application. The plan mirrors patterns already used by nearby simple forms (for example, 21-4142 and 21-4138) so that future maintenance and onboarding stay predictable.

## Reference Implementations
- `src/applications/simple-forms/21-4142/tests/e2e/4142-medial-release.cypress.spec.js`
- `src/applications/simple-forms/21-4138/tests/e2e/4138-ss.cypress.spec.js`
- `src/applications/simple-forms/20-10207/tests/e2e/10207-pp.cypress.spec.js`
- `src/applications/simple-forms/21-4138/tests/unit/**`
- `src/applications/simple-forms/20-10207/tests/unit/**`

These files demonstrate the Cypress form tester set-up, shared fixtures, SIP mocks, and Jest patterns that should be reused for Form 21-4140.

## End-to-End Coverage
1. **Employed happy-path flow**
   - Exercises Introduction → Required information → Employment check → Array-builder employer pages (add at least one employer) → Section 2 signature → Review & submit.
   - Verifies Section 3 routes never appear and submission hits `formConfig.submitUrl` mock.
   - Reuses `shared/tests/e2e/helpers` utilities and injects `cy.injectAxeThenAxeCheck` on at least one gating page.

2. **Unemployed alternate flow**
   - Starts from Introduction and selects "no" on the employment check.
   - Confirms legacy `employedByVA` data backfills the radio when present.
   - Ensures Section 2 pages are skipped, Section 3 intro + signature are required, and the review button text matches medical release copy updates.
   - Validates the warning alert rendered when Pre-Section selection is "no" and performs an axe check on the alert state.

3. **Save-in-progress resume guardrail (optional)**
   - Seeds SIP GET payload with partially completed employment info.
   - Confirms the wizard resumes at the correct page with values populated and that `hasEmploymentInLast12Months` still controls route visibility.
   - Mirrors SIP mocks from 20-10207.

### Fixtures & Mocks
- Add minimal and maximal form data JSON under `tests/e2e/fixtures/data/` for employed vs. unemployed scenarios.
- Provide `featureToggles.json`, `user.json`, `sip-get.json`, `sip-put.json`, and `application-submit.json` consistent with existing forms.

## Unit Test Coverage
1. **Utilities (`utils/employment.js`)**
   - Truth table for `hasEmploymentInLast12Months` covering current selection, legacy values, and undefined fallback.
   - Assertions that `shouldShowEmploymentSection` and `shouldShowUnemploymentSection` proxy correctly.

2. **Container components**
   - `PreSectionOnePage`: renders alert on "no", requires selection before navigation, and calls `getNextPagePath` when appropriate.
   - `RequiredInformationPage`: checkbox must be checked before continuing; blur triggers error state.
   - `EmploymentCheckPage`: normalizes legacy data, updates form data on change, prevents forward navigation without a selection, and toggles error messaging on blur.
   - Use React Testing Library with mocked `setFormData`, `goForward`, and routing props (see 21-4138 container specs).

3. **Schema/UI configuration**
   - `pages/personalInformation1`: confirms required fields and `getFullNameLabels` formatting.
   - `pages/contactInformation1`: ensures phone and address required rules, checkbox optionality, and label overrides.
   - `pages/sectionTwo` array builder: unit-test `employersOptions.isItemIncomplete` and max item constraints.
   - Section 2 & Section 3 signature pages: validate checkbox requirements and alert visibility metadata.

4. **Helpers**
   - Add coverage for `getFullNameLabels`, including middle-name override and capitalization.

5. **Config sanity checks**
   - Verify `formConfig.additionalRoutes` map to the intended components.
   - Assert each spread `sectionTwo` page receives a `depends` wrapper invoking `shouldShowEmploymentSection`.

## Implementation Notes
- Place Cypress specs in `tests/e2e/` with names such as `4140-employed.cypress.spec.js` and `4140-unemployed.cypress.spec.js`.
- Organize Jest specs under `tests/unit/` mirroring the directory structure used by adjacent forms.
- Reuse shared helpers from `src/applications/simple-forms/shared/tests/e2e/helpers.js` to minimize custom command code.
- Remember to wire fixtures through `createTestConfig` (set `useWebComponentFields: true`, `dataPrefix`, and `dataDir`).

## Next Steps
1. Scaffold e2e spec files and fixture data.
2. Implement Jest coverage for utilities, containers, and schemas.
3. Run `yarn test:e2e:headless --spec <new specs>` and `yarn test:unit --app simple-forms` (or equivalent targeted scripts).
4. Capture results and add CI gating once the form ships to production.
