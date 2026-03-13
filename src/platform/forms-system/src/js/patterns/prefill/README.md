# Prefill Pattern

## Overview

The prefill pattern provides reusable components for VA.gov forms to display cards prefilled with user information.

Prefill data comes from two backend sources:
- **`/v0/user`** - User profile data from VA Profile (name, date of birth, contact info, etc.)
- **`/v0/in_progress_forms/{form-id}`** - Form-specific prefill data that cannot be obtained from the user profile, such as SSN and VA file number

## Table of Contents

- [vets-website (Frontend)](#vets-website-frontend)
  - [Enable Prefill in formConfig](#enable-prefill-in-formconfig)
  - [Pass prefillEnabled to SaveInProgressIntro](#pass-prefillenabled-to-saveinprogressintro)
  - [Create a Prefill Transformer](#create-a-prefill-transformer)
  - [Import and Add Prefill Pages](#import-and-add-prefill-pages)
  - [Add Route Protection](#add-route-protection)
  - [Set Up Local Testing](#set-up-local-testing)
  - [Components](#components)
    - [Personal Information](#personal-information)
    - [Contact Information](#contact-information)
- [vets-api (Backend)](#vets-api-backend)
  - [Add Form to form_profile.rb](#add-form-to-form_profilerb)
  - [Create a FormProfile Class](#create-a-formprofile-class)
  - [Create a Form Profile Mapping](#create-a-form-profile-mapping)
  - [Add Prefill Settings](#add-prefill-settings)
  - [Add Tests](#add-tests)

---

## vets-website (Frontend)

### Enable Prefill in formConfig

In your form's config file (usually `src/applications/<your-app>/config/form.js`), add `prefillEnabled: true` to the `formConfig` object:

```js
const formConfig = {
  // ...
  prefillEnabled: true,
  // ...
};
```

### Pass prefillEnabled to SaveInProgressIntro

In your introduction page, pass the `prefillEnabled` prop to the `SaveInProgressIntro` component so that prefill is activated when the user starts the form:

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

### Create a Prefill Transformer

A `prefillTransformer` takes pre-filled form data from the backend, restructures it, and returns the new object for the form to use. Add it to your `formConfig`:

```js
const formConfig = {
  // ...
  prefillTransformer,
  // ...
};
```

Your `prefillTransformer` must return `ssn`, `vaFileNumber`, and `fullName`. Personal Information gets `ssn` and `vaFileNumber` from the `save-in-progress` endpoint, and `fullName` is required for form submission. It is helpful if you make these properties direct children of `formData`, but if you nest them further you must provide a `dataAdapter` to the Personal Information component. More details in the [Personal Information](#personal-information) section below.

Here is a simple example from the [mock-form-prefill](../../../../../applications/simple-forms/mock-form-prefill):

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

The transformer receives `pages`, `formData`, and `metadata` from the save-in-progress response, and must return an object with those same three keys. The `formData` you return becomes the form's initial data.

### Import and Add Prefill Pages

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

### Add Route Protection

Configure route protection to ensure veterans follow the intended form flow and cannot manually navigate to future steps via URL. This also handles page refreshes by redirecting to the beginning of the form.

Without route protection, users can:
- Navigate to future form steps via URL manipulation
- Lose prefilled data on page refresh (Redux state is cleared)
- Bypass required authentication checks

The example below is from the mock-form-prefill's [App.jsx](../../../../../applications/simple-forms/mock-form-prefill/containers/App.jsx):

```js
import React from 'react';
import { connect } from 'react-redux';
import environment from 'platform/utilities/environment';
import manifest from '../manifest.json';

function App({ location, children, isLoggedIn, formData }) {
  const isIntroPage = location.pathname === '/introduction';
  const noSaveInProgressData = !formData?.ssn;

  // Redirect to introduction page if not logged in or no ssn on higher envs
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

const mapStateToProps = state => {
  return {
    isLoggedIn: state.user?.login?.currentlyLoggedIn,
    formData: state.form?.data || {},
  };
};

export default connect(mapStateToProps)(App);
```

### Set Up Local Testing

To test prefill locally, create a `local-mock-responses.js` file to mock the in-progress forms endpoint:

```js
// tests/fixtures/mocks/local-mock-responses.js
const mockSipGet = require('./sip-get.json');

const responses = {
  'GET /v0/in_progress_forms/{YOUR_FORM_ID}': mockSipGet,
  // ... other endpoints
};

module.exports = responses;
```

Create a corresponding `sip-get.json` file with your form's prefill data structure:

```json
{
  "formData": {
    "data": {
      "attributes": {
        "veteran": {
          "ssn": "123456789",
          "vaFileNumber": "987654321"
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

Run the mock API server:
```bash
yarn mock-api --responses src/applications/your-app/tests/fixtures/mocks/local-mock-responses.js
```

See the [mock-form-prefill example](../../../../../../applications/simple-forms/mock-form-prefill/tests/fixtures/mocks/local-mock-responses.js) for a complete reference implementation.

### Components

#### Personal Information
Displays user's personal information (name, SSN, VA file number, date of birth, sex) in a read-only card format. Expects `ssn` and `vaFileNumber` at the root of `formData`, which should be handled by your `prefillTransformer` or `dataAdapter`.

**Basic usage example:**
```js
...profilePersonalInfoPage()
```

**With customization example:**
```js
...profilePersonalInfoPage({
  // Page configuration
  key: 'personalInfoPage',
  title: 'Personal Information',
  path: 'personal-information',
  
  // Field visibility and validation
  personalInfoConfig: {
    name: { show: true, required: true },
    ssn: { show: true, required: false },
    vaFileNumber: { show: true, required: false },
    dateOfBirth: { show: true, required: true },
    sex: { show: false, required: false },
  },
  
  // Custom content
  header: <h3>Review your personal information</h3>,
  cardHeader: <h4>Personal details</h4>,
  note: <p>If you need to update your information, call us at 800-827-1000.</p>,
  footer: <p>We'll use this information to process your application.</p>,
  
  // Error handling
  errorMessage: "We're missing some of your personal information.",
  
  // Display options
  background: true,  // Show card with background color
  hideOnReview: false,  // Show on review page
  
  // Conditional display
  depends: formData => formData.applicantType === 'veteran',
})
```

**With data adapter (for nested data structures):**
If your prefill transformer places data in a nested structure (e.g., `formData.veteran.ssn`), use a `dataAdapter`:
```js
...profilePersonalInfoPage({
  dataAdapter: {
    ssnPath: 'veteran.ssn',
    vaFileNumberPath: 'veteran.vaFileNumber',
  },
})
```
Do not include `formData` in the path. Paths are relative to the `formData` object.

#### Contact Information
Displays and allows inline editing of contact information (email, phones, mailing address) with VA Profile synchronization.

**Basic usage example:**
```js
...profileContactInfoPages()
```

**With customization example:**
```js
...profileContactInfoPages({
  // Page configuration
  contactInfoPageKey: 'confirmContactInfo',
  contactPath: 'veteran-information',
  
  // Field configuration - which contact fields to include
  included: ['mailingAddress', 'email', 'homePhone', 'mobilePhone'],
  
  // Data structure keys
  wrapperKey: 'veteran',  // Top-level wrapper in formData
  addressKey: 'mailingAddress',
  homePhoneKey: 'homePhone',
  mobilePhoneKey: 'mobilePhone',
  emailKey: 'email',
  
  // Required fields (for validation)
  contactInfoRequiredKeys: ['mailingAddress', 'email'],
  
  // Custom schemas (optional - defaults are usually sufficient)
  addressSchema: {
    type: 'object',
    properties: {
      street: { type: 'string' },
      city: { type: 'string' },
      state: { type: 'string' },
      postalCode: { type: 'string' },
    },
  },
  
  // Content customization
  content: {
    title: 'Contact information',
    editMailingAddress: 'Edit mailing address',
    editHomePhone: 'Edit home phone',
    editMobilePhone: 'Edit mobile phone',
    editEmail: 'Edit email address',
  },
  
  // Display options
  contactSectionHeadingLevel: '3',  // Heading level for section titles
  editContactInfoHeadingLevel: '2',  // Heading level for edit pages
  prefillPatternEnabled: true,  // Enable prefill pattern styling
  disableMockContactInfo: true,  // Disable mock data in tests
  
  // Conditional display
  depends: formData => formData.applicantType === 'veteran',
})
```

---

## vets-api (Backend)

The following steps configure prefill in the [vets-api](https://github.com/department-of-veterans-affairs/vets-api) backend. For a working example, see [PR #5391 (Pre-fill CH31)](https://github.com/department-of-veterans-affairs/vets-api/pull/5391/files).

### Add Form to form_profile.rb

In `app/models/form_profile.rb`, add your form to two places:

**1. Add to the `ALL_FORMS` hash** under the appropriate category:

```ruby
ALL_FORMS = {
  # ...
  your_app_name: ['YOUR-FORM-ID'],
  # ...
}.freeze
```

**2. Add to the `FORM_ID_TO_CLASS` hash**, mapping your form ID to its FormProfile class:

```ruby
FORM_ID_TO_CLASS = {
  # ...
  'YOUR-FORM-ID' => ::FormProfiles::VAYOURFORMID,
  # ...
}.freeze
```

### Create a FormProfile Class

Create a new file at `app/models/form_profiles/va_your_form.rb` that defines the metadata for your form's prefill:

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

The `returnUrl` should match the path of the first prefilled page in your form (the page users land on after the introduction).

### Create a Form Profile Mapping

Create a YAML file at `config/form_profile_mappings/YOUR-FORM-ID.yml` that maps form fields to data sources:

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

The left side defines the keys in the prefill response. The right side maps them to internal data sources (`identity_information`, `contact_information`, etc.).

### Add Prefill Settings

Add your app's prefill setting to three configuration files:

**1. `config/settings.yml`:**

```yaml
your_app_name:
  prefill: true
```

**2. `config/settings/development.yml`:**

```yaml
your_app_name:
  prefill: true
```

**3. `config/settings/test.yml`:**

```yaml
your_app_name:
  prefill: true
```

### Add Tests

In `spec/models/form_profile_spec.rb`, add two things:

**1. Define expected prefill data** for your form:

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

**2. Add your form ID to the `returns prefilled` test list:**

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
