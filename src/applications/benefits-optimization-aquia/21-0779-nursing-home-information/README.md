# VA Form 21-0779: Request for Nursing Home Information in Connection with Claim for Aid and Attendance

## Form Purpose

This form is used by nursing home officials to provide certification information for patients (Veterans or their spouses/parents) who are applying for Aid and Attendance benefits while residing in a nursing home. The form collects information about the facility, level of care, and costs to help determine eligibility and payment amounts.

## Who Should Use This Form

Nursing home officials who need to certify:

- A patient's residence in a qualified extended care facility
- The level of nursing care being provided
- Medicaid coverage status and costs
- Monthly out-of-pocket expenses for care

## Form Sections

### 1. Nursing Official Information

- Official's name and job title
- Facility phone number

### 2. Nursing Home Details

- Name of nursing home facility
- Complete facility address

### 3. Patient Information

- Patient type (Veteran or spouse/parent of Veteran)
- Patient's name, date of birth, and identification
- Veteran's name, date of birth, and identification (if different from patient)

### 4. Care Information

- Certification level of care (skilled or intermediate)
- Admission date to facility
- Medicaid facility approval status
- Medicaid application status
- Current Medicaid coverage status
- Medicaid start date (if applicable)
- Monthly out-of-pocket costs

## Technical Implementation

### Form Configuration

- **Form ID**: 21-0779
- **OMB Number**: 2900-0361
- **OMB Expiration**: 07/31/2027
- **Estimated Burden**: 15 minutes
- **Submit URL**: `/simple_forms_api/v1/simple_forms`
- **Form System**: VA.gov JSON Schema Form System (RJSF)

### Application Structure

```bash
21-0779-nursing-home-information/
├── app-entry.jsx                    # Main entry point
├── components/                      # Reusable components
│   ├── get-help/
│   │   ├── get-help.jsx
│   │   └── index.js
│   └── index.js                     # Components barrel
├── config/
│   ├── form/
│   │   ├── form.js                  # Main form configuration
│   │   └── form.unit.spec.jsx       # Form config tests
│   ├── prefill-transformer/
│   │   ├── prefill-transformer.js   # Prefill logic
│   │   └── prefill-transformer.unit.spec.jsx
│   ├── submit-transformer/
│   │   ├── submit-transformer.js    # Submit transformer
│   │   └── submit-transformer.unit.spec.jsx
│   └── index.js                     # Config barrel
├── constants/
│   ├── constants.js                 # Application constants
│   ├── constants.unit.spec.jsx      # Constants tests
│   └── index.js                     # Constants barrel
├── containers/
│   ├── app/
│   │   └── app.jsx                  # Main app container
│   ├── confirmation-page.jsx        # Submission confirmation
│   ├── introduction-page.jsx        # Form intro page
│   └── index.js                     # Containers barrel
├── index.js                         # Root barrel export
├── manifest.json                    # Application manifest
├── pages/                           # JSON-schema form pages (flat structure)
│   ├── admission-date.js            # Admission date page
│   ├── benefit-type.js              # Benefit type selection
│   ├── certification-level-of-care.js
│   ├── claimant-identification-info.js
│   ├── claimant-personal-info.js
│   ├── claimant-question.js         # Patient type question
│   ├── helpers.js                   # Shared helper functions
│   ├── hospitalization-date.js
│   ├── hospitalization-facility.js
│   ├── hospitalization-status.js
│   ├── medicaid-application.js
│   ├── medicaid-facility.js
│   ├── medicaid-start-date.js
│   ├── medicaid-status.js
│   ├── monthly-costs.js
│   ├── nursing-home-details.js
│   ├── nursing-official-information.js
│   ├── veteran-identification-info.js
│   ├── veteran-personal-info.js
│   └── index.js                     # Pages barrel export
├── reducers/
│   └── index.js                     # Redux reducers
├── routes/
│   ├── routes.jsx                   # React Router configuration
│   ├── routes.unit.spec.jsx         # Routes tests
│   └── index.js                     # Routes barrel
├── sass/
│   └── 21-0779-nursing-home-information.scss
├── tests/
│   ├── e2e/
│   │   └── 21-0779-nursing-home-information.cypress.spec.js
│   ├── fixtures/
│   │   ├── data/
│   │   │   ├── maximal-test.json   # Full form data (Star Wars themed)
│   │   │   └── minimal-test.json   # Minimal required data
│   │   └── mocks/
│   │       ├── application-submit.json
│   │       ├── feature-toggles.json
│   │       ├── user.json
│   │       └── index.js
│   └── unit/
│       └── transform.unit.spec.jsx
└── README.md                        # This file
```

### Development Commands

```bash
# Run build for this single app
yarn build --entry=21-0779-nursing-home-information

# Start development server for this form only
yarn watch --env entry=21-0779-nursing-home-information

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,login-page,21-0779-nursing-home-information

# Run unit tests
yarn test:unit --app-folder benefits-optimization-aquia/21-0779-nursing-home-information

# Run Cypress tests
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-0779-nursing-home-information/tests/*.cypress.spec.js"
```

