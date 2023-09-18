import VaNumberInputField from '../web-component-fields/VaNumberInputField';

/**
 * Web component uiSchema for number input
 *
 * Used for simple number amounts containing only digits
 *
 * ```js
 * exampleAmount: numberUI('Amount of documents')
 * exampleAmount: numberUI({
 *  title: 'Amount of documents',
 *  description: 'This is a description',
 *  hint: 'This is a hint'
 *  width: 'xs'
 * })
 * ```
 *
 * Web component schema for number input
 * ```js
 * exampleAmount: numberSchema()
 * ```
 * @param {string | {
 *   title?: UISchemaOptions['ui:title'],
 *   description: UISchemaOptions['ui:description'],
 *   hint?: string,
 *   width?: UISchemaOptions['ui:options']['width'],
 *   errorMessages?: UISchemaOptions['ui:errorMessages'],
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions}
 */
export const numberUI = options => {
  const { title, errorMessages, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title,
    'ui:webComponentField': VaNumberInputField,
    'ui:options': {
      inputmode: 'numeric',
      width: 'sm',
      ...uiOptions,
    },
    'ui:errorMessages': {
      required: 'Please enter a valid number',
      pattern: 'Please enter a valid number',
      ...errorMessages,
    },
  };
};

export const numberSchema = {
  type: 'string',
  pattern: '^\\d*$',
};
