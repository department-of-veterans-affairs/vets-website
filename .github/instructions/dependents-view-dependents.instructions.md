---
applyTo: "src/applications/dependents/view-dependents/**/*"
---

# View Dependents Application Instructions

## Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the view-dependents application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New titles, status values, or configuration
- **Create new helper functions**: New utilities in `util/` or shared utils
- **Implement new business rules**: Changes to rating requirements, alert logic, dependent display, or manage-dependents formlett
- **Add new action types or actions**: New Redux actions in `actions/`
- **Create new reducers or modify state shape**: Changes to Redux state structure
- **Implement new feature flags**: New feature toggles that affect behavior
- **Add new API endpoints**: New API calls
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new components or layouts**: New list items, headers, sidebar blocks, or layout versions
- **Modify the manage-dependents formlett**: Changes to inline removal schemas or submission
- **Update V1/V2 layout switching**: Changes to layout toggle logic

### How to Update These Instructions
1. **Locate the relevant section**: Find the section that relates to your change
2. **Add or update documentation**: Include function signatures, parameters, and usage examples
3. **Mark critical items**: Use **CRITICAL** marker for security-sensitive or business-critical information
4. **Keep it concise**: Focus on practical guidance that helps future development

## Application Overview
- **Entry Name**: `dependents-view-dependents`
- **Root URL**: `/manage-dependents/view`
- **Entry File**: `view-dependents-entry.jsx`
- **Purpose**: Allow veterans to view their dependents on VA benefits, remove dependents inline, and access related forms (686c-674, 21-0538)
- **Not a form app**: This is a view/list application, not a platform forms-system form

## Architecture & State Management

### Redux Structure
- **Reducers**: `allDependents`, `removeDependents`, `ratingValue`, `verifyDependents`
- **State access patterns**:
  - `state.allDependents` — All dependents data split by award status
  - `state.ratingValue` — Disability rating info and minimum rating check
  - `state.verifyDependents` — Dependency verification diary status
  - `state.removeDependents` — Manage-dependents formlett state

### Action Types & Creators

#### Dependents Actions (`actions/index.js`)
- `FETCH_ALL_DEPENDENTS_STARTED` / `FETCH_ALL_DEPENDENTS_SUCCESS` / `FETCH_ALL_DEPENDENTS_FAILED`
- `fetchAllDependents(dependentsModuleEnabled)` — Thunk that calls different endpoints based on feature toggle

#### Rating Info Actions (`actions/ratingInfo.js`)
- `FETCH_RATING_INFO_STARTED` / `FETCH_RATING_INFO_SUCCESS` / `FETCH_RATING_INFO_FAILED`
- `fetchRatingInfo()` — Thunk calling `/disability_compensation_form/rating_info`

#### Dependency Verification Actions (`actions/dependencyVerification.js`)
- `DEPENDENCY_VERIFICATION_CALL_SUCCESS` / `DEPENDENCY_VERIFICATION_CALL_FAILED`
- `UPDATE_DIARIES_STARTED` / `UPDATE_DIARIES_SUCCESS` / `UPDATE_DIARIES_FAILED` / `UPDATE_DIARIES_SKIP`
- **Note**: Action types only, no action creators exported

#### Manage Dependents Actions (`manage-dependents/redux/actions.js`)
- `FORM_DATA_UPDATED` / `FORM_DATA_CLEANUP` / `FORM_DATA_SUBMIT_START` / `FORM_DATA_SUBMIT_SUCCESS` / `FORM_DATA_SUBMIT_FAILED`
- `updateFormData(formSchema, uiSchema, formData, stateKey)` — Synchronous action
- `cleanupFormData(stateKey)` — Synchronous action
- `submitFormData(stateKey, payload)` — Thunk POSTing to `/v0/dependents_applications`

