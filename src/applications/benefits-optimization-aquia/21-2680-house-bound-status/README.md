# VA Form 21-2680: Examination for Housebound Status or Permanent Need for Regular Aid and Attendance

## Overview

VA Form 21-2680 is used by Veterans or their caregivers to apply for Aid and Attendance (A&A) benefits or Housebound allowance. This form collects information about the Veteran, the claimant (if different from the Veteran), the type of benefit being claimed, and hospitalization status.

## Purpose

This form is used to:

- Apply for Aid and Attendance benefits or Housebound allowance
- Document the relationship between the claimant and the Veteran
- Collect medical information related to hospitalization
- Support claims for Special Monthly Compensation (SMC) or Special Monthly Pension (SMP)

## Who Can Complete This Form

- **Veterans** applying on their own behalf
- **Caregivers** (spouse, child, or parent) applying on behalf of the Veteran

## Form Sections

### Chapter 1: Veteran's Information

- **Veteran Information** - Full name, SSN, date of birth
- **Veteran Address** - Mailing address (supports standard and military addresses)

### Chapter 2: Claimant's Information

- **Claimant Relationship** - Who is filing the claim (veteran, spouse, child, or parent)
- **Claimant Information** - Full name and date of birth (conditional)
- **Claimant SSN** - Social Security number (conditional)
- **Claimant Address** - Mailing address (conditional)
- **Contact Information** - Phone numbers and email (conditional)

> **Note:** Claimant pages are hidden when the Veteran is the claimant

### Chapter 3: Claim Information

- **Benefit Type** - Choice between SMC (Special Monthly Compensation) or SMP (Special Monthly Pension)

### Chapter 4: Hospitalization

- **Hospitalization Status** - Whether the Veteran is currently hospitalized
- **Admission Date** - Date of hospital admission (conditional)
- **Hospitalization Facility** - Facility name and address (conditional)

> **Note:** Hospitalization detail pages are hidden when not currently hospitalized

## Technical Implementation

### Architecture

This application uses the VA.gov forms system (RJSF - React JSON Schema Form) with the following structure:

- **Barrel exports** with circular dependency prevention
- **Internal files** use sub-module barrel imports
- **External files** (tests) use main barrel import
- **kebab-case** file naming throughout
- **Named exports** for components (except where platform expects defaults)

### Running Locally

```bash
# Run build for this single app
yarn build --entry=21-2680-house-bound-status

# Watch only this application (minimal)
yarn watch --env entry=21-2680-house-bound-status

# Watch with full development dependencies (recommended)
yarn watch --env entry=auth,view-payments,static-pages,login-page,terms-of-use,verify,21-2680-house-bound-status

# Run unit tests
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run Cypress E2E tests (requires yarn watch running first)
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-2680-house-bound-status/tests/e2e/*.cypress.spec.js"

# Open Cypress UI
yarn cy:open
```

### Project Structure

