# Utility Functions

This directory contains shared utility functions for VA Form 21-2680.

## Structure

The utility functions are organized by functionality:

### `nameHelpers.js`

Functions for retrieving and formatting names from form data:

- `getClaimantName(formData, fallback)` - Gets claimant's name with optional fallback
- `getVeteranName(formData, fallback)` - Gets veteran's name with optional fallback
- `getPersonName(formData, options)` - Gets appropriate person's name based on relationship

### `relationshipHelpers.js`

Functions for determining claimant relationships:

- `isClaimantVeteran(formData)` - Checks if claimant is the veteran
- `getClaimantRelationship(formData)` - Gets relationship type (veteran, spouse, child, parent)

### `dynamicTitleHelpers.js`

Functions for building dynamic page titles:

- `getHospitalizationStatusTitle(formData)` - Title for hospitalization status page
- `getHospitalizationDateTitle(formData)` - Title for admission date page
- `getHospitalizationFacilityTitle(formData)` - Title for hospital facility page

## Usage

Import from the utils directory:

```javascript
import { getClaimantName, isClaimantVeteran } from '../utils';
```

Or import from specific files:

```javascript
import { getClaimantName } from '../utils/nameHelpers';
import { isClaimantVeteran } from '../utils/relationshipHelpers';
```

## Testing

Each utility module has corresponding unit tests in `/tests/utils/`:

- `nameHelpers.unit.spec.js`
- `relationshipHelpers.unit.spec.js`
- `dynamicTitleHelpers.unit.spec.js`

Run tests with:

```bash
yarn test:unit src/applications/benefits-optimization-aquia/21-2680-house-bound-status/tests/utils/
```