### API Layer

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/dependents_applications/show` | Fetch dependents (legacy) |
| `GET` | `/dependents_benefits/v0/claims/show` | Fetch dependents (when `dependentsModuleEnabled`) |
| `GET` | `/disability_compensation_form/rating_info` | Fetch disability rating |
| `POST` | `/v0/dependents_applications` | Remove dependent (manage-dependents formlett) |
| `GET` | `/v0/dependents_applications/show` | Shared dependents fetch (shared action) |

## Constants & Configuration

### Core Constants

| Constant | Value | Location |
|----------|-------|----------|
| `PAGE_TITLE` | `'Your VA dependents'` | `util/index.js` |
| `TITLE_SUFFIX` | `' \| Veteran Affairs'` | `util/index.js` |
| `minRating` | `30` | `reducers/ratingInfo.js` |
| `VIEW_DEPENDENTS_WARNING_KEY` | `'viewDependentsWarningClosedAt'` | `shared/utils/index.js` |

### Call Status Constants
```javascript
CALLSTATUS = { pending: 'pending', success: 'success', failed: 'failed', skip: 'skipped' }
```

### Manage Dependents Constants (`manage-dependents/utils/index.js`)
```javascript
LOADING_STATUS = { failed, pending, success }
WIZARD_OPTIONS_KEYS = { DIVORCE, ANNULMENT, VOID, DEATH, CHILD_MARRIED, CHILD_LEFT_SCHOOL, STEPCHILD_LEFT_HOUSEHOLD }
DEPENDENT_TYPES = { SPOUSE, CHILD, DEPENDENT_PARENT }
DIVORCE_REASONS = { DIVORCE: 'Divorce', ANNULMENT: 'Other', VOID: 'Other' }
```

## Helper Functions

### Utility Functions (`util/index.js`)
- `PAGE_TITLE` / `TITLE_SUFFIX` — Page title constants
- `getData(apiRoute, options)` — Wrapper around `apiRequest`, extracts `data.attributes` if present
- `splitPersons(persons)` — Splits persons array by `awardIndicator === 'N'` into `{ onAward, notOnAward }`
- `isServerError(errCode)` — Tests against `/^5\d{2}$/`
- `isClientError(errCode)` — Tests against `/^4\d{2}$/`

### Manage Dependents Utils (`manage-dependents/utils/index.js`)
- `ServerErrorFragment` — React component for error display
- `transformForSubmit(formData, vetContactInfo, userInfo)` — Transforms form data into 686c payload structure
- Internal helpers: `buildVeteranInformation`, `adaptPayload`, `formatDateString`

### Layout Helpers (`layouts/helpers.jsx`)
- `errorFragment` — Error alert JSX
- `noDependentsAlert` — V1 "no dependents" info alert
- `noDependentsAlertV2` — V2 "no dependents" info alert

## Business Logic & Requirements

### V1 vs V2 Layout Toggle
- **V1 (`ViewDependentsLayout`)**: 2-column layout (8/4 grid) with sidebar containing 3 info blocks
- **V2 (`ViewDependentsLayoutV2`)**: Single column layout, no sidebar, with "Managing your dependents" additional info section
- **Toggle**: Controlled by `vaDependentsVerification` feature flag
- **CRITICAL**: When `vaDependentsVerification` is true, V2 layout is used

### Disability Rating Gate
- **Minimum rating**: 30% service-connected combined degree
- **Purpose**: Verification alerts only shown when veteran has 30%+ disability rating
- **Calculation**: `hasMinimumRating = userPercentOfDisability >= 30`

### Dependent Award Status
- **On-award**: Dependents with `awardIndicator !== 'N'` — shown in primary list
- **Not-on-award**: Dependents with `awardIndicator === 'N'` — shown in secondary list
- **Error handling**: Server errors (5xx) show error alert; client errors (4xx) show "no dependents" info alert

### 6-Month Warning Alert Dismissal
- **Key**: `viewDependentsWarningClosedAt` in localStorage
- **Logic**: Warning is hidden if closed within the last 6 months (uses `getIsDependentsWarningHidden()`)
- **Reset**: After 6 months, the warning reappears
- **Set**: `hideDependentsWarning()` stores current ISO date to localStorage

### Upcoming Removal Alerts
- **V2 only**: Children approaching 18th birthday show a 90-day warning alert
- **Displays**: Upcoming removal date and child's age information
- **Calculation**: Uses `calculateAge` from shared utils

### Manage Dependents Formlett
- **Purpose**: Inline mini-form for removing a specific dependent without leaving the page
- **Implementation**: Uses platform `SchemaForm` with relationship-specific schemas
- **Schemas**: Separate JSON Schema + uiSchema pairs for Spouse, Child, and Dependent Parent
- **Submission**: POSTs to `/v0/dependents_applications` with 686c payload structure
- **State tracking**: Tracks `openFormlett`, `submittedDependents`, and per-dependent `status`/`error`

### Diary Status Alerts
- **Success alert**: "We've updated your dependents" (when `updateDiariesStatus === 'success'`)
- **Error/skip alerts**: Shown based on `updateDiariesStatus` values
- **V2 header**: Also includes closeable 0538 verification warning with Datadog logging

## Component Patterns

### Containers
- `ViewDependentsApp.jsx` — Main connected container. Wraps in `DowntimeNotification` + `RequiredLoginView`. On mount: dispatches `fetchAllDependents` and `fetchRatingInfo`. Switches between V1/V2 layouts based on `vaDependentsVerification` toggle

### Layouts
- `ViewDependentsLayout.jsx` — V1: 2-column with sidebar
- `ViewDependentsLayoutV2.jsx` — V2: Single column, no sidebar, links to 686c-674 and 0538 forms
- `ViewDependentsLists.jsx` — V1: On-award + not-on-award lists with "learn more" links
- `ViewDependentsListsV2.jsx` — V2: Lists with "Managing your dependents" additional info, links to forms

### Header Components
- `ViewDependentsHeader.jsx` — V1: Page title, "Add or remove a dependent" link, diary status alerts
- `ViewDependentsHeaderV2.jsx` — V2: Same plus closeable 0538 verification warning with 6-month localStorage persistence, Datadog logging

### List Components
- `ViewDependentsList.jsx` — V1: Connected list with header, subheader, external links
- `ViewDependentsListV2.jsx` — V2: List with contact change note and name change link
- `ViewDependentsListItem.jsx` — V1: Card showing name, relationship, masked SSN, DOB, optional "Remove" button
- `ViewDependentsListItemV2.jsx` — V2: `<va-card>` with age display, upcoming removal date, 90-day warning alert

### Sidebar Components (V1 only)
- `ViewDependentsSidebar.jsx` — Wrapper with left padding
- `ViewDependentsSidebarBlock.jsx` — Heading + content block
- `ViewDependentSidebarBlockStates.jsx` — Three exported blocks: when to notify VA, get help with claim/VSO, call VA for questions

### Other Components
- `ViewDependentsFooter.jsx` — Static "What if I have questions?" footer with VA benefits phone number
- `ManageDependentsApp.jsx` — Inline formlett for removing a dependent

### Manage Dependents Schemas (`manage-dependents/schemas.js`)
Large file (383 lines) defining JSON Schema + uiSchema pairs per relationship type:
- Uses web component fields: `VaSelectField`, `VaRadioField`, `VaCheckboxField`, `VaTextInputField`
- Uses `addressUiSchema`, `currentOrPastDateUI`
- Includes location schema (US states + international countries)
- Conditional fields for reason of removal/marriage ending

## Testing Patterns

### Unit Tests
- **Framework**: Mocha/Chai/Sinon with React Testing Library
- **Location**: `tests/` with mirrored structure
- **Test areas**: actions (2 files), components (7 files), containers, layouts (2 files), reducers (2 files), util
- **Manage dependents tests**: `manage-dependents/tests/unit/ManageDependentsApp.unit.spec.jsx`

### E2E Tests (Cypress)
- `tests/e2e/view-dependents.cypress.spec.js`
- `manage-dependents/tests/e2e/manage-dependents.cypress.spec.js`
- Fixtures in `tests/e2e/fixtures/` and `manage-dependents/tests/fixtures/`

## Analytics & Monitoring

### Datadog Browser Monitoring
- **Application ID**: `7b9afdca-6bc0-4706-90c6-b111cf5c66c5`
- **Client Token**: `pubbc32e28e73f69e1a445f98e2437c5ff9`
- **Service**: `benefits-view-dependents`
- **Version**: `1.0.0`
- **Session Rates**: 100% session, 0% replay
- **Privacy**: `defaultPrivacyLevel: 'mask-user-input'`
- **Toggle-gated by**: `vaDependentsViewBrowserMonitoringEnabled`

### Datadog Logging
- `dataDogLogger` used in `ViewDependentsHeaderV2.jsx` for:
  - 0538 warning alert visibility/state changes (with `state` and `reason` attributes)
  - Alert hidden by user
  - 0538 verification link clicked

### Google Analytics
- `disability-view-dependents-load-failed` / `disability-view-dependents-load-success`
- `disability-rating-info-load-failed` / `disability-rating-info-load-success`
- `cta-primary-button-click` (ViewDependentsHeader)

### Downtime Notifications
- Monitored services: `bgs`, `global`, `mvi`, `vaProfile`, `vbms`

## Feature Flags

| Flag | Purpose |
|------|---------|
| `dependentsModuleEnabled` | Controls API endpoint for fetching dependents (new module vs legacy) |
| `manageDependents` | Enables "Remove this dependent" buttons / manage-dependents formlett |
| `vaDependentsVerification` | Switches between V1 and V2 layouts |
| `vaDependentsViewBrowserMonitoringEnabled` | Enables Datadog browser monitoring |

## Redux State Shape

```javascript
state = {
  allDependents: {
    loading: boolean,
    error: null | { code: string },
    onAwardDependents: Array,   // persons with awardIndicator !== 'N'
    notOnAwardDependents: Array, // persons with awardIndicator === 'N'
  },
  ratingValue: {
    loading: boolean,
    error: null | { code: string },
    serviceConnectedCombinedDegree: null | number,
    hasMinimumRating: undefined | boolean, // true if >= 30
  },
  verifyDependents: {
    getDependencyVerificationStatus: 'pending' | 'success' | 'failed',
    updateDiariesStatus: null | 'pending' | 'success' | 'failed' | 'skipped',
    error: null | { code: string },
    verifiableDependents: null | Array,
  },
  removeDependents: {
    dependentsState: null | { [stateKey]: { formSchema, uiSchema, formData, status?, error? } },
    openFormlett: null | true,
    submittedDependents: Array, // array of stateKey indices
  },
  featureToggles: { /* platform feature toggles */ },
  user: { login: { currentlyLoggedIn }, profile: { vapContactInfo } },
}
```

## Development Workflow

### Local Development
- **Dev server**: `yarn watch --env entry=dependents-view-dependents`
- **Access URL**: `http://localhost:3001/manage-dependents/view`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder dependents`
- **Specific test**: `yarn test:unit path/to/test.unit.spec.js`
- **Cypress CLI**: `yarn cy:run --spec "src/applications/dependents/view-dependents/tests/e2e/*"`

