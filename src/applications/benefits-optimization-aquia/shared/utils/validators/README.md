# Validators

Centralized validation functions for benefits-optimization-aquia applications.

## Overview

This module provides a **single import point** for all validation needs:
- **Platform validators** - Re-exported from VA.gov platform
- **Custom validators** - Bio-aquia specific validations

## Usage

Import all validators from this centralized module:

```javascript
import {
  // Platform validators
  isValidName,
  isValidSSN,
  isValidPhone,
  isValidEmail,
  isValidUSZipCode,
  isValidCanPostalCode,

  // Custom validators
  isValidVAFileNumber,
  isValidMexicoPostalCode,
  isValidMilitaryZip,
  MILITARY_ZIP_PATTERNS,

  // Validation messages
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/utils/validators';
```

## Platform Validators (Re-exported)

These validators are imported from VA.gov platform and re-exported for convenience:

### `isValidName(value: string): boolean`

Validates names with letters, spaces, hyphens, and apostrophes.

**Source:** `platform/forms/validations`

**Example:**
```javascript
isValidName('John O\'Brien')  // true
isValidName('Mary-Jane')      // true
isValidName('123')            // false
```

### `isValidSSN(value: string): boolean`

Validates Social Security Numbers (9 digits, formatted or unformatted).
Rejects invalid patterns (000-00-0000, 666-xx-xxxx, etc.).

**Source:** `platform/forms/validations`

**Example:**
```javascript
isValidSSN('123456789')     // true
isValidSSN('123-45-6789')   // true
isValidSSN('000-00-0000')   // false
```

### `isValidPhone(value: string): boolean`

Validates US 10-digit phone numbers. Automatically strips formatting.

**Source:** `platform/forms/validations`

**Example:**
```javascript
isValidPhone('1234567890')      // true
isValidPhone('(123) 456-7890')  // true (strips formatting)
isValidPhone('123')             // false
```

### `isValidEmail(value: string): boolean`

Validates email addresses using comprehensive regex.

**Source:** `platform/forms/validations`

**Example:**
```javascript
isValidEmail('user@example.com')  // true
isValidEmail('invalid-email')     // false
```

### `isValidUSZipCode(value: string): boolean`

Validates US ZIP codes (5 digits or 5+4 format).

**Source:** `platform/forms/address`

**Example:**
```javascript
isValidUSZipCode('12345')       // true
isValidUSZipCode('12345-6789')  // true
isValidUSZipCode('1234')        // false
```

### `isValidCanPostalCode(value: string): boolean`

Validates Canadian postal codes (A1A 1A1 format).

**Source:** `platform/forms/address`

**Example:**
```javascript
isValidCanPostalCode('K1A 0B1')  // true
isValidCanPostalCode('12345')    // false
```

## Custom Validators

These validators are specific to bio-aquia applications:

### `isValidVAFileNumber(value: string): boolean`

Validates VA file numbers (8 or 9 digits). Simple digit validation without SSN rules.

**Parameters:**
- `value` - VA file number to validate

**Returns:** `true` if valid (8-9 digits) or empty, `false` otherwise

**Example:**
```javascript
isValidVAFileNumber('12345678')  // true (8 digits)
isValidVAFileNumber('123456789') // true (9 digits)
isValidVAFileNumber('')          // true (optional field)
isValidVAFileNumber('1234567')   // false (too short)
isValidVAFileNumber('12-34567')  // false (invalid characters)
```

### `isValidMexicoPostalCode(value: string): boolean`

Validates Mexican postal codes (5 digits).

**Parameters:**
- `value` - Postal code to validate

**Returns:** `true` if valid (5 digits), `false` otherwise

**Example:**
```javascript
isValidMexicoPostalCode('12345') // true
isValidMexicoPostalCode('1234')  // false (too short)
```

### `isValidMilitaryZip(zipCode: string, state: string): boolean`

Validates military ZIP codes match the correct range for the military state.

**Parameters:**
- `zipCode` - ZIP code to validate
- `state` - Military state code ('AA', 'AE', or 'AP')

**Returns:** `true` if ZIP matches state range, `false` otherwise

