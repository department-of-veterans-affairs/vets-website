---
applyTo: "src/applications/pensions/**/*"
---

# Pensions Application Instructions

## Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the pensions application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants or labels**: New configuration in `labels.jsx` or form definitions
- **Create new helper functions**: New utilities in `helpers.jsx` or `validation.js`
- **Implement new business rules**: Changes to pension eligibility, wartime service rules, marriage/dependent logic, or financial calculations
- **Add new chapters or pages**: New form chapters, pages, or ArrayBuilder configurations
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New API calls or submit URL changes
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new components**: New components in `components/` or `containers/`
- **Modify the submission pipeline**: Changes to `submit.js` or data transformation logic
- **Update migrations**: New data migrations in `migrations.js`
- **Add new FormAlert components**: New alert components in `components/FormAlerts/`

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
- **Entry Name**: `pensions`
- **Root URL**: `/pension/apply-for-veteran-pension-form-21p-527ez`
- **Entry File**: `pensions-entry.jsx`
- **Form ID**: `VA_FORM_IDS.FORM_21P_527EZ`
- **Tracking Prefix**: `pensions-527EZ-`
- **JSON Schema**: `vets-json-schema/dist/21P-527EZ-schema.json`
- **OMB Number**: `2900-0002` (exp: `08/31/2025`)
- **Purpose**: Allow veterans to apply for Veterans Pension benefits using VA Form 21P-527EZ
- **Product ID**: `fb68f9f1-c8f0-4e81-9181-57c35dc84910`

## Architecture & State Management

### Redux Structure
- **Reducer**: `form` (save-in-progress via `createSaveInProgressFormReducer`)
- **No custom actions or action types** — relies entirely on platform save-in-progress form actions
- **State access**: `state.form` — standard platform form state with `data`, `submission`, `loadedData`, etc.

