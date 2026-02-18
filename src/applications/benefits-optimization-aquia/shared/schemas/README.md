# Schema Organization Strategy

## Overview

The schema system provides reusable Zod validation schemas organized by domain
and complexity level.

## Schema Categories

### **Core Schemas** (Universal)

These schemas are used across all form types:

- `personal-info.js` - Names, SSN, DOB, VA file numbers
- `address.js` - Addresses with military/international support
- `contact.js` - Phone, email, preferred contact methods

### **Domain-Specific Schemas**

#### **Memorial/Benefits Domain**

- `veteran-info.js` - Service details, discharge status, branch
- `death-certificate.js` - Death certificate information
- `burial-benefits.js` - Burial allowances, cemetery preferences
- `memorial-benefits.js` - Medallion, flag eligibility

#### **Healthcare Domain**

- `medical-info.js` - Medical conditions, symptoms, treatments
- `insurance.js` - Insurance coverage, policy details
- `healthcare-provider.js` - Provider information, referrals
- `medication.js` - Current medications, allergies
- `disability-rating.js` - VA disability ratings and conditions

#### **Dependency/Relationship Domain**

- `dependent.js` - Spouse, children, beneficiary information
- `emergency-contact.js` - Emergency contacts
- `legal-representation.js` - Power of attorney, representatives

#### **Financial Domain**

- `financial-info.js` - Income, assets, expenses
- `hardship.js` - Financial hardship documentation

## Schema Design Patterns

### **Composition Over Inheritance**

```javascript
// Base schemas for composition
export const basePersonSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  // ...
});

// Composed schemas
export const veteranPersonSchema = basePersonSchema.extend({
  serviceNumber: z.string().optional(),
  vaFileNumber: vaFileNumberSchema.optional(),
});

export const dependentPersonSchema = basePersonSchema.extend({
  relationship: z.enum(['spouse', 'child', 'other']),
  dateOfBirth: dateOfBirthSchema,
});
```

### **Conditional Validation**

```javascript
export const addressSchema = baseAddressSchema.superRefine((data, ctx) => {
  // Military address validation
  if (data.isMilitary) {
    // Military-specific validation
  }

  // Country-specific validation
  if (data.country === 'USA') {
    // US-specific validation
  }
});
```

### **Form-Specific Extensions**

```javascript
// In form-specific directories
import { personalInfoSchema } from '@bio-aquia/shared/schemas';

export const burialFlagsPersonalInfoSchema = personalInfoSchema.extend({
  relationshipToVeteran: z.enum(['self', 'spouse', 'child', 'parent', 'other']),
});
```

## Schema File Structure

```bash
schemas/
├── address/
│   ├── address.js
│   ├── address.unit.spec.jsx
│   └── index.js
├── contact/
│   ├── contact.js
│   ├── contact.unit.spec.jsx
│   └── index.js
├── name/
│   ├── name.js
│   ├── name.unit.spec.jsx
│   └── index.js
├── personal-info/
│   ├── personal-info.js
│   ├── personal-info.unit.spec.jsx
│   └── index.js
├── regex-patterns/
│   ├── regex-patterns.js
│   ├── regex-patterns.unit.spec.jsx
│   └── index.js
└── index.js (barrel exports)
```

### Current Implementation

The schema system currently includes:

- **address/** - US, international, and military address validation
  - Single source of truth for state/territory lists
  - Consolidated validation logic for better maintainability
- **contact/** - Phone and email validation patterns
- **name/** - First, middle, last name, and suffix validation
  - Streamlined suffix validation with single refine
- **personal-info/** - SSN, DOB, VA file number validation
- **regex-patterns/** - Shared validation patterns and messages

### Recent Improvements

**Consolidation Efforts (2025):**

- Merged duplicate US state lists in `address.js` - single source of truth
- Consolidated suffix validation in `name.js` - removed redundant refinements
- Improved maintainability with centralized constants

### Directory Organization

Each schema follows a consistent structure:

- **Schema file** (`[schema-name].js`) - Zod schema definitions
- **Test file** (`[schema-name].unit.spec.jsx`) - Unit tests
- **Barrel file** (`index.js`) - Named exports

This organization provides:

- **Co-location** - Tests live next to their schemas
- **Encapsulation** - Each schema module is self-contained
- **Clean imports** - Multiple import options via barrel files

## Validation Error Standards

### **Error Message Patterns**

- **Required fields**: "This field is required"
- **Format errors**: "Enter a valid [field type]"
- **Length errors**: "Must be between X and Y characters"
- **Custom rules**: Context-specific messages

### **Error Context**

```javascript
ctx.addIssue({
  code: z.ZodIssueCode.custom,
  message: 'Invalid ZIP code for military address',
  path: ['postalCode'],
  params: {
    expectedFormat: '96xxx',
    actualValue: data.postalCode,
  },
});
```

## Usage Examples

### **Simple Schema Usage**

```javascript
import { personalInfoSchema } from '@bio-aquia/shared/schemas';

const validatePersonalInfo = data => {
  return personalInfoSchema.parse(data);
};
```

### **Composed Schema Usage**

```javascript
import {
  personalInfoSchema,
  addressSchema,
  contactSchema,
} from '@bio-aquia/shared/schemas';

const completeProfileSchema = z.object({
  personalInfo: personalInfoSchema,
  mailingAddress: addressSchema,
  contactInfo: contactSchema,
});
```

### **Form-Specific Extension**

```javascript
// In 2008-burial-flags-21/schemas/
import { personalInfoSchema } from '@bio-aquia/shared/schemas';

export const applicantInfoSchema = personalInfoSchema.extend({
  relationshipToVeteran: z.enum(['spouse', 'child', 'parent', 'other']),
  certificateRequested: z.boolean().default(false),
});
```
