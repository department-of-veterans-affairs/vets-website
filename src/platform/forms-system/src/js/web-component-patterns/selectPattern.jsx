import VaSelectField from '../web-component-fields/VaSelectField';

/**
 * Web component v3 uiSchema for generic select field
 *
 * ```js
 * // uiSchema
 * exampleSelect: selectUI('Select animal')
 * exampleSelect: selectUI({
 *  title: 'Select animal',
 *  hint: 'This is a hint',
 * })
 *
 * // schema:
 * exampleSelect: selectSchema(['Cat', 'Dog', 'Octopus'])
 *
 * // or with labels defined:
 * // uiSchema
 * exampleSelect: selectSchema({
 *  title: 'Select animal',
 *  labels: {
 *    cat: 'Cat',
 *    dog: 'Dog',
 *    octopus: 'Octopus',
 *  },
 *  errorMessages: {
 *     required: 'Please select an animal',
 *  },
 * })
 *
 * // schema
 * exampleSelect: selectSchema(['cat', 'dog', 'octopus'])
 * ```
 *
 * @param {string | UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 * }} options
 * @returns {UISchemaOptions}
 */
export const selectUI = options => {
  const { title, description, errorMessages, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:webComponentField': VaSelectField,
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * ```js
 * exampleSelect: selectSchema(['Cat', 'Dog', 'Octopus'])
 * exampleSelect: selectSchema(['cat', 'dog', 'octopus'])
 * ```
 * @param {string[]} labels
 * @returns {SchemaOptions}
 */
export const selectSchema = labels => {
  return {
    type: 'string',
    enum: labels,
  };
};
