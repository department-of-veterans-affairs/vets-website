# Survivors Benefits Form Cypress Test Matrix

## Test Overview
This document outlines the test workflows and coverage for the Survivors Benefits application (Form 21P-534EZ).

## Test Datasets

The test runs with two datasets that validate different scenarios:

### minimal-test-a.json
**Purpose**: Full form flow validation  
**Scope**: Tests the complete application from start to finish  
**Flow**: Goes through all form pages sequentially, filling in all required fields and validating the entire submission process from introduction through review and submit.

### minimal-test-b.json
**Purpose**: Exit link verification and navigation recovery  
**Scope**: Tests the claimant-other page exit functionality and backward navigation  
**Special Behavior**: 
- Navigates to the claimant-other page
- Verifies the "Exit application" link exists with correct attributes
- Clicks back to the claimant-relationship page
- Changes selection to "Spouse" 
- Continues through the rest of the form normally

Both datasets contain complete form data including veteran information, claimant details, marriages, dependents, and VA medical centers.

## Test Workflows

### Workflow 1: Full Form Flow (minimal-test-a)
This workflow tests the complete form submission from start to finish without interruption.

### Workflow 2: Exit Link Verification with Navigation Recovery (minimal-test-b)
This workflow tests navigation to the "claimant-other" page, verifies the exit link, then navigates back to change the relationship to "Spouse" and continues through the form.

| Page | Actions | Validations |
|------|---------|-------------|
| Introduction | Click "Apply for survivors benefits" link | - |
| Veteran | Fill veteran's first name, last name, date of birth | - |
| Veteran Additional Information | Select VA claims history, died on duty status, fill date of death | - |
| Claimant Information | Fill claimant's first name, last name, date of birth | - |
| Claimant Relationship | Select claimant relationship from test data | - |
| Claimant Other | - | Verify `va-link-action` exists with correct attributes (text: "Exit application", href: "https://va.gov/", type: "secondary") |
| Claimant Relationship (revisit) | Click back, select "SPOUSE" | - |
| Service Period | Select branch of service (MARINE_CORPS), fill initial entry date, final release date, city/state/foreign country | - |
| National Guard Service Period | Fill activation date, unit name, unit phone number | - |
| Prisoner of War Period | Fill POW period from/to dates | - |
| Marriage to Veteran Location | Fill marriage start date, select outside US checkbox (if applicable), fill marriage location address | - |
| Marriage to Veteran End Info | Fill marriage end date, select outside US checkbox (if applicable), fill marriage end location address | - |
| Separation Details | Fill separation explanation, start date, end date, select court ordered separation | - |
| Remarriage Details | Select remarriage end reason, fill other reason (if applicable), fill remarriage date and end date | - |
| Previous Marriage Date and Location | Fill marriage to veteran date, select married outside US checkbox (if applicable), fill marriage location address | For each marriage in `spouseMarriages` array |
| Previous Marriage End Date and Location | Fill marriage end date, select married outside US checkbox (if applicable), fill marriage end location address | For each marriage in `spouseMarriages` array |
| Veteran Previous Marriages Date and Place | Fill marriage date, select married outside US checkbox (if applicable), fill marriage location address | For each marriage in `veteranMarriages` array |
| Veteran Previous Marriages End Date and Location | Fill date of termination, select marriage ended outside US checkbox (if applicable), fill marriage end location address | For each marriage in `veteranMarriages` array |
| Dependents Date and Place of Birth | Fill dependent's date of birth, select born outside US checkbox (if applicable), fill birth place address | For each dependent in `dependents` array |
| Claim Information DIC Dates | Fill VA medical center start date and end date (if applicable) | For each medical center in `vaMedicalCenters` array |
| Review and Submit | Sign statement of truth with claimant's full name, check certification checkbox, click submit | Verify accessibility with `cy.axeCheck()` |

## Field Coverage by Page

### Veteran Page
- `veteranFullName.first`
- `veteranFullName.last`
- `veteranDateOfBirth`

### Veteran Additional Information Page
- `vaClaimsHistory` (Yes/No)
- `diedOnDuty` (Yes/No)
- `veteranDateOfDeath`

### Claimant Information Page
- `claimantFullName.first`
- `claimantFullName.last`
- `claimantDateOfBirth`

### Claimant Relationship Page
- `claimantRelationship` (radio options)
  - Test verifies switching from test data value to `SPOUSE`

### Claimant Other Page
- Exit application link component validation

