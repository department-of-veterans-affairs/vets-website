## Review Errors

To provide a better user experience on a form's review & submit page, an update to form 526 error alert was made to provide Veteran's with a list of clickable errors.

Clicking the link would open the appropriate accordion chapter and place the associated page into edit mode.

![custom error message links](./images/custom-review-error-text.png
error-text-based-on-error-name.png)

## Set up

To enable error links in your form, you'll need to update the `config/form` file with two new entries:
- `showReviewErrors` is a boolean flag that is required to enable review error links on the review & submit page. For form 526, we initially set this to `!environment.isProduction()` to enable testing on staging.
- `reviewErrors` is an object set with the key that matches the uiSchema name of entry. The value can be either a string or a function that returns a string. More details are provided below.

Here's an example:

```js
const formConfig = {
  // ...
  showReviewErrors: !environment.isProduction(),
  reviewErrors: {
    primaryPhone: 'Contact information (enter your phone number)',
    emailAddress: 'Contact information (enter your email address)',
    // condition is an array path, so an index is passed as a parameter
    condition: index =>
      `Add a new conditions (in the ${numberToWords(index + 1)} section`,

    // For form data not associated with a particular page, e.g. list loop pages
    // aren't shown on the review & submit page, instead shows a summary page
    _override: (error, fullError) => {
      if (error === 'location') {
        return {
          chapterKey: 'locations',
          pageKey: 'summary', // summary page on review & submit
        };
      }
      if (error.includes('dates')) {
        return {
          chapterKey: 'locations',
          pageKey: 'summary-dates',
        };
      }
      // always return null for non-matches
      return null;
    }
  },
  // ...
};
```

## How it works

A third-party schema validation script (https://github.com/tdegrunt/jsonschema) is run upon form submission. The errors are combined with some uiSchema error messages and are reduced, then added to the redux state under `form.formErrors.errors`. The third-party validator doesn't have access to all the `uiSchema` error messages, so if a `reviewErrors` entry isn't provided, the link text is build from the error key. This isn't always ideal.

The following screenshot shows the same errors as in the screenshot above, but without a provided `reviewErrors` cross-reference.

![error message text based on error key](./images/error-text-based-on-error-name.png)

The `reviewErrors` text can be reviewed by your content team to provide the best content for that specific form entry.

## Overrides

[Custom pages documentation](https://depo-platform-documentation.scrollhelp.site/developer-docs/va-forms-library-how-to-bypass-schema-form) don't require a `uiSchema`, but if the page contains required form fields, `ui:validations` must be included to block form submission.

In an example of using a list-loop + summary page, the summary page gets the `ui:validations`  array added to the summary page. With missing form values, submission shows a generic error message on the review & submit page, but does not highlight any accordion; this is because the `reduceErrors` function searches for the chapter & page based on the uiSchema path.

See the Supplemental Claim form (`/applications/appeals/995`) for an example.
