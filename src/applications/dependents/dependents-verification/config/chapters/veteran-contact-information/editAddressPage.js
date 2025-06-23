import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import EditMailingAddress from '../../../components/EditMailingAddress';

export default {
  title: 'Edit mailing address',
  path: 'veteran-contact-information/mailing-address',
  depends: () => false,
  CustomPage: EditMailingAddress,
  CustomPageReview: null,
  uiSchema: {
    address: addressUI({ omit: ['street3'] }),
  },
  schema: {
    type: 'object',
    properties: {
      // 'view:pageTitle': blankSchema,
      address: addressSchema({ omit: ['street3'] }),
    },
  },
};
