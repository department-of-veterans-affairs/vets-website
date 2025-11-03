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

### 1. Personal Information

- Veteran's name and date of birth
- Social Security Number and VA File Number
- Current mailing address
- Phone and email contact information

### 2. Nursing Home Information

- Name of nursing home facility
- Complete address of nursing home
- Date of admission
- Medicaid number (if applicable)

### 3. Care and Payment Information

- Type of care received (nursing care vs. custodial care)
- Medicaid coverage status
- Amount of Medicaid per diem
- Monthly payments made by the veteran
- Monthly payments made by family, friends, or other sources
- Names and relationships of those contributing to nursing home costs

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
├── components/               # Reusable components
│   ├── get-help/
│   │   ├── get-help.jsx
│   │   ├── get-help.unit.spec.jsx
│   │   └── index.js          # Component barrel
│   ├── pre-submit-signature/
│   │   ├── pre-submit-signature.jsx
│   │   └── index.js          # Component barrel
│   └── index.js              # Components barrel
├── config/
│   ├── form.js               # Form configuration
│   ├── transform.js          # Submit transformer
│   └── index.js              # Config barrel
├── constants.js              # Application constants
├── constants.unit.spec.jsx   # Constants tests
├── containers/
│   ├── app.jsx               # Main app container
│   ├── introduction-page.jsx # Form intro page
│   ├── confirmation-page.jsx # Submission confirmation
│   └── index.js              # Containers barrel
├── index.js                  # Root barrel export
├── pages/                    # Form pages with co-located reviews
│   ├── admission-date/
│   │   ├── admission-date.jsx
│   │   ├── admission-date-review.jsx
│   │   ├── admission-date-review.unit.spec.jsx
│   │   └── index.js
│   ├── claimant-question/
│   │   ├── claimant-question.jsx
│   │   ├── claimant-question-review.jsx
│   │   ├── claimant-question-review.unit.spec.jsx
│   │   └── index.js
│   ├── [13 more page directories...]
│   └── index.js              # Pages barrel (exports pages & reviews)
├── reducers/                 # Redux reducers
│   └── index.js              # Reducers barrel
├── routes.jsx                # React Router configuration
├── routes.unit.spec.jsx      # Routes tests
├── sass/                     # Styles
├── schemas/                  # Zod validation schemas
│   ├── admission-date/
│   │   ├── admission-date.js
│   │   ├── admission-date.unit.spec.jsx
│   │   └── index.js
│   ├── veteran-identification/
│   │   ├── veteran-identification.js
│   │   ├── veteran-identification.unit.spec.jsx
│   │   └── index.js
│   ├── [13 more schema directories...]
│   └── index.js              # Schemas barrel (exports all schemas)
├── tests/                    # E2E Cypress tests
└── utils/                    # Utility functions
    ├── index.js              # Utils with JSDoc
    └── index.unit.spec.jsx
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
- **Validation**: Real-time validation of required fields and data formats
- **Accessibility**: WCAG 2.2 AA compliant with full keyboard navigation and screen reader support

## Form Flow

1. **Introduction Page**: Explains the form purpose and requirements
2. **Personal Information**: Collects veteran identification details
3. **Contact Information**: Gathers current mailing address and contact methods
4. **Nursing Home Details**: Records facility information and admission date
5. **Care Information**: Documents type of care and payment arrangements
6. **Review and Submit**: Allows review of all entered information before submission
7. **Confirmation Page**: Provides submission confirmation and next steps

## Integration Points

- **User Profile**: Prefills veteran information from authenticated session
- **VA Benefits API**: Submits form data to `/v0/form21_0779` endpoint
- **Save in Progress API**: Stores partial form data for later completion

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

- Cypress tests for complete form flow
- Accessibility testing with axe-core
- Cross-browser testing on Chrome, Firefox, Safari, and Edge
