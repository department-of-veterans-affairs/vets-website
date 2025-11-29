# Web Component Validators

## Purpose

This directory contains **temporary** implementations of validation functions that should be exported from `@department-of-veterans-affairs/component-library`.

These validators ensure consistent error messages between:
1. Component blur validation (when user leaves a field)
2. Form submit validation (when RJSF validates the form)

## Why This Approach?

Web components (va-date, va-memorable-date) use asynchronous validation via shadow DOM, which cannot integrate directly with RJSF's synchronous validation. The solution is to extract validation logic as pure JavaScript functions that both the component-library and vets-website can use.

## What Component-Library Must Export

Component-library should export these functions from a new module:

```javascript
// @department-of-veterans-affairs/component-library/validators

export function validateMemorableDate(month, day, year, options = {}) {
  // Returns { error: string, message: string } or null
  // See dateValidators.js for full implementation
}

export function validateDate(month, day, year, options = {}) {
  // Returns { error: string, message: string } or null
  // See dateValidators.js for full implementation
}
```

## Usage in vets-website

Once component-library exports these functions:

1. Update import in `validation.js`:
```javascript
import { validateDate, validateMemorableDate } from '@department-of-veterans-affairs/component-library/validators';
```

2. Delete this `web-component-validators` directory

## Current Status

⚠️ **Temporary implementation** - These files should be deleted once component-library exports the validation functions.
