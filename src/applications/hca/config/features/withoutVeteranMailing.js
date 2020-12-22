import { merge } from 'lodash/fp';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';

export const veteranAddressOG = {
  veteranAddress: {
    path: 'veteran-information/veteran-address',
    title: 'Permanent address',
    initialData: {},
    uiSchema: {
      'ui:description': PrefillMessage,
      veteranAddress: merge(addressUI('Permanent address', true), {
        street: {
          'ui:errorMessages': {
            pattern:
              'Please provide a valid street. Must be at least 1 character.',
          },
        },
        city: {
          'ui:errorMessages': {
            pattern:
              'Please provide a valid city. Must be at least 1 character.',
          },
        },
      }),
    },
    schema: {
      type: 'object',
      properties: {
        veteranAddress: merge(addressSchema(fullSchemaHca, true), {
          properties: {
            street: {
              minLength: 1,
              maxLength: 30,
            },
            street2: {
              minLength: 1,
              maxLength: 30,
            },
            street3: {
              type: 'string',
              minLength: 1,
              maxLength: 30,
            },
            city: {
              minLength: 1,
              maxLength: 30,
            },
          },
        }),
      },
    },
  },
};
