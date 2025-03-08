import {
  addressNoMilitarySchema,
  addressNoMilitaryUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { merge } from 'lodash';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI(
      'Your organization’s mailing address',
      'We’ll mail information about this application to the organization’s address you provide here.',
    ),
    address: addressNoMilitaryUI({
      omit: ['street3'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      address: merge(
        {},
        addressNoMilitarySchema({
          omit: ['street3'],
        }),
        {
          properties: {
            street: {
              maxLength: 35,
            },
            street2: {
              maxLength: 35,
            },
            city: {
              maxLength: 20,
            },
            postalCode: {
              maxLength: 5,
            },
          },
        },
      ),
    },
  },
};
