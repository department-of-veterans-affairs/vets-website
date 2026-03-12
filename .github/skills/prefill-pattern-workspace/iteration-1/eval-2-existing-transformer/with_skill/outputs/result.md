# Eval 2: Existing Transformer (995) - WITH SKILL

## Prompt
The Supplemental Claim form at src/applications/appeals/995 already has a prefillTransformer but I want to add the profilePersonalInfoPage and profileContactInfoPages from the prefill pattern. Can you set it up?

## Agent Output (Dry Run)

### Current State Analysis

- ✅ `prefillEnabled: true` already set
- ✅ `prefillTransformer` registered but only extracts SSN and VA file last four
- ✅ `IntroductionPage` exists
- ✅ Mock data exists but minimal
- ❌ `profilePersonalInfoPage` and `profileContactInfoPages` NOT yet added
- ⚠️ Route protection exists but doesn't check for prefill data
- ⚠️ Current `veteranInfo` is just a description, not prefill pages

### Changes

#### 1. Update prefill-transformer.js

Replace the transformer to extract FULL SSN, vaFileNumber, and fullName (not just last 4):

```javascript
export default function prefillTransformer(pages, formData, metadata) {
  const { ssn, vaFileNumber, firstName, middleName, lastName, suffix, dateOfBirth }
    = formData?.data?.attributes?.veteran || {};

  return {
    pages,
    formData: {
      ssn,
      vaFileNumber,
      fullName: { first: firstName, middle: middleName, last: lastName, suffix },
      dateOfBirth,
    },
    metadata,
  };
}
```

#### 2. Update config/form.js

- Add imports for `profilePersonalInfoPage`, `profileContactInfoPages` from prefill pattern
- Replace `veteranInfo` page and `...contactInfo` spread with:
  - `...profilePersonalInfoPage({...})` - personal info card
  - `...profileContactInfoPages({...})` - contact info pages
- Keep remaining pages (housingRisk, livingSituation, etc.) unchanged
- Remove old `veteranInfo` and `contactInfo` imports

#### 3. Update App.jsx Route Protection

Add route protection checking for `formData.ssn` in addition to existing login check:

```javascript
const isIntroPage = pathname === '/introduction';
const isStartPage = pathname === '/start';
const noSaveInProgressData = !formData?.ssn;

if (!environment.isLocalhost() && !isIntroPage && !isStartPage &&
    (!loggedIn || (loggedIn && noSaveInProgressData))) {
  document.location.replace(manifest.rootUrl);
  return wrapInH1(<va-loading-indicator message="Redirecting..." />);
}
```

#### 4. Update prefill.json Mock

Replace with full veteran data structure (full SSN, name fields) instead of just last 4 digits. Update `returnUrl` to `/personal-information`.

### Summary

| File | Change | Impact |
|------|--------|--------|
| prefill-transformer.js | Extract full data, not last-4 only | CRITICAL |
| form.js | Replace veteran/contact pages with prefill pages | CRITICAL |
| App.jsx | Add prefill data route protection | IMPORTANT |
| prefill.json | Full data structure | IMPORTANT |
| IntroductionPage.jsx | None needed | Already correct |
