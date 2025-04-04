# Minimal header (minimal form flow) pattern

- [Minimal header (minimal form flow) pattern](#minimal-header-minimal-form-flow-pattern)
  - [Features](#features)
  - [Example Form](#example-form)
  - [How to implement](#how-to-implement)
    - [Change 1: Add `minimalHeaderFormConfigOptions` to your formConfig](#change-1-add-minimalheaderformconfigoptions-to-your-formconfig)
    - [Change 2: Add the follow properties to your app in `registry.json` in `content-build`](#change-2-add-the-follow-properties-to-your-app-in-registryjson-in-content-build)
    - [Change 3: If updating an existing form, apply conditional H1s](#change-3-if-updating-an-existing-form-apply-conditional-h1s)
      - [If using `radioUI` or `checkboxUI` as the title of a page, then add `ifMinimalHeader`:](#if-using-radioui-or-checkboxui-as-the-title-of-a-page-then-add-ifminimalheader)
      - [If using `titleUI`, then no change is required unless you are manually setting the `headerLevel`. It should automatially adapt to h3 or h1 depending on the header type.](#if-using-titleui-then-no-change-is-required-unless-you-are-manually-setting-the-headerlevel-it-should-automatially-adapt-to-h3-or-h1-depending-on-the-header-type)


## Features
- Introduction and confirmation page use full header and footer with breadcrumbs
- Whilst in the form flow, the following differences apply:
  - Minimal header and footer
  - "Back to previous page" link at top
  - A single "continue" button at the bottom
  - No breadcrumbs
  - H1s for page titles

## Example Form
You can see an example of the minimal header pattern here: https://staging.va.gov/mock-form-minimal-header

## How to implement

### Change 1: Add `minimalHeaderFormConfigOptions` to your formConfig
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

> Note: `minimalHeaderFormConfigOptions` will do NOTHING if content-build registry does not have the `minimalHeader` object. So you can safely add this before the content-build changes.

### Change 2: Add the follow properties to your app in `registry.json` in `content-build`

```json
"breadcrumbs": false,
"minimalExcludePaths": [
  "/introduction",
  "/confirmation",
],
"minimalFooter": true,
"minimalHeader": {
  "title": "Submit a statement to support a claim",
  "subtitle": "Statement in support of a claim (VA Form 21-4138)",
}
```

### Change 3: If updating an existing form, apply conditional H1s

#### If using `radioUI` or `checkboxUI` as the title of a page, then add `ifMinimalHeader`:

```js
labelHeaderLevel: '3',
ifMinimalHeader: {
  labelHeaderLevel: '1',
}
```

#### If using `titleUI`, then no change is required unless you are manually setting the `headerLevel`. It should automatially adapt to h3 or h1 depending on the header type.