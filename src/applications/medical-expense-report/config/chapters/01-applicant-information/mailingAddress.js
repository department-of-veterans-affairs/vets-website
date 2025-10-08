import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Your address',
  path: 'applicant/mail-address',
  uiSchema: {
    ...titleUI('Your address'),
    claimantAddress: addressUI({
      labels: {
        militaryCheckbox:
          'I receive mail outside of the United States on a U.S. military base',
      },
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantAddress'],
    properties: {
      claimantAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};
