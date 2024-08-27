import { validateDateRange } from 'platform/forms-system/src/js/validation';
import dateUI from './date';

export default function uiSchema(
  from = 'From',
  to = 'To',
  rangeError = 'To date must be after From date',
) {
  return {
    'ui:validations': [validateDateRange],
    'ui:errorMessages': {
      pattern: rangeError,
      required: 'Please enter a date',
    },
    from: dateUI(from),
    to: dateUI(to),
  };
}