### Service Period Page
- `branchOfService.MARINE_CORPS` (checkbox)
- `dateInitiallyEnteredActiveDuty`
- `finalReleaseDateFromActiveDuty`
- `cityStateOrForeignCountry`

### National Guard Service Period Page
- `dateOfActivation`
- `unitName`
- `unitPhoneNumber`

### Prisoner of War Period Page
- `powPeriod.from`
- `powPeriod.to`

### Marriage to Veteran Location Page
- `marriageToVeteranStartDate`
- `marriageToVeteranStartOutsideUS` (checkbox)
- `marriageToVeteranStartLocation` (address pattern)

### Marriage to Veteran End Info Page
- `marriageToVeteranEndDate`
- `marriageToVeteranEndOutsideUS` (checkbox)
- `marriageToVeteranEndLocation` (address pattern)

### Separation Details Page
- `separationExplanation`
- `separationStartDate`
- `separationEndDate`
- `courtOrderedSeparation` (Yes/No)

### Remarriage Details Page
- `remarriageEndReason` (radio options)
- `remarriageEndOtherReason`
- `remarriageDate`
- `remarriageEndDate`

### Previous Marriage (Array Items)
- `spouseMarriages[].marriageToVeteranDate`
- `spouseMarriages[].marriedOutsideUS` (checkbox)
- `spouseMarriages[].marriageLocation` (address pattern)
- `spouseMarriages[].marriageEndDate`
- `spouseMarriages[].marriageEndedOutsideUS` (checkbox)
- `spouseMarriages[].marriageEndLocation` (address pattern)

### Veteran Previous Marriages (Array Items)
- `veteranMarriages[].marriageDate`
- `veteranMarriages[].marriedOutsideUS` (checkbox)
- `veteranMarriages[].marriageLocation` (address pattern)
- `veteranMarriages[].dateOfTermination`
- `veteranMarriages[].marriageEndedOutsideUS` (checkbox)
- `veteranMarriages[].marriageEndLocation` (address pattern)

### Dependents (Array Items)
- `dependents[].dateOfBirth`
- `dependents[].bornOutsideUS` (checkbox)
- `dependents[].birthPlace` (address pattern)

### Claim Information DIC (Array Items)
- `vaMedicalCenters[].startDate`
- `vaMedicalCenters[].endDate`

### Review and Submit Page
- Statement of Truth signature
- Certification checkbox
- Accessibility validation

## Web Components Used

| Component | Usage | Page(s) |
|-----------|-------|---------|
| `va-text-input` | Text input fields | Veteran, Claimant Information, Service Period, National Guard, Separation Details, Remarriage Details |
| `va-date` | Date input fields | All pages with date fields |
| `va-radio` | Radio button options | Claimant Relationship, Remarriage Details |
| `va-checkbox` | Checkbox inputs | Service Period, Marriage pages, Dependent pages |
| `va-telephone-input` | Phone number input | National Guard Service Period |
| `va-link-action` | Exit application link | Claimant Other |
| `va-statement-of-truth` | Signature and certification | Review and Submit |
| Address pattern | Address collection | Marriage locations, Birth places |

## Special Test Scenarios

### Exit Link Verification and Navigation Flow
- **Scenario**: User selects a non-spouse relationship → navigates to "claimant-other" page → verifies exit link → goes back → changes to spouse relationship
- **Purpose**: Tests navigation backward functionality and validates exit link component on "claimant-other" page
- **Validation**: Ensures `va-link-action` component has correct attributes (text, href, type)

### Array Item Iteration
The test handles dynamic array-based pages:
- Spouse previous marriages
- Veteran previous marriages
- Dependents
- VA medical centers

Each array item is tested with index-specific data from the test dataset.

## Mock Setup

### User Authentication
- Mocks `/v0/user` endpoint with `mockUser.json`
- Uses `cy.login(mockUser)` for authenticated session

### Form Submission
- Mocks form submission endpoint (`formConfig.submitUrl`) with `mock-submit.json`

## Accessibility Testing
- `cy.axeCheck()` is run on the Review and Submit page before submission

## CI Configuration
- Tests are skipped in CI until form is released to production
- Controlled by `skip: Cypress.env('CI')` configuration

## Test Execution Notes
- Tests run against datasets: `minimal-test-a` and `minimal-test-b`
- Uses form tester utility from `platform/testing/e2e/cypress/support/form-tester`
- Test data is loaded from `fixtures/data` directory with prefix `data`
