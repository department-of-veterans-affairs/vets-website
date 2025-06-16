import VaInputTelephoneField from '../web-component-fields/VaInputTelephoneField';
import internationalPhoneNumberWidget from '../review/InternationalPhoneNumberWidget';
import { validateInputTelephone } from '../validation';

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
    'ui:title': title ?? 'Home phone number',
    'ui:webComponentField': VaInputTelephoneField,
    'ui:reviewField': internationalPhoneNumberWidget,
    'ui:confirmationField': ({ formData }) => {
      const { callingCode, contact, countryCode } = formData;
      let data = 'No contact provided';
      if (contact) {
        data = `+${callingCode || ''} ${contact} (${countryCode || ''})`;
      }
      return {
        data,
        label: 'Contact',
      };
    },
    'ui:options': uiOptions,
    'ui:validations': [validateInputTelephone],
  };
};

const internationalPhoneSchema = {
  type: 'object',
  properties: {
    callingCode: { type: 'number', title: 'Calling code' },
    countryCode: { type: 'string', title: 'Country code' },
    contact: { type: 'string', title: 'Contact' },
    _error: {
      type: 'string',
      title: 'Error',
    },
  },
};

export { internationalPhoneSchema, internationalPhoneUI };
