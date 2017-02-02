import { validateDate } from '../validation';
import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';

export const schema = fullSchema1995.definitions.date;

export const uiSchema = (title = 'Date') => {
  return {
    'ui:title': title,
    'ui:widget': 'date',
    'ui:validations': [
      validateDate
    ],
    'ui:errorMessages': {
      pattern: 'Please provide a valid date'
    }
  };
};
