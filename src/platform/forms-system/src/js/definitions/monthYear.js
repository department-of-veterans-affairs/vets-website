import { validateMonthYear } from '../validation';

export default function uiSchema(title = 'Date') {
  return {
    'ui:title': title,
    'ui:widget': 'date',
    'ui:options': {
      monthYear: true,
    },
    'ui:validations': [validateMonthYear],
    'ui:errorMessages': {
      pattern: 'Please enter a valid month and year',
      required: 'Please enter a date',
    },
  };
}
