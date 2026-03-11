---
name: prefill-pattern
description: Implement the VA.gov Prefill Pattern in a vets-website form application — adding prefilled personal and contact information cards using `profilePersonalInfoPage` and `profileContactInfoPages`. Use this skill whenever a user wants to add prefill to a VA.gov form, integrate prefilled veteran information, set up save-in-progress prefill, add personal info or contact info cards, configure a prefillTransformer, or implement the prefill pattern in either vets-website or vets-api. Also use when the user mentions profilePersonalInfoPage, profileContactInfoPages, prefillTransformer, form_profile.rb, or save-in-progress prefill data — even if they don't say "prefill pattern" explicitly.
---

# Prefill Pattern Implementation

This skill walks through implementing the VA.gov Prefill Pattern end-to-end: frontend work in vets-website and backend work in vets-api. The pattern displays user information (name, SSN, DOB, contact info) in prefilled read-only cards, pulling data from VA Profile and save-in-progress endpoints.

## Before You Begin — Clean Working State

Before making any changes, ask the user:

> Do you have any unstaged or uncommitted changes in your working directory? It's best to stage, commit, or stash your current changes before we start, so that the prefill changes are cleanly separated and easy to review or revert.

Wait for the user to confirm they have a clean working state before proceeding. If they're unsure, suggest running `git status` to check. Do not proceed until they confirm.

## Gathering Context

Before writing any code, gather information about the target form:

1. **Identify the form** — Ask the user which form/application they want to add prefill to, or infer it from context. Find the app directory under `src/applications/`.
2. **Read the form's `formConfig`** — Usually in `config/form.js`. Look for existing `prefillEnabled`, `prefillTransformer`, chapters, and pages structure.
3. **Read the form's `App.jsx`** (or equivalent container) — Usually in `containers/App.jsx`. Check if route protection already exists.
4. **Read the form's introduction page** — Check if `SaveInProgressIntro` already has `prefillEnabled` wired up.
5. **Check for an existing `prefillTransformer`** — Many forms already have one. If it exists, you'll adapt it rather than create from scratch.
6. **Check mock data** — Look for existing `local-mock-responses.js` and save-in-progress fixtures in `tests/fixtures/mocks/`.

Understanding what already exists prevents duplicating work and breaking existing functionality.

## Phase 1: vets-website (Frontend)

Work through each step below. Many forms will already have some of these pieces in place — skip or adapt as needed based on what you found during context gathering.

### Step 1: Enable Prefill in formConfig

In the form's config file (usually `config/form.js`), ensure `prefillEnabled: true` is set in the `formConfig` object:

```js
const formConfig = {
  // ...
  prefillEnabled: true,
  // ...
};
```

If this is already present, move on.

### Step 2: Wire Up SaveInProgressIntro

In the introduction page component, ensure the `prefillEnabled` prop is passed to `SaveInProgressIntro`:

```js
<SaveInProgressIntro
  prefillEnabled={route.formConfig.prefillEnabled}
  messages={route.formConfig.savedFormMessages}
  formConfig={route.formConfig}
  pageList={route.pageList}
  downtime={route.formConfig.downtime}
  startText="Start your application"
  headingLevel={2}
/>
```

If the component already renders `SaveInProgressIntro` but is missing `prefillEnabled`, add it. If `SaveInProgressIntro` isn't used at all, add it to the introduction page.

### Step 3: Create or Update the Prefill Transformer

The `prefillTransformer` restructures raw backend data into the shape the form expects. It must return `ssn`, `vaFileNumber`, and `fullName` — either at the root of `formData` (preferred) or nested (requires a `dataAdapter` on the Personal Information component).

If the form already has a `prefillTransformer`, update it to include `ssn`, `vaFileNumber`, and `fullName` in its output. Preserve any other fields it already transforms.

If no transformer exists, create one. Here is a straightforward example:

```js
export const prefillTransformer = (pages, formData, metadata) => {
  const { ssn, vaFileNumber, firstName, middleName, lastName, suffix } =
    formData?.data?.attributes?.veteran || {};

  return {
    metadata,
    formData: {
      ssn,
      vaFileNumber,
      fullName: {
        first: firstName,
        middle: middleName,
        last: lastName,
        suffix,
      },
    },
    pages,
  };
};
```

The transformer receives three arguments from the save-in-progress response:
- `pages` — the form's page definitions
- `formData` — the raw prefill data from the backend (nested under `data.attributes`)
- `metadata` — version info, prefill flag, and returnUrl

It must return an object with those same three keys. The `formData` you return becomes the form's initial data.

**Important:** `vaFileNumber` is optional — not all users have one and the backend may not provide it. The transformer should still include it (it will just be `undefined`).

Then register it in `formConfig`:

```js
import { prefillTransformer } from './prefill-transformer';

const formConfig = {
  // ...
  prefillTransformer,
  // ...
};
```

### Step 4: Import and Add Prefill Pages

Add the prefill page generators to a chapter in `formConfig`. These go in the `pages` object of the appropriate chapter (typically "Veteran information" or similar):

