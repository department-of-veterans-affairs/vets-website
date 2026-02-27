---
applyTo: "src/applications/dependents/686c-674/**/*"
---

# 686C-674 Dependents Form Application Instructions

## Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the 686c-674 application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New task keys, marriage types, date formats, or configuration in `config/constants.js`
- **Create new helper functions**: New utilities in `config/helpers.js`, `config/utilities/`, or `utils/`
- **Implement new business rules**: Changes to V2/V3 flow logic, picklist transformations, pension rules, or submission pipeline
- **Add new action types or actions**: New Redux actions in `actions/index.js`
- **Create new reducers or modify state shape**: Changes to Redux state structure
- **Add new chapters or pages**: New form chapters, pages, or array builder configurations
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New API calls or submit URL changes
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new components**: New picklist components or shared components
- **Modify the submission pipeline**: Changes to `customTransformForSubmit`, `buildSubmissionData`, or picklist transforms
- **Update data mappings**: Changes to `ADD_WORKFLOW_MAPPINGS`, `REMOVE_WORKFLOW_MAPPINGS`, or `V3_TRANSFORMATION_ROUTES`

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
- **Entry Name**: `686C-674-v2`
- **Root URL**: `/manage-dependents/add-remove-form-21-686c-674`
- **Entry File**: `app-entry.jsx`
- **Form ID**: `VA_FORM_IDS.FORM_21_686CV2`
- **Tracking Prefix**: `disability-21-686c-`
- **Purpose**: Allow veterans to add or remove dependents on VA benefits using VA Forms 21-686c and 21-674
- **Product ID**: `500cfb4d-0f70-4663-bfe2-28d295d3301a`

## Architecture & State Management

### Redux Structure
- **Reducers**: `vaFileNumber`, `dependents` (shared), `form` (save-in-progress)
- **Action types**: `VERIFY_VA_FILE_NUMBER_STARTED`, `VERIFY_VA_FILE_NUMBER_SUCCEEDED`, `VERIFY_VA_FILE_NUMBER_FAILED`
- **Shared action types**: `DEPENDENTS_FETCH_STARTED`, `DEPENDENTS_FETCH_SUCCESS`, `DEPENDENTS_FETCH_FAILED` (from `shared/actions`)
- **State access patterns**:
  - `state.vaFileNumber` — VA file number verification state
  - `state.dependents` — Shared dependents data (loading, error, data)
  - `state.form` — Platform save-in-progress form state

