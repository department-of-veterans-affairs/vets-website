import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import EditMailingAddressPage from '../../../components/EditMailingAddressPage';
import { focusPrefillAlert } from '../../../util/focus';

/** @returns {PageSchema} */
export default {
  title: 'Edit mailing address',
  path: 'veteran-contact-information/mailing-address',
  CustomPage: EditMailingAddressPage,
  CustomPageReview: null,
  uiSchema: {
    address: {
      ...addressUI(),
      city: {
        ...addressUI().city,
        'ui:validations': [
          (errors, city, formData) => {
            const address = formData?.address;
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
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      address: addressSchema(),
    },
  },
  scrollAndFocusTarget: focusPrefillAlert,
};
