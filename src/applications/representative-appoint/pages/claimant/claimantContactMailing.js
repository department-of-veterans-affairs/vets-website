import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  ...titleUI(
    'Your mailing address',
    'We’ll send any important information about your form to this address.',
  ),

  homeAddress: addressUI({
    labels: {
      militaryCheckbox:
        'This address is on a United States military base outside of the U.S.',
    },
    required: {
      state: () => true,
    },
  }),
};

export const schema = {
  type: 'object',
  properties: {
    homeAddress: {
      ...addressSchema({ omit: ['street3'] }),
      properties: {
        ...addressSchema({ omit: ['street3'] }).properties,
        street: {
          type: 'string',
          maxLength: 30,
        },
        street2: {
          type: 'string',
          maxLength: 5,
        },
        city: {
          type: 'string',
          maxLength: 18,
        },
        state: {
          type: 'string',
          maxLength: 2,
        },
        postalCode: {
          type: 'string',
          maxLength: 9,
        },
      },
    },
  },
};
