# Date Handling Module for Disability Benefits All-Claims

This module centralizes all date-related functionality for the disability-benefits/all-claims application, providing a consistent API for date formatting, validation, comparison, and form integration.

## Structure

```zsh
dates/
├── index.js              # Public API exports
├── formatting.js         # Date formatting and core utilities
├── comparisons.js        # Date comparison functions
├── validations.js        # Date validation functions
├── product-specific.js   # Product-specific date operations
├── form-integration.js   # VA forms system integration
└── README.md            # This file
```

## Usage

Import only what you need from the main index:

```javascript
import { 
  formatDate, 
  isValidFullDate, 
  validateSeparationDate 
} from 'applications/disability-benefits/all-claims/utils/dates';
```

## API Reference

### Formatting Functions

- `formatDate(date, format)` - Format a date string
- `formatDateRange(dateRange, format)` - Format a date range
- `formatMonthYearDate(rawDate)` - Format as "Month YYYY"
- `formatDateShort(date)` - Format as "MM/DD/YYYY"
- `formatDateLong(date)` - Format as "MMMM D, YYYY"

### Core Validation Functions

- `isValidFullDate(dateString)` - Validate YYYY-MM-DD format
- `isValidYear(err, fieldData)` - Validate year value
- `isValidPartialDate(dateString)` - Validate partial dates
- `isNotExpired(expirationDate)` - Check if date hasn't expired
- `validateAge(err, fieldData, formData)` - Validate age requirements
- `validateSeparationDate(err, fieldData, formData)` - Validate separation dates
- `validateServicePeriod(errors, fieldData)` - Validate service periods
- `isInFuture(err, fieldData)` - Check if date is in the future
- `isLessThan180DaysInFuture(errors, fieldData)` - Validate date is less than 180 days in future

### Advanced Validation Functions

- `validateDateRange(errors, dateRange, options)` - Validate a date range
- `validateFutureDate(errors, date, options)` - Validate date is in the future
- `validatePastDate(errors, date, options)` - Validate date is in the past
- `validateDateNotBeforeReference(errors, date, referenceDate, options)` - Validate date is not before reference
- `validateSeparationDateWithRules(errors, dateString, options)` - Validate separation date with BDD/reserves rules
- `validateTitle10ActivationDate(errors, activationDate, servicePeriods, reservesList)` - Validate Title 10 activation

### Comparison Functions

- `isDateBefore(date1, date2, granularity)` - Check if date1 is before date2
- `isDateAfter(date1, date2, granularity)` - Check if date1 is after date2
- `isDateSame(date1, date2, granularity)` - Check if dates are the same
- `isDateBetween(date, startDate, endDate, granularity, inclusivity)` - Check if date is in range
- `compareDates(date1, date2, operator, granularity)` - General comparison

### Range and Service Functions

- `isWithinRange(dates, range)` - Check if date(s) are within a range
- `isWithinServicePeriod(date, servicePeriods)` - Check if date is within service periods
- `getDiffInDays(date1, date2)` - Get difference in days between dates
- `findEarliestServiceDate(servicePeriods)` - Find earliest service date
- `isTreatmentBeforeService(treatmentDate, earliestServiceDate, fieldData)` - Check treatment vs service date

### Parsing Functions

- `parseDate(dateString, format)` - Parse a date string
- `parseDateWithTemplate(dateString)` - Parse date with YYYY-MM-DD template

### BDD-Specific Functions

- `isBddClaimValid(separationDate)` - Check if BDD claim is valid (90-180 days)
- `getBddSeparationDateError(separationDate)` - Get BDD separation date error message

### Partial Date Functions

- `isMonthOnly(fieldData)` - Check if date is month-only format (XXXX-MM-XX)
- `isYearOnly(fieldData)` - Check if date is year-only format (YYYY-XX-XX)
- `isYearMonth(fieldData)` - Check if date is year-month format (YYYY-MM-XX)

### Form Integration

- `dateFieldToISO(dateField)` - Convert form field to ISO date
- `isoToDateField(isoDate)` - Convert ISO date to form field
- `formatReviewDate(dateString, monthYear)` - Format for review display
- `validateFormDateField(dateField, options)` - Validate form date field
- `createDateRange(fromField, toField)` - Create date range from form fields
- `validateFormDateRange(fromField, toField, options)` - Validate form date range
- `getCurrentFormDate()` - Get current date as form field object
- `adjustFormDate(dateField, amount, unit)` - Add/subtract time from form date

### Product-Specific Operations

Access via `productSpecificDates` object:

- `productSpecificDates.ptsd` - PTSD-specific date operations
- `productSpecificDates.toxicExposure` - Toxic exposure date operations
- `productSpecificDates.unemployability` - Unemployability date operations
- `productSpecificDates.hospitalization` - Hospitalization date operations
- `productSpecificDates.evidence` - Evidence date operations

## Constants

- `DATE_FORMAT` - Default format ('LL')
- `DATE_FORMAT_SHORT` - Short format ('MM/DD/YYYY')
- `DATE_FORMAT_LONG` - Long format ('MMMM D, YYYY')
- `PARTIAL_DATE_FORMAT` - Partial date format ('YYYY-MM')

## Migration Guide

When refactoring existing code to use this module:

1. Replace direct moment() calls with module functions
2. Use validation functions instead of inline validation
3. Use form integration utilities for form date handling
4. Move product-specific logic to product-specific.js

### Example Migration

Before:

```javascript
import moment from 'moment';

const formattedDate = moment(date).format('LL');
const isValid = moment(date).isValid();
```

After:

```javascript
import { formatDate, parseDate } from '.../utils/dates';

const formattedDate = formatDate(date);
const isValid = parseDate(date) !== null;
```

## Technical Notes

### MomentJS Usage

- All MomentJS usage is centralized in this module
- MomentJS warnings are expected and should NOT be fixed (per requirements)
- ESLint warnings are disabled with the following format:

```javascript
/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
```

### Module Design Principles

- The module is designed to make future refactoring easier
- Internal utilities (like `safeMoment`) are not exported via index
- All public API functions are exported through index
- Product-specific logic is isolated in product-specific
- Complex validation functions are refactored into smaller, focused helper functions to reduce cognitive complexity

### Internal Helper Functions

The following internal helper functions are used to reduce cognitive complexity and improve maintainability:

#### validations

- `checkRequiredDates()` - Validates required date fields
- `validateDateValues()` - Converts and validates moment objects
- `checkDateRangeLogic()` - Handles date ordering and range validation

#### form-integration

- `checkRequiredField()` - Validates required form fields
- `isEmptyDateField()` - Checks for empty date fields
- `validateISOFormat()` - Validates ISO date format
- `validateCompleteDateConstraints()` - Validates temporal constraints (future/past)

These helper functions are not part of the public API and are subject to change.

### Future Migration

When Node.js is upgraded to support the Temporal API, this module will serve as the single point of migration from MomentJS to Temporal, minimizing the impact on the rest of the codebase.
