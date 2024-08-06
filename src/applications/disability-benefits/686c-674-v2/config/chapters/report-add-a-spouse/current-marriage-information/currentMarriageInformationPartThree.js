import {
  addressUI,
  addressSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { updateFormDataAddress } from '../../../address-schema';
import { generateTitle } from '../../../helpers';
// import { currentMarriageInformation } from '..';

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
    'ui:title': generateTitle('Spouse’s address'),
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

export const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, [
    // 'doesLiveWithSpouse',
    'address',
  ]);
