# Prefill Pattern

## Overview

The prefill pattern provides reusable components for VA.gov forms to display cards prefilled with user information.

Prefill data comes from two backend sources:
- **`/v0/user`** - User profile data from VA Profile (name, date of birth, contact info, etc.)
- **`/v0/in_progress_forms/{form-id}`** - Form-specific prefill data that cannot be obtained from the user profile, such as SSN and VA file number

## Table of Contents

- [Quick Start](#quick-start)
- [Additional Steps](#additional-steps)
  - [Add Submit Transformer](#add-submit-transformer)
  - [Add Route Protection](#add-route-protection)
  - [Set Up Local Testing](#set-up-local-testing)
  - [Import and Add Prefill Pages](#import-and-add-prefill-pages)
- [Components](#components)
  - [Personal Information](#personal-information)
  - [Contact Information](#contact-information)

## Quick Start

Follow [VA Forms Library - How to work with Pre-fill](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-work-with-pre-fill#VAFormsLibrary-HowtoworkwithPre-Fill-Introduction) to complete the initial vets-website configuration (enabling prefill and adding the prefill transformer) and the vets-api backend work. Then proceed with the additional steps below.

Note that your `prefillTransformer` should structure the data so that `ssn` and `vaFileNumber` are direct children of `formData` (not nested). If you need to nest these properties for your form's structure, you must provide a `dataAdapter` to the personal information component. For more details, refer to the [Personal Information](#personal-information) section below.

## Additional Steps

### Add Submit Transformer

Chain transformers to prepare data before submission. The `transformEmailForSubmit` helper is provided by the prefill pattern and converts the email object (used by the contact info component) into a simple string (required for submission).

```js
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';
import { transformEmailForSubmit } from 'platform/forms-system/src/js/patterns/prefill';

const formConfig = {
  transformForSubmit: (formConfig, form, options) => {
    let formData = form;
    // Transform email object to string (required if using profileContactInfoPages)
    formData = transformEmailForSubmit(formData);
    // Add other custom transformers here if needed
    return transformForSubmit(formConfig, formData, options);
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

## Components

### Personal Information
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

### Contact Information
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