## Common Pitfalls & Anti-patterns

### What NOT to Do
- **Never** hardcode API endpoints; always check `dependentsModuleEnabled` toggle for the correct URL
- **Never** show the remove button without checking `manageDependents` toggle
- **Never** assume V1 or V2 layout; always check `vaDependentsVerification` toggle
- **Never** skip the 30% disability rating check before showing verification alerts
- **Never** use server-side storage for alert dismissal — use localStorage with `VIEW_DEPENDENTS_WARNING_KEY`
- **Never** forget to split persons by `awardIndicator` before displaying
- **Never** assume rating info is loaded — check `ratingValue.loading` first
- **Never** use Jest — use Mocha/Chai/Sinon instead

### Performance Considerations
- On mount, dispatches `fetchAllDependents` and `fetchRatingInfo` in parallel
- `RequiredLoginView` gates content behind authentication
- `DowntimeNotification` prevents rendering during maintenance windows

## Import Patterns

### Platform Utilities
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
```

### Local Imports
```javascript
import { PAGE_TITLE, TITLE_SUFFIX, splitPersons, isServerError } from '../util';
import { fetchAllDependents } from '../actions';
import { fetchRatingInfo } from '../actions/ratingInfo';
import { LOADING_STATUS, DEPENDENT_TYPES, transformForSubmit } from '../manage-dependents/utils';
import { updateFormData, submitFormData, cleanupFormData } from '../manage-dependents/redux/actions';
```

### Shared Imports
```javascript
import { getFullName, maskID, calculateAge, getFormatedDate } from '../../shared/utils';
import { getIsDependentsWarningHidden, hideDependentsWarning } from '../../shared/utils';
import { fetchDependents } from '../../shared/actions';
```
