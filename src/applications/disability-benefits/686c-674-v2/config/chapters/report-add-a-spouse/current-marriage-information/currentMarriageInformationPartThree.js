import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

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
  doesLiveWithSpouse: {
    ...titleUI('Spouse’s address'),
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
