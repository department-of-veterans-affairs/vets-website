import { validateDate } from '../validation';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';

export const schema = commonDefinitions.date;

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
