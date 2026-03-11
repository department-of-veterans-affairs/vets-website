---
applyTo: "src/applications/burials-ez/**/*"
---

# Burials-EZ Application Instructions

## Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the burials-ez application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New configuration values in `utils/constants.js`
- **Create new helper functions**: New utilities in `utils/helpers.jsx`, `utils/validation.js`, or `utils/upload.js`
- **Implement new business rules**: Changes to burial allowance logic, death location handling, or Elizabeth Dole Act dates
- **Add new chapters or pages**: New form chapters, pages, or chapter configurations
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New API calls or submit URL changes
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new components**: New components in `components/`
- **Modify the submission pipeline**: Changes to `submit.js`, `transform`, or CSRF logic
- **Update migrations**: New data migrations in `migrations.js`
- **Change labels or enums**: Updates to `utils/labels.jsx`

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
- **Entry Name**: `burials-ez`
- **Root URL**: `/burials-memorials/veterans-burial-allowance/apply-for-allowance-form-21p-530ez`
- **Entry File**: `burials-entry.jsx`
- **Form ID**: `VA_FORM_IDS.FORM_21P_530EZ`
- **Tracking Prefix**: `burials-530-`
- **JSON Schema**: `vets-json-schema/dist/21P-530EZ-schema.json`
- **Purpose**: Allow claimants to apply for Veterans burial allowance benefits using VA Form 21P-530EZ
- **Product ID**: `02990746-9fc6-425b-9fdd-b33bf32ee580`

## Architecture & State Management

### Redux Structure
- **Reducer**: `form` (save-in-progress via `createSaveInProgressFormReducer`)
- **No custom actions or action types** — relies entirely on platform save-in-progress form actions
- **State access**: `state.form` — standard platform form state with `data`, `submission`, `loadedData`, etc.

