import { validatePartialDate, validateFullDate } from '../validation';

export default function uiSchema(title = 'Date', enforceFullDate = false) {
  const dateValidation = enforceFullDate ? validateFullDate : validatePartialDate;
  return {
    'ui:title': title,
    'ui:widget': 'date',
    'ui:validations': [
      dateValidation
    ],
    'ui:errorMessages': {
      pattern: 'Please provide a valid date'
    }
  };
}
