import {
  addressUI,
  addressSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { asciiValidation } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    doesLiveWithSpouse: {
      type: 'object',
      properties: {
        address: addressSchema({ omit: ['street3'] }),
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
        omit: ['street3'],
        labels: {
          street2: 'Apartment or unit number',
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
          asciiValidation,
        ],
      },
    },
  },
};
