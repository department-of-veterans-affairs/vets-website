# VA Form 21-0779: Request for Nursing Home Information in Connection with Claim for Aid and Attendance

## Form Purpose

This form is used to collect nursing home information from Veterans who are applying for or receiving Aid and Attendance benefits while residing in a nursing home. The information helps determine eligibility and payment amounts for these additional benefits.

## Who Should Use This Form

Veterans who:

- Are currently residing in a nursing home
- Are applying for Aid and Attendance benefits
- Need to report nursing home admission to VA
- Are already receiving VA benefits and have entered a nursing home

## Form Sections

### 1. Veteran Personal Information

- Veteran's full name and date of birth
- Social Security Number and VA File Number

### 2. Claimant Determination

- Determine if the veteran is the patient or if someone else is filing on their behalf
- If claimant is not the veteran, collect claimant's personal and identification information

### 3. Nursing Home Details

- Name of nursing home facility
- Complete facility address
- Date of admission to nursing home

### 4. Level of Care Certification

- Type of care received (skilled nursing care vs. custodial care)
- Certification of care level required for benefit determination

### 5. Medicaid Information

- Nursing home's Medicaid approval status
- Whether claimant has applied for Medicaid
- Current Medicaid coverage status
- Medicaid coverage start date (if applicable)

### 6. Monthly Cost Information

- Monthly out-of-pocket expenses for nursing home care
- Financial responsibility and payment arrangements

### 7. Nursing Home Official Information

- Name and title of nursing home official
- Official's contact phone number
- Certification and signature requirements

## Technical Implementation

### Form Configuration

- **Form ID**: 21-0779
- **OMB Number**: 2900-0652
- **OMB Expiration**: 09/30/2026
- **Estimated Burden**: 10 minutes
- **Submit URL**: `/v0/form21_0779`

### Application Structure

```bash
21-0779-nursing-home-information/
├── app-entry.jsx             # Main entry point
├── config/
│   ├── form.js               # Form configuration
│   ├── transform.js          # Data transformation for submission
│   └── prefill-transformer.js # Profile data prefill logic
├── containers/
│   ├── App.jsx               # Main app container
│   ├── introduction-page.jsx # Form intro page
│   └── confirmation-page.jsx # Submission confirmation
├── pages/                    # Individual form pages
│   ├── veteran-personal-info.jsx
│   ├── veteran-identification-info.jsx
│   ├── claimant-question.jsx
│   ├── claimant-personal-info.jsx
│   ├── claimant-identification-info.jsx
│   ├── nursing-home-details.jsx
│   ├── admission-date.jsx
│   ├── certification-level-of-care.jsx
│   ├── medicaid-facility.jsx
│   ├── medicaid-application.jsx
│   ├── medicaid-status.jsx
│   ├── medicaid-start-date.jsx
│   ├── monthly-costs.jsx
│   └── nursing-official-information.jsx
├── reviews/                  # Review page components
│   ├── veteran-personal-info-review.jsx
│   ├── veteran-identification-info-review.jsx
│   ├── claimant-question-review.jsx
│   ├── claimant-personal-info-review.jsx
│   ├── claimant-identification-info-review.jsx
│   ├── nursing-home-details-review.jsx
│   ├── admission-date-review.jsx
│   ├── certification-level-of-care-review.jsx
│   ├── medicaid-facility-review.jsx
│   ├── medicaid-application-review.jsx
│   ├── medicaid-status-review.jsx
│   ├── medicaid-start-date-review.jsx
│   ├── monthly-costs-review.jsx
│   └── nursing-official-information-review.jsx
├── schemas/                  # Form validation schemas
│   ├── personal-info.js
│   ├── veteran-identification.js
│   ├── claimant-identification.js
│   ├── claimant-question.js
│   ├── nursing-home.js
│   ├── admission-date.js
│   ├── certification-level-of-care.js
│   ├── medicaid-facility.js
│   ├── medicaid-application.js
│   ├── medicaid-status.js
│   ├── medicaid-start-date.js
│   ├── monthly-costs.js
│   └── nursing-official-information.js
├── components/               # Shared components
│   ├── get-help.jsx
│   └── pre-submit-info/
├── routes.jsx                # React Router configuration
├── sass/                     # Styles
├── tests/                    # Unit and E2E tests
│   ├── unit/                # Unit test files
│   ├── fixtures/            # Test data and mocks
│   └── *.cypress.spec.js    # Cypress E2E tests
└── utils/                    # Utility functions
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

- **Save in Progress**: Veterans can save their form and return later to complete it
- **Prefill**: Form automatically populates with veteran's profile information where available
- **Conditional Logic**: Dynamic form flow based on claimant type and Medicaid status
- **Data Transformation**: Server-ready data formatting with robust error handling
- **Enhanced Validation**: Real-time validation with Zod schemas for all form sections
- **Review Components**: Section-specific review summaries for comprehensive data verification
- **Error Monitoring**: Sentry integration for transform failures and validation errors
- **Accessibility**: WCAG 2.2 AA compliant with full keyboard navigation and screen reader support

## Form Flow

1. **Introduction Page**: Explains the form purpose and requirements
2. **Veteran Personal Information**: Collects veteran's name and date of birth
3. **Veteran Identification**: Records SSN and VA file number
4. **Claimant Determination**: Determines if veteran is the patient or if someone else is filing
5. **Claimant Information**: If applicable, collects claimant's personal and identification details
6. **Nursing Home Details**: Records facility name and complete address
7. **Admission Date**: Documents date of nursing home admission
8. **Level of Care Certification**: Determines skilled vs. custodial care type
9. **Medicaid Facility Status**: Verifies if nursing home is Medicaid-approved
10. **Medicaid Application**: Records whether claimant has applied for Medicaid
11. **Medicaid Coverage**: Documents current Medicaid coverage status
12. **Medicaid Start Date**: If covered, records when Medicaid coverage began
13. **Monthly Costs**: Captures monthly out-of-pocket nursing home expenses
14. **Nursing Official Information**: Collects nursing home official's contact details
15. **Review and Submit**: Comprehensive review with section-specific summaries
16. **Confirmation Page**: Provides submission confirmation and next steps

## Integration Points

- **User Profile**: Prefills veteran information from authenticated session
- **VA Benefits API**: Submits transformed form data to `/v0/form210779` endpoint
- **Save in Progress API**: Stores partial form data for later completion with enhanced state management
- **Data Transform**: Converts form data to API-ready format with validation and error handling
- **Sentry Monitoring**: Tracks form submission errors and transform failures

## Accessibility Features

- All form fields use VA Design System web components
- Proper ARIA labels and descriptions on all inputs
- Keyboard navigation support throughout
- Screen reader announcements for form progress
- Error messages associated with specific fields
- Focus management between form sections

## Testing

### Unit Testing
- Component tests for all form pages and review components
- Transform function unit tests with maximal and minimal data fixtures
- Container component tests (introduction and confirmation pages)
- Schema validation testing for all form sections

### End-to-End Testing
- Cypress E2E tests for complete form flow including conditional paths
- Claimant vs. veteran filing path testing
- Medicaid workflow scenario testing
- Form save/restore functionality validation

### Quality Assurance
- Accessibility testing with axe-core integration
- Cross-browser testing on Chrome, Firefox, Safari, and Edge
- Mobile responsiveness validation
- Error handling and validation message testing
