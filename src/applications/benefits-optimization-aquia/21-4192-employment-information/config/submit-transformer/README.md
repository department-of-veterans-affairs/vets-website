# Submit Transformer for VA Form 21-4192

## Overview

This module transforms form data from the vets-website frontend format to the vets-api backend format for VA Form 21-4192 (Request for Employment Information in Connection with Claim for Disability Benefits).

## API Integration

The transformer maps frontend form data to the API schema defined in:
- **API Schema**: `vets-api/app/openapi/openapi/requests/form214192.rb`
- **API Endpoint**: `POST /v0/form21_4192`
- **Controller**: `vets-api/app/controllers/v0/form214192_controller.rb`

## Data Mapping

### Frontend Structure → API Structure

#### Veteran Information
```javascript
// Frontend
{
  veteranInformation: {
    firstName: 'John',
    middleName: 'A',
    lastName: 'Doe',
    dateOfBirth: '1980-01-15'
  },
  veteranContactInformation: {
    ssn: '123-45-6789',
    vaFileNumber: '987654321'
  }
}

// API
{
  veteranInformation: {
    fullName: {
      first: 'John',
      middle: 'A',
      last: 'Doe'
    },
    ssn: '123456789', // Dashes removed
    vaFileNumber: '987654321',
    dateOfBirth: '1980-01-15',
    address: null
  }
}
```

#### Employment Information
```javascript
// Frontend (spread across multiple sections)
{
  employerInformation: { employerName, employerAddress },
  employmentDates: { beginningDate, endingDate },
  employmentEarningsHours: { typeOfWork, amountEarned, timeLost, dailyHours, weeklyHours },
  employmentConcessions: { concessions },
  employmentTermination: { terminationReason, dateLastWorked },
  employmentLastPayment: { dateOfLastPayment, grossAmountLastPayment, lumpSumPayment, grossAmountPaid, datePaid }
}

// API (consolidated into single object)
{
  employmentInformation: {
    employerName: 'Acme Corp',
    employerAddress: { street, street2, city, state, country, postalCode },
    typeOfWorkPerformed: 'Software Engineer',
    beginningDateOfEmployment: '2020-01-01',
    endingDateOfEmployment: '2023-12-31', // null if currently employed
    amountEarnedLast12MonthsOfEmployment: 50000, // number, not string
    timeLostLast12MonthsOfEmployment: '2 weeks',
    hoursWorkedDaily: 8, // number
    hoursWorkedWeekly: 40, // number
    concessions: 'Flexible schedule',
    terminationReason: 'Medical reasons',
    dateLastWorked: '2023-12-15',
    lastPaymentDate: '2023-12-31',
    lastPaymentGrossAmount: 4500, // number
    lumpSumPaymentMade: true, // boolean
    grossAmountPaid: 10000, // number, null if no lump sum
    datePaid: '2024-01-15' // null if no lump sum
  }
}
```

#### Military Duty Status (Conditional)
```javascript
// Frontend
{
  dutyStatus: { reserveOrGuardStatus: 'yes' },
  dutyStatusDetails: {
    currentDutyStatus: 'Active Reserve',
    disabilitiesPreventDuties: 'yes'
  }
}

// API (only included if reserveOrGuardStatus === 'yes')
{
  militaryDutyStatus: {
    currentDutyStatus: 'Active Reserve',
    veteranDisabilitiesPreventMilitaryDuties: true // boolean
  }
}
```

#### Benefit Entitlement Payments
```javascript
// Frontend
{
  benefitsInformation: { benefitEntitlement: 'yes' },
  benefitsDetails: {
    benefitType: 'Sick leave',
    grossMonthlyAmount: '$2,500.00',
    startReceivingDate: '2023-01-01',
    firstPaymentDate: '2023-02-01',
    stopReceivingDate: '2024-12-31'
  },
  remarks: { remarks: 'Additional information' }
}

// API
{
  benefitEntitlementPayments: {
    sickRetirementOtherBenefits: true, // boolean
    typeOfBenefit: 'Sick leave', // null if no benefits
    grossMonthlyAmountOfBenefit: 2500, // number, null if no benefits
    dateBenefitBegan: '2023-01-01', // null if no benefits
    dateFirstPaymentIssued: '2023-02-01', // null if no benefits
    dateBenefitWillStop: '2024-12-31', // null if no benefits
    remarks: 'Additional information'
  }
}
```

## Data Transformations

### 1. Currency Formatting
- **Input**: `"$1,234.56"` or `"1,234.56"`
- **Output**: `1234.56` (number)
- Removes dollar signs and commas
- Converts to number
- Returns `null` for invalid/empty values

### 2. Date Formatting
- **Input**: `"YYYY-MM-DD"`
- **Output**: `"YYYY-MM-DD"` (same format)
- Returns `null` for empty/invalid values

### 3. SSN Formatting
- **Input**: `"123-45-6789"`
- **Output**: `"123456789"` (removes dashes)

### 4. Yes/No to Boolean
- **Input**: `"yes"` or `"no"`
- **Output**: `true` or `false`
- Returns `null` for undefined/empty values

### 5. Hours Formatting
- **Input**: `"8"` or `8`
- **Output**: `8` (number)
- Returns `null` for invalid/empty values

## Conditional Logic

### Currently Employed
If no ending date is provided:
- `endingDateOfEmployment` is omitted from the payload (or set to `null`)
- Termination information pages are not shown

### Lump Sum Payment
If `employmentLastPayment.lumpSumPayment === 'no'`:
- `grossAmountPaid` is set to `null`
- `datePaid` is set to `null`

### Reserve/Guard Status
If `dutyStatus.reserveOrGuardStatus !== 'yes'`:
- Entire `militaryDutyStatus` section is excluded from payload

### Benefit Entitlement
If `benefitsInformation.benefitEntitlement === 'no'`:
- All benefit detail fields are set to `null`
- Only `sickRetirementOtherBenefits` and `remarks` are included

## Usage

The transformer is automatically applied to form submissions via the form configuration:

```javascript
// config/form/form.js
import transformForSubmit from '@bio-aquia/21-4192-employment-information/config/submit-transformer';

const formConfig = {
  // ...
  transformForSubmit,
  submitUrl: '/v0/form21_4192',
  // ...
};
```

## Testing

Run the unit tests:
```bash
yarn test:unit src/applications/benefits-optimization-aquia/21-4192-employment-information/config/submit-transformer/submit-transformer.unit.spec.jsx
```

The test suite covers:
- Veteran information transformation
- Employment information consolidation
- Military duty status conditional logic
- Benefit entitlement conditional logic
- Currency and date formatting
- Yes/no to boolean conversion
- Edge cases and null handling
- Complete form transformation

## API Contract

### Required Fields (per API schema)
- `veteranInformation.fullName` (first and last name)
- `veteranInformation.dateOfBirth`
- `employmentInformation.employerName`
- `employmentInformation.employerAddress`
- `employmentInformation.typeOfWorkPerformed`
- `employmentInformation.beginningDateOfEmployment`
- `employerCertification.signature`

### Optional Fields
All other fields are optional and can be `null` or omitted.

## Notes

- The transformer cleans up `null` sections (e.g., removes `militaryDutyStatus` if not applicable)
- Currency values are converted from strings to numbers for API consumption
- SSN dashes are removed to match API's 9-digit format requirement
- Boolean conversions handle yes/no radio button responses
- The `employerCertification` section is included with empty signature (to be filled by employer)
