import {
  addressSchema,
  addressUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { asciiValidation } from '../../../helpers';

export const uiSchema = {
  veteranContactInformation: {
    ...titleUI('Mailing address'),
    veteranAddress: {
      ...addressUI({
        title: '',
        omit: ['street3'],
        labels: {
          street2: 'Apartment or unit number',
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
          asciiValidation,
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
        veteranAddress: addressSchema({ omit: ['street3'] }),
      },
    },
  },
};
