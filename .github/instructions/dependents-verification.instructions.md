---
applyTo: "src/applications/dependents/dependents-verification/**/*"
---

# Dependents Verification (21-0538) Application Instructions

## Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the dependents-verification application, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new constants**: New titles, choices, or configuration in `constants.js`
- **Create new helper functions**: New utilities in `helpers.js` or `util/`
- **Implement new business rules**: Changes to verification flow, exit logic, or contact info editing
- **Add new chapters or pages**: New form chapters, pages, or edit pages
- **Implement new feature flags**: New feature toggles that affect application behavior
- **Add new API endpoints**: New API calls or submit URL changes
- **Change testing patterns**: New test utilities, fixtures, or patterns
- **Add new components**: New custom pages or review components
- **Modify the submission pipeline**: Changes to `transform`, `submit`, or CSRF handling
- **Update contact info patterns**: Changes to inline edit pages or session storage focus management

### How to Update These Instructions
1. **Locate the relevant section**: Find the section that relates to your change
2. **Add or update documentation**: Include function signatures, parameters, return types, and usage examples
3. **Mark critical items**: Use **CRITICAL** marker for security-sensitive or business-critical information
4. **Keep it concise**: Focus on practical guidance that helps future development

## Application Overview
- **Entry Name**: `0538-dependents-verification`
- **Root URL**: `/manage-dependents/verify-dependents-form-21-0538`
- **Entry File**: `app-entry.jsx`
- **Form ID**: `21-0538` (`VA_FORM_IDS.FORM_21_0538`)
- **Tracking Prefix**: `0538-dependents-verification-`
- **Purpose**: Allow veterans to verify their dependents for disability benefits. This is a verification-only flow — veterans confirm whether their dependents' information is up to date, with no new dependent data entry
- **Product ID**: `34b9f018-c72d-4788-9cce-b73c8f234116`
- **OMB Info**: Control number `2900-0500`, respondent burden `10 minutes`, expiration `1/31/2027`

## Architecture & State Management

### Redux Structure
- **Reducers**: `form` (save-in-progress), `dependents` (shared reducer from `shared/reducers/dependents.js`)
- **Shared action types**: `DEPENDENTS_FETCH_STARTED`, `DEPENDENTS_FETCH_SUCCESS`, `DEPENDENTS_FETCH_FAILED` (from `shared/actions`)
- **State access patterns**:
  - `state.form` — Platform save-in-progress form state
  - `state.dependents` — Shared dependents data (loading, error, data)
  - `state.featureToggles.vaDependentsVerification` — Feature gate for entire app

### API Layer
- **Backend Service**: vets-api

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/v0/dependents_applications/show` | Fetch dependents list |
| `POST` | `/dependents_verification/v0/claims` | Submit verification form |
| `HEAD` | `/v0/maintenance_windows` | Fetch CSRF token |
| `GET/PUT` | `/v0/in_progress_forms/21-0538` | Save-in-progress (platform) |

### Form Configuration
- **Prefill**: Enabled with `verifyRequiredPrefill: true`
- **Custom submit**: `util/index.js` — `submit(form, formConfig)` with CSRF retry logic
- **Custom scroll/focus**: `useCustomScrollAndFocus: true`, `scrollAndFocusTarget: focusH3`
- **Pre-submit**: Statement of Truth with `useProfileFullName: true`
- **Downtime dependencies**: None currently configured (commented out)
- **Get help**: `NeedHelp` component
- **Footer**: Platform `FormFooter`

### Form Chapters

| Chapter | Title | Pages |
|---------|-------|-------|
| `veteranInformation` | "Review your personal information" | `veteranInformation` (path: `veteran-information`) |
| `veteranContactInformation` | "Veteran's contact information" | `veteranContactInformation`, `editAddressPage`, `editEmailPage`, `editPhonePage`, `editInternationalPhonePage` |
| `dependents` | "Review your dependents" | `dependents`, `exitForm` (conditional: `hasDependentsStatusChanged === 'Y'`) |

## Constants & Configuration

### Core Constants (`constants.js`)
```javascript
TITLE = 'Verify your dependents for disability benefits'
SUBTITLE = 'VA Form 21-0538'
DEPENDENT_TITLE = 'Has the status of your dependents changed?'
DEPENDENT_CHOICES = {
  Y: 'Yes, I need to update my dependents\u2019 information.',
  N: 'No, my dependents\u2019 information is up to date.',
}
```

## Helper Functions

### Main Helpers (`helpers.js`)
- `hasSession()` — Checks `localStorage.getItem('hasSession') === 'true'`
- `processDependents(persons)` — Filters persons where `awardIndicator === 'Y'`, maps to add: `dob` (formatted), `ssn` (last 4 only), `fullName`, `age`, `removalDate` (formatted)
- `PRIVACY_ACT_NOTICE` — JSX constant with full privacy act text and respondent burden statement

### Utility Functions (`util/index.js`)
- `transform(formConfig, form)` — Wraps `transformForSubmit` output in `{ dependentsVerificationClaim: { form } }`
- `ensureValidCSRFToken()` — Checks localStorage for `csrfToken`, fetches new one if missing via HEAD to `/v0/maintenance_windows`
- `submit(form, formConfig)` — POSTs to `/dependents_verification/v0/claims`, handles CSRF 403 retry, 429 throttling, calls `hideDependentsWarning()` on success

### Contact Info Utilities (`util/contact-info.js`)
- `contactInfoXref` — Maps `address`, `phone`, `internationalPhone`, `email` to labels/paths
- `saveEditContactInformation(name, action)` — Stores edit state in sessionStorage
- `getEditContactInformation()` — Reads edit state from sessionStorage
- `removeEditContactInformation()` — Clears edit state
- `convertPhoneObjectToString(phoneObj)` — Formats phone object to string

### Focus Utilities (`util/focus.js`)
- `focusFirstError(_index, root)` — Focuses first `[error]` or `.usa-input-error` element
- `focusH3(index, root)` — Scrolls to top, focuses `va-alert h2` or `#main h3`
- `focusContactInfo()` — Scrolls to `h3` unless editing contact info
- `focusPrefillAlert()` — Focuses `va-alert`

