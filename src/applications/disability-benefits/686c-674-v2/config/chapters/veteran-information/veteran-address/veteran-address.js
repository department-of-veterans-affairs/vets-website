import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { updateFormDataAddress } from '../../../address-schema';
import { generateTitle } from '../../../helpers';

export const uiSchema = {
  veteranContactInformation: {
    'ui:title': generateTitle('Mailing address'),
    veteranAddress: {
      ...addressUI({
        title: '',
        labels: {
          militaryCheckbox:
            'I live on a United States military base outside of the U.S.',
        },
      }),
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

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, [
    'veteranContactInformation',
    'veteranAddress',
  ]);
