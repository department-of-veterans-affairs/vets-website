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
      'Your mailing address',
      'We’ll mail information about this application to the address you provide here.',
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
                pattern: '^[A-Za-z]+$',
              };
            },
          },
          'ui:errorMessages': {
            pattern: 'Please enter a valid city',
          },
        },
      },
      {
        postalCode: {
          'ui:options': {
            replaceSchema: (_, schema) => {
              return {
                ...schema,
                pattern: '^[a-zA-Z0-9]+$',
              };
            },
          },
          'ui:errorMessages': {
            pattern:
              'Enter a postal code that meets your country’s requirements. If your country doesn’t require a postal code, enter NA.',
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
              pattern: '^[A-Za-z]+$',
            },
            postalCode: {
              maxLength: 5,
              pattern: '^[a-zA-Z0-9]+$',
            },
          },
        },
      ),
    },
  },
};