## Business Logic & Requirements

### Verification Flow
- **Purpose**: Veterans confirm whether their dependents' information is current
- **No data entry**: Unlike 686c-674, this form does not collect new dependent data
- **Award indicator filtering**: Only dependents with `awardIndicator === 'Y'` are shown for verification
- **Exit to 686c**: When `hasDependentsStatusChanged === 'Y'`, the exit form page redirects veterans to the 686c-674 form to make changes

### Contact Info Editing
- **Inline edit pages**: Address, email, phone, and international phone are edited via custom pages within the form flow
- **Session storage focus management**: Edit state is stored in sessionStorage to manage focus on return from edit pages
- **Address validation**: Custom city validation rejects APO/FPO/DPO for non-military addresses
- **International phone**: 11-digit limit per RBPS requirements (`^\d{1,11}$`)

### CSRF Token Handling
All submissions ensure a valid CSRF token before POST. On 403 failure, retries once with a fresh token. Records analytics events for each CSRF scenario.

### Form Completion Side Effects
- On successful submission, calls `hideDependentsWarning()` to dismiss the 6-month warning alert in view-dependents

## Component Patterns

### Containers
- `App.jsx` — Root container. Feature toggle gate (`vaDependentsVerification`), breadcrumbs, Datadog monitoring, routing. Renders `NoFormPage` when toggle is off
- `IntroductionPage.jsx` — Form intro with process list, OMB info, `Gateway` component with save-in-progress widget
- `ConfirmationPage.jsx` — Post-submit confirmation with accordion summary, PDF download, `ConfirmationView`

### Components
- `DependentsInformation.jsx` — CustomPage for dependents review
- `DependentsInformationReview.jsx` — CustomPageReview for dependents
- `EditCardLink.jsx` — Link to edit contact info card
- `EditEmailPage.jsx` — Custom email edit page
- `EditInternationalPhonePage.jsx` — Custom international phone edit page
- `EditMailingAddressPage.jsx` — Custom address edit page
- `EditPageButtons.jsx` — Shared buttons for edit pages (back/continue navigation)
- `EditPhonePage.jsx` — Custom phone edit page
- `ExitForm.jsx` — Exit form page (shown when dependents status changed = "Yes"), redirects to 686c-674
- `Gateway.jsx` — Introduction page gateway/save-in-progress widget
- `NeedHelp.jsx` — Help footer component
- `NoFormPage.jsx` — Shown when `vaDependentsVerification` feature toggle is off
- `VeteranContactInformationPage.jsx` — Contact info display page
- `VeteranContactInformationReviewPage.jsx` — Contact info review page
- `VeteranInformationComponent.jsx` — Veteran personal info display
- `VeteranInformationReviewPage.jsx` — Veteran personal info review

## Testing Patterns