### API Layer
- **Backend Service**: vets-api

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/burials/v0/claims` | Form submission |
| `POST` | `/v0/claim_attachments` | File upload (death cert, DD214, receipts, evidence) |
| `HEAD` | `/v0/maintenance_windows` | CSRF token refresh |
| `GET/PUT` | `/in_progress_forms/21P-530EZ` | Save-in-progress (platform) |

### Form Configuration
- **Prefill**: Enabled (`prefillEnabled: true`)
- **Custom submit**: `config/submit.js` with CSRF retry logic
- **Migrations**: 3 active migrations (version 3), 1 commented-out migration (3→4 for PDF alignment)
- **Downtime dependencies**: `externalServices.icmhs`
- **Pre-submit**: Platform `preSubmitInfo` (Statement of Truth)
- **Progress bar**: `v3SegmentedProgressBar: true`
- **Form options**: `useWebComponentForNavigation: true`

### Form Chapters

| Chapter | Key | Key Pages |
|---------|-----|-----------|
| Your Information | `claimantInformation` | `relationshipToVeteran`, `personalInformation`, `mailingAddress`, `contactInformation` |
| Deceased Veteran Information | `veteranInformation` | `veteranInformation`, `burialInformation`, `locationOfDeath`, `homeHospiceCare`, `homeHospiceCareAfterDischarge`, location-specific detail pages |
| Military History | `militaryHistory` | `separationDocuments`, `uploadDD214`, `serviceNumber`, `servicePeriod`/`servicePeriods`, `previousNamesQuestion`, `previousNames`, POW pages |
| Benefits Selection | `benefitsSelection` | `benefitsSelection`, `burialAllowancePartOne`/`PartTwo`, `burialAllowanceConfirmation`, `finalRestingPlace`, `nationalOrFederalCemetery`, `cemeteryLocation`, `plotAllowancePartOne`/`PartTwo`, `transportationExpenses` |
| Additional Information | `additionalInformation` | `directDeposit`, `supportingDocuments`, `deathCertificate`/`deathCertificateRequired`, `transportationReceipts`, `additionalEvidence`, `fasterClaimProcessing` |

## Constants & Configuration

### Core Constants (`utils/constants.js`)
```javascript
MAX_FILE_SIZE_BYTES = 20 * 1024 ** 2   // 20 MB
FILE_UPLOAD_URL = `${environment.API_URL}/v0/claim_attachments`
FORM_NUMBER = VA_FORM_IDS.FORM_21P_530EZ
```

### Labels (`utils/labels.jsx`)
- **`relationshipLabels`** — `spouse`, `child`, `parent`, `executor`, `funeralDirector`, `otherFamily`
- **`locationOfDeathLabels`** — `atHome`, `nursingHomePaid`, `nursingHomeUnpaid`, `vaMedicalCenter`, `stateVeteransHome`, `other`
- **`allowanceLabels`** — `service`, `nonService`, `unclaimed` (each with `title` + `description`)
- **`benefitsLabels`** — `burialAllowance`, `plotAllowance`, `transportation`
- **`restingPlaceLabels`** — `cemetery`, `mausoleum`, `privateResidence`, `other`
- **`cemeteryTypeLabels`** — `cemetery`, `tribalLand`, `none`
- **`fasterClaimLabels`** — `Y`, `N`
- **`serviceBranchLabels`** — `army`, `navy`, `airForce`, `coastGuard`, `marineCorps`, `spaceForce`, `usphs`, `noaa`

## Helper Functions

### Form Helpers (`utils/helpers.jsx`)
- `generateTitle(text)` — Renders `<h3>` title
- `generateHelpText(text, className?)` — Renders `<span>` help text
- `generateDeathFacilitySchemas(facilityKey, facilityName?)` — Generates facility name/location schemas for death location pages
- `checkboxGroupSchemaWithReviewLabels(keys)` — Checkbox schema with Selected/Not selected review labels
- `benefitsIntakeFullNameUI(formatTitle, uiOptions?)` — Full name UI with Benefits Intake name validation
- `isProductionEnv()` — Production check (not localhost, no DD_RUM init, no Mocha)
- `pageAndReviewTitle(title)` — Returns `{ title, reviewTitle }` shorthand
- `showDeathCertificateRequiredPage(form)` — True unless claiming burial allowance + service-connected + VA medical center
- `showHomeHospiceCarePage(form)` — True if death at home AND before 2026-09-30 (Elizabeth Dole Act sunset)
- `showHomeHospiceCareAfterDischargePage(form)` — True if death at home AND homeHospiceCare is true
- `DateReviewField({ children, title })` — Custom review field for formatted dates
- `showPdfFormAlignment()` — Reads `sessionStorage.showPdfFormAlignment === 'true'`
- `maskBankInformation(string, unmaskedLength)` — Masks bank info with ● characters

### Validation (`utils/validation.js`)
- `validateBurialAndDeathDates(errors, page)` — Validates burial >= death date, death > birth date
- `validateBenefitsIntakeName(errors, value)` — Requires at least one A-Z character
- `validateFileUploads({ required?, requiredMessage? })` — File upload validation factory

### Upload Helpers (`utils/upload.js`)
- `burialUploadUI({ title, required?, ...options })` — File upload UI config (pdf/jpeg/jpg/png, 20MB max, skips upload on localhost)

### CSRF Token (`utils/ensureValidCSRFToken.js`)
- `ensureValidCSRFToken()` — Checks localStorage for CSRF token; fetches new one from `/v0/maintenance_windows` if missing

## Business Logic & Requirements

### Elizabeth Dole Act
The `showHomeHospiceCarePage` helper implements a sunset date for VA Home Hospice-related questions per the Elizabeth Dole Act. Home hospice care questions only appear when the veteran died at home AND the death date is on or before `2026-09-30`.

### Death Certificate Logic
- Death certificate is **required** when the claimant is NOT claiming burial allowance for service-connected death at a VA medical center
- Death certificate is **recommended** (but not required) when claiming burial allowance for service-connected death at a VA medical center

### Benefits Selection
The form supports three benefit types that can be claimed independently:
- **Burial Allowance** — Service-connected, non-service-connected, or unclaimed remains
- **Plot or Interment Allowance** — For cemetery/tribal land burial costs
- **Transportation** — Reimbursement for transporting remains

### Burial Allowance Confirmation
When claiming unclaimed remains burial allowance as a funeral director, a Statement of Truth confirmation page is shown.

### PDF Form Alignment
Controlled by `burialPdfFormAlignment` feature flag (stored in sessionStorage). When enabled:
- Shows single `servicePeriod` page instead of `servicePeriods` array
- Hides `fasterClaimProcessing` page
- Would trigger migration 3→4 (currently commented out)

### Direct Deposit
`DirectDeposit` is a page factory that creates the direct deposit page config with:
- Bank account fields (routing number, account number, account type)
- Masked input showing ●●●● + last 4 digits
- Routing number validation

## Component Patterns

### Containers
- `BurialsApp.jsx` — Root container. Handles feature flag gating (`burialFormEnabled`), PDF alignment sessionStorage sync, Datadog monitoring setup, login redirect, `NoFormPage` rendering
- `ConfirmationPage.jsx` — Post-submission confirmation. Shows claimant name, confirmation number, timestamp, veteran name, benefits claimed, documents uploaded, regional office, next steps. Toggleable between new `ConfirmationView` (behind `burialConfirmationPage` toggle) and legacy layout

### Key Components
- `ApplicantDescription` — Intro text + `PrefillMessage` component for claimant info
- `DeathCertificateUploadMessage` — Conditional upload instructions (required vs. recommended based on service/location)
- `DirectDeposit` — Factory function creating direct deposit page config with masked bank input
- `ErrorText` — Error text with VBA center link
- `GetFormHelp` — MyVA411 contact info (24/7)
- `IntroductionPage` — Process list, LOA3 verify gate (behind `pbbFormsRequireLoa3`), SaveInProgressIntro
- `ListItemView` — Simple `<h3>` title view for arrays
- `MaskedBankAccountInfo` — Bank input masking all but last 4 chars with ●
- `NoFormPage` — Shown when `burialFormEnabled` is false; fetches saved data from `/in_progress_forms/21P-530EZ` and displays summary
- `NoHintReviewField` — Review field without hint text, with DD privacy masking
- `PrefillMessage` — Prefill info alert
- `ReviewRowView` / `AltReviewRowView` — Custom review row renderers

## Testing Patterns

### Unit Tests
- **Framework**: Mocha/Chai/Sinon with React Testing Library
- **Location**: `tests/` directory with mirrored structure
- **Test areas**: BurialsApp, helpers, migrations, components (7 tests), config (form + chapters), containers (ConfirmationPage), utils (CSRF, helpers, validation)
- **Fixtures**: `tests/fixtures/data/` for form data, `tests/fixtures/mocks/` for store/user/feature mocks
- **Schema tests**: `tests/schema/` for maximal, minimal, and overflow tests

### E2E Tests (Cypress)
- `burials.cypress.spec.js` — Standard flow
- `burials-max.cypress.spec.js` — Maximal data flow
- **Helpers**: `tests/e2e/helpers/index.js`
- **Page paths**: `tests/e2e/pagePaths.js`

### Chapter Tests
- `tests/config/chapters/multiPageTests.spec.jsx` — Multi-page chapter tests
- `tests/config/chapters/pageTests.spec.jsx` — Standard page tests
- Individual chapter directories: `01-claimant-information/` through `05-additional-information/`

## Analytics & Monitoring

### Datadog RUM Configuration
- **Application ID**: `88a7f64b-7f8c-4e26-bef8-55954cab8973`
- **Client Token**: `pub2261e01d7a3f40a23796d0b4c256c5bd`
- **Service**: `benefits-burial`
- **Version**: `1.0.0`
- **Session Rates**: 100% session, 100% replay
- **Toggle-gated by**: `burialBrowserMonitoringEnabled`

### Datadog Logging
- `DD_LOGS.logger.error` used in `submit.js` for CSRF token error logging
- `dataDogHidden: true` set on personal DOB, veteran info, and service period date fields

### Google Analytics Events
- `burials-530--submission-successful` — On successful form submission
- `burials-21p-530-fetch-csrf-token-empty` — CSRF token missing from localStorage
- `burials-21p-530-fetch-csrf-token-success` — CSRF token fetched successfully
- `burials-21p-530-fetch-csrf-token-failure` — CSRF token fetch failed
- `burials-21p-530-fetch-csrf-token-present` — CSRF token already present

## Feature Flags

| Flag | Purpose |
|------|---------|
| `burialFormEnabled` | Controls whether the form renders or shows `NoFormPage` |
| `burialPdfFormAlignment` | Controls PDF form alignment features (service period layout, faster claim processing page visibility) |
| `burialBrowserMonitoringEnabled` | Enables Datadog browser/session monitoring |
| `pbbFormsRequireLoa3` | Requires LOA3 verification before starting the form |
| `burialConfirmationPage` | Toggle between new `ConfirmationView` and legacy confirmation layout |

## Redux State Shape

```javascript
state = {
  form: {
    data: {
      claimantFullName: Object,
      relationship: { type: string },
      claimantAddress: Object,
      claimantEmail: string,
      claimantPhone: string,
      veteranFullName: Object,
      veteranDateOfBirth: string,
      veteranDateOfDeath: string,
      burialDate: string,
      locationOfDeath: { location: string, ... },
      homeHospiceCare: boolean,
      'view:separationDocuments': boolean,
      'view:servedUnderOtherNames': boolean,
      'view:claimedBenefits': {
        burialAllowance: boolean,
        plotAllowance: boolean,
        transportation: boolean,
      },
      burialAllowanceRequested: string, // 'service', 'nonService', 'unclaimed'
      finalRestingPlace: { location: string },
      cemetaryLocationQuestion: string, // 'cemetery' or 'tribalLand'
      transportationExpenses: boolean,
      bankAccount: Object,
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
- **Dev server**: `yarn watch --env entry=burials-ez`
- **Access URL**: `http://localhost:3001/burials-memorials/veterans-burial-allowance/apply-for-allowance-form-21p-530ez`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder burials-ez`
- **Specific test**: `yarn test:unit path/to/test.unit.spec.js`
- **Cypress CLI**: `yarn cy:run --spec "src/applications/burials-ez/tests/e2e/*"`

## Common Patterns & Best Practices

### Depends Functions
Form chapter pages use `depends` functions to control visibility:
```javascript
depends: formData => formData['view:claimedBenefits']?.burialAllowance
```

### Location-of-Death Conditional Pages
Location-of-death detail pages use `depends` to show the correct page based on `locationOfDeath.location`:
```javascript
depends: formData => formData?.locationOfDeath?.location === 'nursingHomePaid'
```

### File Upload Pattern
Uses `burialUploadUI` factory from `utils/upload.js`:
```javascript
burialUploadUI({ title: 'Upload DD214', required: false })
```
Accepts PDF/JPEG/JPG/PNG, 20MB max. Skips actual upload on localhost.

### CSRF Token Handling
All submissions ensure a valid CSRF token before POST. On 403 failure, clears token, logs to DD_LOGS, and retries once.

## Common Pitfalls & Anti-patterns

### What NOT to Do
- **Never** bypass `ensureValidCSRFToken` on form submission
- **Never** skip `dataDogHidden: true` on SSN, DOB, or other sensitive fields
- **Never** hardcode the Elizabeth Dole Act sunset date in multiple places — use `showHomeHospiceCarePage` helper
- **Never** assume `locationOfDeath.location` is populated — always check with optional chaining
- **Never** skip file upload validation — use `validateFileUploads` factory
- **Never** modify migration functions retroactively — add new migrations with incremented version
- **Never** use Jest — use Mocha/Chai/Sinon instead
- **Never** forget to update `sessionStorage.showPdfFormAlignment` when adding PDF-alignment-conditional logic

### Performance Considerations
- File uploads skip actual upload on localhost to speed development
- `isProductionEnv()` check prevents unnecessary monitoring initialization in dev/test

## Import Patterns

### Platform Utilities
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
```

### Local Imports
```javascript
import { MAX_FILE_SIZE_BYTES, FILE_UPLOAD_URL, FORM_NUMBER } from '../utils/constants';
import { generateTitle, showDeathCertificateRequiredPage, showHomeHospiceCarePage } from '../utils/helpers';
import { relationshipLabels, locationOfDeathLabels, allowanceLabels } from '../utils/labels';
import { validateBurialAndDeathDates, validateFileUploads } from '../utils/validation';
import { burialUploadUI } from '../utils/upload';
import { ensureValidCSRFToken } from '../utils/ensureValidCSRFToken';
```
