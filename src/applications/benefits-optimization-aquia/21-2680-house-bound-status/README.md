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
- **Entry Name**: `21-2680-house-bound-status`
- **Root URL**: `/pension/aid-attendance-housebound/apply-form-21-2680`
- **API Endpoint**: `POST /v0/form212680`
- **Product ID**: `803cc23f-a627-4ea7-a3ea-0f5595d0dfd3`

## Form Flow and Sections

The form is organized into **4 chapters** with **13 total pages**, using conditional logic to show/hide pages based on claimant relationship and hospitalization status.

### Chapter 1: Veteran's Information (2 pages)

- **Page 1: Veteran Information** (`veteran-information`)

  - Full name (first, middle, last, suffix)
  - Social Security Number
  - Date of birth

- **Page 2: Veteran Address** (`veteran-address`)
  - Mailing address (supports standard, APO/AE, FPO/AP, and DPO/AA military addresses)
  - Street address, city, state, ZIP/postal code
  - Country (for international addresses)

### Chapter 2: Claimant's Information (5 pages, conditional)

- **Page 3: Claimant Relationship** (`claimant-relationship`)

  - Who is filing the claim (veteran, spouse, child, or parent)
  - **Conditional branching point**

- **Page 4: Claimant Information** (`claimant-information`) - **Conditional**

  - Full name (first, middle, last, suffix)
  - Date of birth
  - Hidden when Veteran is the claimant

- **Page 5: Claimant SSN** (`claimant-ssn`) - **Conditional**

  - Social Security Number
  - Hidden when Veteran is the claimant

- **Page 6: Claimant Address** (`claimant-address`) - **Conditional**

  - Mailing address (standard or military)
  - Hidden when Veteran is the claimant

- **Page 7: Contact Information** (`claimant-contact`) - **Conditional**
  - Phone number (home)
  - Mobile phone number
  - Email address
  - Hidden when Veteran is the claimant

### Chapter 3: Claim Information (1 page)

- **Page 8: Benefit Type** (`benefit-type`)
  - SMC (Special Monthly Compensation)
  - SMP (Special Monthly Pension)

### Chapter 4: Hospitalization (3 pages, conditional)

- **Page 9: Hospitalization Status** (`hospitalization-status`)

  - Whether the Veteran is currently hospitalized
  - **Conditional branching point**

- **Page 10: Admission Date** (`hospitalization-date`) - **Conditional**

  - Date of hospital admission
  - Shown only if currently hospitalized

- **Page 11: Hospitalization Facility** (`hospitalization-facility`) - **Conditional**
  - Facility name
  - Facility address
  - Shown only if currently hospitalized

### Final Pages (All Users)

- **Page 12: Review and Submit**

  - Pre-submission review of all entered information
  - Statement of truth with signature validation
  - Privacy policy acknowledgment

- **Page 13: Confirmation Page**
  - Submission confirmation number
  - Print button for confirmation
  - Next steps information

## Technical Implementation

This application uses the **VA.gov Form System (RJSF)** with traditional page-based configuration.

### API Integration

The form uses **prefill-transformer** and **submit-transformer** for data handling:

- **Form Submission**: `POST ${environment.API_URL}/v0/form212680`
- **Save in Progress**: Stores partial form data at `/v0/in_progress_forms/21-2680`
- **User Profile**: `GET /v0/user` (for prefill)
- **Prefill Transformer**: Converts user profile data to form data
- **Submit Transformer**: Converts form data to backend API format

## Testing

### Test Scenarios

- **Minimal**: Veteran is claimant, no hospitalization (shortest path) - Star Wars themed
- **Maximal**: Spouse claimant, hospitalized, APO military address (all conditional pages) - Star Wars themed
- **Parent, Child, Spouse**: Additional relationship variations with FPO/DPO addresses

### Running Tests

```bash
# Run all unit tests for this application
yarn test:unit --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run tests with coverage
yarn test:unit:coverage --app-folder benefits-optimization-aquia/21-2680-house-bound-status

# Run specific test file
yarn test:unit src/applications/benefits-optimization-aquia/21-2680-house-bound-status/config/form/form.unit.spec.jsx

# Run Cypress E2E tests (requires yarn watch to be running)
yarn cy:run --spec "src/applications/benefits-optimization-aquia/21-2680-house-bound-status/tests/*.cypress.spec.js"

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
yarn watch --env entry=auth,static-pages,login-page,21-2680-house-bound-status
```

### Local Development URL

- Development: `http://localhost:3001/pension/aid-attendance-housebound/apply-form-21-2680`
- Introduction page: Starts at the root URL above

## Conditional Form Logic

### When Pages Are Shown/Hidden

#### Claimant Pages (Pages 4-7)

**Shown when**:

- `claimantRelationship.relationship !== 'veteran'`

**Hidden when**:

- `claimantRelationship.relationship === 'veteran'` (Veteran is the claimant)

**Pages affected**:

- Claimant Information
- Claimant SSN
- Claimant Address
- Claimant Contact

#### Hospitalization Pages (Pages 10-11)

**Shown when**:

- `hospitalizationStatus.isCurrentlyHospitalized === true`

**Hidden when**:

- `hospitalizationStatus.isCurrentlyHospitalized === false`

**Pages affected**:

- Hospitalization Date
- Hospitalization Facility

## Support

For questions or issues:

- **Team**: Benefits Intake Optimization - Aquia Team
- **Slack**: `#benefits-optimization-aquia` (internal)
- **Repository**: `vets-website`
