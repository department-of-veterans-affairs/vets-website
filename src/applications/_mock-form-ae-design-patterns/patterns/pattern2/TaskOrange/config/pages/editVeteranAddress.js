import {
  addressSchema,
  addressUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { blankSchema } from 'platform/forms-system/src/js/utilities/data/profile';

import { EditVeteranAddress } from '../../pages/edit-veteran-address/EditVeteranAddress';

export const editVeteranAddress = {
  title: 'Edit contact information',
  path: 'personal-information/edit-veteran-address',
  CustomPage: EditVeteranAddress,
  CustomPageReview: null,
  uiSchema: {
    veteranAddress: addressUI({ omit: ['street3'] }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:pageTitle': blankSchema,
      veteranAddress: addressSchema({ omit: ['street3'] }),
    },
  },
};
