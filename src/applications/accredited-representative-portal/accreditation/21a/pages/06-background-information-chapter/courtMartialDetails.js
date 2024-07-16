import {
  addressSchema,
  addressUI,
  textSchema,
  textUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Court martial details',
  path: 'court-martial-details',
  depends: formData => formData.courtMartialed,
  uiSchema: {
    ...titleUI(
      'Provide details of the military authority or court of the court martial',
    ),
    militaryAuthorityName: textUI('Name'),
    militaryAuthorityAddress: addressUI({
      labels: {
        militaryCheckbox:
          'This address is on a United States military base outside of the U.S.',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      militaryAuthorityName: textSchema,
      militaryAuthorityAddress: addressSchema({
        omit: ['street3'],
      }),
    },
    required: ['militaryAuthorityName'],
  },
};
