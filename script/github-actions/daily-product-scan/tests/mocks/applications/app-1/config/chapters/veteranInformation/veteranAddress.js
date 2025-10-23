/* eslint-disable import/order */
import React from 'react';
import merge from 'lodash/merge';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import { AddressDescription } from '../../../components/ContentComponents';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';

export default {
  uiSchema: {
    'ui:description': PrefillMessage,
    veteranAddress: merge({}, addressUI('Mailing address', true), {
      'ui:description': <AddressDescription addressType="mailing" />,
      street: {
        'ui:title': 'Street address',
        'ui:errorMessages': {
          pattern:
            'Please provide a valid street. Must be at least 1 character.',
        },
      },
      city: {
        'ui:errorMessages': {
          pattern: 'Please provide a valid city. Must be at least 1 character.',
        },
      },
    }),
    'view:doesMailingMatchHomeAddress': {
      'ui:title': 'Is your home address the same as your mailing address?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranAddress: merge({}, addressSchema(fullSchemaHca, true), {
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
      'view:doesMailingMatchHomeAddress': {
        type: 'boolean',
      },
    },
  },
};
