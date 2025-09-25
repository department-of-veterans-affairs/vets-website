# VA Form 21P-530A: Application for Interment Allowance

## Form Purpose

This form is used to apply for interment (burial) allowance benefits for eligible Veterans. The interment allowance helps cover burial and funeral expenses for Veterans who die from non-service-connected causes.

## Who Should Use This Form

Eligible applicants include:

- Surviving spouses of deceased Veterans
- Children of deceased Veterans
- Parents of deceased Veterans
- Executors or administrators of the Veteran's estate
- Funeral directors or other persons who paid burial expenses

## Eligibility Requirements

The deceased Veteran must have:

- Been discharged under conditions other than dishonorable
- Died from non-service-connected causes
- Been receiving VA pension or compensation at the time of death, OR
- Been entitled to receive VA pension or compensation but decided not to reduce military retirement or disability pay

## Form Sections

### 1. Personal Information

- Applicant's name and relationship to Veteran
- Social Security Number or VA File Number
- Current mailing address
- Phone and email contact information

### 2. Veteran Information

- Veteran's name and date of birth
- Date of death
- Place of death
- Military service information
- VA claim number (if applicable)

### 3. Burial Information

- Date of burial
- Name and location of cemetery
- Was burial in a national cemetery?
- Transportation costs for burial

### 4. Expense Information

- Total burial expenses
- Amount paid by applicant
- Itemized list of funeral and burial costs
- Documentation of expenses paid

## Technical Implementation

### Form Configuration

- **Form ID**: 21P-530A
- **OMB Number**: 2900-0565
- **OMB Expiration**: 10/31/2027
- **Estimated Burden**: 5 minutes
- **Submit URL**: `/v0/form21p_530a`

### Application Structure

```bash
21p-530a-interment-allowance/
├── app-entry.jsx                    # Main entry point
├── config/
│   ├── index.js                     # Barrel export for config
│   └── form.js                      # Form configuration
├── containers/
│   ├── index.js                     # Barrel export for containers
│   ├── app.jsx                      # Main app container
│   ├── introduction-page.jsx        # Form intro page
│   └── confirmation-page.jsx        # Submission confirmation
├── pages/                           # Individual form pages
│   ├── index.js                     # Barrel export for pages
│   ├── name-and-date-of-birth.js
│   ├── identification-information.js
│   ├── mailing-address.js
│   └── phone-and-email-address.js
├── reducers/                        # Redux reducers
├── routes.jsx                       # React Router configuration
├── constants.js                     # Application constants
├── sass/                            # Styles
│   └── 21p-530a-interment-allowance.scss
├── tests/                           # Unit and E2E tests
│   ├── fixtures/
│   │   ├── index.js
│   │   ├── data/
│   │   │   ├── index.js
│   │   │   └── minimal-test.json
│   │   └── mocks/
│   │       ├── index.js
│   │       ├── local-mock-responses.js
│   │       └── user.json
│   ├── containers/
│   │   ├── introduction-page.unit.spec.jsx
│   │   └── confirmation-page.unit.spec.jsx
│   └── 21p-530a-interment-allowance.cypress.spec.js
├── manifest.json                    # Application manifest
├── index.js                         # Main barrel export
└── README.md                        # This file
```

### Development Commands

```bash
# Run build for this single app
yarn build --entry=21p-530a-interment-allowance

# Start development server for this form only
yarn watch --env entry=21p-530a-interment-allowance

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,login-page,21p-530a-interment-allowance

# Run unit tests
yarn test:unit --app-folder benefits-optimization-aquia/21p-530a-interment-allowance

# Run Cypress tests
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21p-530a-interment-allowance/tests/*.cypress.spec.js"
```

### Key Features

- **Save in Progress**: Applicants can save their form and return later to complete it
- **Prefill**: Form automatically populates with user's profile information where available
- **Validation**: Real-time validation of required fields and data formats
- **Accessibility**: WCAG 2.2 AA compliant with full keyboard navigation and screen reader support
- **Named Exports**: Uses named exports pattern with barrel files for clean imports
- **JSDoc Documentation**: Comprehensive documentation throughout codebase
- **Kebab-case Naming**: All file names follow kebab-case convention

## Form Flow

1. **Introduction Page**: Explains the form purpose and eligibility requirements
2. **Personal Information**: Collects applicant's name and date of birth
3. **Identification Information**: Gathers SSN or VA file number
4. **Mailing Address**: Records current mailing address for correspondence
5. **Contact Information**: Collects phone and email contact details
6. **Review and Submit**: Allows review of all entered information before submission
7. **Confirmation Page**: Provides submission confirmation and next steps

## Integration Points

- **User Profile**: Prefills applicant information from authenticated session
- **VA Benefits API**: Submits form data to `/v0/form21p_530a` endpoint
- **Save in Progress API**: Stores partial form data for later completion
- **VA Forms Constants**: Uses `VA_FORM_IDS.FORM_21P_530A` for form identification

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

## Import Patterns

All imports use the `@bio-aquia` alias for consistency:

```javascript
import { formConfig } from '@bio-aquia/21p-530a-interment-allowance/config';
import { IntroductionPage } from '@bio-aquia/21p-530a-interment-allowance/containers';
import {
  TITLE,
  SUBTITLE,
} from '@bio-aquia/21p-530a-interment-allowance/constants';
```
