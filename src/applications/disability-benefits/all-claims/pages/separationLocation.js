import AutosuggestField from 'platform/forms-system/src/js/fields/AutosuggestField';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import {
  SeparationLocationTitle,
  SeparationLocationDescription,
} from '../content/separationLocation';

import { checkSeparationLocation } from '../validations';
import separationLocations from '../content/separationLocations';

export const uiSchema = {
  serviceInformation: {
    'view:separationLocation': {
      'ui:title': SeparationLocationTitle,
      'ui:description': SeparationLocationDescription,
    },
    // Not using autosuggest.uiSchema; validations not set?
    separationLocation: {
      'ui:title': 'Enter a location',
      'ui:field': AutosuggestField,
      'ui:required': () => true,
      'ui:validations': [checkSeparationLocation],
      'ui:options': {
        showFieldLabel: 'label',
        maxOptions: 20,
        getOptions: () =>
          Promise.resolve().then(() =>
            separationLocations.map(({ code, description }) => ({
              id: code,
              label: description,
            })),
          ),
      },
    },
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