### Key Features

- **JSON Schema Form System**: Uses VA.gov platform's standard RJSF with web component patterns
- **Platform Web Components**: All form fields use `platform/forms-system/src/js/web-component-patterns`
- **Conditional Pages**: Dynamic form flow based on patient type (veteran vs spouse/parent)
- **Save in Progress**: Officials can save partial forms and return later
- **Validation**: Real-time validation using JSON Schema
- **Accessibility**: WCAG 2.2 AA compliant with full keyboard navigation and screen reader support

### Form Patterns Used

- `textUI` / `textSchema` - Text input fields
- `phoneUI` / `phoneSchema` - Phone number fields
- `fullNameNoSuffixUI` / `fullNameNoSuffixSchema` - Name fields without suffix
- `dateOfBirthUI` / `dateOfBirthSchema` - Date of birth fields
- `ssnUI` / `ssnSchema` - Social Security Number fields
- `addressUI` / `addressSchema` - Address fields with customization
- `radioUI` / `radioSchema` - Radio button selections
- `yesNoUI` / `yesNoSchema` - Yes/No boolean fields
- `currentOrPastDateUI` / `currentOrPastDateSchema` - Date validation

## Form Flow

### All Users Path

1. **Introduction Page**: Explains form purpose and requirements for nursing home officials
2. **Nursing Official Information**: Collects official's name, title, and phone number
3. **Nursing Home Details**: Facility name and address
4. **Patient Type Question**: Determines if patient is the Veteran or spouse/parent

### Path 1: Patient is Veteran

5. **Veteran Personal Info**: Veteran's name and date of birth
6. **Veteran Identification**: SSN and optional VA file number

### Path 2: Patient is Spouse/Parent

5. **Claimant Personal Info**: Patient's (spouse/parent) name and DOB
6. **Claimant Identification**: Patient's SSN and optional VA file number
7. **Veteran Personal Info**: Connected Veteran's name and DOB
8. **Veteran Identification**: Veteran's SSN and optional VA file number

### Continuing for All Users

9. **Certification Level of Care**: Skilled or intermediate care level
10. **Admission Date**: Date patient was admitted to facility
11. **Medicaid Facility Status**: Is facility Medicaid-approved?
12. **Medicaid Application**: Has patient applied for Medicaid?
13. **Medicaid Coverage Status**: Is patient currently covered by Medicaid?
14. **Medicaid Start Date** (conditional): Only if currently covered by Medicaid
15. **Monthly Costs**: Out-of-pocket monthly expenses
16. **Review and Submit**: Pre-submission signature and review
17. **Confirmation Page**: Submission confirmation and next steps

## Integration Points

- **Simple Forms API**: Submits form data to `/simple_forms_api/v1/simple_forms` endpoint
- **Save in Progress API**: Stores partial form data at `/v0/in_progress_forms/21-0779`
- **Form Data Transform**: Uses `submit-transformer.js` to convert to backend format
- **User Authentication**: Uses VA.gov authentication for form access

## Accessibility Features

- All form fields use VA Design System web components
- Proper ARIA labels and descriptions on all inputs
- Keyboard navigation support throughout
- Screen reader announcements for form progress
- Error messages associated with specific fields
- Focus management between form sections

## Testing

### Test Organization

Tests are co-located with their source files using the naming convention `[filename].unit.spec.jsx` for all unit test files.

### Running Tests

```bash
# Run all unit tests for this application
yarn test:unit --app-folder benefits-optimization-aquia/21-0779-nursing-home-information

# Run tests with coverage
yarn test:unit:coverage --app-folder benefits-optimization-aquia/21-0779-nursing-home-information

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21-0779-nursing-home-information/schemas/nursing-home.unit.spec.jsx

# Run Cypress E2E tests
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-0779-nursing-home-information/tests/*.cypress.spec.js"
```

### E2E Testing

- Cypress tests for complete form flow using `platform/testing/e2e/cypress/support/form-tester`
- Two test scenarios:
  - **minimal-test.json**: Patient is veteran, no Medicaid coverage (shortest path)
  - **maximal-test.json**: Patient is spouse/parent, full Medicaid coverage (longest path with all conditional pages)
- Test data uses Star Wars themed names and locations for consistency with other forms
- Accessibility testing with axe-core integrated into page hooks
- Tests both veteran and claimant pathways through conditional logic

### Test Data Theme

Test fixtures use Star Wars lore-accurate data:

- **Minimal**: Ben Kenobi at Mos Eisley Extended Care Facility (Tatooine)
- **Maximal**: Shmi Skywalker (patient) / Anakin Skywalker (veteran) at Coruscant Veterans Medical Center
- Nursing officials: Dr. Evazan Ponda (minimal), Beru Lars (maximal)
- Easter eggs: May the Fourth dates, THX-1138 references, C-3PO cost amounts
