import VaTelephoneInputField from '../web-component-fields/VaTelephoneInputField';
import internationalPhoneNumberWidget from '../review/InternationalPhoneNumberWidget';
import { validateTelephoneInput } from '../validation';

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

  const _title = title ?? 'Home phone number';
  return {
    'ui:title': _title,
    'ui:webComponentField': VaTelephoneInputField,
    'ui:reviewField': internationalPhoneNumberWidget,
    'ui:confirmationField': ({ formData }) => {
      const { callingCode, contact, countryCode } = formData;
      let data = 'No contact provided';
      if (contact) {
        data = `+${callingCode || ''} ${contact} (${countryCode || ''})`;
      }
      return {
        data,
        label: _title,
      };
    },
    'ui:options': {
      hint: 'For international numbers, select or enter your country code.',
      ...uiOptions,
    },
    'ui:validations': [validateTelephoneInput],
    'ui:errorMessages': {
      required: 'Enter a phone number with up to 15 digits',
    },
  };
};

const internationalPhoneSchema = (options = { required: false }) => {
  return {
    type: 'object',
    properties: {
      callingCode: { type: 'number', title: 'Calling code' },
      countryCode: { type: 'string', title: 'Country code' },
      contact: { type: 'string', title: 'Contact' },
    },
    ...(options.required
      ? { required: ['callingCode', 'countryCode', 'contact'] }
      : {}),
  };
};

export { internationalPhoneSchema, internationalPhoneUI };
