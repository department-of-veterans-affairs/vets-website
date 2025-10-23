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
├── config/
│   └── form.js               # Form configuration
├── containers/
│   ├── App.jsx               # Main app container
│   ├── IntroductionPage.jsx  # Form intro page
│   └── ConfirmationPage.jsx  # Submission confirmation
├── pages/                    # Individual form pages
│   ├── nameAndDateOfBirth.js
│   ├── identificationInformation.js
│   ├── mailingAddress.js
│   ├── phoneAndEmailAddress.js
│   ├── nursingHomeDetails.js
│   └── nursingCareInformation.js
├── reducers/                 # Redux reducers
├── routes.jsx                # React Router configuration
├── sass/                     # Styles
├── tests/                    # Unit and E2E tests
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

- Unit tests for all form pages and components
- Cypress E2E tests for complete form flow
- Accessibility testing with axe-core
- Cross-browser testing on Chrome, Firefox, Safari, and Edge
