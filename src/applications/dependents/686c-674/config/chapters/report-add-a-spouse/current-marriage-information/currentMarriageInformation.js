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
  ...titleUI('Spouse’s address'),
  doesLiveWithSpouse: {
    address: {
      ...addressUI({
        title: '',
        labels: {
          militaryCheckbox:
            'Spouse receives mail outside of the United States on a U.S. military base.',
        },
      }),
      city: {
        ...addressUI().city,
        'ui:validations': [
          (errors, city, formData) => {
            const address = formData?.doesLiveWithSpouse?.address;
            const cityStr = city?.trim().toUpperCase();

            if (
              address &&
              ['APO', 'FPO', 'DPO'].includes(cityStr) &&
              address.isMilitary !== true
            ) {
              errors.addError('Enter a valid city name');
            }
          },
        ],
      },
    },
  },
};
