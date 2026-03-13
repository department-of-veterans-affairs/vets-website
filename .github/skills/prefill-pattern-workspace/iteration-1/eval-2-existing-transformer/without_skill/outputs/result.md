# Eval 2: Existing Transformer (995) - WITHOUT SKILL

## Prompt
The Supplemental Claim form at src/applications/appeals/995 already has a prefillTransformer but I want to add the profilePersonalInfoPage and profileContactInfoPages from the prefill pattern. Can you set it up?

## Agent Output (Dry Run)

### Current State Analysis

- ✅ `prefillEnabled: true` already set
- ✅ `prefillTransformer` registered, extracts SSN and VA file number
- ❌ `profilePersonalInfoPage` and `profileContactInfoPages` NOT added
- ⚠️ Route protection exists but doesn't validate prefill data

### Changes

#### 1. Update prefill-transformer.js

Replace the existing transformer to extract full fields:

```javascript
export default function prefillTransformer(pages, formData, metadata) {
  const { ssn, vaFileNumber, firstName, middleName, lastName, suffix }
    = formData?.data?.attributes?.veteran || {};

  return {
    pages,
    formData: {
      ssn,
      vaFileNumber,
      fullName: { first: firstName, middle: middleName, last: lastName, suffix },
      ...(formData?.data?.attributes || {}),
    },
    metadata,
  };
}
```

#### 2. Update config/form.js

- Add imports for `profilePersonalInfoPage`, `profileContactInfoPages`
- Replace veteranInfo page with spread `...profilePersonalInfoPage({...})`
- Replace contactInfo spread with `...profileContactInfoPages({...})`
- Keep housingRisk, livingSituation, etc. unchanged

#### 3. Update App.jsx

Add route protection checking for `formData.ssn` or `formData.fullName.first`:

```javascript
const isIntroPage = pathname === '/introduction';
const isStartPage = pathname.includes('/start');
const hasPrefillData = formData?.ssn || formData?.fullName?.first;

if (!environment.isLocalhost() && !isIntroPage && !isStartPage &&
    (!loggedIn || (loggedIn && !hasPrefillData))) {
  document.location.replace(manifest.rootUrl);
  return wrapInH1(<va-loading-indicator ... />);
}
```

#### 4. Update prefill.json

Replace with full veteran data structure including full SSN, name fields. Update returnUrl to `/personal-information`.

#### 5. Optional: local-mock-responses.js

Create/update to ensure mock API routes map correctly.

### Key Considerations
- Existing pages (housingRisk, livingSituation, etc.) remain unchanged
- Submission logic stays the same
- Follows pattern from mock-form-prefill reference implementation
