# Eval 1: Greenfield - WITH SKILL

## Prompt
I need to add the prefill pattern to the new-chapter-36-form app at src/applications/new-chapter-36-form. It already has prefillEnabled: true but nothing else. Can you implement the full prefill pattern?

## Agent Output (Dry Run)

### Current State Analysis

**Already In Place:**
- `prefillEnabled: true` is set in form.js
- `SaveInProgressIntro` component is correctly wired with `prefillEnabled` prop in IntroductionPage.jsx
- Mock fixtures exist in `tests/fixtures/mocks/`
- Form ID is correctly referenced in local-mock-responses.js as `27-8832`

**Missing / Needs Updates:**
1. No `prefill-transformer.js` file
2. No prefill pages (`profilePersonalInfoPage`, `profileContactInfoPages`) in chapters
3. No route protection in `App.jsx`
4. Mock sip-get.json missing `ssn` and `vaFileNumber`

### File-by-File Implementation Plan

#### 1. CREATE: `src/applications/new-chapter-36-form/config/prefill-transformer.js`

```javascript
export default function prefillTransformer(pages, formData, metadata) {
  const {
    ssn,
    vaFileNumber,
    firstName,
    middleName,
    lastName,
    suffix,
    dateOfBirth,
  } = formData?.data?.attributes?.veteran || {};

  return {
    pages,
    formData: {
      ssn,
      vaFileNumber,
      fullName: {
        first: firstName,
        middle: middleName,
        last: lastName,
        suffix,
      },
      dateOfBirth,
      ...formData,
    },
    metadata,
  };
}
```

#### 2. MODIFY: `src/applications/new-chapter-36-form/config/form.js`

- Add imports for `profilePersonalInfoPage`, `profileContactInfoPages` from `platform/forms-system/src/js/patterns/prefill`
- Add import for `prefillTransformer`
- Register `prefillTransformer` in formConfig
- Add new `veteranInfoChapter` with prefill pages before existing chapter:
  - `...profilePersonalInfoPage({...})` with personalInfoConfig for name, ssn, vaFileNumber, dateOfBirth
  - `...profileContactInfoPages({...})` with included: mailingAddress, email, homePhone, mobilePhone
- Keep existing `veteranServiceMemberInfoChapter` pages unchanged

#### 3. MODIFY: `src/applications/new-chapter-36-form/containers/App.jsx`

- Add Redux `connect`
- Add `environment` import
- Add `manifest` import
- Add route protection: check `isLoggedIn` and `formData?.ssn`
- Redirect to `manifest.rootUrl` if not on intro page and missing login/prefill data
- Skip protection on localhost

#### 4. MODIFY: Mock data files

- Update `sip-get.json` to include `ssn`, `vaFileNumber` in `data.attributes.veteran` structure
- Update `returnUrl` to `/personal-information`

### Summary Table

| Component | Status | Action |
|-----------|--------|--------|
| prefillEnabled in formConfig | ✓ Exists | No change |
| SaveInProgressIntro wired | ✓ Exists | No change |
| prefillTransformer | ✗ Missing | CREATE |
| Prefill pages | ✗ Missing | MODIFY form.js |
| Route protection | ✗ Missing | MODIFY App.jsx |
| Mock prefill data | ⚠ Incomplete | MODIFY sip-get.json |

### Backend Note
Backend steps (vets-api) described but NOT implemented since vets-api is not in workspace.
