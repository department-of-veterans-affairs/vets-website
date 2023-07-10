import VaRadioField from '../web-component-fields/VaRadioField';

/**
 * Web component uiSchema for generic radio field
 *
 * ```js
 * exampleRadio: radioUI({
 *  title: 'Select animal',
 *  labels: {
 *      dog: 'Dog',
 *      cat: 'Cat',
 *      octopus: 'Octopus',
 *  }
 * })
 * ```
 * @param {{
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  labels: Record<PropertyKey, string>,
 *  tile?: boolean,
 * }} options
 * @returns {UISchemaOptions}
 */
export const radioUI = ({ title, description, labels, tile }) => {
  return {
    'ui:title': title,
    'ui:description': description,
    'ui:webComponentField': VaRadioField,
    'ui:widget': 'radio', // This is required for the review page to render the field properly
    'ui:options': {
      tile,
      labels,
    },
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