### API Layer
- **Backend Service**: vets-api

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/pensions/v0/claims` | Form submission |
| `POST` | `/v0/claim_attachments` | File upload (medical evidence, supporting docs) |
| `GET` | `/v0/rated_disabilities` | Disability rating check (IntroductionPage) |
| `HEAD` | `/v0/maintenance_windows` | CSRF token refresh |
| `GET/PUT` | `/in_progress_forms/21P-527EZ` | Save-in-progress (platform) |

### Form Configuration
- **Prefill**: Enabled (`prefillEnabled: true`)
- **Custom submit**: `config/submit.js` with CSRF retry logic
- **Migrations**: 12 migrations (version 12)
- **Downtime dependencies**: `externalServices.icmhs`
- **Pre-submit**: Statement of Truth with `fullNamePath: 'veteranFullName'`
- **Progress bar**: `v3SegmentedProgressBar: true`
- **Custom saved page**: `FormSavedPage` component showing ITF expiration date
- **Intent to File**: Uses `IntentToFile` with `itfType="pension"` in `PensionsApp.jsx`

### Form Chapters

| # | Chapter | Key | Key Pages |
|---|---------|-----|-----------|
| 1 | Applicant Information | `applicantInformation` | `applicantInformation`, `mailingAddress`, `contactInformation` |
| 2 | Military History | `militaryHistory` | `servicePeriod`, `hasOtherNames`, `otherNames`/`otherNamesPages`, `pow` |
| 3 | Health and Employment | `healthAndEmploymentInformation` | `over65`, `socialSupplementalSecurity`, `medicalConditions`, `additionalEvidence`, `nursingHome`, `medicaidCoverage`/`medicaidStatus`, `specialMonthlyPension`, `vaTreatmentHistory`/`vaMedicalCenters`, `federalTreatmentHistory`/`federalMedicalCenters`, `currentEmployment`/`currentEmploymentHistory`, `previousEmploymentHistory` |
| 4 | Household Information | `householdInformation` | `maritalStatus`, `marriageInfo`, `marriageHistory`, `spouseInfo`, `reasonForCurrentSeparation`, `currentSpouseAddress`, `currentSpouseMonthlySupport`, `currentSpouseMaritalHistory`, `currentSpouseFormerMarriages`, `hasDependents`, `dependentChildren`/`dependentChildInformation`/`dependentChildInHousehold`/`dependentChildAddress` |
| 5 | Financial Information | `financialDisclosure` | `totalNetWorth`, `additionalDocuments`, `netWorthEstimation`, `transferredAssets`, `homeOwnership`, `homeAcreage*`, `landMarketable`, `receivesIncome`, `incomeSources`, `hasCareExpenses`/`careExpenses`, `hasMedicalExpenses`/`medicalExpenses` |
| 6 | Additional Information | `additionalInformation` | `directDeposit`, `accountInformation`, `otherPaymentOptions`, `supportingDocuments`, `uploadDocuments`, `fasterClaimProcessing` |

## Constants & Configuration

### Definitions (`config/definitions.js`)
Schema properties from `21P-527EZ-schema.json`:
- `spouseDateOfBirth`, `spouseSocialSecurityNumber`, `spouseVaFileNumber`, `liveWithSpouse`, `spouseIsVeteran`, `netWorthEstimation`

Default definitions:
- `address`, `date`, `dateRange`, `usaPhone`, `fullName`, `ssn`, `centralMailVaFile`, `monthlyIncome`, `expectedIncome`, `netWorth`, `benefitsIntakeFullName`

### Labels (`labels.jsx`)
- **`relationshipLabels`** — `CHILD`, `PARENT`
- **`childRelationshipLabels`** — `BIOLOGICAL`, `ADOPTED`, `STEP_CHILD`
- **`marriageTypeLabels`** — `CEREMONY`, `OTHER`
- **`recipientTypeLabels`** — `VETERAN`, `SPOUSE`, `DEPENDENT`
- **`separationTypeLabels`** — `DEATH`, `DIVORCE`, `OTHER`
- **`serviceBranchLabels`** — `army`, `navy`, `airForce`, `coastGuard`, `marineCorps`, `spaceForce`, `usphs`, `noaa`
- **`typeOfIncomeLabels`** — `SOCIAL_SECURITY`, `INTEREST_DIVIDEND`, `CIVIL_SERVICE`, `PENSION_RETIREMENT`, `OTHER`
- **`careTypeLabels`** — `NURSING_HOME`, `CARE_FACILITY`, `ADULT_DAYCARE`, `IN_HOME_CARE_PROVIDER`
- **`careTypeLabelsOld`** — `CARE_FACILITY`, `IN_HOME_CARE_PROVIDER` (deprecated)
- **`careFrequencyLabels`** — `ONCE_MONTH`, `ONCE_YEAR`, `ONE_TIME`

## Helper Functions

### Core Helpers (`helpers.jsx`)

#### Date & Formatting
- `isSameOrBefore(date1, date2)` — Date comparison
- `isSameOrAfter(date1, date2)` — Date comparison
- `formatCurrency(num)` — `$X,XXX` format
- `formatFullName({ first, middle, last, suffix })` — Joins name parts with spaces
- `formatPossessiveString(str)` — `"Johnson's"` vs `"Williams'"`

#### Wartime Service
- `servedDuringWartime(period)` — Checks if service period overlaps with any wartime period (Mexican Border, WWI, WWII, Korea, Vietnam, Gulf War)

#### Conditional Logic
- `isUnder65(formData, currentDate)` — Checks DOB against 65-year threshold
- `hasNoSocialSecurityDisability(formData)` — No SSA disability benefits
- `requiresEmploymentHistory(formData)` — `isUnder65 && hasNoSocialSecurityDisability`
- `isEmployedUnder65(formData)` / `isUnemployedUnder65(formData)` — Employment status for under-65
- `doesNotHaveCurrentEmployers(formData)` — No current employers
- `hasFederalTreatmentHistory(formData)` — Federal treatment history exists
- `hasVaTreatmentHistory(formData)` — VA treatment history exists
- `isInNursingHome(formData)` — Currently in nursing home
- `medicaidDoesNotCoverNursingHome(formData)` — Medicaid not covering nursing home
- `isSeparated(formData)` — Marital status === 'SEPARATED'
- `hasMarriageHistory(formData)` — Depends on `showPdfFormAlignment()` toggle
- `doesHaveDependents(formData)` — `view:hasDependents === true`
- `isCurrentMarriage(formData, index)` — Last marriage in array for MARRIED/SEPARATED
- `requiresSpouseInfo(formData)` — MARRIED or SEPARATED
- `currentSpouseHasFormerMarriages(formData)` — Spouse has former marriages
- `showSpouseAddress(formData)` — Separated or not living with spouse
- `isBetween18And23(childDOB)` — Age range check for dependents
- `dependentIsOutsideHousehold(formData, index)` — Dependent not in household
- `doesHaveCareExpenses(formData)` / `doesHaveMedicalExpenses(formData)` — Expense checks
- `ownsHome(formData)` / `doesReceiveIncome(formData)` — Financial checks
- `otherExplanationRequired(formData, index)` — Other explanation needed
- `dependentNameRequired(formData, index)` / `childNameRequired(key, formData, index)` — Name required checks
- `usingDirectDeposit(formData)` — `view:usingDirectDeposit === true`

#### Environment / Feature
- `isProductionEnv()` — Checks not localhost, no DD_RUM, no Mocha
- `showMultiplePageResponse()` — Reads sessionStorage
- `showPdfFormAlignment()` — Reads sessionStorage

#### Schema Generators
- `generateMedicalCentersSchemas(key, title, message, label, reviewTitle)` — Generates uiSchema/schema for medical center arrays
- `generateEmployersSchemas({ ... })` — Generates employer array uiSchema/schema

#### Title Helpers
- `getMarriageTitle(index)` — "First marriage", "Second marriage", etc.
- `getMarriageTitleWithCurrent(form, index)` — "Current marriage" for last
- `getDependentChildTitle(item, description)` — Dependent child title
- `createSpouseLabelSelector(nameTemplate)` — Reselect selector for spouse name display
- `MarriageTitle(title)` — Renders `<Title>` component

#### UI Components (from helpers)
- `DependentsMinItem` — JSX element for dependents
- `DependentSeriouslyDisabledDescription` — JSX element for disability description
- `IncomeSourceDescription` — JSX element
- `MedicalConditionDescription()` — Medical condition description component
- `MedicalEvidenceNotice()` — Medical evidence notice component
- `SupportingDocumentsNotice()` — Supporting documents notice
- `MedicalExpenseDescription()` — Medical expense description
- `DirectDepositOtherOptions` — JSX component with Direct Express and VBBP info

#### Bank Account
- `obfuscateAccountNumber(accountNumber)` — Replaces digits except last 4 with `*`

### Validation (`validation.js`)
- `validateAfterMarriageDate(errors, dateOfSeparation, formData)` — Separation date after marriage date
- `validateAfterMarriageDates(errors, dateOfSeparation, formData)` — Validates across spouse marriages array
- `validateUniqueMarriageDates(errors, dateOfMarriage, formData)` — No duplicate marriage dates
- `validateServiceBirthDates(errors, service, formData)` — Service entry date after birth date
- `validateCurrency(errors, currencyAmount)` — Dollar amount format validation
- `isValidCurrency(currencyAmount)` — Boolean currency validation (no $ sign allowed)
- `validateBenefitsIntakeName(errors, value)` — Requires at least one [a-zA-Z] character

### CSRF Token (`ensureValidCSRFToken.js`)
- `ensureValidCSRFToken()` — Checks localStorage; fetches new token from `/v0/maintenance_windows` if missing

## Business Logic & Requirements

### Wartime Service Requirement
The `servedDuringWartime(period)` helper checks service overlap with defined wartime periods:
- Mexican Border Period, WWI, WWII, Korean Conflict, Vietnam Era, Gulf War
- **CRITICAL**: This is a pension eligibility requirement — veterans must have wartime service

### Age-Based Logic
- Veterans **65 or older**: Skip employment history
- Veterans **under 65 with SSA disability**: Skip employment history
- Veterans **under 65 without SSA disability**: Must provide employment history

### Marriage History
- Marriage count is managed via `MarriageCount` component (max 10)
- Marriage array is dynamically sized based on count input
- Marriage history pages depend on `showPdfFormAlignment()` toggle
- Spouse former marriages are tracked separately

### Dependent Children
- Children between 18-23 may require school attendance info
- Children outside household require address info
- Child relationship types: BIOLOGICAL, ADOPTED, STEP_CHILD

### Financial Disclosure
- Net worth estimation determines additional document requirements
- Home ownership triggers acreage/marketability questions
- Care expenses support multiple types (nursing home, care facility, adult daycare, in-home care)
- Medical expenses tracked separately from care expenses

### Disability Rating Check
`DisabilityRatingAlert` fetches `/v0/rated_disabilities` and warns if veteran has 100% rating. Logged to Datadog.

### Intent to File (ITF)
`PensionsApp.jsx` includes `IntentToFile` with `itfType="pension"`, establishing the veteran's intent to file date for benefits backdating.

### PDF Form Alignment
Controlled by `pensionPdfFormAlignment` feature flag (stored in sessionStorage). Affects marriage history logic and page display.

## Component Patterns

### Containers
- `PensionsApp.jsx` — Root container. Handles feature flag gating (`pensionFormEnabled`), Datadog monitoring, Intent to File, sessionStorage sync for `pensionMultiplePageResponse` and `pensionPdfFormAlignment`, login redirect, `NoFormPage` rendering. Redirects to `/pension/survivors-pension/` when form is disabled.
- `ConfirmationPage.jsx` — Post-submission confirmation. Shows confirmation number, submission date (Central time), bank account info (obfuscated), next steps, mail address for documents, direct deposit info.

### Key Components
- `IntroductionPage` — Form intro with eligibility info, process list, SaveInProgressIntro, LOA3 verify check, disability rating alert
- `DisabilityRatingAlert` — Fetches disability rating, shows warning if 100%, logs to Datadog
- `FormSavedPage` — Custom saved page showing ITF expiration date
- `NoFormPage` — Shown when `pensionFormEnabled` is false; fetches in-progress form data, displays saved info sections or "no saved form" message
- `GetFormHelp` — Help text with VA benefits phone number
- `ErrorText` — Error text with VBA center call info
- `MarriageCount` — Custom number input (max 10) managing marriages array sizing
- `MarriageCountReview` — Review-page display of marriage count
- `ServicePeriodReview` — Review-page display of service period details
- `SpouseMarriageTitle` — "Spouse's former marriage(s)" title
- `DisclosureTitle` — `createDisclosureTitle(path, title)` — creates title with person's full name
- `ArrayDescription` — Simple subtitle block for arrays
- `IncomeSourceView` — Card view for income sources
- `ListItemView` — Simple title card for array items
- `ExpenseField` — Card view for expenses

### FormAlerts (`components/FormAlerts/index.jsx`)
15+ alert components for specific form contexts:
- `AssetInformationAlert`, `AssetTransferInformationAlert` — Asset-related alerts
- `ContactWarningAlert`, `ContactWarningMultiAlert` — Contact info warnings
- `DisabilityDocsAlert` — Disability documentation alert
- `IncomeAssetStatementFormAlert`, `RequestIncomeAndAssetInformationAlert` — Income/asset info
- `IncomeInformationAlert` — Income info alert
- `LandMarketableAlert` — Land marketability alert
- `RequestNursingHomeInformationAlert` — Nursing home info
- `SchoolAttendanceAlert` — School attendance for dependents
- `SpecialMonthlyPensionEvidenceAlert` — SMP evidence
- `WartimeWarningAlert` — Wartime service warning
- `FormReactivationAlert` — Form reactivation
- `AccountInformationAlert` — Account info alert
- `AdoptionEvidenceAlert` — Adoption evidence

### SectionField (`components/SectionField.jsx`)
6 section display components for `NoFormPage`:
- `ApplicantInformation`, `MilitaryHistory`, `WorkHistory`, `HouseholdInformation`, `FinancialDisclosure`, `AdditionalInformation`
- Also exports utilities: `convertDateFormat`, `formatPhoneNumber`, `formatCurrency`, `bytesToKB`

## Testing Patterns

### Unit Tests
- **Framework**: Mocha/Chai/Sinon with React Testing Library
- **Location**: `tests/unit/` directory with mirrored structure
- **Test areas**: PensionsApp, NoFormPage, CSRF, helpers, migrations, wartime service, validation, chapters (6 chapter directories), components (12 test files), config (3 tests), containers (ConfirmationPage)
- **Chapter tests**: `pageTests.spec.jsx` (generic runner), plus per-chapter directories (`01-applicant-information/` through `06-additional-information/`)
- **Test helpers**: `tests/unit/testHelpers/webComponents.jsx`
- **Fixtures**: `tests/fixtures/mocks/` for store/user/feature/prefill mocks, `tests/fixtures/data/` for migration test data

### E2E Tests (Cypress)
- `pensions-simple.cypress.spec.js` — Simple/minimal flow
- `pensions-maximal-test-1-2.cypress.spec.js` through `pensions-maximal-test-6.cypress.spec.js` — Maximal data (split across 6 files)
- `pensions-disability-rating.cypress.spec.js` — Disability rating alert flow
- `pensions-itf.cypress.spec.js` — Intent to File flow
- `pensions-keyboard-only.cypress.spec.js` — Keyboard navigation accessibility
- `pensions-net-worth-estimation.cypress.spec.js` — Net worth estimation flow
- `pensions-overflow.cypress.spec.js` — Overflow/edge case flow
- **Helpers**: `helpers/index.js`, `helpers/itfHelpers.js`, `helpers/keyboardOnlyHelpers.js`, `helpers/pageHooks.js`
- **Setup**: `cypress.setup.js`, `pagePaths.js`

## Analytics & Monitoring

### Datadog RUM Configuration
- **Application ID**: `b3319250-eeb3-419c-b596-3422aec52e4d`
- **Client Token**: `pubd03b9c29b16b25a9fa3ba5cbe8670658`
- **Service**: `benefits-pension`
- **Version**: `1.0.0`
- **Session Rates**: 100% session, 100% replay
- **Toggle-gated by**: `pensionsBrowserMonitoringEnabled`

### Datadog Logging
- `dataDogLogger` used in `DisabilityRatingAlert.jsx` for rating fetch errors and alert visibility
- `DD_LOGS.logger.error` used in `submit.js` for CSRF token error logging
- `isProductionEnv()` in helpers checks `window.DD_RUM?.getInitConfiguration()`

### Google Analytics Events
- `pensions-527EZ--submission-successful` — On successful form submission
- `pensions-21p-527-fetch-csrf-token-empty` — CSRF token missing
- `pensions-21p-527-fetch-csrf-token-success` — CSRF token fetched
- `pensions-21p-527-fetch-csrf-token-failure` — CSRF token fetch failed
- `pensions-21p-527-fetch-csrf-token-present` — CSRF token already present

## Feature Flags

| Flag | Purpose |
|------|---------|
| `pensionFormEnabled` | Controls whether the form renders or shows `NoFormPage` / redirects to survivors pension page |
| `pensionMultiplePageResponse` | Controls multi-page response behavior (stored in sessionStorage) |
| `pensionPdfFormAlignment` | Controls PDF form alignment features affecting marriage history logic |
| `pensionsBrowserMonitoringEnabled` | Enables Datadog browser/session monitoring |
| `pbbFormsRequireLoa3` | Requires LOA3 verification before starting the form |
| `pensionRatingAlertLoggingEnabled` | Enables disability rating alert with Datadog logging on intro page |

## Redux State Shape

```javascript
state = {
  form: {
    data: {
      veteranFullName: Object,
      veteranDateOfBirth: string,
      veteranSocialSecurityNumber: string,
      vaFileNumber: string,
      veteranAddress: Object,
      email: string,
      dayPhone: string,
      nightPhone: string,
      activeServiceDateRange: Object,
      serviceBranch: string,
      serviceNumber: string,
      placeOfSeparation: string,
      serveUnderOtherNames: boolean,
      previousNames: Array,
      powStatus: boolean,
      isOver65: string,
      socialSecurityDisability: boolean,
      medicalCondition: string,
      nursingHome: boolean,
      medicaidCoverage: boolean,
      specialMonthlyPension: boolean,
      vaTreatmentHistory: boolean,
      vaMedicalCenters: Array,
      federalTreatmentHistory: boolean,
      federalMedicalCenters: Array,
      currentEmployment: Object,
      currentEmployers: Array,
      previousEmployers: Array,
      maritalStatus: string, // 'MARRIED', 'SEPARATED', 'DIVORCED', 'NEVER_MARRIED', 'WIDOWED'
      marriages: Array,
      'view:hasDependents': boolean,
      dependents: Array,
      totalNetWorth: number,
      netWorthEstimation: string,
      transferredAssets: boolean,
      homeOwnership: boolean,
      homeAcreageMoreThanTwo: boolean,
      landMarketable: boolean,
      receivesIncome: boolean,
      incomeSources: Array,
      hasCareExpenses: boolean,
      careExpenses: Array,
      hasMedicalExpenses: boolean,
      medicalExpenses: Array,
      'view:usingDirectDeposit': boolean,
      bankAccount: Object,
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
- **Dev server**: `yarn watch --env entry=pensions`
- **Access URL**: `http://localhost:3001/pension/apply-for-veteran-pension-form-21p-527ez`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console
- **Flipper**: `pension_form_enabled` must be enabled

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder pensions`
- **Specific test**: `yarn test:unit path/to/test.unit.spec.js`
- **Cypress CLI**: `yarn cy:run --spec "src/applications/pensions/tests/e2e/*"`

## Common Patterns & Best Practices

### Depends Functions
Form chapter pages use `depends` functions to control visibility:
```javascript
depends: formData => isInNursingHome(formData)
depends: formData => requiresEmploymentHistory(formData)
depends: formData => requiresSpouseInfo(formData)
```

### Schema Generator Pattern
Medical centers and employers use schema generators for repeatable array patterns:
```javascript
const { uiSchema, schema } = generateMedicalCentersSchemas('vaMedicalCenters', 'VA medical centers', ...);
const { uiSchema, schema } = generateEmployersSchemas({ key: 'currentEmployers', ... });
```

### Marriage Array Management
`MarriageCount` component manages the marriages array length:
```javascript
// Sets marriage count and resizes marriages array accordingly (max 10)
```

### CSRF Token Handling
All submissions ensure a valid CSRF token before POST. On 403 failure, clears token, logs to DD_LOGS, and retries once.

### Intent to File
The `IntentToFile` component in `PensionsApp.jsx` establishes the ITF date before the form starts.

## Common Pitfalls & Anti-patterns

### What NOT to Do
- **Never** bypass `ensureValidCSRFToken` on form submission
- **Never** skip `dataDogHidden: true` on SSN, DOB, or other sensitive fields
- **Never** modify migration functions retroactively — add new migrations with incremented version and update `version` to `migrations.length`
- **Never** hardcode wartime period dates — use `servedDuringWartime` helper
- **Never** assume marriage array is populated — always check array bounds
- **Never** skip the disability rating check on the introduction page
- **Never** forget the `IntentToFile` component when modifying `PensionsApp.jsx`
- **Never** modify `MarriageCount` without understanding its array sizing behavior
- **Never** use Jest — use Mocha/Chai/Sinon instead
- **Never** forget to handle the `showPdfFormAlignment()` toggle in marriage-related pages

### Performance Considerations
- `isProductionEnv()` check prevents unnecessary monitoring initialization in dev/test
- Disability rating fetch is scoped to introduction page only
- Medical center and employer schemas are generated via factory functions to reduce duplication

## Import Patterns

### Platform Utilities
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { VA_FORM_IDS } from '@department-of-veterans-affairs/platform-forms/constants';
```

### Local Imports
```javascript
import { formatCurrency, servedDuringWartime, isUnder65, requiresSpouseInfo } from '../helpers';
import { serviceBranchLabels, marriageTypeLabels, careTypeLabels } from '../labels';
import { validateAfterMarriageDate, validateCurrency, validateBenefitsIntakeName } from '../validation';
import { ensureValidCSRFToken } from '../ensureValidCSRFToken';
import { transform, submit } from '../config/submit';
```
