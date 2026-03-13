# Eval 1: Greenfield - WITHOUT SKILL

## Prompt
I need to add the prefill pattern to the new-chapter-36-form app at src/applications/new-chapter-36-form. It already has prefillEnabled: true but nothing else. Can you implement the full prefill pattern?

## Agent Output (Dry Run)

### Current State Analysis

**Already In Place:**
- `prefillEnabled: true` already set
- `SaveInProgressIntro` with `prefillEnabled` prop wired correctly
- Test mock files already in place
- Form structure has veteranServiceMemberInfoChapter with 3 pages

**Missing:**
- `prefillTransformer` not registered
- Prefill pages (`profilePersonalInfoPage`, `profileContactInfoPages`) NOT yet added
- Route protection doesn't check for prefill data
- Mock data needs update for SSN/VA file number

### Changes

#### 1. Create prefill-transformer.js

```javascript
export const prefillTransformer = (pages, formData, metadata) => {
  const veteranData = formData?.data?.attributes?.veteran || {};
  const { ssn, vaFileNumber, firstName, middleName, lastName, suffix } = veteranData;

  return {
    metadata,
    formData: {
      ssn,
      vaFileNumber,
      fullName: { first: firstName, middle: middleName, last: lastName, suffix },
      ...formData,
    },
    pages,
  };
};
export default prefillTransformer;
```

#### 2. Update config/form.js

- Add imports for `profilePersonalInfoPage`, `profileContactInfoPages`
- Add import for `prefillTransformer`
- Register `prefillTransformer` in formConfig
- Replace chapter with prefill pages + existing pages:
  - `...profilePersonalInfoPage({...})`
  - `...profileContactInfoPages({...})`
  - Keep claimantAddressPage and veteranAddressPage
- Remove veteranServiceMemberInfoPage import (replaced by prefill)

#### 3. Add Route Protection to App.jsx

- Add Redux `connect` with mapStateToProps
- Import `environment` and `manifest`
- Add route protection checking `isLoggedIn` and `formData?.ssn`
- Redirect to `manifest.rootUrl` if unauthorized
- Skip on localhost

#### 4. Update Mock Data

- Update sip-get.json with full veteran data under `data.attributes.veteran`
- Add `ssn`, `vaFileNumber`, `firstName`, `middleName`, `lastName`, `suffix`
- Update `returnUrl` to `/personal-information`

### Optional Changes
- Rename constants for semantic clarity (optional)

### Backend Note
Backend changes described but NOT in scope (vets-api not in workspace).
