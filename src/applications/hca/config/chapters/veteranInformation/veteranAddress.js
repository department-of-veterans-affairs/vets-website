import React from 'react';
import merge from 'lodash/merge';

import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import PrefillMessage from 'platform/forms/save-in-progress/PrefillMessage';
import {
  schema as addressSchema,
  uiSchema as addressUI,
} from 'platform/forms/definitions/address';

import { AddressDescription } from '../../../components/ContentComponents';
import { ShortFormMessage } from '../../../components/FormAlerts';
import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';

export default {
  uiSchema: {
    'view:veteranAddressShortFormMessage': {
      'ui:description': ShortFormMessage,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
      },
    },
    'view:prefillMessage': {
      'ui:description': PrefillMessage,
    },
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
      'view:veteranAddressShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
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
