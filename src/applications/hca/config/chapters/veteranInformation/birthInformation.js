import React from 'react';
import { hasSession } from 'platform/user/profile/utilities';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';

import { HIGH_DISABILITY, emptyObjectSchema } from '../../../helpers';
import AuthenticatedShortFormAlert from '../../../components/FormAlerts/AuthenticatedShortFormAlert';

const { cityOfBirth } = fullSchemaHca.properties;

const stateLabels = createUSAStateLabels(states);

export default {
  uiSchema: {
    'view:authShortFormAlert': {
      'ui:field': AuthenticatedShortFormAlert,
      'ui:options': {
        hideIf: form =>
          !(
            form['view:hcaShortFormEnabled'] &&
            form['view:totalDisabilityRating'] &&
            form['view:totalDisabilityRating'] >= HIGH_DISABILITY
          ),
      },
    },
    'view:applicationDescription': {
      'ui:options': {
        hideIf: () => !hasSession(),
      },
      'ui:description': (
        <p>
          You don’t have to fill in all these fields. But we can review your
          application faster if you provide more information.
        </p>
      ),
    },
    'view:placeOfBirth': {
      'ui:title': 'Place of birth',
      cityOfBirth: {
        'ui:title': 'City',
      },
      stateOfBirth: {
        'ui:title': 'State',
        'ui:options': {
          labels: stateLabels,
        },
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:authShortFormAlert': emptyObjectSchema,
      'view:applicationDescription': emptyObjectSchema,
      'view:placeOfBirth': {
        type: 'object',
        properties: {
          cityOfBirth,
          stateOfBirth: {
            type: 'string',
            enum: states.USA.map(state => state.value),
          },
        },
      },
    },
  },
};
