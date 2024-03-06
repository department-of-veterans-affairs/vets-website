import VaRadioField from '../web-component-fields/VaRadioField';

/**
 * Web component v3 uiSchema for generic radio field
 *
 * Usage uiSchema:
 * ```js
 * exampleRadio: radioUI({
 *  title: 'Select animal',
 *  labels: {
 *      dog: 'Dog',
 *      cat: 'Cat',
 *      octopus: 'Octopus',
 *  },
 *  hint: 'This is a hint',
 *  required: () => true,
 *  errorMessages: {
 *     required: 'Please select an animal',
 *  },
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleRadio: radioSchema(['cat', 'dog', 'octopus'])
 * ```
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  labels?: UISchemaOptions['ui:options']['labels'],
 *  description?: UISchemaOptions['ui:description'],
 *  required?: UISchemaOptions['ui:required'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 * }} options
 * @returns {UISchemaOptions}
 */
export const radioUI = ({
  title,
  description,
  errorMessages,
  required = () => false,
  ...uiOptions
}) => {
  return {
    'ui:title': title,
    'ui:description': description,
    'ui:required': required,
    'ui:webComponentField': VaRadioField,
    'ui:widget': 'radio', // This is required for the review page to render the field properly
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * ```js
 * exampleRadio: radioSchema(['cat', 'dog', 'octopus'])
 * exampleRadio: radioSchema(['none', 'email', 'mobile', 'home', 'all'])
 * exampleRadio: radioSchema(['lowDisability', 'highDisability', 'none'])
 * ```
 * @param {string[]} labels
 * @returns {SchemaOptions}
 */
export const radioSchema = labels => {
  return {
    type: 'string',
    enum: labels,
  };
};
