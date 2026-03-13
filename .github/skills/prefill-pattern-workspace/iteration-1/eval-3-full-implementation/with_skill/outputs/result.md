# Eval 3: Full Implementation (burials-ez) - WITH SKILL

## Prompt
I need to implement prefill for the burials-ez form at src/applications/burials-ez (form ID 21P-530EZ). Please implement the frontend prefill pattern and then show me what backend vets-api changes are needed.

## Agent Output (Dry Run)

### Current State Analysis

**Already in Place:**
- `prefillEnabled: true` ✓ (already set in form.js)
- `SaveInProgressIntro` ✓ (already used in IntroductionPage.jsx with `prefillEnabled` prop)
- Route protection ⚠️ (basic login check exists, but doesn't validate prefill data)

**Missing/Incomplete:**
- No prefillTransformer
- No profilePersonalInfoPage/profileContactInfoPages imported or used
- Route protection doesn't check for save-in-progress prefill data
- No mock prefill fixtures for testing

### FRONTEND Changes

#### 1. CREATE: `config/prefillTransformer.js`

```javascript
export const prefillTransformer = (pages, formData, metadata) => {
  const veteranData = formData?.veteran || {};
  const claimantData = formData?.claimant || {};
  const contactInfo = formData?.contactInformation || {};

  return {
    metadata,
    pages,
    formData: {
      veteranFullName: { first: veteranData?.firstName, ... },
      veteranSocialSecurityNumber: veteranData?.ssn,
      veteranVaFileNumber: veteranData?.vaFileNumber,
      veteranDateOfBirth: veteranData?.dateOfBirth,
      claimantFullName: { first: claimantData?.firstName, ... },
      claimantSocialSecurityNumber: claimantData?.ssn,
      claimantEmail: contactInfo?.email,
      claimantPhone: contactInfo?.primaryPhone,
      claimantAddress: { street: contactInfo?.address?.street, ... },
    },
  };
};
```

#### 2. UPDATE: `config/form.js`

- Import `profilePersonalInfoPage`, `profileContactInfoPages` from prefill pattern
- Import `prefillTransformer`
- Register `prefillTransformer` in formConfig
- Update `claimantInformation` chapter:
  - Add `...profilePersonalInfoPage({...})` with dataAdapter for SSN path
  - Add `...profileContactInfoPages({...})` for contact info
  - Keep existing `relationshipToVeteran` page

#### 3. UPDATE: `BurialsApp.jsx`

Add route protection:
- Check `formData?.claimantFullName?.first` for prefill data
- Redirect to `manifest.rootUrl` if logged in but no prefill data
- Skip on localhost

#### 4. CREATE: Mock test fixtures

- Create `sip-get.json` with veteran, claimant, and contactInformation data
- Update `local-mock-responses.js` with GET endpoint for `21P-530EZ`

### BACKEND Changes (vets-api) - DESCRIBED ONLY

#### 1. Update `app/models/form_profile.rb`
- Add `'21P-530EZ'` to `ALL_FORMS` hash under `burials` key
- Add `'21P-530EZ' => ::FormProfiles::VA21P530EZ` to `FORM_ID_TO_CLASS` hash

#### 2. Create `app/models/form_profiles/va_21p_530ez.rb`
```ruby
class FormProfiles::VA21P530EZ < FormProfile
  def metadata
    { version: 0, prefill: true, returnUrl: '/claimant-personal-information' }
  end
end
```

#### 3. Create `config/form_profile_mappings/21P-530EZ.yml`
- Map veteran fields: firstName, middleName, lastName, suffix, ssn, dateOfBirth, vaFileNumber
- Map claimant fields from identity_information
- Map contactInformation from contact_information

#### 4. Update settings files
- `config/settings.yml` - Add `burials: prefill: true`
- `config/settings/development.yml` - Same
- `config/settings/test.yml` - Same

#### 5. Add tests to `spec/models/form_profile_spec.rb`
- Add expected data hash for `21P-530EZ`
- Add form to the prefilled forms test list

### Key Notes
- Did NOT attempt to create/modify files outside vets-website workspace
- vaFileNumber is optional
- SSN uses dataAdapter with `ssnPath` for non-standard location
- Backend steps described but not executed (vets-api not in workspace)
