import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import EditMailingAddress from '../../../components/EditMailingAddress';

export default {
  title: 'Edit mailing address',
  path: 'veteran-contact-information/mailing-address',
  // depends: () => false,
  CustomPage: EditMailingAddress,
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
      // 'view:pageTitle': blankSchema,
      address: addressSchema(),
    },
  },
};
