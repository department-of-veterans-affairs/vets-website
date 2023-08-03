import phoneUIDefinition from 'platform/forms-system/src/js/definitions/phone';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';

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
    ...phoneUIDefinition,
    'ui:title': title ?? 'Phone number',
    'ui:webComponentField': VaTextInputField,
    'ui:options': {
      inputType: 'tel',
    },
    'ui:errorMessages': {
      required: 'Please enter a 10-digit phone number (with or without dashes)',
      minLength:
        'Please enter a 10-digit phone number (with or without dashes)',
    },
  };
};

/**
 * @returns `commonDefinitions.phone`
 */
export const phoneSchema = commonDefinitions.phone;
