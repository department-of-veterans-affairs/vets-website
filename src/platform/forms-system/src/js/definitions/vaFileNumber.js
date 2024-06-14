import { validateVAFileNumber } from '../validation';
import VAFileNumberWidget from '../widgets/VAFileNumberWidget';
import VAFileNumberReviewWidget from '../review/VAFileNumberWidget';

const uiSchema = {
  'ui:widget': VAFileNumberWidget,
  'ui:reviewWidget': VAFileNumberReviewWidget,
  'ui:title': 'VA file number',
  'ui:options': {
    widgetClassNames: 'usa-input-medium',
    expandUnder: 'isVeteran',
    hideEmptyValueInReview: true,
  },
  'ui:validations': [validateVAFileNumber],
  'ui:errorMessages': { pattern: 'Please enter a valid VA File number' },
};

export default uiSchema;
