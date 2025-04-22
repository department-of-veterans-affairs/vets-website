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
    address: merge(
      {},
      addressNoMilitaryUI({
        omit: ['street3'],
      }),
      {
        city: {
          'ui:title': 'City',
          'ui:options': {
            replaceSchema: (_, schema) => {
              return {
                ...schema,
                pattern: '^[A-Za-z\\s]+$',
              };
            },
          },
          'ui:errorMessages': {
            pattern: 'Please enter a valid city',
          },
        },
      },
    ),
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
              pattern: '^[A-Za-z\\s]+$',
            },
          },
        },
      ),
    },
  },
};
