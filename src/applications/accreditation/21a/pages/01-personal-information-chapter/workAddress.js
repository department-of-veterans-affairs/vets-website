import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Work address',
  path: 'work-address',
  depends: formData => formData.employmentStatus === 'EMPLOYED',
  uiSchema: {
    ...titleUI('Work address'),
    workAddress: addressUI({
      labels: {
        militaryCheckbox:
          'I work on a United States military base outside of the U.S.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      workAddress: addressSchema({
        omit: ['street3'],
      }),
    },
  },
};
