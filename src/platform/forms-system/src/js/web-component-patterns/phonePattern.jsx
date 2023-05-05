import phoneUIDefinition from 'platform/forms-system/src/js/definitions/phone';
import commonDefinitions from 'vets-json-schema/dist/definitions.json';
import VaTextInputField from '../web-component-fields/VaTextInputField';

/**
 * @param {string | UISchemaOptions} [options]
 * @returns {UISchemaOptions}
 */
export const phoneUI = title => {
  return {
    ...phoneUIDefinition,
    'ui:title': title,
    'ui:webComponentField': VaTextInputField,
    'ui:errorMessages': {
      format:
        'Enter a valid email address using the format email@domain.com. Your email address can only have letters, numbers, the @ symbol and a period, with no spaces.',
    },
    'ui:options': {
      inputType: 'tel',
    },
  };
};

const schema = commonDefinitions.phone;

/**
 * @param {SchemaOptions} [options]
 * @returns {SchemaOptions}
 */
export const phoneSchema = () => {
  return schema;
};
