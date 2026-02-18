import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import {
  SeparationLocationTitle,
  SeparationLocationDescription,
} from '../content/separationLocation';

import { getSeparationLocations } from '../utils';
import { requireSeparationLocation } from '../validations';

export const uiSchema = {
  serviceInformation: {
    'ui:title': SeparationLocationTitle,
    'ui:description': SeparationLocationDescription,
    separationLocation: autosuggest.uiSchema(
      'Enter a location',
      getSeparationLocations,
      {
        'ui:required': () => true,
        'ui:validations': [requireSeparationLocation],
        'ui:confirmationField': ({ formData }) => ({
          label: uiSchema.serviceInformation['ui:title'],
          data: formData.label,
        }),
      },
    ),
  },
};

export const schema = {
  type: 'object',
  properties: {
    serviceInformation: {
      type: 'object',
      properties: {
        'view:separationLocation': {
          type: 'object',
          properties: {},
        },
        separationLocation: autosuggest.schema,
      },
    },
  },
};
