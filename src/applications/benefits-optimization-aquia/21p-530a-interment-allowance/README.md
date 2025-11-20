# VA Form 21P-530A - State or Tribal Organization Application for Interment Allowance

## Overview

VA Form 21P-530A is used by state or tribal organizations to apply for interment allowances and burial benefits on behalf of deceased Veterans. This form collects organization information, deceased Veteran details, military service history, and burial information to support claims for burial benefits.

## Who Uses This Form

- **State organizations** requesting burial benefits for deceased Veterans
- **Tribal organizations** applying for interment allowances
- **Authorized officials** submitting burial benefit claims on behalf of their organization
- **VA Regional Offices** processing burial benefit requests

State and tribal organizations use this form to:

- Request interment allowances for deceased Veterans
- Provide Veteran service history and burial information
- Submit burial benefit claims on behalf of their organization
- Document military service periods and previous names

## Team

Benefits Intake Optimization - Aquia Team

## Form Details

- **Form Number**: VA Form 21P-530A
- **Entry Name**: `21p-530a-interment-allowance`
- **Root URL**: `/submit-state-interment-allowance-form-21p-530a`
- **API Endpoint**: `POST /v0/form21p530a`
- **Product ID**: TBD

## Form Flow and Sections

The form is organized into **4 chapters** with **11 total pages**, using conditional logic and List & Loop patterns for service periods and previous names.

### Chapter 1: Your organization's information (3 pages)

- **Page 1: Organization Information** (`organization-information`)
  - Organization name and type (state or tribal)
  - Contact person name
  - Organization phone number

- **Page 2: Burial Benefits Recipient** (`burial-benefits-recipient`)
  - Name of person/organization receiving benefits
  - Relationship to organization

- **Page 3: Mailing Address** (`mailing-address`)
  - Street address, city, state, ZIP code

### Chapter 2: Deceased Veteran information (4 pages)

- **Page 4: Personal Information** (`veteran-personal-information`)
  - Veteran's full name (first, middle, last, suffix)
  - Relationship to claimant

- **Page 5: Identification** (`veteran-identification`)
  - Social Security Number
  - Service number (optional)
  - VA file number (optional)

- **Page 6: Birth Information** (`veteran-birth-information`)
  - Date of birth
  - Place of birth (city, state)

- **Page 7: Burial Information** (`veteran-burial-information`)
  - Date of death
  - Date of burial
  - Cemetery name and location

### Chapter 3: Military history (3+ pages)

- **Page 8: Served Under Different Name** (`veteran-served-under-different-name`)
  - Yes/no question determining if previous names section appears
  - **Conditional branching point**

- **Page 9: Service Periods Summary** (`service-periods`) - **List & Loop**
  - Summary of all service periods with add/edit/delete options
  - Multi-step entry flow for each period:
    - Service Branch: Select branch of service
    - Service Dates: Enter start and end dates
    - Locations and Rank: Entry/separation locations and rank

- **Page 10: Previous Names Summary** (`veteran-previous-names`) - **Conditional List & Loop**
  - Shown only if veteran served under a different name
  - Summary of all previous names with add/edit/delete options
  - Single-page entry flow for each name

### Chapter 4: Additional remarks (1 page)

- **Page 11: Additional Remarks** (`additional-remarks`)
  - Optional additional information or clarifications

### Final Pages (All Users)

- **Page 12: Review and Submit**
  - Pre-submission review of all entered information
  - Statement of truth with signature
  - Privacy policy acknowledgment

- **Page 13: Confirmation Page**
  - Submission confirmation
  - Next steps information

## Technical Implementation

This application uses the **VA.gov Form System (CustomPage pattern)** with Zod validation and modern React components.

### API Integration

The form uses **prefill-transformer** for data handling:

- **Form Submission**: `POST /v0/form21p530a`
- **Save in Progress**: `/v0/in_progress_forms/21p-530a`
- **Prefill Transformer**: Converts user profile data to form data

## Testing

### Test Scenarios

- **Minimal**: Basic required fields only, no previous names
- **Maximal**: All fields filled, including previous names and all service periods

### Running Tests

```bash
# Run all unit tests for this application
yarn test:unit --app-folder benefits-optimization-aquia/21p-530a-interment-allowance

# Run tests with coverage
yarn test:unit:coverage --app-folder benefits-optimization-aquia/21p-530a-interment-allowance

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21p-530a-interment-allowance/pages/organization-information/

# Run Cypress E2E tests (requires yarn watch to be running)
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21p-530a-interment-allowance/tests/*.cypress.spec.js"

# Open Cypress test runner
yarn cy:open
```

## Development

### Getting Started

```bash
# Install dependencies (if needed)
yarn install

# Run build for this single app
yarn build --entry=21p-530a-interment-allowance

# Watch only this application (recommended for development)
yarn watch --env entry=21p-530a-interment-allowance

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,login-page,21p-530a-interment-allowance
```

### Local Development URL

- Development: `http://localhost:3001/submit-state-interment-allowance-form-21p-530a`
- Introduction page: Starts at the root URL above

## Conditional Form Logic

### When Pages Are Shown/Hidden

#### Previous Names Summary (Page 10)

**Shown when**:

- `formData?.veteranServedUnderDifferentName?.veteranServedUnderDifferentName === 'yes'`

**Hidden when**:

- `formData?.veteranServedUnderDifferentName?.veteranServedUnderDifferentName === 'no'`

**Fields collected**:

- Full name (first, middle, last, suffix) for each previous name
- Multiple previous names can be added using List & Loop pattern

### List & Loop Patterns

The form uses multi-page list & loop patterns for repeating data:

**Service Periods** (3-step entry):

- Step 1: Select branch of service
- Step 2: Enter service dates (from/to)
- Step 3: Enter locations and rank
- Summary: Review all periods with edit/delete/add options

**Previous Names** (1-step entry):

- Step 1: Enter full name
- Summary: Review all names with edit/delete/add options

## Support

For questions or issues:

- **Team**: Benefits Intake Optimization - Aquia Team
- **Slack**: `#benefits-optimization-aquia` (internal)
- **Repository**: `vets-website`