### API Layer
- **Backend Service**: vets-api
- **API Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/profile/valid_va_file_number` | Verify VA file number |
| `GET` | `/v0/dependents_applications/show` | Fetch dependents list |
| `POST` | `/v0/dependents_applications` | Form submission (legacy) |
| `POST` | `/dependents_benefits/v0/claims` | Form submission (when `dependentsModuleEnabled` toggle is on) |
| `POST` | `/v0/claim_attachments` | File upload |
| `HEAD` | `/v0/maintenance_windows` | CSRF token refresh |

### Form Configuration
- **Prefill**: Enabled with `verifyRequiredPrefill: true`
- **Custom submit**: `config/submit.js` with CSRF retry logic
- **Migrations**: 2 migrations (`emptyMigration`, `movedSpouseDob`)
- **Downtime dependencies**: `bgs`, `global`, `mvi`, `vaProfile`, `vbms`
- **Pre-submit**: Statement of Truth with `useProfileFullName: true`
- **Progress bar**: `v3SegmentedProgressBar: true`
- **Form options**: `focusOnAlertRole: true`, `useWebComponentForNavigation: true`

### Form Chapters

| Chapter | Key Pages |
|---------|-----------|
| `veteranInformation` | `veteranInformation`, `veteranAddress`, `veteranContactInformation` |
| `optionSelection` | `reviewDependents` (CustomPage), `addOrRemoveDependents`, `addDependentOptions`, `removeDependentOptions`, `checkVeteranPension`, `removeDependentsPicklistOptions` |
| `removeDependentsPicklistFollowupPages` | V3 picklist follow-up pages (spread from `formConfigRemovePicklist`) |
| `addSpouse` | Spouse information pages |
| `addChild` | Child information pages |
| `report674` | Student/674 flow pages |
| `reportDivorce` | Divorce reporting pages |
| `reportStepchildNotInHousehold` | Stepchild removal pages |
| `deceasedDependents` | Dependent death reporting pages |
| `reportChildMarriage` | Child marriage reporting pages |
| `reportChildStoppedAttendingSchool` | Child left school reporting pages |
| `householdIncome` | Net worth pages (conditional on pension) |
| `additionalEvidence` | Marriage and child evidence upload pages |

## Constants & Configuration

### Core Constants (`config/constants.js`)

#### Task Keys
```javascript
TASK_KEYS = {
  addChild, addDisabledChild, addSpouse, reportDivorce, reportDeath,
  reportStepchildNotInHousehold, reportMarriageOfChildUnder18,
  reportChild18OrOlderIsNotAttendingSchool, report674
}
```

#### Marriage Types
```javascript
MARRIAGE_TYPES = { ceremonial, civil, commonLaw, tribal, proxy, other }
```

#### Date Formats
- `FORMAT_YMD_DATE_FNS`: `'yyyy-MM-dd'`
- `FORMAT_COMPACT_DATE_FNS`: `'MMM d, yyyy'`
- `FORMAT_READABLE_DATE_FNS`: `'MMMM d, yyyy'`

#### Error Detection
- `SERVER_ERROR_REGEX`: `/^5\d{2}$/`
- `CLIENT_ERROR_REGEX`: `/^4\d{2}$/`

#### Pension
- `NETWORTH_VALUE`: `'163,699'`

#### Picklist Constants
- `PICKLIST_DATA`: `'view:removeDependentPickList'`
- `PICKLIST_PATHS`: `'view:removeDependentPaths'`
- `PICKLIST_EDIT_REVIEW_FLAG`: `'editFromReviewPage'`

#### Page Metadata
- `PAGE_TITLE`: `'Add or remove dependents on VA benefits'`
- `DOC_TITLE`: `'Add or remove dependents on VA benefits'`

### Data Mappings (`config/dataMappings.js`)
- `ADD_WORKFLOW_MAPPINGS` — Maps task keys to required data fields (addSpouse: 6 fields, addChild: 2, report674: 1)
- `REMOVE_WORKFLOW_MAPPINGS` — Maps task keys to their data fields
- `NO_SSN_REASON_UI_MAPPINGS` — `NONRESIDENT_ALIEN` & `NONE_ASSIGNED` labels
- `NO_SSN_REASON_PAYLOAD_MAPPINGS` — Converts to `"Nonresident Alien"` & `"No SSN Assigned by SSA"`
- `V3_TRANSFORMATION_ROUTES` — Maps V3 removal reasons to V2 destination arrays (with stepchild-awareness)
- `getV2Destination(removalReason, isStepchild)` — Routing function for V3-to-V2 transforms

## Helper Functions

### Form Helpers (`config/helpers.js`)
- `isChapterFieldRequired(formData, option)` — Checks `formData['view:selectable686Options']?.[option]`
- `VerifiedAlert` — JSX constant (prefill info alert)
- `VaFileNumberMissingAlert` — JSX constant (missing VA file number error)
- `ServerErrorAlert` — JSX constant (server error alert)
- `certificateNotice()` — JSX function (marriage certificate notice)
- `CancelButton({ isAddChapter, dependentType, dependentButtonType, removePath, router })` — withRouter HOC, modal cancel button
- `customLocationSchema` — JSON schema for city/state/country
- `customLocationSchemaStatePostal` — JSON schema with postal code
- `generateHelpText(text, className?)` — Returns styled span
- `generateTransition(text, className?)` — Returns styled paragraph
- `generateTitle(text)` — Returns h3
- `marriageEnums` — `['Death', 'Divorce', 'Annulment', 'Other']`
- `spouseFormerMarriageLabels` — Mapping for spouse's former marriage end reasons
- `veteranFormerMarriageLabels` — Mapping for veteran's former marriage end reasons
- `incomeQuestionUpdateUiSchema(formData)` — Hides hint text when pension flag is ON

### API Utilities (`config/utilities/api.js`)
- `isServerError(errCode)` / `isClientError(errCode)` — Regex test against error codes
- `getData(apiRoute, options)` — Wraps `apiRequest`, returns `response.data.attributes`
- `checkAddingDependentsNot674ForPension(formData)` — Checks if adding spouse/child (not 674)
- `checkAdding674ForPension(formData)` — Checks if adding 674 student
- `showPensionBackupPath(formData)` — Pension API failed + adding dependents + flag on
- `isVetInReceiptOfPension(formData)` — Checks receipt of pension (1 or -1 + backup)
- `showPensionRelatedQuestions(formData)` — Pension flag on + in receipt + adding dependents
- `show674IncomeQuestions(formData)` — Pension flag on + in receipt + adding 674
- `shouldShowStudentIncomeQuestions({ formData, index })` — Pension or per-student pension flag

### Form Helpers (`config/utilities/formHelpers.js`)
- `customFormReplacer(key, value)` — JSON stringifier replacer for phone cleanup, empty objects, autosuggest, file data, empty arrays
- `showV3Picklist(formData)` — `!!formData?.vaDependentsV3 && formData?.vaDependentV2Flow !== true`
- `parseDateToDateObj(date, template)` — Parses ISO and formatted dates
- `spouseEvidence(formData)` — Returns `{ isCommonLawMarriage, isTribalMarriage, isProxyMarriage, isOutsideUSA, needsSpouseUpload }`
- `childEvidence(formData)` — Returns `{ showBirthCertificate, hasAdoptedChild, hasDisabledChild, needsChildUpload }`
- `showDupeModalIfEnabled(formData)` — Checks `vaDependentsDuplicateModals`
- `isAddingDependents(formData)` / `isRemovingDependents(formData)`
- `noV3Picklist(formData)` — Negation of `showV3Picklist`
- `hasAwardedDependents(formData)` — Checks `dependents.awarded` array
- `showOptionsSelection(formData)` — V3: checks no API error + has awarded; V2: always true
- `isVisiblePicklistPage(formData, relationship)` — V3 picklist page visibility per relationship
- `hasSelectedPicklistItems(formData)` — Any picklist item selected

### Submission Utilities (`config/utilities/submission.js`)
- **CRITICAL**: `buildSubmissionData(payload)` — Single source of truth for submission flags; rebuilds `view:selectable686Options` based on actual data presence
- **CRITICAL**: `customTransformForSubmit(formConfig, form)` — 8-step pipeline: prepare → filter inactive → extract data → picklist transform → SSN enrichment → rebuild → serialize

### Picklist Transform (`config/utilities/picklistTransform.js`)
- `transformPicklistToV2(data)` — Transforms V3 picklist items into V2 arrays (deaths, childMarriage, childStoppedAttendingSchool, stepChildren, reportDivorce)
- `enrichDivorceWithSSN(data)` — Matches spouse in awarded dependents by name/DOB and adds SSN

### CSRF Token (`config/utilities/ensureValidCSRFToken.js`)
- `ensureValidCSRFToken()` — Checks localStorage for CSRF token; fetches new one via HEAD request if empty

### Process Dependents (`utils/processDependents.js`)
- `slugifyKey(dependent)` — Creates key from `first-ssnLast4`
- `processDependents({ dependents, isPrefill })` — Normalizes prefill/API data, calculates age, returns `{ hasError, awarded, notAwarded }`
- `updateDependentsInFormData(formData, apiDependentsData)` — Merges API data into form data, preserving picklist selections

### Analytics Helpers (`analytics/helpers.js`)
- `buildEventData(formData)` — Builds tracking event data mapping each TASK_KEY to `disability-*` analytics property

## Business Logic & Requirements

### V2 vs V3 Flow
- **V2 Flow**: Traditional checkbox-based add/remove selection with separate chapter pages per removal type
- **V3 Flow**: Picklist-based removal using a dependent selection UI where veterans pick specific dependents to remove
- **Detection**: `showV3Picklist(formData)` checks `vaDependentsV3` flag AND `vaDependentV2Flow !== true`
- **V2 in-progress form**: If a saved-in-progress form was started as V2, it stays V2 even with V3 enabled (`vaDependentV2Flow` flag)
- **CRITICAL**: The picklist transform (`transformPicklistToV2`) converts V3 selections back to V2 data structures for submission

### Submission Pipeline
The `customTransformForSubmit` function follows an 8-step pipeline:
1. Prepare form data
2. Filter inactive workflow data
3. Extract relevant data fields
4. Transform picklist selections to V2 format (if V3)
5. Enrich divorce data with SSN from awarded dependents
6. Rebuild selectable options based on actual data
7. Serialize for submission
8. Submit with CSRF retry logic

### Pension-Related Questions
- Controlled by `vaDependentsNetWorthAndPension` feature flag
- Shows net worth and income questions when: flag is on + veteran is in receipt of pension + adding dependents
- Has a backup path when pension API fails

### Evidence Upload
- **Spouse**: Required for common law, tribal, proxy marriages, or marriages outside USA
- **Child**: Required for adopted or disabled children
- Accepts PDF/JPG/PNG, max 20MB, min 1KB
- Upload URL: `/v0/claim_attachments`

### Duplicate Detection
- Controlled by `vaDependentsDuplicateModals` feature flag
- Warns veterans when adding a dependent that may already exist in their records

### No SSN Option
- Controlled by `vaDependentsNoSsn` feature flag
- Allows `NONRESIDENT_ALIEN` or `NONE_ASSIGNED` reasons for missing SSN
- **CRITICAL**: SSN fields have `dataDogHidden: true` to prevent PII leakage in monitoring

### Feature Flag Sync
Feature flags are synced into form data via `useFormFeatureToggleSync`: `vaDependentsNetWorthAndPension`, `vaDependentsDuplicateModals`, `vaDependentsV3`, `vaDependentsNoSsn`

## Component Patterns

### Containers
- `App.jsx` — Root container. Handles V2/V3 flow detection, Datadog monitoring, feature toggle sync, dependents fetching, VA file number auth gating, breadcrumbs, submit URL switching
- `IntroductionPage.jsx` — Pre-form intro. Dispatches `verifyVaFileNumber()`, shows loading/error states for VA file number validation
- `ConfirmationPage.jsx` — Post-submission confirmation. Shows confirmation number, date, toggleable form download link (via `dependentsEnableFormViewerMFE`)

### Key Components
- `ReviewDependents.jsx` — Custom page for reviewing dependents in the option selection chapter
- `CurrentSpouse.jsx` — Current spouse display/selection (uses `dataDogLogger`)
- `GetFormHelp.jsx` — Help footer component
- `IntroductionPageFormProcess.jsx` — Step-by-step process description on intro
- `ChildAdditionalEvidence.jsx` / `SpouseAdditionalEvidence.jsx` — Upload UI for supporting documents
- `PensionContent.jsx` — Pension-related informational content
- `StudentIncomeContent.jsx` — Student income information content

### Picklist Components (`components/picklist/`)
The picklist system handles V3 dependent removal:
- `PicklistRemoveDependents.jsx` — Dependent selection page for removal
- `PicklistRemoveDependentsReview.jsx` — Review page for picklist selections
- `PicklistRemoveDependentFollowup.jsx` — Follow-up questions per selected dependent
- `PicklistRemoveDependentFollowupReview.jsx` — Review page for follow-up data
- Child/Spouse/Parent-specific reason and scenario components
- Stepchild-specific flow components (household, address, financial support)
- `helpers.js`, `routes.js`, `types.js`, `utils.js` — Shared picklist logic

## Testing Patterns

### Unit Tests
- **Framework**: Mocha/Chai/Sinon with React Testing Library
- **Location**: `tests/` directory with mirrored structure
- **Rendering**: Use `renderWithStoreAndRouter` from platform testing helpers
- **Test areas**: actions, reducers, containers, components, picklist components (22 files), config utilities, chapter configs, processDependents

### E2E Tests (Cypress)
- `686C-674.cypress.spec.js` — Main happy path
- `686C-674-ancillary.cypress.spec.js` — Ancillary flows
- `686C-674-duplicate-checker.cypress.spec.js` — Duplicate detection
- `686C-674-maximal.cypress.spec.js` — Maximal data
- `686C-674-v3-removal.cypress.spec.js` — V3 picklist removal flow
- `cypress.helpers.js` — Shared Cypress utilities
- 15+ fixture files in `tests/e2e/fixtures/`

### Mock API
- `tests/mock-api-full-data.js` — Full mock API responses including all feature flags

## Analytics & Monitoring

### Datadog RUM Configuration
- **Application ID**: `48416fb2-5b5e-428c-a1b1-b6e83b7c4088`
- **Client Token**: `pubd3c0ed031341634412d7af1c9abf2a30`
- **Service**: `benefits-dependents-management`
- **Version**: `1.0.0`
- **Session Rates**: 100% session, 100% replay
- **Toggle-gated by**: `vaDependentsBrowserMonitoringEnabled`

### Datadog Logging
- `dataDogLogger` used in `picklistTransform.js` (unknown removal reasons, multiple spouse divorces) and `CurrentSpouse.jsx` (data issues)
- `DD_LOGS` used in `submit.js` for CSRF token retry logging
- **CRITICAL**: `dataDogHidden: true` set on all SSN/sensitive fields to prevent PII leakage

### Google Analytics
- `buildEventData(formData)` maps each TASK_KEY to `disability-*` analytics property
- Analytics events pushed on successful form submission

## Feature Flags

| Flag | Purpose |
|------|---------|
| `vaDependentsV3` | Enables V3 picklist-based removal flow |
| `vaDependentsNetWorthAndPension` | Controls pension-related questions visibility |
| `vaDependentsDuplicateModals` | Enables duplicate dependent detection modals |
| `vaDependentsNoSsn` | Enables "No SSN" option for spouse, children, and students |
| `vaDependentsBrowserMonitoringEnabled` | Enables Datadog browser/session monitoring |
| `dependentsModuleEnabled` | Switches submit URL between legacy and new module route |
| `dependentsEnableFormViewerMFE` | Shows "Download your submitted form" link on confirmation page |

## Redux State Shape

```javascript
state = {
  vaFileNumber: {
    hasVaFileNumber: null | { VALIDVAFILENUMBER: boolean } | { errors: [...] },
    isLoading: boolean
  },
  dependents: {
    loading: boolean,
    error: null | string,
    data: Array // processed dependents { hasError, awarded, notAwarded }
  },
  form: {
    data: {
      veteranInformation: { fullName, ssnLastFour, vaFileLastFour, isInReceiptOfPension },
      veteranContactInformation: { veteranAddress, phoneNumber, emailAddress },
      dependents: { hasError, hasDependents, awarded: [], notAwarded: [] },
      useV2: boolean,
      netWorthLimit: string,
      vaDependentsV3: boolean,
      vaDependentsNetWorthAndPension: boolean,
      vaDependentsDuplicateModals: boolean,
      vaDependentsNoSsn: boolean,
      vaDependentV2Flow: boolean,
      'view:addOrRemoveDependents': { add: boolean, remove: boolean },
      'view:addDependentOptions': { addChild, addSpouse, report674, ... },
      'view:removeDependentOptions': { reportDivorce, reportDeath, ... },
      'view:selectable686Options': { /* combined add+remove options */ },
      'view:removeDependentPickList': Array, // V3 picklist items
      currentMarriageInformation: Object,
      spouseInformation: Object,
      childrenToAdd: Array,
      studentInformation: Array,
      reportDivorce: Object,
      deaths: Array,
      stepChildren: Array,
      childMarriage: Array,
      childStoppedAttendingSchool: Array,
      householdIncome: Object,
      spouseSupportingDocuments: Object,
      childSupportingDocuments: Object,
    },
    loadedData: { metadata: { prefill, returnUrl, inProgressFormId }, formData },
    // ...platform form state
  },
  featureToggles: { /* platform feature toggles */ },
  user: { login: { currentlyLoggedIn }, profile: { loading, savedForms } }
}
```

## Development Workflow

### Local Development
- **Dev server**: `yarn watch --env entry=686C-674-v2`
- **Access URL**: `http://localhost:3001/manage-dependents/add-remove-form-21-686c-674`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder dependents`
- **Specific test**: `yarn test:unit path/to/test.unit.spec.js`
- **Cypress CLI**: `yarn cy:run --spec "src/applications/dependents/686c-674/tests/e2e/*"`

