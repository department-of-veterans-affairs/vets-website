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
    'view:homeAddressShortFormMessage': {
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
    veteranHomeAddress: merge({}, addressUI('Home address', true), {
      'ui:description': <AddressDescription addressType="home" />,
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
      'ui:options': {
        // TODO: is this being used?
        'ui:title': 'Street',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:homeAddressShortFormMessage': emptyObjectSchema,
      'view:prefillMessage': emptyObjectSchema,
      veteranHomeAddress: merge({}, addressSchema(fullSchemaHca, true), {
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
};