```bash
21-2680-house-bound-status/
├── components/
│   ├── get-help/                             # Help footer component
│   │   ├── get-help.jsx
│   │   ├── get-help.unit.spec.jsx
│   │   └── index.js
│   └── index.js                              # Barrel export
├── config/
│   ├── form/                                 # Main form configuration
│   │   ├── form.js
│   │   ├── form.unit.spec.jsx
│   │   └── index.js
│   ├── prefill-transformer/                  # Profile data to form data
│   │   ├── prefill-transformer.js
│   │   ├── prefill-transformer.unit.spec.jsx
│   │   └── index.js
│   ├── submit-transformer/                   # Form data to API payload
│   │   ├── submit-transformer.js
│   │   ├── submit-transformer.unit.spec.jsx
│   │   └── index.js
│   └── index.js                              # Barrel export
├── constants/
│   ├── constants.js                          # App constants (benefit types, etc.)
│   ├── constants.unit.spec.jsx
│   └── index.js
├── containers/
│   ├── app/                                  # Main app wrapper
│   │   ├── app.jsx
│   │   ├── app.unit.spec.jsx
│   │   └── index.js
│   ├── introduction-page/                    # Form intro and process steps
│   │   ├── introduction-page.jsx
│   │   ├── introduction-page.unit.spec.jsx
│   │   └── index.js
│   ├── confirmation-page/                    # Submission confirmation
│   │   ├── confirmation-page.jsx
│   │   ├── confirmation-page.unit.spec.jsx
│   │   └── index.js
│   └── index.js                              # Barrel export
├── pages/                                    # Individual form pages
│   ├── veteran-information.js                # Veteran name, SSN, DOB
│   ├── veteran-address.js                    # Veteran mailing address
│   ├── claimant-relationship.js              # Claimant relationship to veteran
│   ├── claimant-information.js               # Claimant name and DOB
│   ├── claimant-ssn.js                       # Claimant SSN
│   ├── claimant-address.js                   # Claimant mailing address
│   ├── claimant-contact.js                   # Claimant phone and email
│   ├── benefit-type.js                       # SMC or SMP selection
│   ├── hospitalization-status.js             # Currently hospitalized?
│   ├── hospitalization-date.js               # Admission date
│   ├── hospitalization-facility.js           # Facility name and address
│   ├── helpers.js                            # Page helper functions
│   └── index.js                              # Barrel export
├── reducers/
│   ├── reducers.js                           # Redux reducers
│   └── index.js
├── routes/
│   ├── routes.jsx                            # React Router configuration
│   └── index.js
├── sass/
│   └── 21-2680-house-bound-status.scss      # Application styles
├── tests/
│   ├── e2e/
│   │   └── 21-2680-house-bound-status.cypress.spec.js
│   └── fixtures/
│       ├── data/                             # Test data (Star Wars themed!)
│       │   ├── minimal-test.json             # Luke Skywalker (veteran)
│       │   ├── maximal-test.json             # Anakin & Padmé (spouse, APO)
│       │   ├── parent-claimant-smp-hospitalized.json  # Leia & Bail (parent)
│       │   ├── spouse-military-address.json  # Wedge & Norra (spouse, FPO)
│       │   ├── child-with-suffixes.json      # Lando Sr. & Jr. (child, DPO)
│       │   ├── minimal-payload.json          # Transformed output
│       │   ├── maximal-payload.json          # Transformed output
│       │   └── index.js
│       ├── mocks/
│       │   ├── user.json                     # Mock user (Luke Skywalker)
│       │   ├── feature-toggles.json          # Feature flags
│       │   ├── application-submit.json       # Submission response
│       │   ├── local-mock-responses.js       # Mock API responses
│       │   └── index.js
│       ├── FIXTURES_THEME.md                 # Star Wars theme documentation
│       └── index.js
├── app-entry.jsx                             # Application entry point
├── index.js                                  # Root barrel export
├── manifest.json                             # App metadata
├── package.json                              # Package configuration
└── README.md                                 # This file
```

### Import Patterns

This application uses the `@bio-aquia` alias with careful circular dependency prevention:

**Internal files** (routes, reducers, config) use sub-module imports:

```javascript
// ✅ Correct - uses sub-module barrels
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21-2680-house-bound-status/constants';
import { GetHelp } from '@bio-aquia/21-2680-house-bound-status/components';
```

**External files** (tests) use main barrel:

```javascript
// ✅ Correct - tests can use main barrel
import {
  formConfig,
  IntroductionPage,
} from '@bio-aquia/21-2680-house-bound-status';
```

### Form Features

- **Conditional pages**: Claimant pages hidden when veteran is claimant, hospitalization details hidden when not hospitalized
- **Save-in-progress**: Auto-saves form data
- **Prefill**: Pulls veteran data from user profile via `prefill-transformer`
- **Data transformation**: `submit-transformer` formats data for backend API
- **Validation**: Uses platform validators for SSN, dates, phone numbers, addresses
- **Military addresses**: Supports APO/AE, FPO/AP, and DPO/AA
- **Accessibility**: WCAG 2.2 AA compliant using VA Design System web components
- **Statement of Truth**: Built-in signature validation using `va-statement-of-truth`

## Testing

### E2E Tests (Cypress)

Cypress tests (`tests/e2e/21-2680-house-bound-status.cypress.spec.js`) validate the complete user flow using the platform's form-tester utility. The application uses 5 optimized test fixtures that provide comprehensive coverage:

| Fixture                              | Relationship | Benefit Type | Hospitalized | Address Type | Coverage                               |
| ------------------------------------ | ------------ | ------------ | ------------ | ------------ | -------------------------------------- |
| **minimal-test.json**                | veteran      | SMC          | No           | Standard     | Baseline scenario, veteran is claimant |
| **maximal-test.json**                | spouse       | SMP          | Yes          | APO/AE       | Full complexity, all optional fields   |
| **parent-claimant-smp-hospitalized** | parent       | SMP          | Yes          | Standard     | Parent relationship, 3-line addresses  |
| **spouse-military-address.json**     | spouse       | SMC          | No           | FPO/AP       | FPO military address                   |
| **child-with-suffixes.json**         | child        | SMP          | Yes          | DPO/AA       | Child relationship, name suffixes, DPO |

**Coverage Summary:**

