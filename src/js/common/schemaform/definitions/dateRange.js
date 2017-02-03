import { validateDateRange } from '../validation';
import * as date from './date';

import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const schema = commonDefinitions.dateRange;

export function uiSchema(from, to, rangeError) {
  return {
    'ui:validations': [
      validateDateRange
    ],
    'ui:errorMessages': {
      dateRange: rangeError || 'To date must be after From date'
    },
    from: date.uiSchema(from || 'From'),
    to: date.uiSchema(to || 'To')
  };
}
