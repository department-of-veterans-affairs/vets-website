import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

export const uiSchema = {
  veteranContactInformation: {
    ...titleUI('Mailing address'),
    veteranAddress: {
      ...addressUI({
        title: '',
        labels: {
          militaryCheckbox:
            'I live on a United States military base outside of the U.S.',
        },
      }),
      city: {
        ...addressUI().city,
        'ui:validations': [
          (errors, city, formData) => {
            const address = formData?.veteranContactInformation?.veteranAddress;
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

export const schema = {
  type: 'object',
  properties: {
    veteranContactInformation: {
      type: 'object',
      properties: {
        veteranAddress: addressSchema(),
      },
    },
  },
};
