import VaInputTelephoneField from '../web-component-fields/VaInputTelephoneField';
import InternationalPhoneNumberWidget from '../review/InternationalPhoneNumberWidget';

/**
 * Web component v3 uiSchema for an international phone number
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
const internationalPhoneUI = options => {
  const { title, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title ?? 'Phone number',
    'ui:webComponentField': VaInputTelephoneField,
    'ui:reviewWidget': InternationalPhoneNumberWidget,
    'ui:options': uiOptions,
  };
};

const internationalPhoneSchema = {
  type: 'object',
  properties: {
    callingCode: { type: 'number', title: 'Calling code' },
    countryCode: { type: 'string', title: 'Country code' },
    contact: { type: 'string', title: 'Contact' },
    isValid: { type: 'boolean', title: 'Is valid' },
  },
  required: ['callingCode', 'countryCode', 'contact', 'isValid'],
};

export { internationalPhoneSchema, internationalPhoneUI };
