import VaTextInputField from '../web-component-fields/VaTextInputField';
import PhoneNumberReviewWidget from '../review/PhoneNumberWidget';

/**
 * Web component uiSchema for phone number
 *
 * ```js
 * examplePhone: phoneUI() // Phone number
 * examplePhone: phoneUI('Cell phone number')
 * examplePhone: {
 *  ...phoneUI('Main phone number')
 * }
 * ```
 * @param {string} [title] - optional title to override default
 * @returns {UISchemaOptions}
 */
export const phoneUI = title => {
  return {
    'ui:title': title ?? 'Phone number',
    'ui:webComponentField': VaTextInputField,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:autocomplete': 'tel',
    'ui:options': {
      inputType: 'tel',
    },
    'ui:errorMessages': {
      required: 'Please enter a 10-digit phone number (with or without dashes)',
      pattern: 'Please enter a 10-digit phone number (with or without dashes)',
    },
  };
};

export const phoneSchema = {
  type: 'string',
  pattern: '^\\d{3}-?\\d{3}-?\\d{4}$',
};
