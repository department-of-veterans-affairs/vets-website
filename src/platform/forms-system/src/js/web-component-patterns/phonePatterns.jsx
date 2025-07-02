import VaTextInputField from '../web-component-fields/VaTextInputField';
import PhoneNumberReviewWidget from '../review/PhoneNumberWidget';

/**
 * uiSchema for a phone number - a single text input field
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
const phoneUI = options => {
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

/**
 * Web component v3 uiSchema for international phone number
 *
 * ```js
 * examplePhone: internationalPhoneDeprecatedUI() // Phone number
 * examplePhone: internationalPhoneDeprecatedUI('Cell phone number')
 * examplePhone: internationalPhoneDeprecatedUI({
 *   title: 'Cell phone number',
 *   hint: 'This is a hint'
 * })
 * examplePhone: {
 *  ...internationalPhoneDeprecatedUI('Main phone number')
 * }
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions}
 */
const internationalPhoneDeprecatedUI = options => {
  const { title, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title ?? 'International phone number',
    'ui:webComponentField': VaTextInputField,
    'ui:reviewWidget': PhoneNumberReviewWidget,
    'ui:autocomplete': 'tel',
    'ui:options': {
      inputType: 'tel',
      ...uiOptions,
    },
    'ui:errorMessages': {
      required: 'Enter up to a 15-digit phone number (with or without dashes)',
      pattern:
        'Enter a valid international phone number up to 15-digits (with or without dashes)',
    },
  };
};

const phoneSchema = {
  type: 'string',
  pattern: '^\\d{3}-?\\d{3}-?\\d{4}$',
};

// The regex pattern allows starting with a plus sign
// It allows up to 15 digits (max digits in an international phone number)
// It allows optional dashes in between
const internationalPhoneDeprecatedSchema = {
  type: 'string',
  pattern: '^\\+?[0-9](?:-?[0-9]){0,14}$',
};

export {
  phoneUI,
  internationalPhoneDeprecatedUI,
  phoneSchema,
  internationalPhoneDeprecatedSchema,
};
