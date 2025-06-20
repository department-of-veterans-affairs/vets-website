---
applyTo: "**/src/applications/**/pages/**/*.js"
---
Instructions on web component patterns for RJSF

Only use these instructions if working with RJSF uiSchema and schema.

Look at [README](src/platform/forms-system/src/js/web-component-patterns/web-component-patterns-catalog.md) for all available web component patterns.

## Example of Usage:

```js
import {
  addressSchema,
  addressUI,
  emailToSendNotificationsSchema,
  emailToSendNotificationsUI,
  phoneSchema,
  phoneUI,
  ssnUI,
  ssnSchema,
  dateOfBirthSchema,
  dateOfBirthUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  radioSchema,
  radioUI,
  yesNoUI,
  yesNoSchema,
  checkboxGroupSchema,
  checkboxGroupUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Mailing address',
      'We’ll send any important information about your application to this address.',
    ),
    veteranMailingAddress: addressUI(),
    veteranPhone: phoneUI(),
    veteranEmail: emailToSendNotificationsUI(),
    wcV3CheckSsn: ssnUI(),
    dateWCV3: currentOrPastDateUI('Web component - Generic'),
    dateOfBirthWCV3: dateOfBirthUI('Web component - Date of birth'),
    wcv3VaTileCompensationType: radioUI({
      title: 'Do you receive VA disability compensation?',
      tile: true,
      labels: {
        lowDisability:
          'Yes, for a service-connected disability rating of up to 40%',
        highDisability:
          'Yes, for a service-connected disability rating of 50% or higher',
        none: 'No',
      },
    }),
    wcv3IsCurrentlyActiveDuty: yesNoUI({
      title: 'Are you on active duty now?',
      description: 'This is a description',
      labels: {
        Y: 'Yes, the Veteran is on active duty now',
        N: 'No, the Veteran is not on active duty now',
      },
    }),
    checkboxGroupAtLeastOneRequired: checkboxGroupUI({
      title: 'Checkbox group - At least one required',
      required: true,
      description: (
        <va-additional-info trigger="JSX description">
          We need the Veteran’s Social Security number or tax identification
          number to process the application when it’s submitted online, but it’s
          not a requirement to apply for the program.
        </va-additional-info>
      ),
      hint: 'This is hint text',
      labels: {
        hasA: 'Option A',
        hasB: 'Option B',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['veteranMailingAddress'],
    properties: {
      veteranMailingAddress: addressSchema(),
      veteranPhone: phoneSchema,
      veteranEmail: emailToSendNotificationsSchema,
      wcV3CheckSsn: ssnSchema,
      dateWCV3: currentOrPastDateSchema,
      dateOfBirthWCV3: dateOfBirthSchema,
      wcv3VaTileCompensationType: radioSchema([
        'lowDisability',
        'highDisability',
        'none',
      ]),
      wcv3IsCurrentlyActiveDuty: yesNoSchema,
      checkboxGroupAtLeastOneRequired: checkboxGroupSchema(['hasA', 'hasB']),
    },
  },
};
```

## Exceptions

titleUI does not have a schema, and is used like:

```js
uiSchema: {
  ...titleUI('Name and date of birth'),
},
```