**Example:**
```javascript
isValidMilitaryZip('34012', 'AA')  // true (AA: 340xx)
isValidMilitaryZip('09123', 'AE')  // true (AE: 09xxx)
isValidMilitaryZip('96234', 'AP')  // true (AP: 96[2-6]xx)
isValidMilitaryZip('12345', 'AA')  // false (wrong range)
```

### `MILITARY_ZIP_PATTERNS`

Regex patterns for military ZIP code ranges:

```javascript
{
  AA: /^340\d{2}$/,    // Armed Forces Americas (340xx)
  AE: /^09\d{3}$/,     // Armed Forces Europe (09xxx)
  AP: /^96[2-6]\d{2}$/ // Armed Forces Pacific (96[2-6]xx)
}
```

## Validation Messages

Centralized error messages for consistent user experience:

```javascript
VALIDATION_MESSAGES = {
  // Name validation
  NAME_INVALID_FIRST: 'Contains invalid characters',
  NAME_INVALID_MIDDLE: 'Middle name contains invalid characters',
  NAME_INVALID_LAST: 'Last name contains invalid characters',
  NAME_INVALID_SUFFIX: 'Suffix contains invalid characters',

  // ID validation
  SSN_FORMAT: 'SSN must be 9 digits',
  VA_FILE_FORMAT: 'VA file number must be 8 or 9 digits',

  // Contact validation
  EMAIL_FORMAT: 'Please enter a valid email address',

  // Postal codes
  POSTAL_MEXICO: 'Postal code must be 5 digits',
  POSTAL_CANADA: 'Postal code must be in format A1A 1A1',

  // Military ZIP codes
  ZIP_MILITARY_AA: 'ZIP code must start with 340',
  ZIP_MILITARY_AE: 'ZIP code must start with 09',
  ZIP_MILITARY_AP: 'ZIP code must start with 962-966',
}
```

## Complete Usage Example

```javascript
import { z } from 'zod';
import {
  isValidSSN,
  isValidName,
  isValidVAFileNumber,
  isValidUSZipCode,
  isValidMilitaryZip,
  VALIDATION_MESSAGES,
} from '@bio-aquia/shared/utils/validators';

// SSN validation
export const ssnSchema = z
  .string()
  .transform(val => val.replace(/\D/g, ''))
  .refine(val => isValidSSN(val), VALIDATION_MESSAGES.SSN_FORMAT);

// Name validation
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .refine(val => isValidName(val), VALIDATION_MESSAGES.NAME_INVALID_FIRST);

// VA file number (custom validator)
export const vaFileNumberSchema = z
  .string()
  .optional()
  .refine(
    val => isValidVAFileNumber(val),
    VALIDATION_MESSAGES.VA_FILE_FORMAT,
  );

// ZIP code validation
export const zipSchema = z
  .string()
  .refine(val => isValidUSZipCode(val), 'Invalid ZIP code');

// Military address with ZIP range validation
export const militaryAddressSchema = z
  .object({
    state: z.enum(['AA', 'AE', 'AP']),
    postalCode: z.string(),
  })
  .refine(
    data => isValidMilitaryZip(data.postalCode, data.state),
    {
      message: 'Invalid military ZIP code for selected state',
      path: ['postalCode'],
    },
  );
```

## Why Centralized?

1. **Single Import Point** - All validators in one place
2. **Consistent API** - Same import pattern for platform and custom validators
3. **Easy Maintenance** - Update platform imports in one location
4. **Clear Organization** - Platform vs custom clearly documented

## Platform Resources

### Platform Validators
- `platform/forms/validations.js` - Name, SSN, phone, email validation
- `platform/forms/address/index.js` - US and Canadian postal code validation

### Platform Constants
- `vets-json-schema/dist/constants.json` - States, countries, etc.
- `platform/forms/address/data` - Military states and cities
- `platform/static-data/options-for-select.js` - Form options (branches, yes/no, etc.)

### Platform Form Definitions
- `platform/forms-system/src/js/definitions/ssn.js` - SSN schema
- `platform/forms-system/src/js/definitions/phone.js` - Phone schema
- `platform/forms-system/src/js/definitions/email.js` - Email schema
- `platform/forms-system/src/js/definitions/address.js` - Address schema
