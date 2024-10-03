// TODO: [#89197 Create internationalPhone pattern in form patterns](https://app.zenhub.com/workspaces/accredited-representative-facing-team-65453a97a9cc36069a2ad1d6/issues/gh/department-of-veterans-affairs/va.gov-team/89197)
import PhoneNumberReviewWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

/**
 * Web component v3 uiSchema for international phone number
 *
 * ```js
 * examplePhone: internationalPhoneUI() // Phone number
 * examplePhone: internationalPhoneUI('Cell phone number')
 * examplePhone: internationalPhoneUI({
 *   title: 'Cell phone number',
 *   hint: 'This is a hint'
 * })
 * examplePhone: {
 *  ...internationalPhoneUI('Main phone number')
 * }
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   hint?: string,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions}
 */
export const internationalPhoneUI = options => {
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
      required: 'Please enter a phone number (with or without dashes)',
      pattern: 'Please enter a valid phone number (with or without dashes)',
    },
  };
};

// The regex pattern allows starting with a plus sign
// It allows up to 15 digits (max digits in an international phone number)
// It allows optional dashes in between
export const internationalPhoneSchema = {
  type: 'string',
  pattern: '^\\+?[0-9](?:-?[0-9]){0,14}$',
};