- All 4 claimant relationships with conditional page logic (veteran hides claimant pages)
- Both benefit types (SMC, SMP)
- Both hospitalization states (not hospitalized hides detail pages)
- All 3 military address types (APO/AE, FPO/AP, DPO/AA)
- Field variations: name suffixes, 3-line addresses, empty middle names
- Complete field coverage: names, addresses, contacts, dates, identification

**Test Flow Per Fixture:**

1. **Introduction Page** - Content loads, start navigation, accessibility checks
2. **Form Navigation** - Page order, conditional logic, back/continue, progress bar
3. **Data Entry** - Field input, validation (SSN, dates, required fields), address handling, suffix selection
4. **Review and Submit** - Data display, statement of truth, signature field, checkbox, submit trigger
5. **Form Submission** - API POST request, data transformation, response handling
6. **Confirmation Page** - Confirmation number, print button, accessibility checks

**Running E2E Tests:**

```bash
# Run Cypress in headless mode
yarn cy:run --spec "**/21-2680-house-bound-status/**/*.cypress.spec.js"

# Open Cypress UI (requires yarn watch running first)
yarn cy:open
```

**Prerequisites:** `yarn watch` must be running. vets-api should NOT be running (tests use mocked API responses).

### Unit Tests

Unit tests use React Testing Library and cover the following areas:

**Configuration Tests:**

- `config/form/form.unit.spec.jsx` - Form configuration, chapters, pages, submitUrl, transformers
- `config/prefill-transformer/prefill-transformer.unit.spec.jsx` - User profile data transformation to form data
- `config/submit-transformer/submit-transformer.unit.spec.jsx` - Form data transformation to API payload

**Container Tests:**

- `containers/app/app.unit.spec.jsx` - Main app wrapper, routing, and save-in-progress integration
- `containers/introduction-page/introduction-page.unit.spec.jsx` - Introduction page rendering, process steps
- `containers/confirmation-page/confirmation-page.unit.spec.jsx` - Confirmation page, confirmation number display

**Component Tests:**

- `components/get-help/get-help.unit.spec.jsx` - Help footer component rendering

**Other Tests:**

- `constants/constants.unit.spec.jsx` - Application constants (benefit types, ADL options)
- `routes/routes.unit.spec.jsx` - React Router configuration

**Running Unit Tests:**

```bash
# Run all unit tests for this app
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21-2680-house-bound-status/config/form/form.unit.spec.jsx

# Run with coverage
yarn test:coverage-app 21-2680-house-bound-status
```

## API Integration

### Endpoints

- **Form submission**: `POST ${environment.API_URL}/v0/form212680`
- **Save in Progress**:
  - Save: `PUT /v0/in_progress_forms/21-2680`
  - Get: `GET /v0/in_progress_forms/21-2680`
  - Delete: `DELETE /v0/in_progress_forms/21-2680`
- **User profile**: `GET /v0/user` (for prefill)

### Data Flow

1. **Prefill**: On form start, veteran info is pulled from profile via `prefill-transformer`
2. **Save**: Form data auto-saves to backend
3. **Submit**: Form transforms data via `submit-transformer` and POSTs to API
4. **Confirmation**: Returns confirmation number displayed on confirmation page

## Conditional Form Logic

### Claimant Pages

When `claimantRelationship.relationship === 'veteran'`, the following pages are hidden:

- Claimant Information
- Claimant SSN
- Claimant Address
- Claimant Contact

### Hospitalization Pages

When `hospitalizationStatus.isCurrentlyHospitalized === false`, the following pages are hidden:

- Hospitalization Date
- Hospitalization Facility

## Accessibility & Compliance

- **WCAG 2.2 Level AA**: All interactive elements meet contrast and keyboard navigation requirements
- **Section 508**: Fully compliant with federal accessibility standards
- **VA Design System**: Uses web components (`va-text-input`, `va-select`, `va-date`, etc.) for consistent UX
- **Screen Readers**: Tested with JAWS, NVDA, and VoiceOver
- **Focus Management**: Proper focus handling on page transitions and error states
- **Statement of Truth**: Uses platform's `va-statement-of-truth` web component for signature validation

## Dependencies

Key platform utilities used:

- `platform/forms-system` - VA.gov form system and web component patterns
- `platform/forms/save-in-progress` - Save-in-progress functionality
- `platform/user/selectors` - User authentication state
- `platform/utilities/ui` - UI helpers (focus, scroll)
- `vets-json-schema` - Common form field definitions

**No custom dependencies** - This app does not depend on `@bio-aquia/shared` or other internal packages.

## Team & Support

**Owner**: Benefits Intake Optimization - Aquia

**Slack**: #benefits-optimization-aquia

For questions about this application, contact the Benefits Intake Optimization - Aquia team.
