import { validateCurrentOrPastYear } from '../validation';
import * as ReviewWidget from '../review/widgets';

const uiSchema = {
  'ui:title': 'Year',
  'ui:reviewWidget': ReviewWidget.TextWidget,
  'ui:validations': [validateCurrentOrPastYear],
  'ui:errorMessages': {
    pattern: 'Please enter a valid year',
    required: 'Please enter a year',
  },
  'ui:options': {
    widgetClassNames: 'usa-input-medium',
  },
};

export default uiSchema;
