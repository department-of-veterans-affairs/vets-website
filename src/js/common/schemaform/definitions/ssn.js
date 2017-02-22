import { validateSSN } from '../validation';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import SSNWidget from '../widgets/SSNWidget';
import SSNReviewWidget from '../review/SSNWidget';

export const schema = commonDefinitions.ssn;

export const uiSchema = {
  'ui:widget': SSNWidget,
  'ui:reviewWidget': SSNReviewWidget,
  'ui:title': 'Social Security number',
  'ui:options': {
    widgetClassNames: 'usa-input-medium'
  },
  'ui:validations': [
    validateSSN
  ],
  'ui:errorMessages': {
    pattern: 'Please enter a valid 9 digit SSN (dashes allowed)'
  }
};
