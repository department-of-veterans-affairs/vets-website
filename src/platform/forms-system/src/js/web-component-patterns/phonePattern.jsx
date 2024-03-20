import VaTextInputField from '../web-component-fields/VaTextInputField';
import PhoneNumberReviewWidget from '../review/PhoneNumberWidget';

/**
 * Web component v3 uiSchema for phone number
 *
 * ```js
 * examplePhone: phoneUI() // Phone number
 * examplePhone: phoneUI('Cell phone number')
 * examplePhone: phoneUI({
 *   title: 'Cell phone number',
 *   hint: 'This is a hint'
 * })
 * examplePhone: {
 *  ...phoneUI('Main phone number')
 * }
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions}
 */
export const phoneUI = options => {
  const { title, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title ?? 'Phone number',
    'ui:webComponentField': VaTextInputField,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:autocomplete': 'tel',
    'ui:options': {
      inputType: 'tel',
      ...uiOptions,
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