```js
import {
  profilePersonalInfoPage,
  profileContactInfoPages,
} from 'platform/forms-system/src/js/patterns/prefill';

const formConfig = {
  chapters: {
    contactInfo: {
      title: 'Veteran information',
      pages: {
        // Personal info page (name, SSN, DOB, etc.)
        ...profilePersonalInfoPage(),

        // Contact info pages (email, phone, address)
        ...profileContactInfoPages(),
      },
    },
  },
};
```

If the form already has a chapter for veteran/personal information, add the prefill pages there. If the form had manual fields for name, SSN, DOB, or contact info, the prefill pages replace them — remove the old manual page definitions.

#### Customizing Personal Information

`profilePersonalInfoPage()` accepts an options object for customization:

```js
...profilePersonalInfoPage({
  key: 'personalInfoPage',
  title: 'Personal Information',
  path: 'personal-information',
  personalInfoConfig: {
    name: { show: true, required: true },
    ssn: { show: true, required: false },
    vaFileNumber: { show: true, required: false },
    dateOfBirth: { show: true, required: true },
    sex: { show: false, required: false },
  },
  header: <h3>Review your personal information</h3>,
  note: <p>If you need to update your information, call us at 800-827-1000.</p>,
  background: true,
  depends: formData => formData.applicantType === 'veteran',
})
```

If the `prefillTransformer` places SSN or vaFileNumber in a nested structure (e.g., `formData.veteran.ssn`), use a `dataAdapter`:

```js
...profilePersonalInfoPage({
  dataAdapter: {
    ssnPath: 'veteran.ssn',
    vaFileNumberPath: 'veteran.vaFileNumber',
  },
})
```

Paths are relative to `formData` — do not include `formData` in the path.

#### Customizing Contact Information

`profileContactInfoPages()` accepts an options object:

```js
...profileContactInfoPages({
  contactInfoPageKey: 'confirmContactInfo',
  contactPath: 'veteran-information',
  included: ['mailingAddress', 'email', 'homePhone', 'mobilePhone'],
  contactInfoRequiredKeys: ['mailingAddress', 'email'],
  wrapperKey: 'veteran',
  prefillPatternEnabled: true,
})
```

### Step 5: Add Route Protection

Route protection ensures veterans follow the intended form flow and can't skip ahead via URL manipulation. It also handles page refreshes by redirecting to the introduction page (since Redux state is cleared on refresh).

In the form's `App.jsx` (or equivalent container component), add a check that redirects users who aren't logged in or lack save-in-progress data:

```js
import React from 'react';
import { connect } from 'react-redux';
import RoutedSavableApp from 'platform/forms/save-in-progress/RoutedSavableApp';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';
import formConfig from '../config/form';

function App({ location, children, isLoggedIn, formData }) {
  const isIntroPage = location.pathname === '/introduction';
  const noSaveInProgressData = !formData?.ssn;

  if (
    !environment.isLocalhost() &&
    !isIntroPage &&
    (!isLoggedIn || (isLoggedIn && noSaveInProgressData))
  ) {
    document.location.replace(manifest.rootUrl);
    return (
      <va-loading-indicator message="Redirecting to introduction page..." />
    );
  }
  return (
    <RoutedSavableApp formConfig={formConfig} currentLocation={location}>
      {children}
    </RoutedSavableApp>
  );
}

const mapStateToProps = state => ({
  isLoggedIn: state.user?.login?.currentlyLoggedIn,
  formData: state.form?.data || {},
});

export default connect(mapStateToProps)(App);
```

If `App.jsx` already has a basic `RoutedSavableApp` wrapper, add the route protection logic around it. If it already has route protection, verify it checks for save-in-progress data (not just login status).

### Step 6: Set Up Local Testing

Create mock data files so the form can be tested locally without a running vets-api.

**Create `tests/fixtures/mocks/sip-get.json`** with your form's prefill data structure:

```json
{
  "formData": {
    "data": {
      "attributes": {
        "veteran": {
          "ssn": "123456789",
          "vaFileNumber": "987654321",
          "firstName": "John",
          "middleName": "A",
          "lastName": "Veteran",
          "suffix": "Jr."
        }
      }
    }
  },
  "metadata": {
    "version": 0,
    "prefill": true,
    "returnUrl": "/personal-information"
  }
}
```

Adjust the `returnUrl` to match the path of the first prefilled page in the form. Adjust the data structure to match what the form's backend prefill endpoint actually returns.

**Create or update `tests/fixtures/mocks/local-mock-responses.js`**:

```js
const mockSipGet = require('./sip-get.json');

const responses = {
  'GET /v0/in_progress_forms/{YOUR_FORM_ID}': mockSipGet,
};

module.exports = responses;
```

Replace `{YOUR_FORM_ID}` with the form's actual ID (e.g., `21-526EZ`).

**To test locally**, run:
```bash
yarn mock-api --responses src/applications/your-app/tests/fixtures/mocks/local-mock-responses.js
```

For a complete reference implementation, see `src/applications/simple-forms/mock-form-prefill/`.

### Frontend Complete

Once all steps are done, tell the user:

