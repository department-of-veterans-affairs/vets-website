import React from 'react';
import { hasSession } from 'platform/user/profile/utilities';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

import { createUSAStateLabels } from 'platform/forms-system/src/js/helpers';
import { states } from 'platform/forms/address';

const { cityOfBirth } = fullSchemaHca.properties;

const stateLabels = createUSAStateLabels(states);

export default {
  uiSchema: {
    'view:applicationDescription': {
      'ui:options': {
        hideIf: () => !hasSession(),
      },
      'ui:description': (
        <p>
          You aren’t required to fill in all fields, but we can review your
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
      'view:applicationDescription': {
        type: 'object',
        properties: {},
      },
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
