import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import EditMailingAddressPage from '../../../components/EditMailingAddressPage';

export default {
  title: 'Edit mailing address',
  path: 'veteran-contact-information/mailing-address',
  CustomPage: EditMailingAddressPage,
  CustomPageReview: null,
  uiSchema: {
    address: {
      ...addressUI(),
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
};
