# VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance

## Overview

VA Form 21-2680 is used by Veterans or their caregivers to apply for Aid and Attendance (A&A) benefits or Housebound allowance. This form collects information about the Veteran, the claimant (if different from the Veteran), the type of benefit being claimed, and hospitalization status to support claims for Special Monthly Compensation (SMC) or Special Monthly Pension (SMP).

## Who Uses This Form

- **Veterans** applying on their own behalf for Aid and Attendance or Housebound benefits
- **Caregivers** (spouse, child, or parent) applying on behalf of the Veteran
- **VA Regional Offices** processing Aid and Attendance and Housebound benefit claims

This form is used to:

- Apply for Aid and Attendance benefits or Housebound allowance
- Document the relationship between the claimant and the Veteran
- Collect medical information related to hospitalization
- Support claims for Special Monthly Compensation (SMC) or Special Monthly Pension (SMP)

## Team

Benefits Intake Optimization - Aquia Team

## Form Details

- **Form Number**: VA Form 21-2680
- **OMB Control Number**: 2900-0721
- **OMB Expiration**: 02/28/2026
- **Respondent Burden**: 30 minutes
- **Entry Name**: `21-2680-house-bound-status`
- **Root URL**: `/pension/aid-attendance-housebound/apply-form-21-2680`
- **Submit Endpoint**: `POST /v0/form212680`
- **Product ID**: `803cc23f-a627-4ea7-a3ea-0f5595d0dfd3`

## Form Flow and Sections

The form is organized into **4 chapters** with **11 form pages** (plus introduction and confirmation pages), using conditional logic to show/hide pages based on claimant relationship and hospitalization status.

### Chapter 1: Veteran's Information (3 pages)

- **Page 1: Veteran Information** (`veteran-information`)

  - Full name (first, middle, last, suffix)
  - Date of birth

- **Page 2: Veteran SSN** (`veteran-ssn`)

  - Social Security Number

- **Page 3: Veteran Address** (`veteran-address`)
  - Mailing address (supports standard, APO/AE, FPO/AP, and DPO/AA military addresses)
  - Street address, city, state, ZIP/postal code
  - Country (for international addresses)

### Chapter 2: Claimant's Information (5 pages, conditional)

- **Page 4: Claimant Relationship** (`claimant-relationship`)

  - Who is filing the claim (veteran, spouse, child, or parent)
  - **Conditional branching point**

- **Page 5: Claimant Information** (`claimant-information`) - **Conditional**

  - Full name (first, middle, last, suffix)
  - Date of birth
  - Hidden when Veteran is the claimant

- **Page 6: Claimant SSN** (`claimant-ssn`) - **Conditional**

  - Social Security Number
  - Hidden when Veteran is the claimant

- **Page 7: Claimant Address** (`claimant-address`) - **Conditional**

  - Mailing address (standard or military)
  - Hidden when Veteran is the claimant

- **Page 8: Contact Information** (`claimant-contact`) - **Conditional**
  - Phone number (home)
  - Mobile phone number
  - Email address
  - Hidden when Veteran is the claimant

### Chapter 3: Claim Information (1 page)

- **Page 9: Benefit Type** (`benefit-type`)
  - SMC (Special Monthly Compensation)
  - SMP (Special Monthly Pension)

### Chapter 4: Hospitalization (3 pages, conditional)

- **Page 10: Hospitalization Status** (`hospitalization-status`)

  - Whether the Veteran is currently hospitalized
  - **Conditional branching point**

- **Page 11: Admission Date** (`hospitalization-date`) - **Conditional**

  - Date of hospital admission
  - Shown only if currently hospitalized

- **Page 12: Hospitalization Facility** (`hospitalization-facility`) - **Conditional**
  - Facility name
  - Facility address
  - Shown only if currently hospitalized

### Final Pages (All Users)

- **Review and Submit Page**

  - Pre-submission review of all entered information
  - Statement of truth with signature validation
  - Privacy policy acknowledgment

- **Confirmation Page**
  - Submission confirmation number
  - Print button for confirmation
  - Next steps information

## Technical Implementation

This application uses the **VA.gov Form System (RJSF)** with traditional page-based configuration.

### API Integration

This form uses a **PDF generation workflow** where the backend generates a PDF after submission.

