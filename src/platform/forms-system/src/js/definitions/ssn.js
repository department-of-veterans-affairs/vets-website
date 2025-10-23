import { validateSSN } from '../validation';
import SSNWidget from '../widgets/SSNWidget';
import SSNReviewWidget from '../review/SSNWidget';

const uiSchema = {
  'ui:widget': SSNWidget,
  'ui:reviewWidget': SSNReviewWidget,
  'ui:title': 'Social Security number',
  'ui:options': {
    widgetClassNames: 'usa-input-medium masked-ssn',
  },
  'ui:validations': [validateSSN],
  'ui:errorMessages': {
    pattern:
      'Please enter a valid 9 digit Social Security number (dashes allowed)',
    required: 'Please enter a Social Security number',
  },
};

export default uiSchema;
