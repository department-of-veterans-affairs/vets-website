# Prefill Pattern

The prefill pattern provides reusable components for VA.gov forms to display and validate user information that is prefilled from VA Profile data and the `in_progress_forms` endpoint.

## Quick Start

### Import and Use

```js
import {
  profilePersonalInfoPage,
  profileContactInfoPages,
  transformEmailForSubmit,
} from 'platform/forms-system/src/js/patterns/prefill';
import { transformForSubmit } from 'platform/forms-system/src/js/helpers';

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
  // Optional: Chain transform functions before submit
  transformForSubmit: (formConfig, form, options) => {
    let formData = form;
    formData = transformEmailForSubmit(formData);
    return transformForSubmit(formConfig, formData, options);
  },
};
```

## Components

### Personal Information
Displays user's personal information (name, SSN, VA file number, date of birth, sex) in a read-only card format.

**Basic usage:**
```js
...profilePersonalInfoPage()
```

**With customization:**
```js
...profilePersonalInfoPage({
  personalInfoConfig: {
    name: { show: true, required: true },
    ssn: { show: true, required: false },
    vaFileNumber: { show: true, required: false },
    dateOfBirth: { show: true, required: true },
    sex: { show: false, required: false },
  },
  dataAdapter: {
    ssnPath: 'veteran.ssn',
    vaFileNumberPath: 'veteran.vaFileNumber',
  },
})
```

### Contact Information
Displays and allows inline editing of contact information (email, phones, mailing address) with VA Profile synchronization.

**Basic usage:**
```js
...profileContactInfoPages()
```

**With customization:**
```js
...profileContactInfoPages({
  contactPath: 'veteran-information',
  contactInfoRequiredKeys: ['mailingAddress', 'email'],
  wrapperKey: 'veteran',
})
```

## Customization Options

### Data Adapter
The `dataAdapter` tells the personal information component where to find data in your form's structure. This is useful when your form's prefill endpoint returns data in a non-standard format.

**Example:** If your prefill transformer returns `veteran.ssn` instead of just `ssn`:
```js
dataAdapter: {
  ssnPath: 'veteran.ssn',
  vaFileNumberPath: 'veteran.vaFileNumber',
}
```

### Transform for Submit
Chain multiple transform functions to prepare your form data before submission. Common transformers include `transformEmailForSubmit` which converts the email object to a simple string.

**Example:**
```js
transformForSubmit: (formConfig, form, options) => {
  let formData = form;
  // Add custom transformers here
  formData = transformEmailForSubmit(formData);
  formData = myCustomTransformer(formData);
  // Always call the base transformer last
  return transformForSubmit(formConfig, formData, options);
}
```

### Prefill Transformer
Configure how data from the prefill API is mapped into your form's initial state:

**Example:**
```js
const prefillTransformer = (pages, formData, metadata) => {
  const { ssn, vaFileNumber } = formData?.data?.attributes?.veteran || {};
  return {
    metadata,
    formData: { ssn, vaFileNumber },
    pages,
  };
};
```
