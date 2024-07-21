import VaRadioField from '../web-component-fields/VaRadioField';

/**
 * @typedef {Object} RadioUIOptions
 * @property {string} title
 * @property {UILabels} labels
 * @property {UIDescription} [description]
 * @property {UIHint} [hint]
 * @property {UILabels} [descriptions]
 * @property {UIRequired} [required]
 * @property {UIErrorMessages} [errorMessages]
 * @property {UILabelHeaderLevel} [labelHeaderLevel]
 */

/**
 * @module RadioPattern
 */

/**
 * Web component v3 uiSchema for generic radio field
 *
 * Usage uiSchema:
 * @example
 * exampleRadio: radioUI({
 *  title: 'Select animal',
 *  labels: {
 *      dog: 'Dog',
 *      cat: 'Cat',
 *      octopus: 'Octopus',
 *  },
 *  descriptions: {
 *    dog: 'This is a dog',
 *    cat: 'This is a cat',
 *  },
 *  hint: 'This is a hint',
 *  required: () => true,
 *  errorMessages: {
 *     required: 'Please select an animal',
 *  },
 *  labelHeaderLevel: '3',
 *  useFormsPattern: true,
 * })
 *
 * @example
 * // Use this if you need JSX description to be read by screen readers
 * exampleRadio: radioUI({
 *   title: 'Select option',
 *   useFormsPattern: 'single',
 *   formHeading: 'Form page title',
 *   formHeadingLevel: 3,
 *   formDescription: (<p>This is a description</p>)
 * })
 *
 * @example
 * // Usage schema:
 * exampleRadio: radioSchema(['cat', 'dog', 'octopus'])
 *
 * @param {UIOptions | RadioUIOptions} [options]
 * @returns {UISchemaOptions}
 * @function
 */
export const radioUI = ({
  title,
  description,
  errorMessages,
  required,
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
 * @example
 * exampleRadio: radioSchema(['cat', 'dog', 'octopus'])
 * exampleRadio: radioSchema(['none', 'email', 'mobile', 'home', 'all'])
 * exampleRadio: radioSchema(['lowDisability', 'highDisability', 'none'])
 * @param {string[]} labels
 * @returns {SchemaOptions}
 * @function
 */
export const radioSchema = labels => {
  return {
    type: 'string',
    enum: labels,
  };
};
