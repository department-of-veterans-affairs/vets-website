---
applyTo: "src/applications/dependents/shared/**/*"
---

# Shared Dependents Module Instructions

## Self-Maintenance Instructions for Copilot

**CRITICAL**: When you make fundamental changes to the shared dependents module, you MUST update this instruction file to reflect those changes. This ensures future Copilot sessions have accurate guidance.

### When to Update These Instructions
Update this file when you:
- **Add new shared actions**: New action types or action creators in `actions/`
- **Modify the shared reducer**: Changes to state shape or processing logic in `reducers/`
- **Add new utility functions**: New helpers in `utils/` or `utils/dates.js`
- **Add new shared components**: New reusable components in `components/`
- **Change API endpoints**: New or modified API calls
- **Update constants**: New shared constants like `VIEW_DEPENDENTS_WARNING_KEY`

## Module Overview
- **Location**: `src/applications/dependents/shared/`
- **Purpose**: Shared code consumed by all dependents applications (686c-674, dependents-verification, view-dependents)
- **Contains**: Actions, reducers, components, utilities, and tests used across multiple apps

## Architecture

### Actions (`actions/index.js`)

**Action Types:**
- `DEPENDENTS_FETCH_STARTED`
- `DEPENDENTS_FETCH_SUCCESS`
- `DEPENDENTS_FETCH_FAILED`

**Constants:**
- `DEPENDENTS_URL` = `${environment.API_URL}/v0/dependents_applications/show`

**Action Creators:**
- `fetchDependents()` — Async thunk that dispatches `STARTED`, calls `apiRequest(DEPENDENTS_URL)`, dispatches `SUCCESS` with `response.data.attributes.persons` (or `[]`), or `FAILED` with the first error detail string

### Reducer (`reducers/dependents.js`)

**Initial State:**
```javascript
{ loading: true, error: null, data: [] }
```

**Behavior:**

| Action | State Change |
|--------|-------------|
| `DEPENDENTS_FETCH_STARTED` | `loading: true, error: null` |
| `DEPENDENTS_FETCH_SUCCESS` | `loading: false, error: null, data: processDependents(action.data)` |
| `DEPENDENTS_FETCH_FAILED` | `loading: false, error: action.data.error` |

**CRITICAL**: The reducer imports `processDependents` from `../../dependents-verification/helpers` to transform raw persons data on success. This creates a cross-module dependency.

## Utility Functions

### Main Utils (`utils/index.js`)

**Constants:**
- `VIEW_DEPENDENTS_WARNING_KEY` = `'viewDependentsWarningClosedAt'`

**Name Formatting:**
- `getFullName({ first, middle, last, suffix })` — Joins name parts; appends suffix with comma
- `makeNamePossessive(name)` — Adds `'s` or `'` depending on trailing "s"

**Data Masking:**
- `maskID(id = '', mask = '●●●–●●-')` — Masks all but last 4 digits with screen-reader-friendly substitute using `srSubstitute`

**Validation:**
- `isFieldMissing(value)` — Returns `true` if `undefined`, `null`, or `''`
- `isEmptyObject(obj)` — Recursively checks if object (and nested objects) are empty

**Navigation:**
- `getRootParentUrl(rootUrl)` — Splits on word-boundary `/` and returns first segment

**Alert Persistence:**
- `getIsDependentsWarningHidden()` — Reads localStorage key `viewDependentsWarningClosedAt`; returns `false` if older than 6 months or invalid
- `hideDependentsWarning()` — Stores current ISO date string to localStorage under `viewDependentsWarningClosedAt`

**Re-exports:** `getFormatedDate`, `calculateAge` from `./dates`

### Date Utils (`utils/dates.js`)

- `getFormatedDate(date, startFormat = 'yyyy-MM-dd', endFormat = 'MMMM d, yyyy')` — Parses a date string and reformats it. Returns original string or `'Unknown date'` on failure
- `calculateAge(dob, options)` — Computes age from a date-of-birth string. Returns `{ age, dobStr, labeledAge }`
  - **Options**: `{ dateInFormat = 'MM/dd/yyyy', dateOutFormat = 'MMMM d, yyyy', futureDateError = 'Date in the future' }`
  - **Smart labels**: `"X years old"`, `"X months old"`, `"X days old"`, `"Newborn"`, `"Date in the future"`, or empty string for invalid input

