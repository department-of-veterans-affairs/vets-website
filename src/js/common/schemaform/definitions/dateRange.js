import { validateDateRange } from '../validation';
import * as date from './date';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const schema = {
  type: 'object',
  properties: {
    from: commonDefinitions.date,
    to: commonDefinitions.date
  }
};

export function uiSchema(from = 'From', to = 'To', rangeError = 'To date must be after From date') {
  return {
    'ui:validations': [
      validateDateRange
    ],
    'ui:errorMessages': {
      pattern: rangeError,
    },
    from: date.uiSchema(from),
    to: date.uiSchema(to)
  };
}
