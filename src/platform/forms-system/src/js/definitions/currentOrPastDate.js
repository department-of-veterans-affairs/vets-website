import { validateCurrentOrPastDate } from '../validation';

export default function uiSchema(title = 'Date') {
  return {
    'ui:title': title,
    'ui:widget': 'date',
    'ui:validations': [validateCurrentOrPastDate],
    'ui:errorMessages': {
      pattern: 'Enter a valid current or past date',
      required: 'Enter a date',
    },
  };
}