## Common Patterns & Best Practices

### Depends Functions
Form chapter pages use `depends` functions to control visibility:
```javascript
depends: formData => isChapterFieldRequired(formData, TASK_KEYS.addSpouse)
```

### Feature Flag Access in Form Config
Feature flags are synced to form data and accessed via `formData` in `depends`, `schema`, and `uiSchema`:
```javascript
depends: formData => formData?.vaDependentsV3 && someCondition(formData)
```

### Array Builder Pattern
Uses Array Builder for multiple arrays: `childrenToAdd`, `studentInformation`, `deaths`, `stepChildren`, `childMarriage`, `childStoppedAttendingSchool`, and spouse former marriages.

### CSRF Token Handling
All submissions ensure a valid CSRF token before POST. On 403 failure, retries once with a fresh token.

## Common Pitfalls & Anti-patterns

### What NOT to Do
- **Never** hardcode submit URLs; always check `dependentsModuleEnabled` toggle
- **Never** assume V2 or V3 flow; always check `showV3Picklist(formData)` or `vaDependentV2Flow`
- **Never** skip `dataDogHidden: true` on SSN or sensitive fields
- **Never** modify `buildSubmissionData` without understanding the full 8-step pipeline
- **Never** bypass `ensureValidCSRFToken` on form submission
- **Never** assume dependents array is populated; always check with `hasAwardedDependents`
- **Never** skip error handling in async actions
- **Never** add picklist components without updating `V3_TRANSFORMATION_ROUTES` in data mappings
- **Never** use Jest — use Mocha/Chai/Sinon instead

### Performance Considerations
- Prefill transformer preserves saved-in-progress address edits
- Feature flags are synced once via `useFormFeatureToggleSync` to avoid re-renders
- Picklist transforms are only applied when V3 flow is active

## Import Patterns

### Platform Utilities
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
```

### Local Imports
```javascript
import { TASK_KEYS, MARRIAGE_TYPES, FORMAT_YMD_DATE_FNS } from '../config/constants';
import { isChapterFieldRequired, CancelButton } from '../config/helpers';
import { showV3Picklist, spouseEvidence, childEvidence } from '../config/utilities/formHelpers';
import { buildSubmissionData, customTransformForSubmit } from '../config/utilities/submission';
import { processDependents, updateDependentsInFormData } from '../utils/processDependents';
```

### Shared Imports
```javascript
import { fetchDependents } from '../../shared/actions';
import { getFullName, maskID, calculateAge } from '../../shared/utils';
```
