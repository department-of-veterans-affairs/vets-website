import { VaTextInputField, VaTextareaField } from '../web-component-fields';

/**
 * Web component v3 uiSchema for generic text field
 *
 * Considerations:
 * - Can we instead use a specific text pattern?
 *   - phoneUI
 *   - emailUI
 *   - numberUI
 * - Do mobile users need to use a different `inputType` keyboard?
 * - Can we provide `autocomplete`?
 *
 * Usage uiSchema:
 * ```js
 * exampleText: textUI('Simple text field')
 * exampleText: textUI({
 *   title: 'Text field',
 *   hint: 'This is a hint',
 *   description: 'This is a description',
 *   charcount: true, // Used with minLength and maxLength in the schema
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleText: textSchema,
 * required: ['exampleText']
 *
 * // or
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 * ```
 *
 * About `useFormsPattern`:
 *
 * Used with `formDescription`, `formHeading`, and `formHeadingLevel`
 * when the label of the field should be the actual form title and
 * have a description with JSX that should be read out by screen readers.
 *
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  hint?: UIOptions['hint'],
 *  charcount?: UIOptions['charcount'],
 *  width?: UIOptions['width'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  messageAriaDescribedby?: UIOptions['messageAriaDescribedby'],
 *  inputType?: UIOptions['inputType'],
 *  autocomplete?: UISchemaOptions['ui:autocomplete'],
 * }} stringOrOptions
 * @returns {UISchemaOptions}
 */
export const textUI = stringOrOptions => {
  if (typeof stringOrOptions === 'string') {
    return {
      'ui:title': stringOrOptions,
      'ui:webComponentField': VaTextInputField,
    };
  }

  const {
    title,
    description,
    errorMessages,
    required,
    autocomplete,
    validations,
    reviewField,
    hidden,
    ...uiOptions
  } = stringOrOptions;

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:required': required,
    'ui:webComponentField': VaTextInputField,
    'ui:reviewField': reviewField,
    'ui:autocomplete': autocomplete,
    'ui:hidden': hidden,
    'ui:validations': validations,
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * Schema for generic text field
 *
 * If you need to use `maxLength` or `minLength`, just define manually rather than use this.
 *
 * ```js
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 * ```
 */
export const textSchema = {
  type: 'string',
};

/**
 * Web component v3 uiSchema for generic textarea field
 *
 * Usage uiSchema:
 * ```js
 * exampleText: textareaUI('Simple textarea field')
 * exampleText: textareaUI({
 *   title: 'Textarea field',
 *   hint: 'This is a hint',
 *   description: 'This is a description',
 *   charcount: true, // Used with minLength and maxLength in the schema
 * })
 * ```
 *
 * Usage schema:
 * ```js
 * exampleText: textareaSchema,
 * required: ['exampleText']
 *
 * // or
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 * ```
 *
 * About `labelHeaderLevel`:
 *
 * Simply use the label as the form header.
 *
 * About `useFormsPattern`:
 *
 * Advanced version of `labelHeaderLevel`.
 * Used with `formDescription`, `formHeading`, and `formHeadingLevel`
 * when the label of the field should be the actual form title and
 * have a description with JSX that should be read out by screen readers.
 *
 * @param {UIOptions & {
 *  title?: UISchemaOptions['ui:title'],
 *  description?: UISchemaOptions['ui:description'],
 *  hint?: UIOptions['hint'],
 *  charcount?: UIOptions['charcount'],
 *  errorMessages?: UISchemaOptions['ui:errorMessages'],
 *  labelHeaderLevel?: UIOptions['labelHeaderLevel'],
 *  messageAriaDescribedby?: UIOptions['messageAriaDescribedby'],
 *  useFormsPattern?: UIOptions['useFormsPattern'],
 *  formHeading?: UIOptions['formHeading'],
 *  formDescription?: UIOptions['formDescription'],
 *  formHeadingLevel?: UIOptions['formHeadingLevel'],
 * }} stringOrOptions
 * @returns {UISchemaOptions}
 */
export const textareaUI = stringOrOptions => {
  if (typeof stringOrOptions === 'string') {
    return {
      'ui:title': stringOrOptions,
      'ui:webComponentField': VaTextareaField,
    };
  }

  const {
    title,
    description,
    errorMessages,
    required,
    autocomplete,
    validations,
    reviewField,
    hidden,
    ...uiOptions
  } = stringOrOptions;

  return {
    'ui:title': title,
    'ui:description': description,
    'ui:required': required,
    'ui:webComponentField': VaTextareaField,
    'ui:reviewField': reviewField,
    'ui:hidden': hidden,
    'ui:autocomplete': autocomplete,
    'ui:validations': validations,
    'ui:options': {
      ...uiOptions,
    },
    'ui:errorMessages': errorMessages,
  };
};

/**
 * Schema for generic textarea field
 *
 * If you need to use `maxLength` or `minLength`, just define manually rather than use this.
 *
 * ```js
 * exampleText: {
 *   type: 'string',
 *   minLength: 10,
 *   maxLength: 30,
 * }
 * ```
 */
export const textareaSchema = {
  type: 'string',
};
