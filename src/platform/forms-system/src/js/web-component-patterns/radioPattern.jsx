import VaRadioField from '../web-component-fields/VaRadioField';

/**
 * uiSchema for generic radio field
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
 * Advanced labels:
 * ```js
 * labels: {
 *    dog: 'Dog',
 *    cat: 'Cat',
 * },
 * descriptions: {
 *    dog: 'This is a dog',
 *    cat: 'This is a cat',
 * }
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
 *  descriptions?: { [key: string]: string },
 *  required?: UISchemaOptions['ui:required'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  labelHeaderLevelStyle?: UISchemaOptions['ui:options']['labelHeaderLevelStyle'],
 *  hint?: string,
 * }} options
 * @returns {UISchemaOptions}
 */
export const radioUI = options => {
  const { title, description, errorMessages, required, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

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
 * schema for radioUI
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