**API Endpoints**:

- **Form Submission**: [POST /v0/form212680](http://dev-api.va.gov/v0/swagger/index.html?urls.primaryName=VA.gov%20Swagger%20Docs#/benefits_forms/downloadForm212680Pdf) - Returns JSON with confirmation number and GUID
- **Form Download**: [GET /v0/form212680/download_pdf/{guid}](http://dev-api.va.gov/v0/swagger/index.html?urls.primaryName=VA.gov%20Swagger%20Docs#/benefits_forms/downloadForm212680Pdf) - Returns PDF (success) or JSON (error)
- **Save in Progress**: [GET/PUT /v0/in_progress_forms/21-2680](https://dev-api.va.gov/v0/swagger/index.html?urls.primaryName=VA.gov%20Swagger%20Docs%20(v2)#/in_progress_forms/updateInProgressForm) - Stores partial form data
- **User Profile**: `GET /v0/user` - Used for prefill # TODO: we should use prefill endpoint, not user.

**Data Transformers**:

- **Prefill Transformer**: Converts user profile data to form data structure
- **Submit Transformer**: Converts form data to backend API format (nested structure)

**Workflow**:

1. User completes and submits form
2. Submit handler sends transformed data to backend via POST /v0/form212680
3. Backend returns JSON response with confirmation number and GUID
4. User redirected to confirmation page
5. Confirmation page provides download link using the GUID to fetch the generated PDF

## Testing

### Test Scenarios

All test scenarios use Star Wars themed data:

- **Minimal**: Veteran is claimant, no hospitalization (shortest path)
- **Maximal**: Spouse claimant, hospitalized, APO military address (all conditional pages)
- **Veteran SMP Hospitalized**: Veteran claimant with SMP benefit type and hospitalization
- **Child Claimant SMC**: Child filing on behalf of veteran with SMC benefit type
- **Parent Claimant SMP Hospitalized**: Parent filing with SMP benefit and hospitalization

### Running Tests

```bash
# Run all unit tests for this application
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run tests with coverage
yarn test:unit:coverage --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21-2680-house-bound-status/config/form/form.unit.spec.jsx

# Run Cypress E2E tests (requires yarn watch to be running)
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-2680-house-bound-status/tests/e2e/21-2680-house-bound-status.cypress.spec.js"

# Open Cypress test runner
yarn cy:open
```

## Development

### Getting Started

```bash
# Install dependencies (if needed)
yarn install

# Run build for this single app
yarn build --entry=21-2680-house-bound-status

# Watch only this application (recommended for development)
yarn watch --env entry=21-2680-house-bound-status

# Watch with authentication and static pages
yarn watch --env entry=auth,static-pages,dashboard,find-forms,login-page,21-2680-house-bound-status
```

### Local Development URL

- Development: `http://localhost:3001/pension/aid-attendance-housebound/apply-form-21-2680`
- Introduction page: Starts at the root URL above

## Conditional Form Logic

### When Pages Are Shown/Hidden

#### Claimant Pages (Pages 5-8)

**Shown when**:

- `claimantRelationship.relationship !== 'veteran'`

**Hidden when**:

- `claimantRelationship.relationship === 'veteran'` (Veteran is the claimant)

**Pages affected**:

- Claimant Information
- Claimant SSN
- Claimant Address
- Claimant Contact

#### Hospitalization Pages (Pages 11-12)

**Shown when**:

- `hospitalizationStatus.isCurrentlyHospitalized === true`

**Hidden when**:

- `hospitalizationStatus.isCurrentlyHospitalized === false`

**Pages affected**:

- Hospitalization Date
- Hospitalization Facility

## Content Widget

This form has a content widget that controls the "Submit online" link on the Drupal CMS "about" page (`/forms/about-form-21-2680/`).

- **Widget Type**: `form212680`
- **Feature Flag**: `form_2680_enabled`
- **Widget Location**: `src/applications/static-pages/benefits-optimization-aquia/21-2680/`

When the feature flag is off, the widget shows "Submit this form by mail" instead of a link to the digital form.

## Support

For questions or issues:

- **Team**: Benefits Intake Optimization - Aquia Team
- **Slack**: `#benefits-optimization-aquia` (internal)
- **Repository**: `vets-website`
