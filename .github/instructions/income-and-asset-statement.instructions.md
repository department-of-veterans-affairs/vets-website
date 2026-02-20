---
applyTo: "src/applications/income-and-asset-statement/**/*"
---

# Income and Asset Statement Application Instructions

## Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the income-and-asset-statement application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New configuration values in `constants.js`
- **Create new helper functions**: New utilities in `helpers.js`, `labels.jsx`, or submit helpers
- **Implement new business rules**: Changes to claimant type logic, recipient relationship handling, or array data management
- **Add new chapters or pages**: New form chapters, pages, or ArrayBuilder configurations
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New API calls or submit URL changes
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new components**: New components in `components/` or `containers/`
- **Modify the submission pipeline**: Changes to `submit.js`, `submit-helpers.js`, or data transformation logic
- **Change labels or enums**: Updates to `labels.jsx`
- **Update post-MVP content**: Changes gated by `showUpdatedContent()` helper

### How to Update These Instructions
1. **Locate the relevant section**: Find the section that relates to your change
2. **Add or update documentation**: Include function signatures, parameters, return types, and usage examples
3. **Update examples**: Ensure code examples reflect the new patterns
4. **Mark critical items**: Use **CRITICAL** marker for security-sensitive or business-critical information
5. **Update anti-patterns**: Add new "what NOT to do" items if relevant
6. **Keep it concise**: Focus on practical guidance that helps future development

### Documentation Standards
- Use clear, concise language
- Include code examples for complex patterns
- Document the "why" behind business rules
- Link related concepts
- Use consistent formatting (bullet points, code blocks, headers)
- Mark breaking changes or deprecations clearly

## Application Overview
- **Entry Name**: `income-and-asset-statement`
- **Root URL**: `/supporting-forms-for-claims/submit-income-and-asset-statement-form-21p-0969`
- **Entry File**: `app-entry.jsx`
- **Form ID**: `VA_FORM_IDS.FORM_21P_0969`
- **Tracking Prefix**: `income-and-asset-statement-`
- **Form Number**: `21P-0969`
- **Purpose**: Allow veterans, spouses, children, custodians, and parents to submit a Pension or DIC Income and Asset Statement
- **Product ID**: `83372f7f-9e10-4929-a230-7fe2967de75c`

## Architecture & State Management

### Redux Structure
- **Reducer**: `form` (save-in-progress via `createSaveInProgressFormReducer`)
- **No custom actions or action types** — relies entirely on platform save-in-progress form actions and built-in `setData`, `setPreSubmit`, `openReviewChapter`
- **State access**: `state.form` — standard platform form state with `data`, `submission`, `loadedData`, etc.

