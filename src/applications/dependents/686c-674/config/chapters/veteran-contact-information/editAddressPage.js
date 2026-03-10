import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import EditMailingAddressPage from '../../../components/EditMailingAddressPage';
import { focusPrefillAlert } from '../../utilities/focus';

/** @returns {PageSchema} */
export default {
  title: 'Edit mailing address',
  path: 'veteran-contact-information/mailing-address',
  CustomPage: EditMailingAddressPage,
  CustomPageReview: null,
  depends: () => false,
  uiSchema: {
    veteranAddress: {
      ...addressUI({ omit: ['street3'] }),
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranContactInformation: {
        type: 'object',
        properties: {
          veteranAddress: addressSchema({ omit: ['street3'] }),
        },
      },
    },
  },
  scrollAndFocusTarget: focusPrefillAlert,
};
