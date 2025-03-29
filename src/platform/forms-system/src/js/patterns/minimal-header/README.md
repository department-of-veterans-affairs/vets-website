# Minimal Header Pattern

- [Minimal Header Pattern](#minimal-header-pattern)
  - [Features](#features)
  - [Example](#example)
  - [Usage:](#usage)
    - [Change 1: Add `'minimalHeader'` object to content-build registry.json](#change-1-add-minimalheader-object-to-content-build-registryjson)
    - [Change 2: Add `minimalHeaderFormConfigOptions` to your formConfig](#change-2-add-minimalheaderformconfigoptions-to-your-formconfig)
    - [Change 2 (alternative): Customize the breadcrumbs for excluded pages](#change-2-alternative-customize-the-breadcrumbs-for-excluded-pages)


## Features
- Smaller header
- Back link at top instead of back button at bottom
- No breadcrumbs or form title for every page within a form
- H1s for page titles

## Example
You can see an example of the minimal header pattern here: https://staging.va.gov/mock-form-minimal-header

## Usage:
To use the minimal header pattern, you must make two changes. One in content-build, and one to your formConfig.

### Change 1: Add `'minimalHeader'` object to content-build registry.json
```js
// registry.json
  {
    "appName": ...,
    ...
    "template": {
      ...
      // Example: Add this to your app
      "minimalHeader": {
        "title": "Submit a statement to support a claim",
        "subtitle": "Statement in support of a claim (VA Form 21-4138)",
        // paths that should not use the minimal header
        "excludePaths": ["/introduction", "/confirmation"],
      }
    }
  },
```
### Change 2: Add `minimalHeaderFormConfigOptions` to your formConfig
```js
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';

const formConfig = {
  ...minimalHeaderFormConfigOptions(),
};
```

### Change 2 (alternative): Customize the breadcrumbs for excluded pages

If you need to customize the breadcrumbs for excluded pages, pass the breadcrumb list to the `minimalHeaderFormConfigOptions` function.

```js
import { minimalHeaderFormConfigOptions } from 'platform/forms-system/src/js/patterns/minimal-header';

const formConfig = {
  ...minimalHeaderFormConfigOptions({
    breadcrumbList: [
      { href: '/', label: 'VA.gov home' },
      {
        href: '/supporting-forms-for-claims',
        label: 'Supporting forms for VA claims',
      },
      {
        href:
          '/supporting-forms-for-claims/submit-statement-form-21-4138',
        label: 'Submit a statement to support a claim',
      },
    ],
  }),
};
```