### API Layer
- **Backend Service**: vets-api

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/income_and_assets/v0/form0969` | Form submission |
| `POST` | `/v0/claim_attachments` | File upload (trust docs, owned asset docs) |
| `HEAD` | `/v0/maintenance_windows` | CSRF token refresh |
| `GET/PUT` | `/in_progress_forms/21P-0969` | Save-in-progress (platform) |

### Form Configuration
- **Prefill**: Enabled with custom `prefillTransformer`
- **Custom submit**: `config/submit.js` with CSRF retry logic
- **Migrations**: None (version 0, empty migrations array)
- **Downtime dependencies**: None (empty array)
- **Pre-submit**: Custom `PreSubmitInfo` component with dual-mode behavior (privacy agreement for logged-in veterans, Statement of Truth for all others)
- **Progress bar**: `v3SegmentedProgressBar: true`
- **Form options**: `focusOnAlertRole: true`, `useWebComponentForNavigation: true`
- **OMB**: Number `2900-0829`, expiration `11/30/2026`, 30 min response burden

### Form Chapters (12 total)

| # | Chapter | Key | Pattern | Key Pages |
|---|---------|-----|---------|-----------|
| 1 | Veteran and claimant information | `veteranAndClaimantInformation` | Standard | `claimantType`, `personalInformation`, `claimantInformation`, `emailAddress`, `phoneNumber`, `otherVeteranInformation`, `dateReceivedBy`, `incomeNetWorthDateRange` |
| 2 | Recurring income | `unassociatedIncomes` | ArrayBuilder | Unassociated income pages |
| 3 | Financial accounts | `associatedIncomes` | ArrayBuilder | Associated income pages |
| 4 | Property and business assets | `ownedAssets` | ArrayBuilder | Owned asset pages |
| 5 | Royalties and other assets | `royaltiesAndOtherProperties` | ArrayBuilder | Royalty/property pages |
| 6 | Asset transfers | `assetTransfers` | ArrayBuilder | Asset transfer pages |
| 7 | Trusts | `trusts` | ArrayBuilder | Trust pages |
| 8 | Annuities | `annuities` | ArrayBuilder | Annuity pages |
| 9 | Other assets | `unreportedAssets` | ArrayBuilder | Unreported asset pages |
| 10 | Discontinued income | `discontinuedIncomes` | ArrayBuilder | Discontinued income pages |
| 11 | Waived income | `incomeReceiptWaivers` | ArrayBuilder | Income receipt waiver pages |
| 12 | Supporting documents | `supportingDocuments` | Standard | `supportingDocuments`, `uploadDocuments` |

## Constants & Configuration

### Core Constants (`constants.js`)
```javascript
MAX_FILE_SIZE_BYTES = 20 * 1024 ** 2   // 20 MB
FILE_UPLOAD_URL = `${environment.API_URL}/v0/claim_attachments`
FORM_NUMBER = '21P-0969'
REGEXP.NON_DIGIT = /\D/g
```

### Labels (`labels.jsx`)
- **`claimantTypeLabels`** — `VETERAN`, `SPOUSE`, `CHILD`, `CUSTODIAN`, `PARENT`
- **`relationshipLabels`** — `VETERAN`, `SPOUSE`, `CHILD`, `PARENT`, `CUSTODIAN`, `OTHER`
- **`parentRelationshipLabels`** — `PARENT`, `SPOUSE`, `OTHER`
- **`spouseRelationshipLabels`** — `SPOUSE`, `CHILD`, `OTHER`
- **`custodianRelationshipLabels`** + `custodianRelationshipLabelDescriptions`
- **`transferMethodLabels`** — `SOLD`, `TRADED`, `GIFTED`, `CONVEYED`, `OTHER` (with descriptions)
- **`incomeFrequencyLabels`** / **`updatedIncomeFrequencyLabels`** (post-MVP)
- **`incomeTypeLabels`** / **`updatedIncomeTypeLabels`** (post-MVP)
- **`incomeTypeEarnedLabels`** — `INTEREST`, `DIVIDENDS`, `OTHER`
- **`generatedIncomeTypeLabels`** — `INTELLECTUAL_PROPERTY`, `MINERALS_LUMBER`, `USE_OF_LAND`, `OTHER`
- **`discontinuedIncomeTypeLabels`** — `WAGES`, `INTEREST`, `UNEMPLOYMENT_BENEFITS`, `LOTTERY_WINNINGS`, `OTHER`
- **`ownedAssetTypeLabels`** — `BUSINESS`, `FARM`, `RENTAL_PROPERTY`
- **`trustTypeLabels`** — `REVOCABLE`, `IRREVOCABLE`, `BURIAL`

## Helper Functions

### Core Helpers (`helpers.js`)
- `showUpdatedContent()` — Reads `sessionStorage.showUpdatedContent` for post-MVP content toggle
- `formatCurrency(num)` — Formats as `$1,234`
- `formatFullNameNoSuffix(name)` — `"First M. Last"`
- `formatPossessiveString(str)` — `"Johnson's"` / `"Williams'"`
- `isDefined(value)` — Not empty/undefined/null
- `isReviewAndSubmitPage()` — Checks pathname
- `hasSession()` — Checks localStorage

#### Conditional Required Helpers
- `annualReceivedIncomeFromAnnuityRequired(form, index)` — Conditional annuity income required check
- `annualReceivedIncomeFromTrustRequired(form, index)` — Conditional trust income required check
- `monthlyMedicalReimbursementAmountRequired(form, index)` — Medical reimbursement required check
- `otherAssetOwnerRelationshipExplanationRequired(form, index)` — Other relationship explanation required
- `otherRecipientRelationshipExplanationRequired(form, index, arrayKey)` — Other recipient explanation
- `otherIncomeTypeExplanationRequired(form, index, arrayIndex)` — Other income type explanation
- `otherGeneratedIncomeTypeExplanationRequired(form, index)` — Other generated income type explanation
- `otherTransferMethodExplanationRequired(form, index)` — Other transfer method explanation
- `recipientNameRequired(form, index, arrayKey)` — Recipient name required (original)
- `updatedRecipientNameRequired(form, index, arrayKey)` — Post-MVP: CHILD/PARENT/CUSTODIAN/OTHER need name
- `surrenderValueRequired(form, index)` — Surrender value required for annuities

#### Validation/Completeness Helpers
- `isRecipientInfoIncomplete(item)` — Validates recipient fields completeness
- `updatedIsRecipientInfoIncomplete(item)` — Post-MVP version (SPOUSE exempt from name requirement)
- `isIncomeTypeInfoIncomplete(item)` — Validates income type fields completeness
- `getIncompleteOwnedAssets(formData, allowlist)` — Filters/classifies owned assets by upload status
- `hasUploadedDocuments(uploadedDocuments)` — Checks for files
- `hasIncompleteTrust(trusts)` — Checks for incomplete trust uploads
- `shouldShowDeclinedAlert(ownedAssets)` — Checks for declined upload alerts

#### UI Helpers
- `sharedRecipientRelationshipBase` — Shared config object for recipient relationship fields
- `otherRecipientRelationshipTypeUI(arrayKey, key)` — Reusable uiSchema config
- `requireExpandedArrayField(expandedFieldKey)` — `updateSchema` for expanded array validation
- `generateDeleteDescription(props, getItemName)` — Delete dialog text
- `resolveRecipientFullName(item, formData)` — Resolves name for summary cards
- `updatedResolveRecipientFullName(item, formData)` — Post-MVP (SPOUSE → "Spouse")
- `fullNameUIHelper()` — Full name uiSchema with custom labels
- `sharedYesNoOptionsBase` — Shared config for yes/no fields

### Submit Helpers (`config/submit-helpers.js`)
- `flattenRecipientName({ first, middle, last })` — Converts name object to string
- `collectAttachmentFiles(data)` — Collects attachment files from trusts + ownedAssets into main files array
- `pruneFields(obj, rules)` / `pruneFieldsInArray(arr, rules)` — Cleans objects by rules
- `pruneConfiguredArrays(formData, config)` — Applies prune rules to configured arrays
- `remapOtherVeteranFields(data)` — Remaps `otherVeteranFullName` → `veteranFullName` etc when claimant is not the veteran
- `remapRecipientRelationshipFields(claimantType, itemData)` — CUSTODIAN/PARENT spouse → OTHER
- `remapRecipientRelationshipsInArrays(formData)` — Applies above across all arrays
- `remapIncomeTypeFields(itemData)` — Maps incomeType keys to human-readable labels
- `removeDisallowedFields(data, disallowedFields)` — Removes forbidden keys from submission
- `removeInvalidFields(input)` — Recursively removes `undefined`, `null`, `view:*` keys
- `replacer(key, value)` — Custom JSON.stringify replacer (flattens recipientName, normalizes phone, removes empty objects/nulls)

### Prefill Transformer (`config/prefill-transformer.js`)
Extracts from prefill data:
- `email` from `formData.email`
- `claimantPhone` from `formData.phone`
- `isLoggedIn` from `state.user.login.currentlyLoggedIn`
- `veteranSocialSecurityNumber` / `veteranSsnLastFour` (last 4 chars)
- `vaFileNumber` / `vaFileNumberLastFour` (last 4 chars)

### CSRF Token (`ensureValidCSRFToken.js`)
- `ensureValidCSRFToken()` — Checks localStorage for CSRF token; fetches new one from `/v0/maintenance_windows` if missing

## Business Logic & Requirements

### Claimant Types
The form supports 5 claimant types: `VETERAN`, `SPOUSE`, `CHILD`, `CUSTODIAN`, `PARENT`. Each type has:
- Different relationship label options for recipient fields
- Different dependent descriptions
- Different pre-submit behavior (privacy agreement vs. Statement of Truth)
- Different field remapping during submission

### Post-MVP Content Toggle
Controlled by `incomeAndAssetsContentUpdates` feature flag → stored in `sessionStorage.showUpdatedContent`:
- **Original**: Uses `recipientNameRequired`, `isRecipientInfoIncomplete`, `resolveRecipientFullName`, `incomeFrequencyLabels`, `incomeTypeLabels`
- **Updated**: Uses `updatedRecipientNameRequired`, `updatedIsRecipientInfoIncomplete`, `updatedResolveRecipientFullName`, `updatedIncomeFrequencyLabels`, `updatedIncomeTypeLabels`
- The updated versions change SPOUSE to be exempt from name requirement, add new frequency/type options

### Submission Pipeline (11 steps)
1. Deep clone form data (avoid Redux mutation)
2. Remap `otherVeteran*` → `veteran*` fields (when claimant is not the veteran)
3. Remap `recipientRelationship` fields for CUSTODIAN/PARENT claimant types
4. Remap discontinued income `incomeType` to human-readable labels
5. Collect attachment files from trusts and ownedAssets into main `files` array
6. Remove disallowed fields (`vaFileNumberLastFour`, `veteranSsnLastFour`, `otherVeteranFullName`, `otherVeteranSocialSecurityNumber`, `otherVaFileNumber`, `_metadata`, `metadata`, `isLoggedIn`)
7. Prune configured arrays (trusts, annuities, incomeReceiptWaivers conditional field cleanup)
8. Remove invalid/null/view-only fields recursively
9. Flatten `recipientName` objects + normalize `claimantPhone` (strip non-digits)
10. Wrap into `{ incomeAndAssetsClaim: { form: serializedData }, localTime }` envelope
11. POST to API

### Supplementary Forms
Certain owned asset types require additional VA forms:
- **Business assets** — VA Form 21P-4185
- **Farm assets** — VA Form 21P-4165
- **Trust documents** — Supporting trust documentation
These can be uploaded or mailed to VA Pension Intake Center.

### Pre-Submit Component
Dual-mode behavior:
- **Logged-in veterans**: Shows `VaPrivacyAgreement` using profile full name
- **All other claimant types**: Shows `VaStatementOfTruth` requiring signature matching

### Auto-Open Review Chapters
The `App.jsx` container auto-opens review chapters for incomplete owned assets and trusts to prompt users to complete uploads.

## Component Patterns

### Containers
- `App.jsx` — Root container. Feature toggle gating (`incomeAndAssetsFormEnabled`), Datadog monitoring, post-MVP content flag sync, auto-opens review chapters for incomplete assets/trusts, redirects unauthenticated users
- `IntroductionPage.jsx` — Form intro with accordion-based guidance per claimant type, VerifyAlert for LOA1 users (when `pbbFormsRequireLoa3`), SaveInProgressIntro, OMB info
- `ConfirmationPage.jsx` — Uses `ConfirmationView` pattern. Shows submission alert, confirmation number, print/save, NextStepsSection, SupplementaryFormsSection, WhatsNextProcessList, income change notification
- `PreSubmitInfo.jsx` — Dual-mode pre-submit (privacy agreement for logged-in veterans, Statement of Truth for others)

### Key Components
- `ContactInformationPage` — Displays/prefills email and phone from profile, links to edit pages
- `CustomPersonalInfo` — Shows personal info (name, SSN last 4, VA file #) from profile
- `CustomPersonalInfoReview` — Review mode for personal info
- `DependentDescription` — `va-additional-info` showing dependent definitions per claimant type
- `EditEmailPage` / `EditPhonePage` — Inline editors with validation
- `MailingAddress` — Static VA Pension Intake Center address (PO Box 5365, Janesville, WI 53547-5365)
- `NextStepsSection` — Post-submission next steps; checks for in-progress 21P-527EZ pension application
- `NoFormPage` — Shown when feature toggle is off
- `OwnedAssetsDescriptions` — Multiple sub-components for document upload guidelines and summaries
- `SSNReviewField` — Masked SSN display with Datadog privacy attributes (`dd-privacy-hidden`, `data-dd-action-name`)
- `SummaryDescriptions` — 7 summary description components for each ArrayBuilder chapter
- `SupplementaryFormsSection` — Post-confirmation section for mailing supplementary forms
- `FormAlerts/SupplementaryFormsAlert` — In-form alert for additional forms needed (business/farm)
- `FormAlerts/TrustSupplementaryFormsAlert` — Trust-specific document alert

## Testing Patterns

### Unit Tests
- **Framework**: Mocha/Chai/Sinon with React Testing Library
- **Location**: `tests/unit/` directory with mirrored structure
- **Test areas**: App, NoFormPage, CSRF, helpers, submit, submit-helpers, prefill-transformer, chapters (12 chapter directories), components (10 test files), containers (3 tests), config (3 tests)
- **Chapter tests**: `multiPageTests.spec.jsx` (multi-page), `pageTests.spec.jsx` (standard), plus per-chapter directories
- **Fixtures**: `tests/fixtures/mocks/` for store/user mocks

### E2E Tests (Cypress)
- `income-and-asset-statement-non-veteran.cypress.spec.js` — Non-veteran claimant flow
- `income-and-asset-statement-post-mvp.cypress.spec.js` — Post-MVP content updates flow
- `income-and-asset-statement-veteran.cypress.spec.js` — Veteran claimant flow
- **Fixtures**: `tests/e2e/fixtures/data/` with multiple test data variants
- **Helpers**: `tests/e2e/helpers/index.js` with `fillDateWebComponentPattern`, `fillStandardTextInput`

## Analytics & Monitoring

### Datadog RUM Configuration
- **Application ID**: `58e7ffff-9710-46f0-bf72-bf1f7b0f1ba4`
- **Client Token**: `puba95e30e73b0bae094ea212fca3870ef3`
- **Service**: `benefits-income-and-assets`
- **Version**: `1.0.0`
- **Session Rates**: 100% session, 100% replay
- **Toggle-gated by**: `incomeAndAssetsBrowserMonitoringEnabled`

### Datadog Logging
- `DD_LOGS.logger.error` used in `submit.js` for CSRF token error logging with `formId`, `trackingPrefix`, `inProgressFormId`, `errorCode/Status`, `timestamp`
- `SSNReviewField` applies `dd-privacy-hidden` and `data-dd-action-name` attributes for PII masking

### Google Analytics Events
- `income-and-assets-21p-0969-fetch-csrf-token-empty` — CSRF token missing
- `income-and-assets-21p-0969-fetch-csrf-token-success` — CSRF token fetched
- `income-and-assets-21p-0969-fetch-csrf-token-failure` — CSRF token fetch failed
- `income-and-assets-21p-0969-fetch-csrf-token-present` — CSRF token already present

## Feature Flags

| Flag | Purpose |
|------|---------|
| `incomeAndAssetsFormEnabled` | Controls whether the form renders or shows `NoFormPage` (Flipper: `income_and_assets_form_enabled`) |
| `incomeAndAssetsContentUpdates` | Controls post-MVP content updates via `sessionStorage.showUpdatedContent` |
| `incomeAndAssetsBrowserMonitoringEnabled` | Enables Datadog browser/session monitoring |
| `pbbFormsRequireLoa3` | Requires LOA3 verification before starting the form |

## Redux State Shape

```javascript
state = {
  form: {
    data: {
      claimantType: string, // 'VETERAN', 'SPOUSE', 'CHILD', 'CUSTODIAN', 'PARENT'
      veteranFullName: Object,
      claimantFullName: Object,
      veteranSocialSecurityNumber: string,
      veteranSsnLastFour: string,
      vaFileNumber: string,
      vaFileNumberLastFour: string,
      email: string,
      claimantPhone: string,
      isLoggedIn: boolean,
      otherVeteranFullName: Object,
      otherVeteranSocialSecurityNumber: string,
      otherVaFileNumber: string,
      dateReceivedBy: string,
      incomeNetWorthDateRange: Object,
      unassociatedIncomes: Array,
      associatedIncomes: Array,
      ownedAssets: Array,
      royaltiesAndOtherProperties: Array,
      assetTransfers: Array,
      trusts: Array,
      annuities: Array,
      unreportedAssets: Array,
      discontinuedIncomes: Array,
      incomeReceiptWaivers: Array,
      files: Array,
      // ...additional fields
    },
    submission: Object,
    loadedData: Object,
    // ...platform form state
  },
  featureToggles: { /* platform feature toggles */ },
  user: { login: { currentlyLoggedIn }, profile: { loading, savedForms } },
}
```

## Development Workflow

### Local Development
- **Dev server**: `yarn watch --env entry=income-and-asset-statement`
- **Access URL**: `http://localhost:3001/supporting-forms-for-claims/submit-income-and-asset-statement-form-21p-0969`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console
- **Flipper**: `income_and_assets_form_enabled` must be enabled

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder income-and-asset-statement`
- **Specific test**: `yarn test:unit path/to/test.unit.spec.js`
- **Cypress CLI**: `yarn cy:run --spec "src/applications/income-and-asset-statement/tests/e2e/*"`

## Common Patterns & Best Practices

### ArrayBuilder Pattern
Chapters 2–11 use ArrayBuilder for list-and-loop repeating data (incomes, assets, trusts, etc.). Each ArrayBuilder configuration provides intro, summary, item pages with add/edit/remove support.

### Post-MVP Content Gating
Use `showUpdatedContent()` to conditionally render updated content:
```javascript
import { showUpdatedContent } from '../helpers';
const label = showUpdatedContent() ? updatedIncomeTypeLabels : incomeTypeLabels;
```

### Claimant-Type-Aware Logic
Many fields and labels vary by claimant type. Use conditional logic based on `formData.claimantType`:
```javascript
depends: formData => formData.claimantType !== 'VETERAN'
```

### CSRF Token Handling
All submissions ensure a valid CSRF token before POST. On 403 failure, clears token, logs to DD_LOGS, and retries once.

## Common Pitfalls & Anti-patterns

### What NOT to Do
- **Never** bypass `ensureValidCSRFToken` on form submission
- **Never** skip Datadog privacy attributes on SSN or sensitive fields — use `dd-privacy-hidden` and `data-dd-action-name`
- **Never** mutate Redux state directly in submit pipeline — always deep clone first
- **Never** forget to handle all 5 claimant types when adding recipient relationship logic
- **Never** skip the field remapping step for non-veteran claimants in submission
- **Never** add new ArrayBuilder chapters without adding corresponding summary description components
- **Never** forget to update both original and `updated*` versions of helpers/labels when adding post-MVP content
- **Never** use Jest — use Mocha/Chai/Sinon instead
- **Never** forget to add new disallowed fields to the `removeDisallowedFields` list in submit helpers

### Performance Considerations
- Deep clone in submit pipeline prevents Redux state mutation
- `showUpdatedContent()` reads from sessionStorage (synchronous, fast)
- ArrayBuilder provides efficient list-and-loop UI for repeating data

## Import Patterns

### Platform Utilities
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
```

### Local Imports
```javascript
import { MAX_FILE_SIZE_BYTES, FILE_UPLOAD_URL, FORM_NUMBER, REGEXP } from '../constants';
import { showUpdatedContent, formatCurrency, recipientNameRequired } from '../helpers';
import { claimantTypeLabels, relationshipLabels, incomeTypeLabels } from '../labels';
import { ensureValidCSRFToken } from '../ensureValidCSRFToken';
import { prepareFormData, serializePreparedFormData, transform, submit } from '../config/submit';
import { remapOtherVeteranFields, removeDisallowedFields, collectAttachmentFiles } from '../config/submit-helpers';
```
