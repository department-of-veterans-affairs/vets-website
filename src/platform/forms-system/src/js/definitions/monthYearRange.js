import {
  validateDateRange,
  validateDateRangeAllowSameMonth,
} from '../validation';
import monthYearUI from './monthYear';

export default function uiSchema(
  from = 'From',
  to = 'To',
  rangeError = 'To date must be after From date',
  allowSameMonth = false,
) {
  return {
    'ui:validations': allowSameMonth
      ? [validateDateRangeAllowSameMonth]
      : [validateDateRange],
    'ui:errorMessages': {
      pattern: rangeError,
      required: 'Please enter a date',
    },
    from: monthYearUI(from),
    to: monthYearUI(to),
  };
}
