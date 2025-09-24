import CurrencyField, {
  CURRENCY_PATTERN,
} from '../web-component-fields/CurrencyField';
import CurrencyWidget from '../review/CurrencyWidget';

import { minMaxValidation } from './numberPattern';

/**
 * uiSchema for currency based input which uses VaTextInputField
 *
 * Used for simple number amounts containing only digits
 *
 * ```js
 * exampleIncome: currencyUI('Gross monthly income')
 * exampleIncome: currencyUI({
 *  title: 'Gross monthly income',
 *  description: 'This is a description',
 *  hint: 'This is a hint',
 *  width: 'sm',
 *  currencySymbol: '$',
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
 *   description?: UISchemaOptions['ui:description'],
 *   hint?: string,
 *   width?: UISchemaOptions['ui:options']['width'],
 *   errorMessages?: UISchemaOptions['ui:errorMessages'],
 *   currencySymbol?: '$',
 *   min?: number,
 *   max?: number,
 * }} [options] accepts a single string for title, or an object of options
 * @returns {UISchemaOptions}
 */
export const currencyUI = options => {
  const {
    title,
    description,
    errorMessages,
    min = 0,
    // large numbers converted to scientific notation; so add limit
    max = 999999999,
    validations = [],
    ...uiOptions
  } = typeof options === 'object' ? options : { title: options };

  // if the title is a string, set it to the title property
  if (min !== null || max !== null) {
    validations.push(minMaxValidation(min, max));
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
    'ui:options': { ...uiOptions, min, max },
    'ui:errorMessages': {
      required: 'Enter an amount',
      pattern: 'Enter a valid dollar amount',
      // error shows when CurrencyField is expecting a number & gets a string
      type: 'Enter a valid dollar amount',
      min: min !== null ? `Enter a number greater than or equal to ${min}` : '',
      max: max !== null ? `Enter a number less than or equal to ${max}` : '',
      ...errorMessages,
    },
    'ui:reviewWidget': CurrencyWidget,
    'ui:validations': validations,
  };
};

/**
 * schema for currencyUI with type number
 * ```js
 * schema: {
 *    exampleIncome: numberSchema
 * }
 * ```
 */
export const currencySchema = {
  type: 'number',
  pattern: CURRENCY_PATTERN,
};

/**
 * schema for currencyUI with type string
 */
export const currencyStringSchema = {
  type: 'string',
  pattern: CURRENCY_PATTERN,
};
