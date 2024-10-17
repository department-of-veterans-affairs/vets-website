import VaRadioField from '../web-component-fields/VaRadioField';

/**
 * Web component v3 uiSchema for generic optional radio field
 *
 * Usage uiSchema:
 * ```js
 * exampleRadio: radioOptionalUI({
 *  title: 'Select animal',
 *  labels: {
 *      dog: 'Dog',
 *      cat: 'Cat',
 *      octopus: 'Octopus',
 *  },
 *  hint: 'This is a hint',
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
 * exampleRadio: radioOptionalSchema()
 * ```
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  labels?: UISchemaOptions['ui:options']['labels'],
 *  description?: UISchemaOptions['ui:description'],
 *  labelHeaderLevel?: UISchemaOptions['ui:options']['labelHeaderLevel'],
 *  hint?: string,
 * }} options
 * @returns {UISchemaOptions}
 */
export const radioOptionalUI = ({
  title,
  description,
  errorMessages, // ignored
  required, // ignored
  ...uiOptions
}) => {
  if (required || errorMessages) {
    // eslint-disable-next-line no-console
    console.warn(
      'radioOptionalUI will ignore required and errorMessages parameters',
    );
  }
  return {
    'ui:title': title,
    'ui:description': description,
    'ui:required': () => false, // override required function
    'ui:webComponentField': VaRadioField,
    'ui:widget': 'radio', // This is required for the review page to render the field properly
    'ui:options': {
      ...uiOptions,
    },
  };
};

/**
 * ```js
 * exampleRadio: radioOptionalSchema()
 * ```
 * @returns {SchemaOptions}
 */
export const radioOptionalSchema = () => {
  return {
    type: 'string',
  };
};
