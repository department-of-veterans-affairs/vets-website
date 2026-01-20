import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';
import { validateCurrentOrPastYear } from 'platform/forms-system/src/js/validation';
import * as ReviewWidget from 'platform/forms-system/src/js/review/widgets';

const validateMinYear = (errors, fieldData) => {
  const year = parseInt(fieldData, 10);
  if (year && year < 1900) {
    errors.addError('Year must be 1900 or later');
  }
};
// Added Hint Support, other version lacked this
export const yearUI = options => {
  const { title, hint, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title,
    'ui:reviewWidget': ReviewWidget.TextWidget,
    'ui:webComponentField': VaTextInputField,
    'ui:validations': [validateCurrentOrPastYear, validateMinYear],
    'ui:errorMessages': {
      pattern: 'Please enter a valid year',
      required: 'Please enter a year',
    },
    'ui:options': {
      widgetClassNames: 'usa-input-medium',
      hint,
      ...uiOptions,
    },
  };
};

export const yearSchema = {
  type: 'string',
  pattern: '^\\d{4}$',
};
