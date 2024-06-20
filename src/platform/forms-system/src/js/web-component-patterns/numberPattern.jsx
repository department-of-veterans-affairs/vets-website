import VaTextInputField from '../web-component-fields/VaTextInputField';

export function minMaxValidation(min, max) {
  return (errors, formData, uiSchema, schema, errorMessages) => {
    const value = parseInt(formData, 10);

    let defaultErrorMessage = `Enter a number between ${min} and ${max}`;
    if (min !== undefined && max === undefined) {
      defaultErrorMessage = `Enter a number larger than ${
        min - 1 > 0 ? min - 1 : 0
      }`;
    } else if (min === undefined && max !== undefined) {
      defaultErrorMessage = `Enter a number smaller than ${max + 1}`;
    }

    if (value < min) {
      errors.addError(errorMessages?.min || defaultErrorMessage);
    } else if (value > max) {
      errors.addError(errorMessages?.max || defaultErrorMessage);
    }
  };
}

/**
 * Web component v3 uiSchema for a number based input which uses VaTextInputField
 *
 * Used for simple number amounts containing only digits
 *
 * ```js
 * exampleAmount: numberUI('Amount of documents')
 * exampleAmount: numberUI({
 *  title: 'Amount of documents',
 *  description: 'This is a description',
 *  hint: 'This is a hint'
 *  width: 'sm'
 *  min: 0,
 *  max: 99
 * })
 * ```
 *
 * widths: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 *
 * Web component schema for number input
 * ```js
 * exampleAmount: numberSchema
 * ```
 * @param {string | UIOptions & {
 *   title?: UISchemaOptions['ui:title'],
 *   description: UISchemaOptions['ui:description'],
 *   hint?: string,
 *   width?: UISchemaOptions['ui:options']['width'],
 *   errorMessages?: UISchemaOptions['ui:errorMessages'],
 *   min?: number,
 *   max?: number,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions}
 */
export const numberUI = options => {
  const { title, description, errorMessages, min, max, ...uiOptions } =
    typeof options === 'object' ? options : { title: options };

  let validations = {};

  if (min !== undefined || max !== undefined) {
    validations = {
      'ui:validations': [minMaxValidation(min, max)],
    };
  }

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
      ...uiOptions,
    },
    'ui:errorMessages': {
      required: 'Please enter a valid number',
      pattern: 'Please enter a valid number',
      ...errorMessages,
    },
    ...validations,
  };
};

/**
 * ```js
 * schema: {
 *    exampleNumber: numberSchema
 * }
 * ```
 */
export const numberSchema = {
  type: 'string',
  pattern: '^\\d*$',
};
