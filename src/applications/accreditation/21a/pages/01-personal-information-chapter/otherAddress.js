import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Other address',
  path: 'other-address',
  depends: formData => formData.primaryMailingAddress === 'OTHER',
  uiSchema: {
    ...titleUI(
      'Other address',
      'We will send any important information about your form to this address.',
    ),
    otherAddress: addressUI({
      labels: {
        militaryCheckbox:
          'This address is on a United States military base outside of the U.S.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      otherAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
