# VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance

## Overview

VA Form 21-0779 is used by nursing home officials to provide certification information for patients (Veterans or their spouses/parents) who are applying for Aid and Attendance benefits while residing in a nursing home. The form collects information about the facility, level of care, Medicaid status, and monthly costs to help the VA determine eligibility and payment amounts for Aid and Attendance benefits.

## Who Uses This Form

- **Nursing home officials** certifying patient care for Aid and Attendance claims
- **Extended care facility administrators** providing patient residence verification
- **VA Regional Offices** collecting nursing home certification for benefit determination

Nursing home officials use this form to certify:

- A patient's residence in a qualified extended care facility
- The level of nursing care being provided (skilled or intermediate)
- Medicaid coverage status and application details
- Monthly out-of-pocket expenses for care

## Team

Benefits Intake Optimization - Aquia Team

## Form Details

- **Form Number**: VA Form 21-0779
- **OMB Control Number**: 2900-0652
- **OMB Expiration**: 09/30/2026
- **Respondent Burden**: 10 minutes
- **Entry Name**: `21-0779-nursing-home-information`
- **Root URL**: `/supporting-forms-for-claims/submit-nursing-home-information-form-21-0779`
- **API Endpoint**: `POST /v0/form210779`
- **Product ID**: `0383a035-c37c-4875-ad1d-5f85c59025fe`

## Form Flow and Sections

The form has **16 total pages** organized into a single-chapter flow, with conditional logic to show different pages based on patient type (Veteran vs spouse/parent).

### All Users Path (Pages 1-4)

- **Page 1: Introduction Page**

  - Explains form purpose and requirements for nursing home officials
  - OMB information and estimated burden

- **Page 2: Nursing Official Information** (`nursing-official-information`)

  - Official's name
  - Job title
  - Facility phone number

- **Page 3: Nursing Home Details** (`nursing-home-details`)

  - Name of nursing home facility
  - Complete facility address (street, city, state, ZIP)

- **Page 4: Patient Type Question** (`claimant-question`)
  - Determines if patient is the Veteran or spouse/parent of Veteran
  - **Conditional branching point**

### Path 1: Patient is the Veteran (Pages 5-6)

- **Page 5: Veteran Personal Information** (`veteran-personal-info`)

  - Veteran's full name (first, middle, last - no suffix)
  - Date of birth

- **Page 6: Veteran Identification Information** (`veteran-identification-info`)
  - Social Security Number
  - VA file number (optional)

### Path 2: Patient is Spouse/Parent (Pages 5-8)

- **Page 5: Claimant Personal Information** (`claimant-personal-info`)

  - Patient's (spouse/parent) full name
  - Date of birth

- **Page 6: Claimant Identification Information** (`claimant-identification-info`)

  - Patient's Social Security Number
  - VA file number (optional)

- **Page 7: Veteran Personal Information** (`veteran-personal-info`)

  - Connected Veteran's full name
  - Date of birth

- **Page 8: Veteran Identification Information** (`veteran-identification-info`)
  - Veteran's Social Security Number
  - VA file number (optional)

### Continuing for All Users (Pages 7-15 or 9-17)

- **Page 9: Certification Level of Care** (`certification-level-of-care`)

  - Skilled nursing care
  - Intermediate nursing care

- **Page 10: Admission Date** (`admission-date`)

  - Date patient was admitted to facility

- **Page 11: Medicaid Facility Status** (`medicaid-facility`)

  - Whether facility is Medicaid-approved

- **Page 12: Medicaid Application** (`medicaid-application`)

  - Whether patient has applied for Medicaid

- **Page 13: Medicaid Coverage Status** (`medicaid-status`)

  - Whether patient is currently covered by Medicaid

- **Page 14: Medicaid Start Date** (`medicaid-start-date`) - **Conditional**

  - Shown only if patient is currently covered by Medicaid
  - Date Medicaid coverage began

- **Page 15: Monthly Costs** (`monthly-costs`)
  - Out-of-pocket monthly expenses for care

### Final Pages (All Users)

- **Page 16: Review and Submit**

  - Pre-submission review of all entered information
  - Statement of truth with signature
  - Privacy policy acknowledgment

- **Page 17: Confirmation Page**
  - Submission confirmation
  - Next steps information

## Technical Implementation

This application uses the **VA.gov Form System (RJSF)** with traditional page-based configuration.

### API Integration

The form uses **submit-transformer** and **prefill-transformer** for data handling:

- **Form Submission**: `POST /v0/form210779`
- **Save in Progress**: `/v0/in_progress_forms/21-0779`
- **Prefill Transformer**: Converts user profile data to form data
- **Submit Transformer**: Converts form data to backend API format

## Testing

### Test Scenarios

- **Minimal**: Patient is Veteran, no Medicaid (shortest path) - Star Wars themed
- **Maximal**: Patient is spouse/parent, full Medicaid (all conditional pages) - Star Wars themed

### Running Tests

```bash
# Run all unit tests for this application
yarn test:unit --app-folder benefits-optimization-aquia/21-0779-nursing-home-information

# Run tests with coverage
yarn test:unit:coverage --app-folder benefits-optimization-aquia/21-0779-nursing-home-information

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21-0779-nursing-home-information/config/form/form.unit.spec.jsx

# Run Cypress E2E tests (requires yarn watch to be running)
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-0779-nursing-home-information/tests/e2e/21-0779-nursing-home-information.cypress.spec.js"

# Open Cypress test runner
yarn cy:open
```

## Development

### Getting Started

```bash
# Install dependencies (if needed)
yarn install

# Run build for this single app
yarn build --entry=21-0779-nursing-home-information

# Watch only this application (recommended for development)
yarn watch --env entry=21-0779-nursing-home-information

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,login-page,21-0779-nursing-home-information
```

### Local Development URL

- Development: `http://localhost:3001/supporting-forms-for-claims/submit-nursing-home-information-form-21-0779`
- Introduction page: Starts at the root URL above

## Conditional Form Logic

### When Pages Are Shown/Hidden

#### Patient Type Branching (Pages 5-8)

**When patient is the Veteran**:

- Shows: Veteran Personal Info, Veteran Identification Info (2 pages)
- Hides: Claimant Personal Info, Claimant Identification Info

**When patient is spouse/parent**:

- Shows: Claimant Personal Info, Claimant Identification Info, Veteran Personal Info, Veteran Identification Info (4 pages)

#### Medicaid Start Date (Page 14)

**Shown when**:

- `formData?.medicaidStatus?.currentlyCoveredByMedicaid === true`

**Fields collected**:

- Date Medicaid coverage began

## Content Widget

This form has a content widget that controls the "Submit online" link on the Drupal CMS "about" page (`/forms/21-0779/`).

- **Widget Type**: `form210779`
- **Feature Flag**: `form_0779_enabled`
- **Widget Location**: `src/applications/static-pages/benefits-optimization-aquia/21-0779/`

When the feature flag is off, the widget shows "Submit this form by mail" instead of a link to the digital form.

## Support

For questions or issues:

- **Team**: Benefits Intake Optimization - Aquia Team
- **Slack**: `#benefits-aquia` (internal)
- **Repository**: `vets-website`