### Unit Tests
- **Framework**: Mocha/Chai/Sinon with React Testing Library
- **Location**: `tests/unit/` with mirrored structure
- **Test areas**: helpers, prefill-transformer, components (16 files), containers (3 files), config chapters, util

### E2E Tests (Cypress)
- `tests/e2e/0538-dependents-verification.cypress.spec.js`
- Fixtures in `tests/e2e/fixtures/data/` and `tests/e2e/fixtures/mocks/`

### Mock API
- `tests/mock-api-full-data.js` — Full mock API responses for local development

## Analytics & Monitoring

### Datadog Browser Monitoring
- **Application ID**: `2f49e2b2-d5d6-4a53-9850-a42ed7ab26d7`
- **Client Token**: `pub15c7121f25875066ff90b92371cd7ff4`
- **Service**: `benefits-dependents-verification`
- **Version**: `1.0.0`
- **Session Rates**: 100% session, 100% replay
- **Privacy**: `defaultPrivacyLevel: 'mask-user-input'`
- **Toggle-gated by**: `vaDependentsBrowserMonitoringEnabled`

### Google Analytics Events
- `dependents-verification-fetch-csrf-token-empty`
- `dependents-verification-fetch-csrf-token-success`
- `dependents-verification-fetch-csrf-token-failure`
- `dependents-verification-fetch-csrf-token-present`
- `${trackingPrefix}-submission-successful`
- `dependents-verification-delete-in-progress-form-success` / `-failure` (via shared utility)

## Feature Flags

| Flag | Purpose |
|------|---------|
| `vaDependentsVerification` | Gates entire form — renders `NoFormPage` when `false` |
| `vaDependentsBrowserMonitoringEnabled` | Enables Datadog browser monitoring |

## Redux State Shape

```javascript
state = {
  form: {
    data: {
      veteranInformation: { ssnLastFour },
      email: string,
      phone: string,
      address: Object,
      internationalPhone: string,
      dependents: Array, // processed dependent objects
      hasDependentsStatusChanged: 'Y' | 'N',
      electronicCorrespondence: boolean,
    },
    // ...platform form state (submission, loadedData, etc.)
  },
  dependents: {
    loading: boolean,
    error: null | string,
    data: Array // processed dependents from shared reducer
  },
  featureToggles: {
    vaDependentsVerification: boolean,
    // ...other toggles
  },
  user: { login: { currentlyLoggedIn }, profile: { ... } },
  externalServiceStatus: { loading: boolean }
}
```

## Development Workflow

### Local Development
- **Dev server**: `yarn watch --env entry=0538-dependents-verification`
- **Access URL**: `http://localhost:3001/manage-dependents/verify-dependents-form-21-0538`
- **Simulate login**: `localStorage.setItem('hasSession', true)` in browser console

### Testing Commands
- **Unit tests**: `yarn test:unit --app-folder dependents`
- **Specific test**: `yarn test:unit path/to/test.unit.spec.js`
- **Cypress CLI**: `yarn cy:run --spec "src/applications/dependents/dependents-verification/tests/e2e/*"`

## Common Pitfalls & Anti-patterns

### What NOT to Do
- **Never** bypass the `vaDependentsVerification` feature toggle gate
- **Never** skip `ensureValidCSRFToken` on form submission
- **Never** allow data entry for dependents — this is a verification-only form
- **Never** forget to call `hideDependentsWarning()` on successful submission
- **Never** skip session storage cleanup for contact info edits
- **Never** validate international phone numbers with US patterns (use `^\d{1,11}$`)
- **Never** show non-awarded dependents (`awardIndicator !== 'Y'`) in the verification list
- **Never** use Jest — use Mocha/Chai/Sinon instead

## Import Patterns

### Platform Utilities
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
```

### Local Imports
```javascript
import { TITLE, SUBTITLE, DEPENDENT_TITLE, DEPENDENT_CHOICES } from '../constants';
import { processDependents, hasSession, PRIVACY_ACT_NOTICE } from '../helpers';
import { transform, submit, ensureValidCSRFToken } from '../util';
import { contactInfoXref, saveEditContactInformation } from '../util/contact-info';
import { focusH3, focusContactInfo, focusFirstError } from '../util/focus';
```

### Shared Imports
```javascript
import { fetchDependents } from '../../shared/actions';
import dependentsReducer from '../../shared/reducers/dependents';
import { getFullName, maskID, hideDependentsWarning } from '../../shared/utils';
import ExitForm from '../../shared/components/ExitFormLink';
import { deleteInProgressForm } from '../../shared/utils/api';
```
