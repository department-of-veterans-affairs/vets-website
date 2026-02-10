# VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability Benefits

## Overview

VA Form 21-4192 is used to request employment information from a veteran or their employer in connection with a claim for disability benefits, specifically for Individual Unemployability (TDIU) claims. This form collects detailed information about the veteran's employment history, including work dates, earnings, hours worked, any workplace concessions provided, termination details, and whether the veteran receives benefits or is in the Reserve or National Guard.

## Who Uses This Form

- **Veterans** applying for Total Disability Individual Unemployability (TDIU) benefits
- **VA Regional Offices** requesting employment verification for TDIU claims
- **Employers** providing employment information about veteran employees

This form helps the VA determine whether a service-connected disability prevents a veteran from maintaining substantially gainful employment, which is a key requirement for TDIU benefits.

## Team

Benefits Intake Optimization - Aquia Team

## Form Details

- **Form Number**: VA Form 21-4192
- **OMB Control Number**: 2900-0074
- **Respondent Burden**: 30 minutes
- **Entry Name**: `21-4192-employment-information`
- **Root URL**: `/disability/eligibility/special-claims/unemployability/submit-employment-information-form-21-4192`
- **API Endpoint**: `POST /v0/form214192`
- **Product ID**: `c61b0c39-7177-4340-9820-955c959b7f5b`

## Form Flow and Sections

The form is organized into **6 chapters** with **15 total pages**, using conditional logic to show/hide pages based on veteran responses.

### Chapter 1: Veteran Information (2 pages)

- **Page 1: Veteran Information** (`veteran-information`)

  - Full name (first, middle, last)
  - Date of birth
  - Social Security Number or VA file number

- **Page 2: Veteran Contact Information** (`veteran-contact-information`)
  - Mailing address (street, city, state, ZIP)
  - Phone number
  - Email address (optional)

### Chapter 2: Employer Information (1 page)

- **Page 3: Employer Information** (`employer-information`)
  - Employer name
  - Employer address (street, city, state, ZIP)

### Chapter 3: Employment Information (5 pages)

- **Page 4: Employment Dates** (`employment-dates`)

  - Beginning date of employment
  - Ending date of employment (optional - leave blank if currently employed)

- **Page 5: Employment Earnings and Hours** (`employment-earnings-hours`)

  - Type of work performed
  - Amount earned in last 12 months (or 12 months before termination)
  - Time lost due to disability
  - Daily hours worked
  - Weekly hours worked

- **Page 6: Employment Concessions** (`employment-concessions`)

  - Whether employer made any concessions for veteran's disability
  - Details of concessions (flexible schedule, modified duties, etc.)

- **Page 7: Employment Termination** (`employment-termination`)

  - Reason for termination (resigned, laid off, retired due to disability, retired due to age, other)
  - Date last worked

- **Page 8: Employment Last Payment** (`employment-last-payment`)
  - Date of last payment
  - Gross amount of last payment
  - Whether lump sum payment was made
  - Gross amount and date of lump sum (if applicable)

### Chapter 4: Duty Status (2 pages, conditional)

- **Page 9: Duty Status** (`duty-status`)

  - Whether veteran is in Reserve or National Guard

- **Page 10: Duty Status Details** (`duty-status-details`) - **Conditional**
  - Shown only if veteran is in Reserve or National Guard
  - Current duty status
  - Whether disabilities prevent veteran from performing military duties

### Chapter 5: Benefits Information (2 pages, conditional)

- **Page 11: Benefits Information** (`benefits-information`)

  - Whether veteran receives sick leave, retirement, or other benefits

- **Page 12: Benefits Details** (`benefits-details`) - **Conditional**
  - Shown only if veteran receives benefits
  - Type of benefit
  - Gross monthly amount
  - Date benefit began
  - Date first payment issued
  - Date benefit will stop

### Chapter 6: Remarks (1 page)

- **Page 13: Remarks** (`remarks`)
  - Additional information or clarifications

## Technical Implementation

This application uses the **VA.gov Form System (RJSF)** with traditional page-based configuration.

### API Integration

The form uses **submit-transformer** for data handling:

- **Form Submission**: `POST /v0/form214192`
- **Save in Progress**: `/v0/in_progress_forms/21-4192`
- **Submit Transformer**: Converts form data to backend API format

## Testing

### Test Scenarios

- **Minimal**: Basic required fields only, no conditional sections
- **Maximal**: All fields filled, all conditional sections shown
- **Currently Employed**: Veteran currently employed, no termination info
- **Duty Status Only**: Focuses on Reserve/Guard conditional logic

### Running Tests

```bash
# Run all unit tests for this application
yarn test:unit --app-folder benefits-optimization-aquia/21-4192-employment-information

# Run tests with coverage
yarn test:unit:coverage --app-folder benefits-optimization-aquia/21-4192-employment-information

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21-4192-employment-information/config/submit-transformer/submit-transformer.unit.spec.jsx

# Run Cypress E2E tests (requires yarn watch to be running)
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-4192-employment-information/**/*.cypress.spec.js"

# Open Cypress test runner
yarn cy:open
```

## Development

### Getting Started

```bash
# Install dependencies (if needed)
yarn install

# Run build for this single app
yarn build --entry=21-4192-employment-information

# Watch only this application (recommended for development)
yarn watch --env entry=21-4192-employment-information

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,login-page,21-4192-employment-information
```

### Local Development URL

- Development: `http://localhost:3001/disability/eligibility/special-claims/unemployability/submit-employment-information-form-21-4192`
- Introduction page: Starts at the root URL above

## Conditional Form Logic

### When Pages Are Shown/Hidden

#### Duty Status Details (Page 10)

**Shown when**:

- `formData?.dutyStatus?.reserveOrGuardStatus === true`

**Fields collected**:

- Current duty status
- Whether disabilities prevent military duties

#### Benefits Details (Page 12)

**Shown when**:

- `formData?.benefitsInformation?.benefitEntitlement === true`

**Fields collected**:

- Type of benefit
- Gross monthly amount
- Date benefit began
- Date first payment issued
- Date benefit will stop

### Dynamic Content Based on Employment Status

The form uses helper functions to adjust language based on whether the veteran is currently employed:

- **Currently employed**: "is working", "last 12 months"
- **No longer employed**: "was working", "12 months before their last date of employment"

## Content Widget

This form has a content widget that controls the "Submit online" link on the Drupal CMS "about" page (`/forms/21-4192/`).

- **Widget Type**: `form214192`
- **Feature Flag**: `form_4192_enabled`
- **Widget Location**: `src/applications/static-pages/benefits-optimization-aquia/21-4192/`

When the feature flag is off, the widget shows "Submit this form by mail" instead of a link to the digital form.

## Support

For questions or issues:

- **Team**: Benefits Intake Optimization - Aquia Team
- **Slack**: `#benefits-aquia` (internal)
- **Repository**: `vets-website`
