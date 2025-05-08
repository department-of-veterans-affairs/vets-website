import {
  addressUI,
  addressSchema,
  titleUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: {
      type: 'object',
      properties: {
        address: addressSchema(),
      },
    },
  },
};

export const uiSchema = {
  ...titleUI('Spouse’s address'),
  doesLiveWithSpouse: {
    address: {
      ...addressUI({
        labels: {
          militaryCheckbox:
            'Spouse receives mail outside of the United States on a U.S. military base.',
        },
      }),
    },
  },
};