> The frontend (vets-website) prefill implementation is complete. The form now has:
> - Prefill enabled in formConfig
> - A prefillTransformer that extracts SSN, VA file number, and full name
> - Personal Information and Contact Information prefill pages
> - Route protection in App.jsx
> - Mock data for local testing
>
> Would you like to proceed with the backend (vets-api) setup? This involves configuring the API to actually send prefill data for this form. If you work in a separate vets-api repository, you'll want to switch to that workspace.

Wait for the user to respond before continuing to Phase 2.

---

## Phase 2: vets-api (Backend)

Before starting backend work, ask the user again about their working state:

> Before we make changes to vets-api, do you have any unstaged or uncommitted changes? It's best to start with a clean working state so these backend changes are isolated.

Wait for confirmation before proceeding.

The backend steps configure vets-api to provide prefill data for the form. For a working example, see [PR #5391 (Pre-fill CH31)](https://github.com/department-of-veterans-affairs/vets-api/pull/5391/files).

### Step 1: Add Form to form_profile.rb

In `app/models/form_profile.rb`, register the form in two places.

**Add to the `ALL_FORMS` hash** under the appropriate category:

```ruby
ALL_FORMS = {
  # ...
  your_app_name: ['YOUR-FORM-ID'],
  # ...
}.freeze
```

**Add to the `FORM_ID_TO_CLASS` hash**, mapping the form ID to its FormProfile class:

```ruby
FORM_ID_TO_CLASS = {
  # ...
  'YOUR-FORM-ID' => ::FormProfiles::VAYOURFORMID,
  # ...
}.freeze
```

The class name follows a convention: `VA` + form ID with hyphens removed and letters capitalized. For example, form `28-1900` becomes `VA281900`.

### Step 2: Create a FormProfile Class

Create a new file at `app/models/form_profiles/va_your_form.rb`:

```ruby
# frozen_string_literal: true

class FormProfiles::VAYOURFORMID < FormProfile
  def metadata
    {
      version: 0,
      prefill: true,
      returnUrl: '/personal-information'
    }
  end
end
```

The `returnUrl` must match the path of the first prefilled page in the frontend form — this is where the user lands after the introduction page.

### Step 3: Create a Form Profile Mapping

Create a YAML file at `config/form_profile_mappings/YOUR-FORM-ID.yml` that maps form fields to backend data sources:

```yaml
veteranInformation:
  fullName: [identity_information, full_name]
  ssn: [identity_information, ssn]
  dob: [identity_information, date_of_birth]
veteranAddress: [contact_information, address]
mainPhone: [contact_information, us_phone]
cellPhone: [contact_information, mobile_phone]
email: [contact_information, email]
```

The left side defines the keys in the prefill response sent to the frontend. The right side maps each key to an internal data source — `identity_information` provides personal details and `contact_information` provides address/phone/email.

### Step 4: Add Prefill Settings

Enable prefill for the app in three configuration files:

**`config/settings.yml`:**
```yaml
your_app_name:
  prefill: true
```

**`config/settings/development.yml`:**
```yaml
your_app_name:
  prefill: true
```

**`config/settings/test.yml`:**
```yaml
your_app_name:
  prefill: true
```

The `your_app_name` key should match the category name used in the `ALL_FORMS` hash from Step 1.

### Step 5: Add Tests

In `spec/models/form_profile_spec.rb`, add two things.

**Define expected prefill data** for the form:

```ruby
let(:your_form_expected) do
  {
    'veteranInformation' => {
      'fullName' => {
        'first' => user.first_name&.capitalize,
        'last' => user.last_name&.capitalize,
        'suffix' => user.suffix
      },
      'ssn' => '796111863',
      'dob' => '1809-02-12'
    },
    'veteranAddress' => {
      'street' => street_check[:street],
      'street2' => street_check[:street2],
      'city' => user.address[:city],
      'state' => user.address[:state],
      'country' => user.address[:country],
      'postal_code' => user.address[:zip][0..4]
    },
    'mainPhone' => us_phone,
    'email' => user.pciu_email
  }
end
```

The expected data structure must match the mapping YAML from Step 3.

**Add the form ID to the `returns prefilled` test list:**

```ruby
%w[
  22-1990
  22-1990N
  # ...existing form IDs...
  YOUR-FORM-ID
].each do |form_id|
  it "returns prefilled #{form_id}" do
    expect_prefilled(form_id)
  end
end
```

### Backend Complete

Once all backend steps are done, summarize what was created:

> The backend (vets-api) prefill configuration is complete:
> - Form registered in `form_profile.rb` (ALL_FORMS + FORM_ID_TO_CLASS)
> - FormProfile class created with metadata
> - Form profile mapping YAML created
> - Prefill enabled in settings, development, and test configs
> - Test expectations added to form_profile_spec.rb

## Reference Implementation

The `mock-form-prefill` app at `src/applications/simple-forms/mock-form-prefill/` is a complete working reference. When in doubt about any implementation detail, read the relevant files from that app:
- `config/form.js` — formConfig with prefill enabled
- `config/prefill-transformer.js` — simple prefillTransformer
- `containers/App.jsx` — route protection
- `containers/IntroductionPage.jsx` — SaveInProgressIntro usage
- `tests/fixtures/mocks/` — mock data for local testing
