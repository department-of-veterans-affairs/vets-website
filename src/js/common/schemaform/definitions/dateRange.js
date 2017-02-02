import { validateDateRange } from '../validation';
import * as date from './date';

import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';

export const schema = fullSchema1995.definitions.dateRange;

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
