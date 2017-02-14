import { validateSSN } from '../validation';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import SSNWidget from '../widgets/SSNWidget';

export const schema = commonDefinitions.ssn;

export const uiSchema = {
  'ui:widget': SSNWidget,
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
