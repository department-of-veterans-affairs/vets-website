# Eval 3: Full Implementation (burials-ez) - WITHOUT SKILL

## Prompt
I need to implement prefill for the burials-ez form at src/applications/burials-ez (form ID 21P-530EZ). Please implement the frontend prefill pattern and then show me what backend vets-api changes are needed.

## Agent Output (Dry Run)

### Current State Analysis

**Already in Place:**
- `prefillEnabled: true` ✓
- `SaveInProgressIntro` ✓ with `prefillEnabled` prop
- Route protection ⚠️ (basic login check, doesn't validate prefill data)
- Form structure with "Your Information" and "Deceased Veteran information" chapters

**Missing/Incomplete:**
- No prefillTransformer
- No profilePersonalInfoPage/profileContactInfoPages
- Route protection doesn't check for SIP data
- No mock prefill fixtures

### FRONTEND Changes

#### 1. CREATE: `config/prefillTransformer.js`

```javascript
export const prefillTransformer = (pages, formData, metadata) => {
  const veteranData = formData?.data?.attributes?.veteran || {};
  const contactInfoData = formData?.data?.attributes?.claimantContactInfo || {};

  return {
    metadata,
    formData: {
      ssn: veteranData.ssn,
      vaFileNumber: veteranData.vaFileNumber,
      fullName: { first: veteranData.firstName, ... },
      dateOfBirth: veteranData.dateOfBirth,
      mailingAddress: contactInfoData.mailingAddress,
      email: contactInfoData.email,
      homePhone: contactInfoData.homePhone,
      mobilePhone: contactInfoData.mobilePhone,
    },
    pages,
  };
};
```

#### 2. UPDATE: `config/form.js`

- Import prefill components and prefillTransformer
- Register prefillTransformer
- Add `...profilePersonalInfoPage({...})` to veteranInformation chapter
- Add `...profileContactInfoPages({...})`
- Keep existing burial-specific pages unchanged

#### 3. UPDATE: `BurialsApp.jsx`

Add route protection:
- Import `environment`
- Check `formData?.ssn` or `formData?.fullName?.first`
- Redirect to `manifest.rootUrl` if logged in but no prefill data
- Skip on localhost

#### 4. CREATE: Mock fixtures

- `sip-get.json` with veteran data under `data.attributes.veteran`
- Update `local-mock-responses.js`

### BACKEND Changes (vets-api)

#### 1. Update `app/models/form_profile.rb`
- Add `'21P-530EZ'` to ALL_FORMS
- Add to FORM_ID_TO_CLASS hash

#### 2. Create `app/models/form_profiles/va_21p_530ez.rb`
- FormProfile class with metadata

#### 3. Create `config/form_profile_mappings/21P-530EZ.yml`
- Map veteran fields
- Map contact information

#### 4. Update settings files
- settings.yml, development.yml, test.yml

#### 5. Add tests

### Testing Plan
- Start mock API, then yarn watch with burials-ez entry
- Verify prefilled data displays on personal info page
- Verify contact info pages work
- Test route protection

### Key Notes
- vaFileNumber is optional
- Backend described but not implemented (vets-api not in workspace)
- Existing form pages preserved
