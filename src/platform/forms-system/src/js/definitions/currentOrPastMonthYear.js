import { validateCurrentOrPastMonthYear } from '../validation';
import monthYearUI from './monthYear';

export default function uiSchema(title = 'Date') {
  return {
    ...monthYearUI(title),
    'ui:validations': [validateCurrentOrPastMonthYear],
    'ui:errorMessages': {
      pattern: 'Enter a valid current or past date',
      required: 'Enter a date',
    },
  };
}
