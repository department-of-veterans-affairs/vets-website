import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Other address',
  path: 'other-address',
  depends: formData => formData.communicationAddress === 'OTHER',
  uiSchema: {
    ...titleUI('Other address'),
    otherAddress: addressUI({
      labels: {
        militaryCheckbox:
          'This address is on a United States military base outside of the U.S.',
      },
      omit: ['street3'],
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
