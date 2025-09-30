# VA Form 21-2680: Examination for Housebound Status or Permanent Need for Regular Aid and Attendance

## Overview

VA Form 21-2680 is a medical examination form that must be completed by a physician to support a Veteran's claim for Aid and Attendance (A&A) or Housebound benefits. This form provides medical evidence of a Veteran's need for regular assistance with daily living activities or their substantial confinement to their home due to disability.

## Purpose

This form is used to:

- Document medical evidence for Aid and Attendance or Housebound benefit claims
- Provide physician assessment of the Veteran's functional limitations
- Support claims for increased compensation due to disability-related care needs

## Who Completes This Form

**This form must be completed by a licensed physician** who has examined the Veteran. The physician provides:

- Medical diagnosis and prognosis
- Assessment of the Veteran's ability to perform daily activities
- Documentation of care needs and functional limitations

## Form Sections

### Section I - Veteran Information

- Full name
- VA file number or Social Security Number
- Date of birth
- Contact information (address, phone, email)

### Section II - Medical History

- Current diagnoses affecting daily function
- Date of onset for conditions
- Hospitalizations and treatment history
- Current medications

### Section III - Physical Examination

- Vision assessment (visual acuity and field defects)
- Hearing assessment
- Physical limitations and restrictions
- Mental/cognitive status

### Section IV - Functional Assessment

- Ability to perform activities of daily living (ADLs)
  - Bathing and hygiene
  - Dressing
  - Eating
  - Toileting
  - Transferring/mobility
- Need for assistive devices
- Safety concerns and supervision needs

### Section V - Physician Certification

- Physician's assessment of aid and attendance needs
- Determination of housebound status
- Physician signature and credentials
- Date of examination

## Technical Implementation

### Architecture

This application uses the VA.gov forms system (RJSF - React JSON Schema Form) with the following structure:

- **Barrel exports** for clean imports using `@bio-aquia` alias
- **kebab-case** file naming throughout
- **Named exports** for components (except where platform expects defaults)
- **index.js files** in each directory for scalable module organization

### Running Locally

```bash
# Run build for this single app
yarn build --entry=21-2680-house-bound-status

# Watch only this application
yarn watch --env entry=21-2680-house-bound-status

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,login-page,21-2680-house-bound-status

# Run unit tests
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run Cypress tests
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-2680-house-bound-status/**/*.cypress.spec.js"
```

### Project Structure

```bash
21-2680-house-bound-status/
├── config/
│   ├── form.js                               # Main form configuration
│   └── index.js                              # Barrel export
├── containers/
│   ├── app.jsx                               # Main app wrapper
│   ├── introduction-page.jsx                 # Form intro and process steps
│   ├── confirmation-page.jsx                 # Submission confirmation
│   └── index.js                              # Barrel exports
├── pages/                                    # Individual form pages
│   ├── name-and-date-of-birth.js            # Veteran name and DOB
│   ├── identification-information.js         # SSN/VA file number
│   ├── mailing-address.js                   # Contact address
│   ├── phone-and-email-address.js           # Contact methods
│   └── index.js                              # Barrel exports
├── reducers/
│   └── index.js                              # Redux reducers
├── sass/
│   └── 21-2680-house-bound-status.scss      # Application styles
├── tests/
│   ├── containers/                           # Component unit tests
│   │   ├── introduction-page.unit.spec.jsx
│   │   └── confirmation-page.unit.spec.jsx
│   ├── fixtures/                             # Test data and mocks
│   │   ├── data/
│   │   │   ├── minimal-test.json
│   │   │   └── index.js
│   │   ├── mocks/
│   │   │   ├── local-mock-responses.js
│   │   │   ├── user.json
│   │   │   └── index.js
│   │   └── index.js
│   └── 21-2680-house-bound-status.cypress.spec.js  # E2E tests
├── utils/                                    # Utility functions
│   └── index.js                              # Barrel exports (ready for utilities)
├── app-entry.jsx                             # Application entry point
├── routes.jsx                                # React Router configuration
├── constants.js                              # Application constants
├── index.js                                  # Root barrel export
├── manifest.json                             # App metadata
└── README.md                                 # This file
```

### Import Alias

This application uses the `@bio-aquia` alias configured in `babel.config.json`:

```javascript
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';
import { IntroductionPage } from '@bio-aquia/21-2680-house-bound-status/containers';
```

### Form Features

- **Save-in-progress**: Auto-saves form data every 60 seconds
- **Prefill**: Pulls veteran data from user profile
- **Validation**: Uses platform validators for SSN, dates, phone numbers
- **Accessibility**: WCAG 2.2 AA compliant using VA Design System components

## Testing

### Unit Tests

Tests use React Testing Library and are located in `tests/containers/`:

```bash
# Run all unit tests for this app
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21-2680-house-bound-status/tests/containers/introduction-page.unit.spec.jsx
```

### E2E Tests

Cypress tests validate the full user flow:

```bash
# Run Cypress in headless mode
yarn cy:run --spec "**/21-2680-house-bound-status/**/*.cypress.spec.js"

# Open Cypress UI (requires yarn watch running)
yarn cy:open
```

### Mock Data

Test fixtures are organized in `tests/fixtures/`:

- `mocks/` - API response mocks
- `data/` - Form data fixtures

## API Integration

### Endpoints

- **Form submission**: `POST /v0/form21_2680` (TBD - pending backend implementation)
- **Save in Progress**:
  - Save: `PUT /v0/in_progress_forms/21-2680`
  - Get: `GET /v0/in_progress_forms/21-2680`
  - Delete: `DELETE /v0/in_progress_forms/21-2680`
- **Prefill**: `GET /v0/in_progress_forms/21-2680/prefill`

### Data Flow

1. **Prefill**: On form start, veteran info is pulled from profile
2. **Save**: Form data auto-saves to backend every 60 seconds
3. **Submit**: Form transforms data to match backend schema and POSTs
4. **Confirmation**: Returns confirmation number and PDF link

## Accessibility & Compliance

- **WCAG 2.2 Level AA**: All interactive elements meet contrast and keyboard navigation requirements
- **Section 508**: Fully compliant with federal accessibility standards
- **VA Design System**: Uses web components (`va-text-input`, `va-button`, etc.) for consistent UX
- **Screen Readers**: Tested with JAWS, NVDA, and VoiceOver
- **Focus Management**: Proper focus handling on page transitions and error states

## Dependencies

Key platform utilities used:

- `platform/forms-system` - VA.gov form system components
- `platform/forms/save-in-progress` - Save-in-progress functionality
- `platform/user/selectors` - User authentication state
- `platform/utilities/ui` - UI helpers (focus, scroll)

## Team & Support

**Owner**: Benefits Intake Optimization - Aquia team
**Slack**: #benefits-optimization-aquia

For questions about this application, contact the Benefits Intake Optimization - Aquia team in #benefits-optimization-aquia.