### API Utils (`utils/api.js`)

- `deleteInProgressForm(formId)` — Async function. Calls `removeFormApi(formId)` from platform's save-in-progress API. Records analytics events:
  - Success: `dependents-verification-delete-in-progress-form-success`
  - Failure: `dependents-verification-delete-in-progress-form-failure`

## Shared Components

### ExitFormLink (`components/ExitFormLink.jsx`)

**Default Export:** `ExitForm` React component

**Props:**

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `href` | `string` | yes | — | URL to navigate to |
| `formId` | `string` | no | — | If provided, deletes in-progress form before navigating |
| `text` | `string` | no | `'Exit application'` | Link/button text |
| `exitCallback` | `func` | no | — | Optional callback invoked after form deletion, before navigation |
| `location` | `{ assign }` | no | `window.location` | Location object for navigation (enables testing) |
| `useButton` | `bool` | no | `false` | Renders `<va-button>` instead of `<va-link-action>` |

**Behavior:** On click, prevents default, optionally calls `deleteInProgressForm(formId)`, optionally calls `exitCallback()`, then navigates via `location.assign(href)`.

## Testing Patterns

### Test Structure
```
tests/
├── actions.unit.spec.jsx               — fetchDependents success/failure
├── components/
│   └── ExitFormLink.unit.spec.jsx       — ExitForm rendering and behavior
├── fixtures/
│   └── mocks/
│       └── mock-dependents.json         — Mock API response with 8 persons
└── utils/
    ├── dates.unit.spec.jsx              — getFormatedDate, calculateAge
    └── utils.unit.spec.jsx              — getFullName, makeNamePossessive, maskID, etc.
```

### Test Stack
- **Framework**: Mocha/Chai/Sinon with React Testing Library
- **API Mocking**: MSW (via platform adapter) with `redux-mock-store` and thunk middleware

### Mock Data
The mock dependents fixture (`tests/fixtures/mocks/mock-dependents.json`) contains 8 persons with fields:
- `awardIndicator`, `dateOfBirth`, `firstName`, `lastName`, `relationship` (Spouse, Child, Parent)
- `ptcpntId`, `upcomingRemoval`, `socialSecurityNumber`, and more

## Common Pitfalls & Anti-patterns

### What NOT to Do
- **Never** modify the shared reducer without checking impact on all consuming apps (686c-674, dependents-verification, view-dependents)
- **Never** remove or rename exports without updating all import sites
- **Never** change `VIEW_DEPENDENTS_WARNING_KEY` without migrating existing localStorage values
- **Never** break the 6-month alert dismissal logic — it is used across view-dependents and dependents-verification
- **Never** change `processDependents` import in the reducer without verifying the cross-module dependency
- **Never** use Jest — use Mocha/Chai/Sinon instead

### Cross-Module Dependencies
- `shared/reducers/dependents.js` imports `processDependents` from `dependents-verification/helpers.js`
- `shared/utils/api.js` records events prefixed with `dependents-verification-`
- Changes to any shared code can affect all three dependents applications

## Import Patterns

### Importing Shared Code (from consuming apps)
```javascript
// Actions
import { fetchDependents, DEPENDENTS_FETCH_STARTED } from '../../shared/actions';

// Reducer
import dependentsReducer from '../../shared/reducers/dependents';

// Utils
import {
  getFullName, makeNamePossessive, maskID,
  isFieldMissing, isEmptyObject,
  getRootParentUrl,
  getIsDependentsWarningHidden, hideDependentsWarning,
  getFormatedDate, calculateAge,
  VIEW_DEPENDENTS_WARNING_KEY,
} from '../../shared/utils';

// API utils
import { deleteInProgressForm } from '../../shared/utils/api';

// Components
import ExitForm from '../../shared/components/ExitFormLink';
```

### Internal Imports (within shared module)
```javascript
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { recordEvent } from '@department-of-veterans-affairs/platform-monitoring/exports';
import { removeFormApi } from 'platform/forms/save-in-progress/api';
import { srSubstitute } from 'platform/forms-system/src/js/utilities/ui/mask-string';
import { parse, isValid, format, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
```
