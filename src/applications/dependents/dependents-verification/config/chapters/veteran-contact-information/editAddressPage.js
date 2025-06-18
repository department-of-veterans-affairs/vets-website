import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';

import EditMailingAddress from '../../../components/EditMailingAddress';

export default {
  title: 'Edit mailing address',
  path: 'veteran-contact-information/mailing-address',
  depends: () => false,
  CustomPage: EditMailingAddress,
  CustomPageReview: null,
  uiSchema: {
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pageTitle': blankSchema,
      address: {
        type: 'object',
        properties: {
          ...addressSchema().properties,
          street2: { type: 'string' },
          street3: { type: 'string' },
        },
      },
    },
  },
};
