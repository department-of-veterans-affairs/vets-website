import { validateSSN } from '../validation';
import fullSchema1995 from 'vets-json-schema/dist/change-of-program-schema.json';

export const schema = fullSchema1995.definitions.ssn;

export const uiSchema = {
  'ui:title': 'Social Security number',
  'ui:options': {
    widgetClassNames: 'usa-input-medium'
  },
  'ui:validations': [
    validateSSN
  ],
  'ui:errorMessages': {
    pattern: 'Please enter a valid nine digit SSN (dashes allowed)'
  }
};
