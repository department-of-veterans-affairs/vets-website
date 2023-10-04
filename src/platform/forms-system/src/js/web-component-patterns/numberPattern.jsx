import VaTextInputField from '../web-component-fields/VaTextInputField';

/**
 * Web component uiSchema for a number based input which uses VaTextInputField
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
 * widths: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 *
 * Web component schema for number input
 * ```js
 * exampleAmount: numberSchema
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
  const { title, description, errorMessages, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  return {
    'ui:title': title,
    'ui:description': description,
    // TextInputField is used here because it can do everything number input can do currently
    // and we prefer to use a string rather than number functionality because we don't
    // want the stepper buttons on the side of the input for a11y reasons, one of which is that
    // its easy to accidentally scroll on
    'ui:webComponentField': VaTextInputField,
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
