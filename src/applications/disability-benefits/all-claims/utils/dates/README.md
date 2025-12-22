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

## When to Use This Module vs Platform Utilities

### Use Platform Utilities When

- You need basic date formatting (use `platform/utilities/date`)
- You need standard date validation (use `platform/forms-system/src/js/utilities/validations`)
- You're working outside the disability-benefits context
- You need date UI components (use `platform/forms-system/src/js/web-component-patterns/datePatterns`)

### Use This Module When

- You're working within the disability-benefits/all-claims application
- You need BDD-specific validation (90-180 days)
- You need to validate separation dates or service periods
- You need to handle partial dates (YYYY-XX-XX, XXXX-MM-XX formats)
- You need disability-benefits specific age validation (13th birthday)
- You need to validate treatment dates against service dates

## Usage

Import only what you need from the main index:

```javascript
import {
  formatDate,
  isValidFullDate,
  validateSeparationDate,
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
- `isValidYear(err, fieldData)` - Validate year value (uses platform utility)
- `validateAge(err, fieldData, formData)` - Validate age requirements (13th birthday)
- `validateSeparationDate(err, fieldData, formData)` - Validate separation dates
- `validateServicePeriod(errors, fieldData)` - Validate service periods
- `isLessThan180DaysInFuture(errors, fieldData)` - Validate date is less than 180 days in future

**Note:** `isValidPartialDate()` has been removed. Partial date validation is now handled by `validateApproximateDate()` in validations.js for specific pages that support approximate dates (e.g., conditionDate, vaMedicalRecords treatment dates).

### Advanced Validation Functions

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

- `dateFieldToISO(dateField, options)` - Convert form field to ISO date
  - `options.allowPartial` - Set to `true` to allow partial dates (XX placeholders). **Default: false**
  - Only use `allowPartial: true` for designated fields that support approximate dates (conditionDate, vaMedicalRecords, separationPayDate)
  - **Toxic Exposure fields must NOT use allowPartial** - they require complete YYYY-MM-DD dates
- `isoToDateField(isoDate)` - Convert ISO date to form field
- `formatReviewDate(dateString, monthYear)` - Format for review display
- `validateFormDateField(dateField, options)` - Validate form date field
  - Supports `allowPartial` option - pass through to enable partial date validation
- `createDateRange(fromField, toField, options)` - Create date range from form fields
  - Supports `allowPartial` option - pass through to enable partial date handling
- `validateFormDateRange(fromField, toField, options)` - Validate form date range
  - Supports `allowPartial` option - pass through to enable partial date validation
- `getCurrentFormDate()` - Get current date as form field object
- `adjustFormDate(dateField, amount, unit)` - Add/subtract time from form date

#### Partial Date Handling

**By default, all form integration functions require complete dates (YYYY-MM-DD)**. This prevents the creation of invalid XX placeholder dates that cause backend submission failures.

**To enable partial dates** for specific fields that explicitly support approximate dates:
```javascript
// For fields that support approximate dates (conditionDate, vaMedicalRecords treatment dates)
const isoDate = dateFieldToISO(dateField, { allowPartial: true });

// For Toxic Exposure dates - DO NOT use allowPartial
const isoDate = dateFieldToISO(dateField); // Returns null if incomplete
```

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
   1. We can break it out into a dir with subfiles as well

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

### Platform Integration

This module uses platform utilities where possible to avoid duplication:

#### Functions Using Platform Utilities

- `formatDateShort()` - Delegates to `platform/utilities/date/formatDateShort`
- `formatDateLong()` - Delegates to `platform/utilities/date/formatDateLong`
- `isValidYear()` - Uses `platform/forms-system/src/js/utilities/validations/isValidYear`
- `isValidPartialDate()` - Enhanced version of platform utility

#### Disability-Benefits Specific Functions

The following functions provide disability-benefits specific functionality not available in platform utilities:

- **BDD-Specific**: `isBddClaimValid()`, `getBddSeparationDateError()`
- **Service-Specific**: `validateSeparationDate()`, `findEarliestServiceDate()`, `isTreatmentBeforeService()`
- **Partial Date Formats**: `isMonthOnly()`, `isYearOnly()`, `isYearMonth()`
- **Age Validation**: `validateAge()` (13th birthday check)
- **Custom Validations**: `isLessThan180DaysInFuture()`, `validateServicePeriod()`

### MomentJS Usage

- MomentJS usage is still required for disability-benefits specific date operations
- Platform utilities use date-fns, but we maintain moment for backward compatibility
- MomentJS warnings are expected and should not be fixed for now
- We will migrate away from moment in future work
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
- Uses platform utilities to avoid duplication
- Internal utilities (like `safeMoment`) are not exported via index
- All public API functions are exported through index
- Product-specific logic is isolated in product-specific
- Complex validation functions are refactored into smaller, focused helper functions to reduce cognitive complexity

### Internal Helper Functions

Internal helper functions reduce cognitive complexity and improve maintainability:

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
