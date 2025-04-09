import CurrencyField from '../web-component-fields/CurrencyField';
import CurrencyWidget from '../review/CurrencyWidget';

import { minMaxValidation } from './numberPattern';

/**
 * Web component v3 uiSchema for currency based input which uses VaTextInputField
 *
 * Used for simple number amounts containing only digits
 *
 * ```js
 * exampleIncome: currencyUI('Gross monthy income')
 * exampleIncome: currencyUI({
 *  title: 'Gross monthy income',
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
 * Web component schema for currency input
 * ```js
 * exampleIncome: numberSchema
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
export const currencyUI = options => {
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
    // TextInputField is used here because it can do everything number input
    // can do currently and we prefer to use a string rather than number
    // functionality because we don't want the stepper buttons on the side of
    // the input for a11y reasons, one of which is that its easy to accidentally
    // scroll on
    'ui:webComponentField': CurrencyField,
    'ui:options': uiOptions,
    'ui:errorMessages': {
      required: 'Enter a valid number',
      pattern: 'Enter a valid number',
      ...errorMessages,
    },
    'ui:reviewWidget': CurrencyWidget,
    ...validations,
  };
};

/**
 * ```js
 * schema: {
 *    exampleIncome: numberSchema
 * }
 * ```
 */
export const currencySchema = {
  type: 'number',
  pattern: '^\\d+(\\.\\d{1,2})?$',
};
